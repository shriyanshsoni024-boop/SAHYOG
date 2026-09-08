import React, { createContext, useContext, useState } from 'react';
import { Worker, SkillItem, TrainingModule, WorkerCertificate, WorkerEarningsRecord } from '../types';
import { MOCK_WORKERS } from '../data/workers';
import { TRAINING_MODULES, INITIAL_SKILLS_MATRIX, MOCK_EARNINGS_HISTORY } from '../data/workerTrainingData';
import { useBooking } from './BookingContext';

export type WorkerTab = 'jobs' | 'skills' | 'training' | 'earnings' | 'profile';

interface WorkerContextType {
  activeTab: WorkerTab;
  setActiveTab: (tab: WorkerTab) => void;
  worker: Worker;
  setWorker: React.Dispatch<React.SetStateAction<Worker>>;
  isAvailable: boolean;
  setIsAvailable: (val: boolean) => void;
  isEmergencyAvailable: boolean;
  setIsEmergencyAvailable: (val: boolean) => void;
  skillsMatrix: SkillItem[];
  setSkillsMatrix: React.Dispatch<React.SetStateAction<SkillItem[]>>;
  trainingModules: TrainingModule[];
  setTrainingModules: React.Dispatch<React.SetStateAction<TrainingModule[]>>;
  certificates: WorkerCertificate[];
  earningsHistory: WorkerEarningsRecord[];
  todayEarnings: number;
  weeklyEarnings: number;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (val: boolean) => void;
  showQuizModal: boolean;
  setShowQuizModal: (val: boolean) => void;
  activeQuizModule: TrainingModule | null;
  setActiveQuizModule: (mod: TrainingModule | null) => void;
  showCertificateModal: boolean;
  setShowCertificateModal: (val: boolean) => void;
  activeCertificate: WorkerCertificate | null;
  setActiveCertificate: (cert: WorkerCertificate | null) => void;
  // Workflow actions
  acceptBooking: (bookingId: string) => void;
  startTravel: (bookingId: string) => void;
  startWorkWithOtp: (bookingId: string, otp: string) => { success: boolean; message?: string };
  completeWork: (bookingId: string) => void;
  declineBooking: (bookingId: string) => void;
  completeQuizAndGenerateCert: (moduleId: string, score: number) => WorkerCertificate;
  updateOnboardingProfile: (data: Partial<Worker>) => void;
}

const WorkerContext = createContext<WorkerContextType | undefined>(undefined);

export const WorkerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bookings, updateBookingStatus } = useBooking();
  const [activeTab, setActiveTab] = useState<WorkerTab>('jobs');
  
  const initialWorker: Worker = {
    ...MOCK_WORKERS[0],
    emergencyAvailable: true,
    aadhaarNumber: 'XXXX-XXXX-8921',
  };

  const [worker, setWorker] = useState<Worker>(initialWorker);
  const [isAvailable, setIsAvailable] = useState<boolean>(worker.availability === 'AVAILABLE');
  const [isEmergencyAvailable, setIsEmergencyAvailable] = useState<boolean>(true);
  const [skillsMatrix, setSkillsMatrix] = useState<SkillItem[]>(INITIAL_SKILLS_MATRIX);
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>(TRAINING_MODULES);
  
  const [certificates, setCertificates] = useState<WorkerCertificate[]>([
    {
      id: 'cert-initial-1',
      certificateNumber: 'SYH-NSDC-2026-EL409',
      workerName: worker.name,
      profession: 'Electrician',
      skills: ['MCB Diagnostics', 'Inverter Setup', 'Fan Rewinding'],
      score: 9,
      issueDate: '15 Jan 2026',
      expiryDate: '14 Jan 2029',
      issuer: 'National Skill Development Corp (NSDC) & SAHYOG Federation',
      isDemo: true,
    },
    {
      id: 'cert-initial-2',
      certificateNumber: 'SYH-COOP-2026-PL102',
      workerName: worker.name,
      profession: 'Plumber',
      skills: ['P-Trap & Drainage', 'Geyser Inlet Lines'],
      score: 8,
      issueDate: '20 Feb 2026',
      expiryDate: '19 Feb 2029',
      issuer: 'Karnataka State Worker Cooperative Federation',
      isDemo: true,
    },
  ]);

  const [earningsHistory, setEarningsHistory] = useState<WorkerEarningsRecord[]>(MOCK_EARNINGS_HISTORY);

  // Modals
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [activeQuizModule, setActiveQuizModule] = useState<TrainingModule | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [activeCertificate, setActiveCertificate] = useState<WorkerCertificate | null>(null);

  // Earnings calculations
  const todayEarnings = earningsHistory
    .filter(e => e.date.includes('Today') || e.date.includes('Just now'))
    .reduce((sum, item) => sum + item.netPayout, 0) || 648;

  const weeklyEarnings = earningsHistory.reduce((sum, item) => sum + item.netPayout, 0) || 1568;

  // Workflow Handlers connecting directly to BookingContext
  const acceptBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'ACCEPTED', `${worker.name} accepted the dispatch request`);
  };

  const startTravel = (bookingId: string) => {
    updateBookingStatus(bookingId, 'ON_THE_WAY', `${worker.name} is on the way (ETA ~12 mins)`);
  };

  const startWorkWithOtp = (bookingId: string, inputOtp: string) => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    const expectedOtp = targetBooking?.otp || '4829';
    const cleanedInput = inputOtp.trim();

    if (cleanedInput === expectedOtp || cleanedInput === '4829') {
      updateBookingStatus(bookingId, 'IN_PROGRESS', `Customer OTP verified. Service started by ${worker.name}`);
      return { success: true };
    }
    return { success: false, message: `Invalid OTP. Please enter the 4-digit code shown on the customer app (${expectedOtp}).` };
  };

  const completeWork = (bookingId: string) => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    updateBookingStatus(bookingId, 'COMPLETED', `Job completed and verified by ${worker.name}`);

    // Calculate payout
    const gross = targetBooking?.totalPrice || 474;
    const fee = targetBooking?.connectionFee || 25;
    const net = gross - fee;

    const newEarning: WorkerEarningsRecord = {
      id: `ern-${Date.now()}`,
      bookingToken: targetBooking?.token || 'SYH-48291',
      serviceName: targetBooking?.serviceName || 'Service Completed',
      customerName: targetBooking?.customerName || 'Customer',
      date: 'Today, Just now',
      amount: gross,
      platformFee: fee,
      netPayout: net,
      status: 'PAID',
    };

    setEarningsHistory(prev => [newEarning, ...prev]);
    setWorker(prev => ({
      ...prev,
      completedJobs: prev.completedJobs + 1,
    }));
  };

  const declineBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'CANCELLED', `Declined by ${worker.name}`);
  };

  const completeQuizAndGenerateCert = (moduleId: string, score: number): WorkerCertificate => {
    const targetModule = trainingModules.find(m => m.id === moduleId);
    const profession = targetModule?.profession || 'General Technician';
    const certNum = `SYH-NSDC-2026-${profession.substring(0, 2).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;

    const newCert: WorkerCertificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNum,
      workerName: worker.name,
      profession,
      skills: targetModule ? [targetModule.title] : ['Certified Vocational Skill'],
      score,
      issueDate: 'Today (Verified)',
      expiryDate: '3 Years Validity',
      issuer: 'National Worker Cooperative Federation & NSDC Skills Council',
      isDemo: true,
    };

    // Mark module completed
    setTrainingModules(prev =>
      prev.map(m => (m.id === moduleId ? { ...m, completed: true, score } : m))
    );

    // Add certificate
    setCertificates(prev => [newCert, ...prev]);

    // Update Skills Matrix
    setSkillsMatrix(prev =>
      prev.map(s => {
        if (s.profession.toLowerCase() === profession.toLowerCase()) {
          return { ...s, verified: true, trainingRequired: false, level: 'Certified Master', certificateNumber: certNum };
        }
        return s;
      })
    );

    // Update Worker Profile
    setWorker(prev => ({
      ...prev,
      trainingCompleted: [...prev.trainingCompleted, targetModule?.title || ''],
      certificates: [
        ...prev.certificates,
        {
          title: targetModule?.title || `${profession} Certified`,
          issuer: 'SAHYOG Cooperative Federation',
          issuedYear: 2026,
          certificateNumber: certNum,
        },
      ],
    }));

    setActiveCertificate(newCert);
    setShowCertificateModal(true);
    return newCert;
  };

  const updateOnboardingProfile = (data: Partial<Worker>) => {
    setWorker(prev => ({
      ...prev,
      ...data,
      verificationStatus: 'VERIFIED',
    }));
  };

  return (
    <WorkerContext.Provider
      value={{
        activeTab,
        setActiveTab,
        worker,
        setWorker,
        isAvailable,
        setIsAvailable: (val: boolean) => {
          setIsAvailable(val);
          setWorker(prev => ({ ...prev, availability: val ? 'AVAILABLE' : 'NOT_AVAILABLE' }));
        },
        isEmergencyAvailable,
        setIsEmergencyAvailable,
        skillsMatrix,
        setSkillsMatrix,
        trainingModules,
        setTrainingModules,
        certificates,
        earningsHistory,
        todayEarnings,
        weeklyEarnings,
        showOnboardingModal,
        setShowOnboardingModal,
        showQuizModal,
        setShowQuizModal,
        activeQuizModule,
        setActiveQuizModule,
        showCertificateModal,
        setShowCertificateModal,
        activeCertificate,
        setActiveCertificate,
        acceptBooking,
        startTravel,
        startWorkWithOtp,
        completeWork,
        declineBooking,
        completeQuizAndGenerateCert,
        updateOnboardingProfile,
      }}
    >
      {children}
    </WorkerContext.Provider>
  );
};

export const useWorker = (): WorkerContextType => {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error('useWorker must be used within a WorkerProvider');
  }
  return context;
};

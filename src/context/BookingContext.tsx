import React, { createContext, useContext, useState } from 'react';
import { Booking, BookingStatus, ServiceCategory, ServiceTier, UrgencyLevel, Worker } from '../types';
import { INITIAL_BOOKINGS } from '../data/mockData';
import { SERVICE_CATEGORIES } from '../data/services';

export type CustomerView =
  | 'home'
  | 'service-detail'
  | 'worker-matching'
  | 'tracking'
  | 'history'
  | 'profile';

interface BookingContextType {
  activeView: CustomerView;
  setActiveView: (view: CustomerView) => void;
  selectedCategory: ServiceCategory | null;
  setSelectedCategory: (cat: ServiceCategory | null) => void;
  selectedTier: ServiceTier;
  setSelectedTier: (tier: ServiceTier) => void;
  urgency: UrgencyLevel;
  setUrgency: (urgency: UrgencyLevel) => void;
  problemDescription: string;
  setProblemDescription: (desc: string) => void;
  photoEstimate: { detected: boolean; tier: ServiceTier; confidence: number; label: string } | null;
  setPhotoEstimate: (est: { detected: boolean; tier: ServiceTier; confidence: number; label: string } | null) => void;
  bookings: Booking[];
  currentBookingId: string | null;
  setCurrentBookingId: (id: string | null) => void;
  currentBooking: Booking | null;
  createBooking: (worker: Worker) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus, note?: string) => void;
  advanceBookingStatus: (bookingId: string) => void;
  submitCustomerReview: (bookingId: string, rating: number, review: string) => void;
  startServiceBooking: (category: ServiceCategory, isEmergency?: boolean) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<CustomerView>('home');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(SERVICE_CATEGORIES[0]);
  const [selectedTier, setSelectedTier] = useState<ServiceTier>('MEDIUM');
  const [urgency, setUrgency] = useState<UrgencyLevel>('NORMAL');
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [photoEstimate, setPhotoEstimate] = useState<{ detected: boolean; tier: ServiceTier; confidence: number; label: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(INITIAL_BOOKINGS[0].id);

  const currentBooking = bookings.find(b => b.id === currentBookingId) || bookings[0] || null;

  const startServiceBooking = (category: ServiceCategory, isEmergency: boolean = false) => {
    setSelectedCategory(category);
    setUrgency(isEmergency ? 'EMERGENCY' : 'NORMAL');
    setProblemDescription('');
    setPhotoEstimate(null);
    setSelectedTier(isEmergency ? 'LARGE' : 'MEDIUM');
    setActiveView('service-detail');
  };

  const createBooking = (worker: Worker): Booking => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const token = `SYH-${randomNum}`;
    const base = selectedCategory?.basePrice || 299;
    const tierMultiplier = selectedTier === 'SMALL' ? 1 : selectedTier === 'MEDIUM' ? 1.8 : 2.8;
    const estimatedPrice = Math.round(base * tierMultiplier);
    const connectionFee = 25;

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      token,
      customerId: 'cust-1',
      customerName: 'Ananya Deshmukh',
      customerPhone: '+91 99801 22334',
      serviceId: selectedCategory?.id || 'electrician',
      serviceName: selectedCategory?.name || 'Electrician',
      serviceCategory: selectedCategory?.category || 'General',
      description: problemDescription || `Requested ${selectedCategory?.name || 'Service'} (${selectedTier} Tier)`,
      address: 'Flat 402, Green Vista Apartments, 12th Main Indiranagar, Bangalore',
      city: 'Bangalore',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: urgency === 'EMERGENCY' ? 'Immediate Priority (15-20 min)' : 'Today (Next Available)',
      urgency,
      tier: selectedTier,
      estimatedPrice,
      connectionFee,
      totalPrice: estimatedPrice + connectionFee,
      worker,
      status: 'REQUESTED',
      otp: '4829',
      statusHistory: [
        {
          status: 'REQUESTED',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Booking request sent to ${worker.name}`
        }
      ],
      paymentStatus: 'PAID',
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => [newBooking, ...prev]);
    setCurrentBookingId(newBooking.id);
    setActiveView('tracking');
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, nextStatus: BookingStatus, note?: string) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id !== bookingId) return b;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const defaultNote =
          nextStatus === 'ACCEPTED' ? `${b.worker?.name || 'Worker'} accepted dispatch request` :
          nextStatus === 'ON_THE_WAY' ? `${b.worker?.name || 'Worker'} is on the way` :
          nextStatus === 'IN_PROGRESS' ? 'OTP verified. Service in progress' :
          nextStatus === 'COMPLETED' ? 'Service completed and verified' :
          nextStatus === 'CANCELLED' ? 'Booking declined/cancelled' :
          `Status updated to ${nextStatus}`;

        const updatedHistory = [
          ...b.statusHistory,
          {
            status: nextStatus,
            timestamp,
            note: note || defaultNote,
          }
        ];

        return {
          ...b,
          status: nextStatus,
          statusHistory: updatedHistory,
          completedAt: nextStatus === 'COMPLETED' ? new Date().toISOString() : b.completedAt,
        };
      })
    );
  };

  const advanceBookingStatus = (bookingId: string) => {
    setBookings(prev => {
      const target = prev.find(b => b.id === bookingId);
      if (!target) return prev;
      let nextStatus: BookingStatus = target.status;
      if (target.status === 'REQUESTED' || target.status === 'MATCHED') nextStatus = 'ACCEPTED';
      else if (target.status === 'ACCEPTED') nextStatus = 'ON_THE_WAY';
      else if (target.status === 'ON_THE_WAY') nextStatus = 'IN_PROGRESS';
      else if (target.status === 'IN_PROGRESS') nextStatus = 'COMPLETED';

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updatedHistory = [
        ...target.statusHistory,
        {
          status: nextStatus,
          timestamp,
          note: `Status advanced to ${nextStatus}`
        }
      ];

      return prev.map(b => (b.id === bookingId ? {
        ...b,
        status: nextStatus,
        statusHistory: updatedHistory,
        completedAt: nextStatus === 'COMPLETED' ? new Date().toISOString() : b.completedAt
      } : b));
    });
  };

  const submitCustomerReview = (bookingId: string, rating: number, review: string) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          customerRating: rating,
          customerReview: review,
        };
      })
    );
  };

  return (
    <BookingContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        selectedTier,
        setSelectedTier,
        urgency,
        setUrgency,
        problemDescription,
        setProblemDescription,
        photoEstimate,
        setPhotoEstimate,
        bookings,
        currentBookingId,
        setCurrentBookingId,
        currentBooking,
        createBooking,
        updateBookingStatus,
        advanceBookingStatus,
        submitCustomerReview,
        startServiceBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

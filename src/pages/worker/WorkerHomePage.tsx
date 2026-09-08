import React from 'react';
import { useWorker } from '../../context/WorkerContext';
import { useBooking } from '../../context/BookingContext';
import { SkillsMatrixView } from '../../components/worker/SkillsMatrixView';
import { TrainingCourseView } from '../../components/worker/TrainingCourseView';
import { WorkerEarningsView } from '../../components/worker/WorkerEarningsView';
import { WorkerProfileView } from '../../components/worker/WorkerProfileView';
import { ActiveJobCard } from '../../components/worker/ActiveJobCard';
import { SkillQuizModal } from '../../components/worker/SkillQuizModal';
import { CertificateModal } from '../../components/worker/CertificateModal';
import { WorkerOnboardingModal } from '../../components/worker/WorkerOnboardingModal';
import {
  ShieldCheck,
  Power,
  Award,
  HardHat,
  MapPin,
  CheckCircle,
  XCircle,
  BookOpen,
  IndianRupee,
  Zap,
  ArrowRight,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

export const WorkerHomePage: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    worker,
    isAvailable,
    setIsAvailable,
    todayEarnings,
    setShowOnboardingModal,
    acceptBooking,
    declineBooking,
    trainingModules,
    skillsMatrix,
    certificates,
    setActiveCertificate,
    setShowCertificateModal,
    setActiveQuizModule,
  } = useWorker();

  const { bookings } = useBooking();

  // Find active booking for this worker
  const activeBooking = bookings.find(
    (b) => b.status === 'ACCEPTED' || b.status === 'ON_THE_WAY' || b.status === 'IN_PROGRESS'
  );

  const pendingRequest = bookings.find(
    (b) => b.status === 'REQUESTED' || b.status === 'MATCHED'
  );

  // Check for pending training modules in worker's professions
  const pendingRequiredModules = trainingModules.filter(
    (m) =>
      worker.professions.some(
        (p) =>
          p.toLowerCase().includes(m.profession.toLowerCase()) ||
          m.profession.toLowerCase().includes(p.toLowerCase())
      ) && !m.completed
  );

  const verifiedSkillsCount = skillsMatrix.filter((s) => s.verified).length;

  const handleOpenCertificate = (certId: string) => {
    const cert = certificates.find((c) => c.id === certId) || certificates[0];
    if (cert) {
      setActiveCertificate(cert);
      setShowCertificateModal(true);
    }
  };

  const handleStartPendingTraining = () => {
    if (pendingRequiredModules.length > 0) {
      setActiveQuizModule(pendingRequiredModules[0]);
      setActiveTab('training');
    } else {
      setActiveTab('training');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'skills':
        return <SkillsMatrixView />;
      case 'training':
        return <TrainingCourseView />;
      case 'earnings':
        return <WorkerEarningsView />;
      case 'profile':
        return <WorkerProfileView />;
      case 'jobs':
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '14px 16px' }}>
            {/* Worker Profile Summary Header Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-sm)',
                      objectFit: 'cover',
                      border: '1.5px solid var(--secondary)',
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <h2 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        {worker.name}
                      </h2>
                      <span
                        style={{
                          fontSize: '0.5625rem',
                          fontWeight: 800,
                          backgroundColor: 'var(--success-light)',
                          color: 'var(--success-dark)',
                          padding: '1px 5px',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid var(--success-border)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <ShieldCheck size={10} />
                        KYC Verified
                      </span>
                    </div>

                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 600 }}>
                      {worker.professions.join(' • ')}
                    </div>

                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                      {worker.cooperativeName}
                    </div>
                  </div>
                </div>

                {/* Online / Offline Switch */}
                <button
                  type="button"
                  onClick={() => setIsAvailable(!isAvailable)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-xs)',
                    border: `1.5px solid ${isAvailable ? 'var(--success)' : 'var(--border-strong)'}`,
                    backgroundColor: isAvailable ? 'var(--success-light)' : 'var(--bg-muted)',
                    color: isAvailable ? 'var(--success-dark)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    minWidth: '58px',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <Power size={16} color={isAvailable ? 'var(--success)' : 'var(--text-muted)'} />
                  <span>{isAvailable ? 'Online' : 'Offline'}</span>
                </button>
              </div>

              {/* Jobs Readiness Status Bar */}
              <div
                style={{
                  marginTop: '10px',
                  padding: '6px 10px',
                  backgroundColor: isAvailable ? '#F8FAFC' : '#FEF2F2',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.6875rem',
                  color: isAvailable ? 'var(--text-secondary)' : '#991B1B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  {isAvailable
                    ? `✓ Active in ${worker.zone} • Ready for Dispatches`
                    : 'Offline. Switch Online to receive customer job dispatches.'}
                </span>

                {worker.emergencyAvailable && isAvailable && (
                  <span style={{ fontSize: '0.5625rem', fontWeight: 800, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Zap size={10} fill="var(--danger)" /> 15m Squad
                  </span>
                )}
              </div>
            </div>

            {/* Onboarding & Verification Status Banner */}
            <div
              style={{
                backgroundColor: '#F0FDFA',
                border: '1px solid #99F6E4',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--secondary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)' }}>
                    Onboarding Completed • Active Partner Profile
                  </div>
                  <div style={{ fontSize: '0.625rem', color: '#0F766E' }}>
                    {worker.professions.length} Professions • {verifiedSkillsCount} Verified Trade Skills • UIDAI KYC
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowOnboardingModal(true)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #99F6E4',
                  color: 'var(--secondary)',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Edit Profile
              </button>
            </div>

            {/* Pending Training Alert Card (if any required module uncertified) */}
            {pendingRequiredModules.length > 0 && (
              <div
                style={{
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <AlertCircle size={18} color="#D97706" style={{ marginTop: '1px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#92400E' }}>
                      Pending Trade Assessment: {pendingRequiredModules[0].profession}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#B45309', marginTop: '1px' }}>
                      "{pendingRequiredModules[0].title}" • Complete 10-mark quiz to unlock badge
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartPendingTraining}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: '#D97706',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  className="sahyog-btn"
                >
                  <span>Start Test</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            )}

            {/* Live Active Job Card (if accepted) */}
            {activeBooking && (
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Current In-Progress Job
                </div>
                <ActiveJobCard booking={activeBooking} />
              </div>
            )}

            {/* Pending Job Request Dispatch Card (if any pending) */}
            {pendingRequest && !activeBooking && (
              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  border: '1.5px solid #3B82F6',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.625rem',
                        fontWeight: 800,
                        color: '#1D4ED8',
                        backgroundColor: '#DBEAFE',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-xs)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        textTransform: 'uppercase',
                      }}
                    >
                      <HardHat size={11} />
                      New Dispatch Request
                    </span>
                    {pendingRequest.urgency === 'EMERGENCY' && (
                      <span
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 800,
                          backgroundColor: '#FEE2E2',
                          color: '#B91C1C',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid #FCA5A5',
                        }}
                      >
                        ⚡ Emergency Priority
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--primary)' }}>
                    Token: {pendingRequest.token}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 3px' }}>
                    {pendingRequest.serviceName} ({pendingRequest.tier} Tier)
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
                    "{pendingRequest.description}"
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.6875rem', color: 'var(--text-secondary)', backgroundColor: '#F8FAFC', padding: '6px 8px', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <MapPin size={12} color="var(--primary)" />
                      {pendingRequest.address}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Scheduled: <strong>{pendingRequest.scheduledTime}</strong></span>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>
                      Est. Payout: <strong style={{ color: 'var(--success-dark)' }}>₹{pendingRequest.totalPrice - pendingRequest.connectionFee}</strong>
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '8px', marginTop: '2px' }}>
                  <button
                    type="button"
                    onClick={() => declineBooking(pendingRequest.id)}
                    style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    <XCircle size={14} />
                    <span>Decline</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => acceptBooking(pendingRequest.id)}
                    style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: 'var(--success-dark)',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                    className="sahyog-btn"
                  >
                    <CheckCircle size={14} />
                    <span>Accept Job</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div
                onClick={() => setActiveTab('earnings')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  padding: '10px 8px',
                  textAlign: 'center',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-xs)',
                  cursor: 'pointer',
                }}
                className="hover-card"
              >
                <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--success-dark)' }}>
                  ₹{todayEarnings}
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '1px' }}>
                  Today's Pay
                </div>
              </div>

              <div
                onClick={() => setActiveTab('jobs')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  padding: '10px 8px',
                  textAlign: 'center',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-xs)',
                  cursor: 'pointer',
                }}
                className="hover-card"
              >
                <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--primary)' }}>
                  {worker.completedJobs}
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '1px' }}>
                  Jobs Done
                </div>
              </div>

              <div
                onClick={() => setActiveTab('skills')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  padding: '10px 8px',
                  textAlign: 'center',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-xs)',
                  cursor: 'pointer',
                }}
                className="hover-card"
              >
                <div style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--accent-warm)' }}>
                  {worker.rating} ★
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '1px' }}>
                  Rating
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div
                onClick={() => setActiveTab('skills')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                className="hover-card"
              >
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--secondary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                  <Award size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Skills Matrix
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                    {verifiedSkillsCount} verified skills
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('training')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                className="hover-card"
              >
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <BookOpen size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    LMS Training
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                    {trainingModules.length} video modules
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('earnings')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                className="hover-card"
              >
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success-dark)' }}>
                  <IndianRupee size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Earnings Ledger
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                    0% platform fee
                  </div>
                </div>
              </div>

              <div
                onClick={() => setShowOnboardingModal(true)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                className="hover-card"
              >
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-xs)', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                  <HardHat size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Onboarding Flow
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                    5-step partner setup
                  </div>
                </div>
              </div>
            </div>

            {/* Certificates Wallet Preview Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={15} color="var(--secondary)" />
                  <span>Earned Trade Certificates ({certificates.length})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontSize: '0.6875rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  <span>View All</span>
                  <ChevronRight size={12} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {certificates.slice(0, 2).map((cert) => (
                  <div
                    key={cert.id}
                    onClick={() => handleOpenCertificate(cert.id)}
                    style={{
                      padding: '8px 10px',
                      backgroundColor: 'var(--bg-app)',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                    className="hover-card"
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {cert.profession} Specialist
                      </div>
                      <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                        {cert.certificateNumber} • Score: {cert.score}/10 Pass
                      </div>
                    </div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--secondary)' }}>
                      View Cert →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingBottom: '16px' }}>
      {renderTabContent()}

      {/* Interactive Modals */}
      <SkillQuizModal />
      <CertificateModal />
      <WorkerOnboardingModal />
    </div>
  );
};

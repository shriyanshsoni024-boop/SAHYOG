import React, { useState, useRef, useEffect } from 'react';
import { useWorker } from '../../context/WorkerContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Booking } from '../../types';
import {
  Phone,
  MapPin,
  CheckCircle,
  Navigation,
  KeyRound,
  ShieldCheck,
  Clock,
  Check,
  User,
  AlertCircle,
} from 'lucide-react';
import { getWorkerTheme } from '../../styles/workerThemes';

export interface ActiveJobCardProps {
  booking: Booking;
}

export const ActiveJobCard: React.FC<ActiveJobCardProps> = ({ booking }) => {
  const { worker, startTravel, startWorkWithOtp, completeWork } = useWorker();
  const { language } = useLanguage();

  const theme = getWorkerTheme(worker.professions);

  // 4-digit OTP state
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [otpError, setOtpError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (booking.status === 'ON_THE_WAY') {
      inputRefs.current[0]?.focus();
    }
  }, [booking.status]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setOtpError('');

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{4}$/.test(pasted)) {
      const digits = pasted.split('');
      setOtpDigits(digits);
      inputRefs.current[3]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    setOtpError('');
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 4) {
      setOtpError('Please enter the complete 4-digit start OTP.');
      return;
    }

    setIsSubmitting(true);
    const result = startWorkWithOtp(booking.id, fullOtp);
    setIsSubmitting(false);

    if (!result.success) {
      setOtpError(result.message || 'Invalid OTP. Please check the code with the customer.');
    }
  };

  const isAccepted = booking.status === 'ACCEPTED';
  const isOnTheWay = booking.status === 'ON_THE_WAY';
  const isInProgress = booking.status === 'IN_PROGRESS';
  const isCompleted = booking.status === 'COMPLETED';

  const grossAmount = booking.totalPrice || 474;
  const platformFee = booking.connectionFee || 0;
  const netPayout = grossAmount - platformFee;

  const steps = [
    { key: 'ACCEPTED', label: 'Accepted', labelHi: 'स्वीकृत' },
    { key: 'ON_THE_WAY', label: 'On The Way', labelHi: 'रास्ते में' },
    { key: 'IN_PROGRESS', label: 'In Progress', labelHi: 'कार्य प्रगति पर' },
    { key: 'COMPLETED', label: 'Completed', labelHi: 'पूर्ण' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 0;
      case 'ON_THE_WAY':
        return 1;
      case 'IN_PROGRESS':
        return 2;
      case 'COMPLETED':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIndex = getStepIndex(booking.status);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '18px 16px 20px',
        border: `1.5px solid ${theme.primaryBorder}`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Header & Token */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isInProgress ? '#EAB308' : isOnTheWay ? theme.primary : '#10B981',
              boxShadow: `0 0 0 3px ${theme.primaryLight}`,
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 800,
              color: theme.primary,
              backgroundColor: theme.primaryLight,
              padding: '3px 8px',
              borderRadius: '9999px',
              border: `1px solid ${theme.primaryBorder}`,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            ACTIVE DISPATCH • {booking.status.replace(/_/g, ' ')}
          </span>
        </div>

        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A' }}>
          Token: <strong style={{ color: theme.primary }}>{booking.token || 'SYH-4829'}</strong>
        </span>
      </div>

      {/* Visual Journey Stepper Flow */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px' }}>
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <React.Fragment key={step.key}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div
                  className={isCurrent ? 'animate-pulse-live' : ''}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: isDone || isCurrent ? theme.primary : '#F1F5F9',
                    color: isDone || isCurrent ? '#FFFFFF' : '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    border: `2px solid ${isCurrent ? theme.primary : isDone ? theme.primary : '#E2E8F0'}`,
                    boxShadow: isCurrent ? `0 0 0 4px ${theme.primaryLight}` : 'none',
                    transition: 'all var(--transition-smooth) var(--ease-out-smooth)',
                  }}
                >
                  {isDone ? <Check size={14} strokeWidth={3} /> : idx + 1}
                </div>
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: isCurrent ? 800 : 600,
                    color: isCurrent ? theme.primaryDark : isDone ? '#0F172A' : '#94A3B8',
                    whiteSpace: 'nowrap',
                    transition: 'color var(--transition-normal) ease',
                  }}
                >
                  {language === 'hi' ? step.labelHi : step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: '3px',
                    backgroundColor: idx < currentStepIndex ? theme.primary : '#E2E8F0',
                    margin: '0 4px',
                    marginBottom: '16px',
                    borderRadius: '2px',
                    transition: 'background-color var(--transition-smooth) var(--ease-out-smooth)',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Service & Customer Summary */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '16px',
          padding: '14px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
              {booking.serviceName || 'Home Service'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
              {booking.serviceCategory || 'Maintenance & Repair'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 900, color: theme.primary }}>
              ₹{netPayout}
            </div>
            <span
              style={{
                fontSize: '0.5625rem',
                fontWeight: 800,
                color: '#1DAA5C',
                backgroundColor: '#ECFDF5',
                padding: '2px 6px',
                borderRadius: '6px',
                border: '1px solid #A7F3D0',
                display: 'inline-block',
              }}
            >
              0% COMMISSION
            </span>
          </div>
        </div>

        {booking.description && (
          <div
            style={{
              fontSize: '0.8125rem',
              color: '#334155',
              backgroundColor: '#FFFFFF',
              padding: '10px 12px',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              lineHeight: 1.4,
            }}
          >
            <strong style={{ color: '#0F172A' }}>Customer Note:</strong> "{booking.description}"
          </div>
        )}

        {/* Customer Details & Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: '1px dashed #CBD5E1',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: theme.primaryLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.primary,
              }}
            >
              <User size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>
                {booking.customerName || 'Resident'}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <MapPin size={11} /> {booking.address || booking.city || 'Sector 62, Noida'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <a
              href={`tel:${booking.customerPhone || ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                borderRadius: '9999px',
                backgroundColor: theme.primaryLight,
                color: theme.primary,
                border: `1px solid ${theme.primaryBorder}`,
                fontSize: '0.75rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Phone size={14} />
              <span>Call</span>
            </a>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(booking.address || booking.city || 'Noida')}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                borderRadius: '9999px',
                backgroundColor: '#F8FAFC',
                color: '#475569',
                border: '1px solid #CBD5E1',
                fontSize: '0.75rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Navigation size={14} />
              <span>Map</span>
            </a>
          </div>
        </div>
      </div>

      {/* STAGE-SPECIFIC ACTION PANELS */}

      {/* 1. ACCEPTED STATE */}
      {isAccepted && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: theme.primaryLight,
              borderRadius: '12px',
              border: `1px solid ${theme.primaryBorder}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8125rem',
              color: theme.primaryDark,
              fontWeight: 600,
            }}
          >
            <Clock size={16} color={theme.primary} />
            <span>Job accepted! Tap below when you begin travelling to the customer.</span>
          </div>

          <button
            type="button"
            onClick={() => startTravel(booking.id)}
            className="sahyog-btn"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '16px',
              backgroundColor: theme.primary,
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.9375rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(29, 170, 92, 0.2)',
              transition: 'all var(--transition-fast) var(--ease-out-smooth)',
            }}
          >
            <Navigation size={18} />
            <span>Start Journey to Customer</span>
          </button>
        </div>
      )}

      {/* 2. ON_THE_WAY STATE (4-DIGIT OTP VERIFICATION) */}
      {isOnTheWay && (
        <div
          style={{
            backgroundColor: '#FFFBEB',
            borderRadius: '18px',
            padding: '16px',
            border: '1.5px solid #FDE68A',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <KeyRound size={20} color="#D97706" />
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#92400E' }}>
                Enter Customer Start OTP
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#B45309', marginTop: '1px' }}>
                Ask the customer for the 4-digit code shown on their tracking screen.
              </div>
            </div>
          </div>

          {/* 4 Separate Rounded OTP Boxes */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              margin: '8px 0',
            }}
            onPaste={handleOtpPaste}
          >
            {[0, 1, 2, 3].map((idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={otpDigits[idx]}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                style={{
                  width: '56px',
                  height: '58px',
                  borderRadius: '14px',
                  border: otpError ? '2px solid #EF4444' : otpDigits[idx] ? `2px solid ${theme.primary}` : '1.5px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  textAlign: 'center',
                  color: '#0F172A',
                  outline: 'none',
                  boxShadow: otpDigits[idx] ? `0 0 0 3px ${theme.primaryLight}` : '0 2px 4px rgba(0,0,0,0.04)',
                  transition: 'all var(--transition-fast) var(--ease-out-smooth)',
                }}
              />
            ))}
          </div>

          {otpError && (
            <div
              className="animate-slide-up"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                color: '#DC2626',
                fontWeight: 700,
                backgroundColor: '#FEF2F2',
                padding: '6px 10px',
                borderRadius: '8px',
              }}
            >
              <AlertCircle size={14} />
              <span>{otpError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={isSubmitting || otpDigits.join('').length !== 4}
            className="sahyog-btn"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '16px',
              backgroundColor: otpDigits.join('').length === 4 ? theme.primary : '#94A3B8',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.9375rem',
              fontWeight: 800,
              cursor: otpDigits.join('').length === 4 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all var(--transition-fast) var(--ease-out-smooth)',
            }}
          >
            <ShieldCheck size={18} />
            <span>Verify OTP & Start Work</span>
          </button>
        </div>
      )}

      {/* 3. IN_PROGRESS STATE */}
      {isInProgress && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#FEF3C7',
              borderRadius: '14px',
              border: '1.5px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Clock size={20} color="#D97706" />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#92400E' }}>
                Job in Progress
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#B45309' }}>
                Complete the home service work, ensure customer satisfaction, and tap below.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => completeWork(booking.id)}
            className="sahyog-btn"
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: '#1DAA5C',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 6px 16px rgba(5, 150, 105, 0.25)',
              transition: 'all var(--transition-fast) var(--ease-out-smooth)',
            }}
          >
            <CheckCircle size={20} />
            <span>Complete Job & Claim ₹{netPayout}</span>
          </button>
        </div>
      )}

      {/* 4. COMPLETED STATE */}
      {isCompleted && (
        <div
          style={{
            padding: '14px',
            backgroundColor: '#ECFDF5',
            borderRadius: '14px',
            border: '1.5px solid #A7F3D0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <CheckCircle size={24} color="#1DAA5C" />
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#065F46' }}>
              Job Completed Successfully!
            </div>
            <div style={{ fontSize: '0.75rem', color: '#047857' }}>
              ₹{netPayout} payout credited instantly to your Cooperative Wallet balance.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

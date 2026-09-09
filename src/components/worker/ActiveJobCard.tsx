import React, { useState } from 'react';
import { useWorker } from '../../context/WorkerContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Booking } from '../../types';
import { Phone, MapPin, CheckCircle, Navigation, KeyRound, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export interface ActiveJobCardProps {
  booking: Booking;
}

export const ActiveJobCard: React.FC<ActiveJobCardProps> = ({ booking }) => {
  const { startTravel, startWorkWithOtp, completeWork } = useWorker();
  const { language } = useLanguage();

  const [otpInput, setOtpInput] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleVerifyOtp = () => {
    setOtpError('');
    if (!otpInput.trim() || otpInput.trim().length !== 4) {
      setOtpError('Please enter the 4-digit OTP shown on the customer app.');
      return;
    }

    setIsSubmitting(true);
    const result = startWorkWithOtp(booking.id, otpInput);
    setIsSubmitting(false);

    if (!result.success) {
      setOtpError(result.message || 'Invalid OTP. Please check the 4-digit code with the customer.');
    }
  };

  const isAccepted = booking.status === 'ACCEPTED';
  const isOnTheWay = booking.status === 'ON_THE_WAY';
  const isInProgress = booking.status === 'IN_PROGRESS';

  const grossAmount = booking.totalPrice || 474;
  const platformFee = booking.connectionFee || 25;
  const netPayout = grossAmount - platformFee;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        padding: '14px',
        border: '1.5px solid #3B82F6',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {/* Top Banner Status & Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isInProgress ? 'var(--warning)' : isOnTheWay ? '#3B82F6' : 'var(--success)',
              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
            }}
          />
          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 800,
              color: '#1D4ED8',
              backgroundColor: '#EFF6FF',
              padding: '2px 6px',
              borderRadius: 'var(--radius-xs)',
              textTransform: 'uppercase',
            }}
          >
            ACTIVE JOB • {booking.status.replace(/_/g, ' ')}
          </span>
        </div>

        <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--primary)' }}>
          Token: {booking.token}
        </span>
      </div>

      {/* Progress Stepper Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '2px 0' }}>
        <div
          style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            backgroundColor: '#3B82F6',
          }}
          title="Accepted"
        />
        <div
          style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            backgroundColor: isOnTheWay || isInProgress ? '#3B82F6' : 'var(--border-default)',
          }}
          title="On The Way"
        />
        <div
          style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            backgroundColor: isInProgress ? '#3B82F6' : 'var(--border-default)',
          }}
          title="In Progress"
        />
      </div>

      {/* Service Details */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            {booking.serviceName}
          </h3>
          {booking.urgency === 'EMERGENCY' && (
            <span style={{ fontSize: '0.5625rem', fontWeight: 800, color: 'var(--danger)', backgroundColor: '#FEF2F2', padding: '1px 5px', borderRadius: 'var(--radius-xs)' }}>
              ⚡ Emergency
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0 0', lineHeight: 1.35 }}>
          "{booking.description}"
        </p>
      </div>

      {/* Customer Contact & Address Box */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          borderRadius: 'var(--radius-xs)',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          border: '1px solid var(--border-default)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {booking.customerName}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {booking.customerPhone}
            </div>
          </div>

          <a
            href={`tel:${booking.customerPhone}`}
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success-dark)',
              border: '1px solid var(--success-border)',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.75rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Phone size={13} />
            <span>Call Customer</span>
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
          <MapPin size={13} color="var(--primary)" style={{ flexShrink: 0, marginTop: '1px' }} />
          <span style={{ fontWeight: 600 }}>{booking.address}</span>
        </div>

        <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={11} />
          <span>Scheduled Slot: <strong>{booking.scheduledTime || 'Today'}</strong></span>
        </div>
      </div>

      {/* Transparent Payout Summary */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          backgroundColor: '#F0FDFA',
          border: '1px solid #99F6E4',
          borderRadius: 'var(--radius-xs)',
          fontSize: '0.75rem',
        }}
      >
        <div>
          <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <ShieldCheck size={12} color="var(--secondary)" />
            Net Take-Home (0% Comm):
          </span>
          <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
            Gross ₹{grossAmount} - Fee ₹{platformFee}
          </span>
        </div>
        <span style={{ fontWeight: 900, color: 'var(--success-dark)', fontSize: '1.125rem' }}>
          ₹{netPayout}
        </span>
      </div>

      {/* State Machine Transition Actions */}
      {isAccepted && (
        <button
          type="button"
          onClick={() => startTravel(booking.id)}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-xs)',
            fontWeight: 800,
            fontSize: '0.8125rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          className="sahyog-btn"
        >
          <Navigation size={15} />
          <span>{language === 'hi' ? 'यात्रा शुरू करें (Start Travel)' : 'Start Journey (On the Way)'}</span>
          <ArrowRight size={14} />
        </button>
      )}

      {isOnTheWay && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#FFFBEB', padding: '10px', borderRadius: 'var(--radius-xs)', border: '1px solid #FDE68A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#92400E', fontWeight: 700 }}>
            <KeyRound size={14} color="#D97706" />
            <span>Enter Customer’s 4-Digit Start OTP:</span>
          </div>
          <div style={{ fontSize: '0.625rem', color: '#B45309' }}>
            Ask customer for the 4-digit code displayed on their live tracking screen (e.g. {booking.otp || (booking as any)?.startOtp || '4829'}).
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              placeholder="••••"
              value={otpInput}
              onChange={(e) => {
                setOtpInput(e.target.value.replace(/\D/g, ''));
                setOtpError('');
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 'var(--radius-xs)',
                border: otpError ? '1.5px solid var(--danger)' : '1.5px solid var(--border-strong)',
                fontSize: '1.125rem',
                fontWeight: 900,
                textAlign: 'center',
                letterSpacing: '0.25em',
                backgroundColor: '#FFFFFF',
              }}
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isSubmitting}
              style={{
                padding: '10px 16px',
                backgroundColor: 'var(--secondary)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-xs)',
                fontWeight: 800,
                fontSize: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              className="sahyog-btn"
            >
              Verify & Start
            </button>
          </div>

          {otpError && (
            <span style={{ fontSize: '0.6875rem', color: 'var(--danger)', fontWeight: 700 }}>
              ⚠ {otpError}
            </span>
          )}
        </div>
      )}

      {isInProgress && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--success-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle size={13} />
            <span>Service in progress. Complete task cleanly and confirm with customer.</span>
          </div>

          <button
            type="button"
            onClick={() => completeWork(booking.id)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'var(--success-dark)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-xs)',
              fontWeight: 800,
              fontSize: '0.8125rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
            className="sahyog-btn"
          >
            <CheckCircle size={16} />
            <span>{language === 'hi' ? 'कार्य पूर्ण करें एवं भुगतान पाएं' : `Complete Job & Claim ₹${netPayout}`}</span>
          </button>
        </div>
      )}
    </div>
  );
};

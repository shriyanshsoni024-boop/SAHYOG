import React, { useState } from 'react';
import { useWorker } from '../../context/WorkerContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Booking } from '../../types';
import { Phone, MapPin, CheckCircle, Navigation, KeyRound, ArrowRight } from 'lucide-react';

export interface ActiveJobCardProps {
  booking: Booking;
}

export const ActiveJobCard: React.FC<ActiveJobCardProps> = ({ booking }) => {
  const { startTravel, startWorkWithOtp, completeWork } = useWorker();
  const { language } = useLanguage();

  const [otpInput, setOtpInput] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');

  const handleVerifyOtp = () => {
    setOtpError('');
    const result = startWorkWithOtp(booking.id, otpInput);
    if (!result.success) {
      setOtpError(result.message || 'Invalid OTP');
    }
  };

  const isAccepted = booking.status === 'ACCEPTED';
  const isOnTheWay = booking.status === 'ON_THE_WAY';
  const isInProgress = booking.status === 'IN_PROGRESS';

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
      {/* Top Banner Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isInProgress ? 'var(--warning)' : '#3B82F6',
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

      {/* Service Details */}
      <div>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 2px' }}>
          {booking.serviceName}
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
          "{booking.description}"
        </p>
      </div>

      {/* Customer Contact & Address Box */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          borderRadius: 'var(--radius-xs)',
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          border: '1px solid var(--border-default)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {booking.customerName}
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
              {booking.customerPhone}
            </div>
          </div>

          <a
            href={`tel:${booking.customerPhone}`}
            style={{
              padding: '4px 8px',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success-dark)',
              border: '1px solid var(--success-border)',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <Phone size={12} />
            <span>Call</span>
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
          <MapPin size={13} color="var(--primary)" style={{ flexShrink: 0, marginTop: '1px' }} />
          <span>{booking.address}</span>
        </div>
      </div>

      {/* Payout Summary */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>
          Net Payout:
        </span>
        <span style={{ fontWeight: 900, color: 'var(--text-primary)', fontSize: '1rem' }}>
          ₹{booking.totalPrice - booking.connectionFee}
        </span>
      </div>

      {/* State Machine Transition Actions */}
      {isAccepted && (
        <button
          type="button"
          onClick={() => startTravel(booking.id)}
          style={{
            width: '100%',
            padding: '10px',
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
          <Navigation size={14} />
          <span>{language === 'hi' ? 'यात्रा शुरू करें (On the Way)' : 'Start Journey (On the Way)'}</span>
          <ArrowRight size={14} />
        </button>
      )}

      {isOnTheWay && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
            <KeyRound size={13} color="var(--primary)" />
            <span>Enter Customer’s 4-Digit Start OTP:</span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              maxLength={4}
              placeholder="e.g. 4829"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 'var(--radius-xs)',
                border: '1.5px solid var(--border-strong)',
                fontSize: '0.9375rem',
                fontWeight: 800,
                textAlign: 'center',
                letterSpacing: '0.2em',
              }}
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              style={{
                padding: '8px 14px',
                backgroundColor: 'var(--secondary)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-xs)',
                fontWeight: 800,
                fontSize: '0.75rem',
                border: 'none',
                cursor: 'pointer',
              }}
              className="sahyog-btn"
            >
              Verify OTP & Start
            </button>
          </div>

          {otpError && (
            <span style={{ fontSize: '0.625rem', color: 'var(--danger)', fontWeight: 700 }}>
              {otpError}
            </span>
          )}
        </div>
      )}

      {isInProgress && (
        <button
          type="button"
          onClick={() => completeWork(booking.id)}
          style={{
            width: '100%',
            padding: '10px',
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
          <CheckCircle size={15} />
          <span>{language === 'hi' ? 'कार्य पूर्ण करें एवं भुगतान पाएं' : 'Complete Job & Claim Payout'}</span>
        </button>
      )}
    </div>
  );
};

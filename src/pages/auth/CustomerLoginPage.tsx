import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Phone, ArrowRight, Sparkles, MapPin, KeyRound, RefreshCw, Edit3 } from 'lucide-react';
import { DEFAULT_LOCATION } from '../../data/locations';
import { isValidIndianMobile } from '../../lib/supabase';

export const CustomerLoginPage: React.FC = () => {
  const { sendPhoneOtp, verifyPhoneOtp, authMode, navigate } = useAuth();

  // Auth Steps: 'PHONE' | 'OTP'
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('9980122334');
  const [otpCode, setOtpCode] = useState('');
  const [name, setName] = useState('Ananya Deshmukh');
  const [locality, setLocality] = useState(DEFAULT_LOCATION);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (step === 'OTP' && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!isValidIndianMobile(cleanPhone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendPhoneOtp({ phone: cleanPhone });
      if (res.success) {
        setSuccessMsg(res.message || `OTP sent to +91 ${cleanPhone}`);
        setStep('OTP');
        setCountdown(45);
        setCanResend(false);
      } else {
        setErrorMsg(res.error || 'Failed to send OTP. Please try again.');
      }
    } catch {
      setErrorMsg('An unexpected network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const token = otpCode.trim();
    if (!token || token.length < 4) {
      setErrorMsg('Please enter a valid OTP code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await verifyPhoneOtp({
        phone: phone.trim().replace(/\D/g, ''),
        token,
        role: 'customer',
        name: name.trim() || 'SAHYOG Customer',
        locality,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Invalid OTP code. Please verify and retry.');
      }
    } catch {
      setErrorMsg('Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const cleanPhone = phone.trim().replace(/\D/g, '');
      const res = await sendPhoneOtp({ phone: cleanPhone });
      if (res.success) {
        setSuccessMsg(`New OTP sent to +91 ${cleanPhone}`);
        setCountdown(45);
        setCanResend(false);
      } else {
        setErrorMsg(res.error || 'Failed to resend OTP.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoFill = () => {
    setPhone('9980122334');
    setName('Ananya Deshmukh');
    setOtpCode('123456');
    setErrorMsg(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        backgroundColor: '#F8FAFC',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 24px -2px rgba(0, 0, 0, 0.06)',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#1DAA5C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(29, 170, 92, 0.25)',
              marginBottom: '12px',
            }}
          >
            <ShieldCheck size={28} strokeWidth={2.3} />
          </div>

          <h1
            style={{
              fontSize: '1.375rem',
              fontWeight: 900,
              color: '#0B0B0B',
              letterSpacing: '-0.03em',
              margin: '0 0 4px',
            }}
          >
            SAHYOG
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '6px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                fontSize: '0.625rem',
                fontWeight: 800,
                color: '#1DAA5C',
                backgroundColor: '#F0FDF4',
                border: '1px solid #D9E9C8',
                padding: '2px 8px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              CUSTOMER MARKETPLACE
            </div>

            {/* Live Environment Status Badge */}
            <div
              style={{
                fontSize: '0.5625rem',
                fontWeight: 800,
                color: authMode === 'SUPABASE_LIVE' ? '#047857' : authMode === 'UNCONFIGURED_PROD' ? '#B91C1C' : '#B45309',
                backgroundColor: authMode === 'SUPABASE_LIVE' ? '#ECFDF5' : authMode === 'UNCONFIGURED_PROD' ? '#FEF2F2' : '#FFFBEB',
                border: `1px solid ${authMode === 'SUPABASE_LIVE' ? '#A7F3D0' : authMode === 'UNCONFIGURED_PROD' ? '#FECACA' : '#FDE68A'}`,
                padding: '2px 7px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {authMode === 'SUPABASE_LIVE' ? '🟢 Live SMS OTP' : authMode === 'UNCONFIGURED_PROD' ? '🔴 Unconfigured' : '🟡 Dev Sandbox'}
            </div>
          </div>

          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
            {step === 'PHONE'
              ? 'Enter your mobile number to sign in or create a customer account'
              : `Enter the 6-digit verification code sent to +91 ${phone}`}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#DC2626',
              lineHeight: 1.4,
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Success Alert */}
        {successMsg && !errorMsg && (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#166534',
              lineHeight: 1.4,
            }}
          >
            {successMsg}
          </div>
        )}

        {step === 'PHONE' ? (
          /* ========================================================= */
          /* STEP 1: MOBILE NUMBER ENTRY                              */
          /* ========================================================= */
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: '5px',
                }}
              >
                Mobile Number
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '10px 12px',
                    backgroundColor: '#F8FAFC',
                    borderRight: '1px solid #E2E8F0',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: '#0F172A',
                    letterSpacing: '0.04em',
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: '5px',
                }}
              >
                Your Name (Optional for first-time login)
              </label>
              <input
                type="text"
                placeholder="e.g. Ananya Deshmukh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  fontSize: '0.875rem',
                  color: '#0F172A',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: '5px',
                }}
              >
                Preferred Service Locality
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#FFFFFF',
                  gap: '8px',
                }}
              >
                <MapPin size={16} color="#64748B" />
                <input
                  type="text"
                  placeholder="e.g. Sector 62, Noida"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.875rem',
                    color: '#0F172A',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: '4px',
                padding: '12px',
                backgroundColor: '#1DAA5C',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(29, 170, 92, 0.25)',
              }}
              className="sahyog-btn"
            >
              <span>{isSubmitting ? 'Sending SMS OTP...' : 'Get OTP on Phone'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          /* ========================================================= */
          /* STEP 2: 6-DIGIT OTP VERIFICATION                         */
          /* ========================================================= */
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} color="#1DAA5C" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B' }}>
                  +91 {phone}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep('PHONE');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1DAA5C',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Edit3 size={13} />
                <span>Change</span>
              </button>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: '6px',
                  textAlign: 'center',
                }}
              >
                Enter 6-Digit OTP Code
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  backgroundColor: '#FFFFFF',
                  gap: '8px',
                }}
              >
                <KeyRound size={18} color="#1DAA5C" />
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  placeholder="• • • • • •"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '140px',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    letterSpacing: '0.3em',
                    textAlign: 'center',
                    color: '#0B0B0B',
                  }}
                  required
                />
              </div>
            </div>

            {/* Countdown & Resend */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {!canResend ? (
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Resend OTP in <strong>{countdown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#1DAA5C',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <RefreshCw size={13} />
                  <span>Resend OTP SMS</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px',
                backgroundColor: '#1DAA5C',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(29, 170, 92, 0.25)',
              }}
              className="sahyog-btn"
            >
              <span>{isSubmitting ? 'Verifying OTP...' : 'Verify OTP & Proceed'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Quick 1-Click Demo Evaluation Shortcut (Only available in Dev Sandbox Mode) */}
        {authMode === 'DEV_SANDBOX' && (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#F8FAFC',
              border: '1px dashed #CBD5E1',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                SIH Sandbox Test Credentials
              </span>
              <span style={{ fontSize: '0.625rem', color: '#1DAA5C', fontWeight: 700 }}>Dev Mode Only</span>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoFill}
              style={{
                padding: '6px 10px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#0B0B0B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={14} color="#F4C430" />
              <span>Pre-fill Demo Customer Number & OTP</span>
            </button>
          </div>
        )}

        {/* Cross-Role Navigation Links */}
        <div
          style={{
            borderTop: '1px solid #F1F5F9',
            paddingTop: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Are you a skilled service technician?{' '}
            <button
              type="button"
              onClick={() => navigate('/worker/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#1DAA5C',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Sign In to Artisan Pro
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Cooperative official or admin?{' '}
            <button
              type="button"
              onClick={() => navigate('/admin/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#1DAA5C',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Federation Command Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


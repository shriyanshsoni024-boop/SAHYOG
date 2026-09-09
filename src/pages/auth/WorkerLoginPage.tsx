import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HardHat, Phone, ArrowRight, Briefcase, Award, Sparkles, KeyRound, RefreshCw, Edit3 } from 'lucide-react';
import { isValidIndianMobile } from '../../lib/supabase';

export const WorkerLoginPage: React.FC = () => {
  const { sendPhoneOtp, verifyPhoneOtp, authMode, navigate } = useAuth();

  // Auth Steps: 'PHONE' | 'OTP'
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('9876543210');
  const [otpCode, setOtpCode] = useState('');
  const [name, setName] = useState('Ramesh Kumar');
  const [profession, setProfession] = useState('Electrician');
  const [cooperativeBranch, setCooperativeBranch] = useState('Bengaluru East Electrical Union');
  const [experienceYears, setExperienceYears] = useState('8');
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
        role: 'worker',
        name: name.trim() || 'Artisan Partner',
        profession,
        cooperativeBranch,
        experienceYears: parseInt(experienceYears, 10) || 5,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Invalid OTP code. Please verify artisan credentials.');
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
    setPhone('9876543210');
    setName('Ramesh Kumar');
    setProfession('Electrician');
    setCooperativeBranch('Bengaluru East Electrical Union');
    setExperienceYears('8');
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
        backgroundColor: '#F0FDFA',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #CCFBF1',
          boxShadow: '0 4px 24px -2px rgba(13, 148, 136, 0.08)',
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
              backgroundColor: '#0D9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.25)',
              marginBottom: '12px',
            }}
          >
            <HardHat size={28} strokeWidth={2.3} />
          </div>

          <h1
            style={{
              fontSize: '1.375rem',
              fontWeight: 900,
              color: '#0F172A',
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
              marginBottom: '8px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                fontSize: '0.625rem',
                fontWeight: 800,
                color: '#0D9488',
                backgroundColor: '#F0FDFA',
                border: '1px solid #99F6E4',
                padding: '2px 8px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              ARTISAN PRO • 0% COMMISSION • AUTH
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
              ? 'Enter your mobile number to sign in or register as a certified cooperative artisan'
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
              backgroundColor: '#F0FDFA',
              border: '1px solid #99F6E4',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#0F766E',
              lineHeight: 1.4,
            }}
          >
            {successMsg}
          </div>
        )}

        {step === 'PHONE' ? (
          /* ========================================================= */
          /* STEP 1: ARTISAN MOBILE & TRADE DETAILS                   */
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
                Registered Mobile Number
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
                    backgroundColor: '#F0FDFA',
                    borderRight: '1px solid #CCFBF1',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#0D9488',
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
                Full Name (as per Aadhaar)
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
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
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                  Primary Trade
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    backgroundColor: '#FFFFFF',
                    gap: '6px',
                  }}
                >
                  <Briefcase size={15} color="#0D9488" />
                  <select
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '0.8125rem',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="AC Repair">AC Repair</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Appliance">Appliance</option>
                    <option value="Cleaning">Cleaning</option>
                  </select>
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
                  Experience (Yrs)
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.875rem',
                    color: '#0F172A',
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
                Cooperative Union Branch
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
                <Award size={16} color="#0D9488" />
                <input
                  type="text"
                  placeholder="e.g. Bengaluru East Electrical Union"
                  value={cooperativeBranch}
                  onChange={(e) => setCooperativeBranch(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.875rem',
                    color: '#0F172A',
                  }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: '4px',
                padding: '12px',
                backgroundColor: '#0D9488',
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
                boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)',
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
                backgroundColor: '#F0FDFA',
                borderRadius: '8px',
                border: '1px solid #CCFBF1',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} color="#0D9488" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F766E' }}>
                  +91 {phone} ({profession})
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
                  color: '#0D9488',
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
                <KeyRound size={18} color="#0D9488" />
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
                    color: '#0F172A',
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
                    color: '#0D9488',
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
                backgroundColor: '#0D9488',
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
                boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)',
              }}
              className="sahyog-btn"
            >
              <span>{isSubmitting ? 'Verifying OTP...' : 'Verify OTP & Access Artisan Pro'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Quick Demo Pre-fill Shortcut (Only shown in DEV_SANDBOX mode, hidden in Production) */}
        {authMode === 'DEV_SANDBOX' && (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#F0FDFA',
              border: '1px dashed #99F6E4',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase' }}>
                SIH Sandbox Test Credentials
              </span>
              <span style={{ fontSize: '0.625rem', color: '#0D9488', fontWeight: 700 }}>Dev Mode Only</span>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoFill}
              style={{
                padding: '6px 10px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CCFBF1',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#0F172A',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={14} color="#0D9488" />
              <span>Pre-fill Demo Artisan: Ramesh Kumar & OTP</span>
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
            Looking to book a service?{' '}
            <button
              type="button"
              onClick={() => navigate('/customer/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#0C831F',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Customer Marketplace Login
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
                color: '#EA580C',
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


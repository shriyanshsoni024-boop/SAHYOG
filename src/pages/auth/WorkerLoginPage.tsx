import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HardHat, Lock, Phone, User, Eye, EyeOff, ArrowRight, Briefcase, Award, Sparkles } from 'lucide-react';

export const WorkerLoginPage: React.FC = () => {
  const { login, signup, navigate } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('artisan@2026');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profession, setProfession] = useState('Electrician');
  const [cooperativeBranch, setCooperativeBranch] = useState('Bengaluru East Electrical Union');
  const [experienceYears, setExperienceYears] = useState('8');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await login('worker', { identifier, password });
      if (!res.success) {
        setErrorMsg(res.error || 'Login failed. Please verify artisan credentials.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await signup('worker', {
        name,
        phone,
        password,
        profession,
        cooperativeBranch,
        experienceYears: parseInt(experienceYears, 10) || 5,
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Artisan registration failed.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoFill = () => {
    setIdentifier('9876543210');
    setPassword('artisan@2026');
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
          borderRadius: '12px',
          border: '1px solid #CCFBF1',
          boxShadow: '0 4px 20px -2px rgba(13, 148, 136, 0.08)',
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
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: '#0D9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)',
              marginBottom: '12px',
            }}
          >
            <HardHat size={26} strokeWidth={2.3} />
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
              fontSize: '0.625rem',
              fontWeight: 800,
              color: '#0D9488',
              backgroundColor: '#F0FDFA',
              border: '1px solid #99F6E4',
              padding: '2px 8px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'inline-block',
              marginBottom: '8px',
            }}
          >
            ARTISAN PRO • 0% COMMISSION
          </div>

          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
            {isSignup
              ? 'Join India’s cooperative artisan network with 100% direct payouts'
              : 'Sign in to access your dispatch queue, jobs & daily earnings'}
          </p>
        </div>

        {/* Tab Toggle (Sign In vs Register as Artisan) */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#F1F5F9',
            padding: '3px',
            borderRadius: '8px',
            gap: '2px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsSignup(false);
              setErrorMsg(null);
            }}
            style={{
              flex: 1,
              padding: '8px',
              fontSize: '0.8125rem',
              fontWeight: !isSignup ? 700 : 500,
              backgroundColor: !isSignup ? '#FFFFFF' : 'transparent',
              color: !isSignup ? '#0F172A' : '#64748B',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: !isSignup ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 120ms ease',
            }}
          >
            Artisan Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignup(true);
              setErrorMsg(null);
            }}
            style={{
              flex: 1,
              padding: '8px',
              fontSize: '0.8125rem',
              fontWeight: isSignup ? 700 : 500,
              backgroundColor: isSignup ? '#FFFFFF' : 'transparent',
              color: isSignup ? '#0F172A' : '#64748B',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: isSignup ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 120ms ease',
            }}
          >
            Register as Artisan
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#DC2626',
              lineHeight: 1.4,
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Forgot PIN / Password Notice */}
        {showForgotNotice && (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#F0FDFA',
              border: '1px solid #99F6E4',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#0F766E',
              lineHeight: 1.4,
            }}
          >
            <strong>Artisan PIN Recovery:</strong> In this demo environment, click the quick-fill button below or contact your cooperative union representative for verification reset.
          </div>
        )}

        {!isSignup ? (
          /* ========================================================= */
          /* ARTISAN SIGN IN FORM                                      */
          /* ========================================================= */
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                Registered Mobile Number or Artisan ID
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '9px 12px',
                  backgroundColor: '#FFFFFF',
                  gap: '8px',
                }}
              >
                <Phone size={16} color="#0D9488" />
                <input
                  type="text"
                  placeholder="e.g. 9876543210 or artisan ID"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                  Secret PIN / Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotNotice(!showForgotNotice)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#0D9488',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Forgot PIN?
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '9px 12px',
                  backgroundColor: '#FFFFFF',
                  gap: '8px',
                }}
              >
                <Lock size={16} color="#0D9488" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter 4-digit PIN or password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.875rem',
                    color: '#0F172A',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex' }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: '6px',
                padding: '11px',
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
                boxShadow: '0 2px 6px rgba(13, 148, 136, 0.25)',
              }}
              className="sahyog-btn"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Artisan Pro'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          /* ========================================================= */
          /* ARTISAN REGISTRATION FORM                                 */
          /* ========================================================= */
          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Full Name (as per Aadhaar)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '8px 12px', gap: '8px' }}>
                <User size={16} color="#0D9488" />
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Mobile Number
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '8px 12px', gap: '8px' }}>
                <Phone size={16} color="#0D9488" />
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Primary Trade / Skill
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '8px 12px', gap: '8px' }}>
                <Briefcase size={16} color="#0D9488" />
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem', backgroundColor: 'transparent' }}
                >
                  <option value="Electrician">Master Electrician</option>
                  <option value="Plumber">Plumber & Pipe Fitter</option>
                  <option value="AC Repair">HVAC & AC Technician</option>
                  <option value="Carpenter">Carpenter & Woodwork</option>
                  <option value="Appliance">Appliance Repair Specialist</option>
                  <option value="Cleaning">Deep Cleaning Specialist</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Cooperative Union Branch
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '8px 12px', gap: '8px' }}>
                <Award size={16} color="#0D9488" />
                <input
                  type="text"
                  placeholder="e.g. Bengaluru East Electrical Union"
                  value={cooperativeBranch}
                  onChange={(e) => setCooperativeBranch(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Years of Experience
              </label>
              <input
                type="number"
                min="1"
                max="40"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                style={{ width: '100%', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '8px 12px', fontSize: '0.875rem' }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: '6px',
                padding: '11px',
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
              }}
              className="sahyog-btn"
            >
              <span>{isSubmitting ? 'Registering...' : 'Submit Artisan Registration'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Quick Demo Pre-fill Shortcut */}
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
              SIH Demo Evaluation Quick Fill
            </span>
            <span style={{ fontSize: '0.625rem', color: '#0D9488', fontWeight: 700 }}>Master Electrician</span>
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
            <span>Fill Demo Artisan: Ramesh Kumar</span>
          </button>
        </div>

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

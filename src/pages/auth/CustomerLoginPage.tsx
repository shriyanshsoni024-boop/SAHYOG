import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Phone, User, Eye, EyeOff, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { DEFAULT_LOCATION } from '../../data/locations';

export const CustomerLoginPage: React.FC = () => {
  const { login, signup, navigate } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('9980122334');
  const [password, setPassword] = useState('sahyog@2026');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState(DEFAULT_LOCATION);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await login('customer', { identifier, password });
      if (!res.success) {
        setErrorMsg(res.error || 'Login failed. Please check your credentials.');
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
      const res = await signup('customer', {
        name,
        phone,
        password,
        locality,
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Registration failed.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoFill = () => {
    setIdentifier('9980122334');
    setPassword('sahyog@2026');
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
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
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
              backgroundColor: '#0C831F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(12, 131, 31, 0.25)',
              marginBottom: '12px',
            }}
          >
            <ShieldCheck size={26} strokeWidth={2.5} />
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
              color: '#0C831F',
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              padding: '2px 8px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'inline-block',
              marginBottom: '8px',
            }}
          >
            CUSTOMER MARKETPLACE
          </div>

          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
            {isSignup
              ? 'Create an account for verified home repairs & fixed rates'
              : 'Sign in to book certified artisans with 30-day warranty'}
          </p>
        </div>

        {/* Tab Toggle (Sign In vs Sign Up) */}
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
            Sign In
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
            Create Account
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

        {/* Forgot Password Notice */}
        {showForgotNotice && (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#1D4ED8',
              lineHeight: 1.4,
            }}
          >
            <strong>Password Reset:</strong> In this demo release, use the demo credentials below or contact your local cooperative helpline for instant PIN recovery.
          </div>
        )}

        {!isSignup ? (
          /* ========================================================= */
          /* SIGN IN FORM                                              */
          /* ========================================================= */
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                Mobile Number or Email
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
                <Phone size={16} color="#64748B" />
                <input
                  type="text"
                  placeholder="e.g. 9980122334 or user@mail.com"
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
                <label
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#334155',
                  }}
                >
                  Password / PIN
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotNotice(!showForgotNotice)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#0C831F',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Forgot password?
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
                <Lock size={16} color="#64748B" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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
                backgroundColor: '#0C831F',
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
                boxShadow: '0 2px 6px rgba(12, 131, 31, 0.25)',
              }}
              className="sahyog-btn"
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In as Customer'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          /* ========================================================= */
          /* SIGN UP FORM                                              */
          /* ========================================================= */
          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Full Name
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '8px 12px', gap: '8px' }}>
                <User size={16} color="#64748B" />
                <input
                  type="text"
                  placeholder="e.g. Ananya Deshmukh"
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
                <Phone size={16} color="#64748B" />
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
                Locality / Area
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '8px 12px', gap: '8px' }}>
                <MapPin size={16} color="#64748B" />
                <input
                  type="text"
                  placeholder="e.g. Sector 62, Noida"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Create Password
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '8px 12px', gap: '8px' }}>
                <Lock size={16} color="#64748B" />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: '6px',
                padding: '11px',
                backgroundColor: '#0C831F',
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
              <span>{isSubmitting ? 'Creating account...' : 'Create Customer Account'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Quick 1-Click Demo Evaluation Shortcut */}
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
              SIH Demo Evaluation Quick Fill
            </span>
            <span style={{ fontSize: '0.625rem', color: '#0C831F', fontWeight: 700 }}>Verified Customer</span>
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
              color: '#0F172A',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} color="#F59E0B" />
            <span>Fill Demo Customer Credentials</span>
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
            Are you a skilled service technician?{' '}
            <button
              type="button"
              onClick={() => navigate('/worker/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#0D9488',
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

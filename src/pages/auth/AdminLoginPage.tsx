import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles, KeyRound } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, authMode, navigate } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('operations@sahyog.coop');
  const [password, setPassword] = useState('admin@sahyog2026');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await login('admin', { identifier, password });
      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed. Please verify federation administrative credentials.');
      }
    } catch {
      setErrorMsg('An unexpected security error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoFill = () => {
    setIdentifier('operations@sahyog.coop');
    setPassword('admin@sahyog2026');
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
        backgroundColor: '#FCFBF4',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
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
              backgroundColor: '#1DAA5C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(29, 170, 92, 0.25)',
              marginBottom: '12px',
            }}
          >
            <Building2 size={26} strokeWidth={2.3} />
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
              marginBottom: '8px',
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
              FEDERATION OPERATIONS COMMAND
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
              {authMode === 'SUPABASE_LIVE' ? '🟢 Live Auth' : authMode === 'UNCONFIGURED_PROD' ? '🔴 Unconfigured' : '🟡 Dev Sandbox'}
            </div>
          </div>

          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
            Central operations, artisan KYC verification & zero-commission clearing
          </p>
        </div>

        {/* Security Advisory Badge */}
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: '#FEF9C3',
            border: '1px solid #FDE047',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.6875rem',
            color: '#854D0E',
          }}
        >
          <KeyRound size={16} color="#854D0E" style={{ flexShrink: 0 }} />
          <span>
            Authorized Personnel Only. Public customer/worker signups are restricted.
          </span>
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
              backgroundColor: '#F0FDF4',
              border: '1px solid #D9E9C8',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#0F7A3E',
              lineHeight: 1.4,
            }}
          >
            <strong>Security Notice:</strong> Administrative key rotation is managed via central cooperative federation master keycards. Use the evaluation credentials below for demo access.
          </div>
        )}

        {/* ========================================================= */}
        {/* ADMIN SIGN IN FORM                                        */
        /* ========================================================= */}
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
              Federation Official Email / Officer ID
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
              <Mail size={16} color="#1DAA5C" />
              <input
                type="text"
                placeholder="e.g. operations@sahyog.coop or officer ID"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.875rem',
                  color: '#0B0B0B',
                }}
                required
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                Administrative Security Key
              </label>
              <button
                type="button"
                onClick={() => setShowForgotNotice(!showForgotNotice)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#1DAA5C',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Forgot key?
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
              <Lock size={16} color="#1DAA5C" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter admin security password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.875rem',
                  color: '#0B0B0B',
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
              boxShadow: '0 2px 6px rgba(29, 170, 92, 0.25)',
            }}
            className="sahyog-btn"
          >
            <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In to Operations Command'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Pre-fill Shortcut (Only shown in DEV_SANDBOX mode, hidden in Production) */}
        {authMode === 'DEV_SANDBOX' && (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#FCFBF4',
              border: '1px dashed #D9E9C8',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#0F7A3E', textTransform: 'uppercase' }}>
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
                border: '1px solid #E5E7EB',
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
              <span>Fill Demo Officer: Vikramaditya Rao</span>
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
            Looking for consumer marketplace?{' '}
            <button
              type="button"
              onClick={() => navigate('/customer/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#1DAA5C',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Customer Login
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Are you a service artisan?{' '}
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
              Artisan Pro Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

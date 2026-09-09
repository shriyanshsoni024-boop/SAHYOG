import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, User, Mail } from 'lucide-react';

interface PersonalDetailsScreenProps {
  onConfirm: (details: { firstName: string; lastName: string; email: string }) => void;
  onBack: () => void;
}

export const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({ onConfirm, onBack }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const isValid = firstName.trim().length >= 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onConfirm({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      });
    }
  };

  const handleQuickDemo = () => {
    setFirstName('Ananya');
    setLastName('Deshmukh');
    setEmail('ananya.deshmukh@example.com');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        padding: '16px 20px 28px',
      }}
    >
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#F1F5F9',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#1E293B',
          }}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          Profile details
        </h1>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '28px' }}>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              lineHeight: 1.25,
              margin: '0 0 8px',
            }}
          >
            Help us{' '}
            <span style={{ color: '#0C831F' }}>
              know you better
            </span>
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>
            This helps our verified technicians identify and coordinate your home visits smoothly.
          </p>
        </div>

        {/* Inputs Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* First Name (Required) */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              First name*
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #CBD5E1',
                borderRadius: '14px',
                padding: '13px 16px',
                backgroundColor: '#FFFFFF',
                gap: '10px',
              }}
            >
              <User size={18} color="#64748B" />
              <input
                type="text"
                placeholder="e.g. Ananya"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#0F172A',
                }}
                autoFocus
                required
              />
            </div>
          </div>

          {/* Last Name (Optional) */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              Last name (Optional)
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #CBD5E1',
                borderRadius: '14px',
                padding: '13px 16px',
                backgroundColor: '#FFFFFF',
                gap: '10px',
              }}
            >
              <User size={18} color="#64748B" />
              <input
                type="text"
                placeholder="e.g. Deshmukh"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#0F172A',
                }}
              />
            </div>
          </div>

          {/* Email (Optional) */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              Email (Optional)
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #CBD5E1',
                borderRadius: '14px',
                padding: '13px 16px',
                backgroundColor: '#FFFFFF',
                gap: '10px',
              }}
            >
              <Mail size={18} color="#64748B" />
              <input
                type="email"
                placeholder="e.g. ananya.deshmukh@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#0F172A',
                }}
              />
            </div>
          </div>

          {/* Sticky Bottom Confirm Button */}
          <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
            <button
              type="submit"
              disabled={!isValid}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: isValid ? '#0C831F' : '#E2E8F0',
                color: isValid ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: isValid ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isValid ? '0 4px 16px rgba(12, 131, 31, 0.3)' : 'none',
                transition: 'all 200ms ease',
              }}
            >
              <span>Confirm details</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>

        {/* 1-Click Demo Shortcut */}
        <div style={{ paddingTop: '16px' }}>
          <button
            type="button"
            onClick={handleQuickDemo}
            style={{
              width: '100%',
              padding: '9px 12px',
              backgroundColor: '#F8FAFC',
              border: '1px dashed #CBD5E1',
              borderRadius: '10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>⚡ Fill Demo: Ananya Deshmukh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

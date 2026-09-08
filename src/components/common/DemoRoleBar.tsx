import React from 'react';
import { Role } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { User, HardHat, Building2, Sparkles } from 'lucide-react';

export interface DemoRoleBarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export const DemoRoleBar: React.FC<DemoRoleBarProps> = ({ currentRole, onRoleChange }) => {
  const { language } = useLanguage();

  return (
    <div
      style={{
        backgroundColor: '#0F172A',
        borderBottom: '1px solid #1E293B',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#E2E8F0',
        fontSize: '0.75rem',
        zIndex: 100,
        position: 'sticky',
        top: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(30, 64, 175, 0.4)',
            color: '#60A5FA',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            border: '1px solid rgba(96, 165, 250, 0.3)',
          }}
        >
          <Sparkles size={10} />
          Prototype Demo Portal
        </span>
        <span style={{ color: '#64748B', display: 'none' }}>•</span>
      </div>

      {/* Role Switcher Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ color: '#94A3B8', fontSize: '0.6875rem', marginRight: '4px' }}>
          Role:
        </span>
        <button
          type="button"
          onClick={() => onRoleChange('customer')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.6875rem',
            fontWeight: currentRole === 'customer' ? 700 : 500,
            backgroundColor: currentRole === 'customer' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.06)',
            color: currentRole === 'customer' ? '#ffffff' : '#94A3B8',
            border: currentRole === 'customer' ? '1px solid #3B82F6' : '1px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <User size={12} />
          <span>{language === 'hi' ? 'ग्राहक (Customer)' : 'Customer App'}</span>
        </button>

        <button
          type="button"
          onClick={() => onRoleChange('worker')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.6875rem',
            fontWeight: currentRole === 'worker' ? 700 : 500,
            backgroundColor: currentRole === 'worker' ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.06)',
            color: currentRole === 'worker' ? '#ffffff' : '#94A3B8',
            border: currentRole === 'worker' ? '1px solid #14B8A6' : '1px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <HardHat size={12} />
          <span>{language === 'hi' ? 'कारीगर (Worker)' : 'Worker App'}</span>
        </button>

        <button
          type="button"
          onClick={() => onRoleChange('admin')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.6875rem',
            fontWeight: currentRole === 'admin' ? 700 : 500,
            backgroundColor: currentRole === 'admin' ? 'var(--accent-warm)' : 'rgba(255, 255, 255, 0.06)',
            color: currentRole === 'admin' ? '#ffffff' : '#94A3B8',
            border: currentRole === 'admin' ? '1px solid #F59E0B' : '1px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Building2 size={12} />
          <span>{language === 'hi' ? 'सहकारी समिति (Admin)' : 'Admin Dashboard'}</span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Role } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { User, HardHat, Building2, Layers } from 'lucide-react';
import { THEMES } from '../../styles/themes';

export interface DemoRoleBarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export const DemoRoleBar: React.FC<DemoRoleBarProps> = ({ currentRole, onRoleChange }) => {
  const { language } = useLanguage();

  const ROLES: { id: Role; labelEn: string; labelHi: string; icon: React.ReactNode; color: string; badge: string }[] = [
    {
      id: 'customer',
      labelEn: 'Customer Marketplace',
      labelHi: 'ग्राहक मंच',
      icon: <User size={13} />,
      color: THEMES.customer.tokens.accent,
      badge: 'Shop',
    },
    {
      id: 'worker',
      labelEn: 'Artisan Pro Portal',
      labelHi: 'कारीगर साथी',
      icon: <HardHat size={13} />,
      color: THEMES.worker.tokens.accent,
      badge: 'Partner',
    },
    {
      id: 'admin',
      labelEn: 'Cooperative Federation',
      labelHi: 'सहकारी संघ',
      icon: <Building2 size={13} />,
      color: THEMES.cooperative.tokens.accent,
      badge: 'Federation',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#0F172A',
        borderBottom: '1px solid #1E293B',
        padding: '5px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        color: '#E2E8F0',
        fontSize: '0.75rem',
        zIndex: 100,
        position: 'sticky',
        top: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#94A3B8',
            padding: '2px 7px',
            borderRadius: 'var(--radius-xs)',
            fontWeight: 700,
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Layers size={10} color="#38BDF8" />
          <span>SAHYOG SYSTEM</span>
        </div>
      </div>

      {/* Role Switcher Horizontal Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          padding: '2px 0',
        }}
      >
        <span style={{ color: '#64748B', fontSize: '0.6875rem', marginRight: '2px', display: 'none' }} className="hide-mobile">
          Active View:
        </span>

        {ROLES.map((role) => {
          const isSelected = currentRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onRoleChange(role.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.6875rem',
                fontWeight: isSelected ? 800 : 500,
                backgroundColor: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.05)',
                color: isSelected ? '#0F172A' : '#94A3B8',
                border: isSelected ? `1.5px solid ${role.color}` : '1.5px solid transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-theme)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxShadow: isSelected ? '0 1px 4px rgba(0, 0, 0, 0.2)' : 'none',
              }}
              aria-pressed={isSelected}
            >
              <span style={{ color: isSelected ? role.color : 'inherit', display: 'flex', alignItems: 'center' }}>
                {role.icon}
              </span>
              <span>{language === 'hi' ? role.labelHi : role.labelEn}</span>
              {isSelected && (
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: role.color,
                    display: 'inline-block',
                    marginLeft: '2px',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

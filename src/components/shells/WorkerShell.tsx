import React from 'react';
import { WorkerHomePage } from '../../pages/worker/WorkerHomePage';
import { WorkerNav } from '../worker/WorkerNav';
import { HardHat } from 'lucide-react';
import { LanguageToggle } from '../common/LanguageToggle';
import { useLanguage } from '../../i18n/LanguageContext';

export const WorkerShell: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div
      className="container-mobile animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
        boxShadow: '0 0 35px rgba(0, 0, 0, 0.1)',
        position: 'relative',
      }}
    >
      {/* Worker App Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-default)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <HardHat size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                SAHYOG
              </span>
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  backgroundColor: 'var(--secondary-light)',
                  color: 'var(--secondary)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid #99F6E4',
                  letterSpacing: '0.02em',
                }}
              >
                PRO
              </span>
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {language === 'hi' ? 'कारीगर साथी मंच' : 'Cooperative Artisan Partner'}
            </div>
          </div>
        </div>

        <LanguageToggle />
      </header>

      <main style={{ flex: 1, paddingBottom: '16px' }}>
        <WorkerHomePage />
      </main>

      <WorkerNav />
    </div>
  );
};

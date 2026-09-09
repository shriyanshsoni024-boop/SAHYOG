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
      className="container-mobile animate-fade-in theme-transition"
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
          backgroundColor: 'var(--theme-header, #FFFFFF)',
          borderBottom: '1px solid var(--theme-header-border, var(--border-default))',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-xs)',
        }}
        className="theme-transition"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--theme-accent, #0D9488)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-xs)',
              transition: 'background-color var(--transition-theme)',
            }}
          >
            <HardHat size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.0625rem', fontWeight: 900, color: 'var(--theme-text, #111827)', letterSpacing: '-0.02em' }}>
                SAHYOG
              </span>
              <span
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: 800,
                  backgroundColor: 'var(--theme-accent-light, #F0FDFA)',
                  color: 'var(--theme-accent, #0D9488)',
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--theme-accent-border, #99F6E4)',
                  letterSpacing: '0.03em',
                }}
              >
                ARTISAN PRO
              </span>
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--theme-text-muted, #6B7280)' }}>
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

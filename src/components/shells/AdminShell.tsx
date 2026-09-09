import React from 'react';
import { AdminDashboardPage } from '../../pages/admin/AdminDashboardPage';
import { LanguageToggle } from '../common/LanguageToggle';
import { Building2 } from 'lucide-react';

export const AdminShell: React.FC = () => {
  return (
    <div
      className="container-admin animate-fade-in theme-transition"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
      }}
    >
      {/* Top Admin Bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '14px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--theme-header-border, var(--border-default))',
        }}
        className="theme-transition"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--theme-accent, #EA580C)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-xs)',
              transition: 'background-color var(--transition-theme)',
            }}
          >
            <Building2 size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--theme-text, #111827)', margin: 0 }}>
              SAHYOG Cooperative Federation Admin
            </h2>
            <div style={{ fontSize: '0.6875rem', color: 'var(--theme-text-muted, #6B7280)', marginTop: '2px' }}>
              Central Operations, Workforce Allocation & Intelligence Portal
            </div>
          </div>
        </div>

        <LanguageToggle />
      </header>

      <main style={{ flex: 1, paddingBottom: '32px' }}>
        <AdminDashboardPage />
      </main>
    </div>
  );
};

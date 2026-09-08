import React from 'react';
import { AdminDashboardPage } from '../../pages/admin/AdminDashboardPage';
import { LanguageToggle } from '../common/LanguageToggle';
import { Building2 } from 'lucide-react';

export const AdminShell: React.FC = () => {
  return (
    <div
      className="container-admin animate-fade-in"
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
          paddingBottom: '16px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-warm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Building2 size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              SAHYOG Cooperative Federation Admin
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
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

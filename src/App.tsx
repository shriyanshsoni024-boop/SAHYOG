import React, { useState } from 'react';
import { Role } from './types';
import { LanguageProvider } from './i18n/LanguageContext';
import { BookingProvider } from './context/BookingContext';
import { WorkerProvider } from './context/WorkerContext';
import { DemoRoleBar } from './components/common/DemoRoleBar';
import { CustomerShell } from './components/shells/CustomerShell';
import { WorkerShell } from './components/shells/WorkerShell';
import { AdminShell } from './components/shells/AdminShell';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<Role>('customer');

  return (
    <LanguageProvider>
      <BookingProvider>
        <WorkerProvider>
          <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column' }}>
            {/* Top Demo Bar for Evaluation */}
            <DemoRoleBar currentRole={currentRole} onRoleChange={(r) => setCurrentRole(r)} />

            {/* Main Role Container */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', width: '100%', backgroundColor: 'var(--bg-app)' }}>
              {currentRole === 'customer' && (
                <div style={{ width: '100%', backgroundColor: 'var(--bg-app)' }}>
                  <CustomerShell />
                </div>
              )}
              {currentRole === 'worker' && <WorkerShell />}
              {currentRole === 'admin' && (
                <div style={{ width: '100%', backgroundColor: 'var(--bg-app)' }}>
                  <AdminShell />
                </div>
              )}
            </div>
          </div>
        </WorkerProvider>
      </BookingProvider>
    </LanguageProvider>
  );
};

export default App;

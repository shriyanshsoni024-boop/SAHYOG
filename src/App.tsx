import React from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { WorkerProvider } from './context/WorkerContext';
import { DemoRoleBar } from './components/common/DemoRoleBar';
import { TopAnnouncementBanner } from './components/common/TopAnnouncementBanner';
import { CustomerShell } from './components/shells/CustomerShell';
import { WorkerShell } from './components/shells/WorkerShell';
import { AdminShell } from './components/shells/AdminShell';
import { CustomerLoginPage } from './pages/auth/CustomerLoginPage';
import { WorkerLoginPage } from './pages/auth/WorkerLoginPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { getThemeCssVariables } from './styles/themes';

const AppRouter: React.FC = () => {
  const { currentRole, currentPath, switchRole } = useAuth();

  const themeKey = currentRole === 'admin' ? 'cooperative' : currentRole;
  const themeVariables = getThemeCssVariables(themeKey);

  // Check if we are on a standalone public login page
  const isLoginPage =
    currentPath === '/customer/login' ||
    currentPath === '/customer/signup' ||
    currentPath === '/worker/login' ||
    currentPath === '/worker/signup' ||
    currentPath === '/admin/login';

  const renderCurrentView = () => {
    // 1. Standalone Login Routes
    if (currentPath === '/customer/login' || currentPath === '/customer/signup') {
      return <CustomerLoginPage />;
    }
    if (currentPath === '/worker/login' || currentPath === '/worker/signup') {
      return <WorkerLoginPage />;
    }
    if (currentPath === '/admin/login') {
      return <AdminLoginPage />;
    }

    // 2. Protected Worker Routes
    if (currentPath.startsWith('/worker')) {
      return (
        <ProtectedRoute requiredRole="worker">
          <WorkerShell />
        </ProtectedRoute>
      );
    }

    // 3. Protected Admin Routes
    if (currentPath.startsWith('/admin')) {
      return (
        <ProtectedRoute requiredRole="admin">
          <AdminShell />
        </ProtectedRoute>
      );
    }

    // 4. Default / Customer Protected Routes
    // If role is worker or admin and path is root, show their protected shell
    if (currentRole === 'worker' && currentPath === '/') {
      return (
        <ProtectedRoute requiredRole="worker">
          <WorkerShell />
        </ProtectedRoute>
      );
    }

    if (currentRole === 'admin' && currentPath === '/') {
      return (
        <ProtectedRoute requiredRole="admin">
          <AdminShell />
        </ProtectedRoute>
      );
    }

    return (
      <ProtectedRoute requiredRole="customer">
        <div style={{ width: '100%', backgroundColor: 'var(--bg-app)' }}>
          <CustomerShell />
        </div>
      </ProtectedRoute>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        ...themeVariables,
      }}
      className="theme-transition"
    >
      {/* Top Demo Bar for Evaluation / Role Switching (Preserved for Evaluation) */}
      <DemoRoleBar currentRole={currentRole} onRoleChange={(r) => switchRole(r)} />

      {/* Contextual Top Announcement Banner (Hidden on clean login screens) */}
      {!isLoginPage && <TopAnnouncementBanner currentRole={themeKey} />}

      {/* Main Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          backgroundColor: 'var(--bg-app)',
        }}
      >
        {renderCurrentView()}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BookingProvider>
          <WorkerProvider>
            <AppRouter />
          </WorkerProvider>
        </BookingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;

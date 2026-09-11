import React from 'react';
import { useWorker, WorkerTab } from '../../context/WorkerContext';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Home, Briefcase, Wallet, User, LucideIcon } from 'lucide-react';
import { getWorkerTheme } from '../../styles/workerThemes';

export const WorkerNav: React.FC = () => {
  const { activeTab, setActiveTab, worker } = useWorker();
  const { bookings } = useBooking();
  const { language } = useLanguage();

  const theme = getWorkerTheme(worker.professions);

  // Active / pending jobs count
  const pendingOrActiveCount = bookings.filter(
    (b) =>
      b.status === 'REQUESTED' ||
      b.status === 'MATCHED' ||
      b.status === 'ACCEPTED' ||
      b.status === 'ON_THE_WAY' ||
      b.status === 'IN_PROGRESS'
  ).length;

  const navItems: { id: WorkerTab; label: string; labelHi: string; icon: LucideIcon }[] = [
    { id: 'home', label: 'Home', labelHi: 'होम', icon: Home },
    { id: 'jobs', label: 'Jobs', labelHi: 'कार्य', icon: Briefcase },
    { id: 'earnings', label: 'Earnings', labelHi: 'कमाई', icon: Wallet },
    { id: 'profile', label: 'Profile', labelHi: 'प्रोफ़ाइल', icon: User },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '14px',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 100,
        pointerEvents: 'none',
        padding: '0 16px',
      }}
    >
      <nav
        style={{
          pointerEvents: 'auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '9999px',
          border: '1px solid rgba(226, 232, 240, 0.85)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 8px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(12px)',
          maxWidth: '400px',
          width: '100%',
          justifyContent: 'space-around',
        }}
        aria-label="Worker floating navigation"
      >
        {navItems.map((item) => {
          const isActive =
            activeTab === item.id ||
            (item.id === 'jobs' && (activeTab === 'skills' || activeTab === 'training'));
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className="sahyog-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: isActive ? '8px 16px' : '8px 10px',
                borderRadius: '9999px',
                color: isActive ? theme.primary : '#64748B',
                transition: 'all var(--transition-fast) var(--ease-out-smooth)',
                position: 'relative',
                background: isActive ? theme.primaryLight : 'transparent',
                border: isActive ? `1px solid ${theme.primaryBorder}` : '1px solid transparent',
                cursor: 'pointer',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon
                  size={19}
                  color={isActive ? theme.primary : '#64748B'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.id === 'jobs' && pendingOrActiveCount > 0 && (
                  <span
                    className="animate-pulse-live"
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-8px',
                      backgroundColor: '#EF4444',
                      color: '#ffffff',
                      fontSize: '0.5625rem',
                      fontWeight: 800,
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 0 2px #FFFFFF',
                    }}
                  >
                    {pendingOrActiveCount}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 800 : 600,
                  display: isActive ? 'inline-block' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {language === 'hi' ? item.labelHi : item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

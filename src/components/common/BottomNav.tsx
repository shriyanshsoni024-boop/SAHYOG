import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBooking, CustomerView } from '../../context/BookingContext';
import { Home, CalendarCheck, Wallet, LucideIcon } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { language } = useLanguage();
  const { activeView, setActiveView, bookings } = useBooking();

  const navItems: { view: CustomerView; label: string; labelHi: string; icon: LucideIcon }[] = [
    { view: 'home', label: language === 'hi' ? 'होम' : 'Home', labelHi: 'होम', icon: Home },
    { view: 'history', label: language === 'hi' ? 'बुकिंग्स' : 'Bookings', labelHi: 'बुकिंग्स', icon: CalendarCheck },
    { view: 'money', label: language === 'hi' ? 'मनी' : 'Money', labelHi: 'मनी', icon: Wallet },
  ];

  const activeBookingsCount = bookings.filter(
    (b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED'
  ).length;

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
          gap: '8px',
          padding: '6px 10px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(12px)',
          maxWidth: '380px',
          width: '100%',
          justifyContent: 'space-around',
        }}
        aria-label="Customer navigation"
      >
        {navItems.map((item) => {
          const isActive =
            activeView === item.view ||
            (item.view === 'history' && (activeView === 'tracking' || activeView === 'worker-matching')) ||
            (item.view === 'home' && activeView === 'service-detail');
          const Icon = item.icon;

          return (
            <button
              key={item.view}
              type="button"
              onClick={() => setActiveView(item.view)}
              className="sahyog-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: isActive ? '8px 18px' : '8px 12px',
                borderRadius: '9999px',
                color: isActive ? 'var(--sahyog-green, #1DAA5C)' : '#64748B',
                transition: 'all var(--transition-fast) var(--ease-out-smooth)',
                position: 'relative',
                background: isActive ? 'var(--theme-accent-light, #F0FDF4)' : 'transparent',
                border: isActive ? '1px solid var(--theme-accent-border, #D9E9C8)' : '1px solid transparent',
                cursor: 'pointer',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon
                  size={19}
                  color={isActive ? 'var(--sahyog-green, #1DAA5C)' : '#64748B'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.view === 'history' && activeBookingsCount > 0 && (
                  <span
                    className="animate-pulse-live"
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-8px',
                      backgroundColor: 'var(--sahyog-green, #1DAA5C)',
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
                    {activeBookingsCount}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 800 : 600,
                  letterSpacing: '-0.01em',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

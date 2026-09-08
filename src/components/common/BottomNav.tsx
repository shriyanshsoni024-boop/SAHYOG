import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBooking, CustomerView } from '../../context/BookingContext';
import { Home, Grid, CalendarCheck, User, LucideIcon } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const { activeView, setActiveView, bookings } = useBooking();

  const navItems: { view: CustomerView; labelKey: 'nav_home' | 'nav_services' | 'nav_bookings' | 'nav_profile'; icon: LucideIcon }[] = [
    { view: 'home', labelKey: 'nav_home', icon: Home },
    { view: 'service-detail', labelKey: 'nav_services', icon: Grid },
    { view: 'history', labelKey: 'nav_bookings', icon: CalendarCheck },
    { view: 'profile', labelKey: 'nav_profile', icon: User },
  ];

  const activeBookingsCount = bookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length;

  return (
    <nav
      className="hide-desktop"
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '6px 4px 8px',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.04)',
      }}
      aria-label="Customer navigation"
    >
      {navItems.map((item) => {
        const isActive = activeView === item.view || (item.view === 'history' && activeView === 'tracking');
        const Icon = item.icon;

        return (
          <button
            key={item.view}
            type="button"
            onClick={() => setActiveView(item.view)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--secondary)' : 'var(--text-muted)',
              transition: 'all var(--transition-fast)',
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={20} color={isActive ? 'var(--secondary)' : 'var(--text-muted)'} />
              {item.view === 'history' && activeBookingsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    backgroundColor: 'var(--secondary)',
                    color: '#ffffff',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeBookingsCount}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.6875rem', fontWeight: isActive ? 700 : 500 }}>
              {t(item.labelKey)}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

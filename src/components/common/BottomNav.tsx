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
      className="hide-desktop theme-transition"
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 50,
        backgroundColor: 'var(--theme-surface, #FFFFFF)',
        borderTop: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '5px 4px 6px',
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
              gap: '2px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-xs)',
              color: isActive ? 'var(--theme-accent, #0C831F)' : 'var(--theme-text-muted, #6B7280)',
              transition: 'all var(--transition-fast)',
              position: 'relative',
              background: isActive ? 'var(--theme-accent-light, #F0FDF4)' : 'none',
              border: 'none',
              cursor: 'pointer',
              minWidth: '58px',
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={19} color={isActive ? 'var(--theme-accent, #0C831F)' : 'var(--theme-text-muted, #6B7280)'} strokeWidth={isActive ? 2.3 : 1.8} />
              {item.view === 'history' && activeBookingsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    backgroundColor: 'var(--theme-accent, #0C831F)',
                    color: '#ffffff',
                    fontSize: '0.5625rem',
                    fontWeight: 800,
                    width: '15px',
                    height: '15px',
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
            <span style={{ fontSize: '0.6875rem', fontWeight: isActive ? 800 : 500, letterSpacing: '-0.01em' }}>
              {t(item.labelKey)}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

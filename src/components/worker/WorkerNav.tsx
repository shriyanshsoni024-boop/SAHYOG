import React from 'react';
import { useWorker, WorkerTab } from '../../context/WorkerContext';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Briefcase, Award, PlayCircle, IndianRupee, User, LucideIcon } from 'lucide-react';

export const WorkerNav: React.FC = () => {
  const { activeTab, setActiveTab } = useWorker();
  const { bookings } = useBooking();
  const { language } = useLanguage();

  const activeJobsCount = bookings.filter(b => b.status === 'ACCEPTED' || b.status === 'ON_THE_WAY' || b.status === 'IN_PROGRESS').length;

  const tabs: { id: WorkerTab; label: string; labelHi: string; icon: LucideIcon }[] = [
    { id: 'jobs', label: 'Jobs', labelHi: 'कार्य (Jobs)', icon: Briefcase },
    { id: 'skills', label: 'Skills', labelHi: 'कौशल (Skills)', icon: Award },
    { id: 'training', label: 'Training', labelHi: 'प्रशिक्षण (LMS)', icon: PlayCircle },
    { id: 'earnings', label: 'Earnings', labelHi: 'कमाई (Earnings)', icon: IndianRupee },
    { id: 'profile', label: 'Profile', labelHi: 'प्रोफ़ाइल', icon: User },
  ];

  return (
    <nav
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 50,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '6px 4px 8px',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
      }}
      aria-label="Worker bottom navigation"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--secondary)' : 'var(--text-muted)',
              transition: 'all var(--transition-fast)',
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={20} color={isActive ? 'var(--secondary)' : 'var(--text-muted)'} strokeWidth={isActive ? 2.5 : 2} />
              {tab.id === 'jobs' && activeJobsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    backgroundColor: 'var(--danger)',
                    color: '#ffffff',
                    fontSize: '0.625rem',
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
                  {activeJobsCount}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.6875rem', fontWeight: isActive ? 800 : 500 }}>
              {language === 'hi' ? tab.labelHi : tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

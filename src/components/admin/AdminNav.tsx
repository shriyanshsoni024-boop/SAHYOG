import React from 'react';
import { AdminTab } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { LayoutDashboard, CalendarCheck, Users, IndianRupee, BarChart3, LucideIcon } from 'lucide-react';

interface AdminNavProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingKycCount?: number;
  activeDispatchesCount?: number;
}

export const AdminNav: React.FC<AdminNavProps> = ({
  activeTab,
  setActiveTab,
  pendingKycCount = 0,
  activeDispatchesCount = 0,
}) => {
  const { language } = useLanguage();

  const tabs: { id: AdminTab; label: string; labelHi: string; icon: LucideIcon; badge?: number }[] = [
    { id: 'operations', label: 'Overview', labelHi: 'डैशबोर्ड', icon: LayoutDashboard },
    { id: 'bookings', label: 'Dispatches', labelHi: 'बुकिंग्स', icon: CalendarCheck, badge: activeDispatchesCount },
    { id: 'workers', label: 'Workers', labelHi: 'कारीगर', icon: Users, badge: pendingKycCount },
    { id: 'finance', label: 'Finance', labelHi: 'वित्त', icon: IndianRupee },
    { id: 'reports', label: 'Insights', labelHi: 'रिपोर्ट्स', icon: BarChart3 },
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
      aria-label="Cooperative Admin bottom navigation"
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
              padding: '6px 8px',
              borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all var(--transition-fast)',
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon
                size={20}
                color={isActive ? 'var(--primary)' : 'var(--text-muted)'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    backgroundColor: tab.id === 'workers' ? 'var(--warning)' : 'var(--primary)',
                    color: '#ffffff',
                    fontSize: '0.5625rem',
                    fontWeight: 800,
                    minWidth: '15px',
                    height: '15px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
                    boxShadow: '0 0 0 2px #FFFFFF',
                  }}
                >
                  {tab.badge}
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

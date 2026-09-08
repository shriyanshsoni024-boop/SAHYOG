import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { Zap, ArrowRight } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../data/services';

export const EmergencyBanner: React.FC = () => {
  const { language } = useLanguage();
  const { startServiceBooking } = useBooking();

  const handleEmergencyClick = () => {
    const electricCat = SERVICE_CATEGORIES.find(c => c.id === 'electrician') || SERVICE_CATEGORIES[0];
    startServiceBooking(electricCat, true);
  };

  return (
    <div
      style={{
        backgroundColor: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          <Zap size={16} fill="#FFFFFF" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '0.625rem',
                fontWeight: 800,
                backgroundColor: 'var(--danger)',
                color: '#FFFFFF',
                padding: '1px 5px',
                borderRadius: 'var(--radius-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              15m Squad
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--danger-dark)' }}>
              {language === 'hi' ? 'आपातकालीन त्वरित सेवा' : 'Need Immediate Emergency Repair?'}
            </span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
            {language === 'hi'
              ? 'शॉर्ट सर्किट, स्पार्किंग या पाइप फटने पर 15 मिनट में सहायता'
              : 'Short circuits, sparking & burst pipes • Priority dispatch under 15 mins'}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleEmergencyClick}
        style={{
          backgroundColor: 'var(--danger)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 'var(--radius-xs)',
          padding: '6px 12px',
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
        className="sahyog-btn"
      >
        <span>{language === 'hi' ? 'तुरंत बुलाएं' : 'Book Fast'}</span>
        <ArrowRight size={13} />
      </button>
    </div>
  );
};

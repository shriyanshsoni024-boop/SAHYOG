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
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)',
          }}
        >
          <Zap size={18} fill="#FFFFFF" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.5625rem',
                fontWeight: 800,
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                padding: '1px 5px',
                borderRadius: 'var(--radius-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              15m Squad
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#991B1B' }}>
              {language === 'hi' ? 'आपातकालीन त्वरित सेवा' : 'Need Immediate Emergency Repair?'}
            </span>
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginTop: '1px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
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
          backgroundColor: '#DC2626',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 'var(--radius-xs)',
          padding: '7px 14px',
          fontSize: '0.75rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxShadow: '0 1px 3px rgba(220, 38, 38, 0.3)',
        }}
        className="sahyog-btn"
      >
        <span>{language === 'hi' ? 'तुरंत बुलाएं' : 'Book Emergency'}</span>
        <ArrowRight size={13} />
      </button>
    </div>
  );
};


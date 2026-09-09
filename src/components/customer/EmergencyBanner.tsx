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
        borderRadius: '8px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: '0 1px 2px rgba(220, 38, 38, 0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          <Zap size={16} fill="#FFFFFF" />
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
                borderRadius: '3px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              15m Squad
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#991B1B' }}>
              {language === 'hi' ? 'आपातकालीन त्वरित सहायता' : 'Immediate Emergency Repair?'}
            </span>
          </div>
          <div
            style={{
              fontSize: '0.71875rem',
              color: '#4B5563',
              marginTop: '1px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {language === 'hi'
              ? 'शॉर्ट सर्किट, स्पार्किंग या पाइप लीकेज • 15 मिनट में प्राथमिकता आवंटन'
              : 'Short circuits, sparking & burst pipes • Priority dispatch in 15 mins'}
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
          borderRadius: '4px',
          padding: '5px 12px',
          fontSize: '0.71875rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          height: '28px',
        }}
        className="sahyog-btn"
      >
        <span>{language === 'hi' ? 'तुरंत बुलाएं' : 'Book 15m Help'}</span>
        <ArrowRight size={12} />
      </button>
    </div>
  );
};


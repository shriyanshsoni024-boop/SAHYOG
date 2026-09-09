import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck, IndianRupee, Award, HeartHandshake } from 'lucide-react';

export const CooperativeTrustSection: React.FC = () => {
  const { language } = useLanguage();

  const PILLARS = [
    {
      icon: ShieldCheck,
      title: language === 'hi' ? '100% KYC व पुलिस जांच' : '100% Verified Artisans',
      desc: language === 'hi'
        ? 'आधार, कौशल प्रमाण व पुलिस सत्यापन से प्रमाणित कुशल कार्यबल।'
        : 'Aadhaar KYC, trade credential audit & police background checked.',
    },
    {
      icon: IndianRupee,
      title: language === 'hi' ? 'पारदर्शी निश्चित दरें' : 'Fixed Standard Rates',
      desc: language === 'hi'
        ? 'कोई अप्रत्याशित सर्ज चार्ज नहीं। पारदर्शी लेबर व पार्ट्स दरें।'
        : 'Zero surge pricing. Fixed cooperative rate cards with clear labor costs.',
    },
    {
      icon: Award,
      title: language === 'hi' ? '30-दिन नि:शुल्क वारंटी' : '30-Day SAHYOG Cover',
      desc: language === 'hi'
        ? 'संतुष्ट न होने पर 30 दिन के भीतर नि:शुल्क सुधार गारंटी।'
        : 'Free rework protection if the repair has any recurring issue.',
    },
    {
      icon: HeartHandshake,
      title: language === 'hi' ? 'कारीगरों को 0% कमीशन' : '0% Commission Deduction',
      desc: language === 'hi'
        ? '0% बिचौलिया कमीशन। 85-90% मूल्य सीधे कारीगर को मिलता है।'
        : 'Zero middleman cut. 85-90% of service value directly to artisans.',
    },
  ];

  return (
    <section
      style={{
        padding: '24px 0 10px',
        borderTop: '1px solid var(--border-default)',
        marginTop: '10px',
      }}
    >
      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--theme-text, #111827)', letterSpacing: '-0.01em', margin: '0 0 4px' }}>
          {language === 'hi' ? 'सहयोग सहकारी मंच की विशेषताएं' : 'The SAHYOG Cooperative Guarantee'}
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted, #6B7280)', margin: 0, maxWidth: '640px' }}>
          {language === 'hi'
            ? 'निजी कंपनियों के भारी कमीशन के विपरीत, हमारा मंच कारीगरों और ग्राहकों दोनों के लिए पारदर्शी है।'
            : 'India’s transparent home-services federation ensuring quality repairs and ethical artisan livelihoods.'}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {PILLARS.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--theme-accent-light, #F0FDF4)',
                  border: '1px solid var(--theme-accent-border, #BBF7D0)',
                  color: 'var(--theme-accent, #0C831F)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--theme-text, #111827)', margin: '0 0 2px' }}>
                  {pillar.title}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--theme-text-secondary, #374151)', margin: 0, lineHeight: 1.4 }}>
                  {pillar.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};


import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck, IndianRupee, Award, HeartHandshake } from 'lucide-react';

export const CooperativeTrustSection: React.FC = () => {
  const { language } = useLanguage();

  const PILLARS = [
    {
      icon: ShieldCheck,
      title: language === 'hi' ? '100% KYC व पुलिस जांच' : '100% Verified Technicians',
      desc: language === 'hi'
        ? 'आधार, कौशल प्रमाण व पुलिस सत्यापन से प्रमाणित कुशल कार्यबल।'
        : 'Aadhaar KYC, trade credential audit & police background checked.',
    },
    {
      icon: IndianRupee,
      title: language === 'hi' ? 'पारदर्शी निश्चित दरें' : 'Upfront Standard Rates',
      desc: language === 'hi'
        ? 'कोई अप्रत्याशित सर्ज चार्ज नहीं। पारदर्शी लेबर व पार्ट्स दरें।'
        : 'Zero surge pricing. Fixed cooperative rate cards with clear labor costs.',
    },
    {
      icon: Award,
      title: language === 'hi' ? '30-दिन नि:शुल्क वारंटी' : '30-Day SAHYOG Cover',
      desc: language === 'hi'
        ? 'संतुष्ट न होने पर 30 दिन के भीतर नि:शुल्क सुधार गारंटी।'
        : 'Free re-work protection if the repair has any recurring issue.',
    },
    {
      icon: HeartHandshake,
      title: language === 'hi' ? 'कारीगरों को उचित पारिश्रमिक' : 'Fair Cooperative Pay',
      desc: language === 'hi'
        ? '0% बिचौलिया कमीशन। 85-90% मूल्य सीधे कारीगर को मिलता है।'
        : 'Zero middleman exploitation. 85-90% of service value directly to artisans.',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>
          {language === 'hi' ? 'सहयोग सहकारी मॉडल की विशेषताएं' : 'The SAHYOG Cooperative Advantage'}
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
          {language === 'hi'
            ? 'निजी कंपनियों के भारी कमीशन के विपरीत, हमारा मंच कारीगरों और ग्राहकों दोनों के लिए पारदर्शी है।'
            : 'India’s transparent home-services federation ensuring quality repairs and ethical artisan livelihoods.'}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
        }}
      >
        {PILLARS.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '10px',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-muted)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--secondary-light)',
                  border: '1px solid var(--secondary-border)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} strokeWidth={2.2} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>
                  {pillar.title}
                </h4>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
                  {pillar.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

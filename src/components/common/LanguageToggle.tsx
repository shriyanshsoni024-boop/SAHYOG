import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: '2px',
        borderRadius: '4px',
        border: '1px solid #E5E7EB',
        height: '24px',
      }}
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        style={{
          padding: '1px 6px',
          borderRadius: '3px',
          fontSize: '0.65625rem',
          fontWeight: language === 'en' ? 800 : 500,
          backgroundColor: language === 'en' ? '#FFFFFF' : 'transparent',
          color: language === 'en' ? '#111827' : '#6B7280',
          boxShadow: language === 'en' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
          border: 'none',
          cursor: 'pointer',
          lineHeight: '18px',
          height: '18px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        style={{
          padding: '1px 6px',
          borderRadius: '3px',
          fontSize: '0.65625rem',
          fontWeight: language === 'hi' ? 800 : 500,
          backgroundColor: language === 'hi' ? '#FFFFFF' : 'transparent',
          color: language === 'hi' ? '#111827' : '#6B7280',
          boxShadow: language === 'hi' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
          border: 'none',
          cursor: 'pointer',
          lineHeight: '18px',
          height: '18px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        हिंदी
      </button>
    </div>
  );
};

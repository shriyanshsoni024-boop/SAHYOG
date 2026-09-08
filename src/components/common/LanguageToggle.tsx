import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'var(--bg-muted)',
        padding: '2px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-default)',
      }}
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        style={{
          padding: '2px 8px',
          borderRadius: 'var(--radius-xs)',
          fontSize: '0.6875rem',
          fontWeight: 700,
          backgroundColor: language === 'en' ? 'var(--bg-surface)' : 'transparent',
          color: language === 'en' ? 'var(--text-primary)' : 'var(--text-muted)',
          boxShadow: language === 'en' ? 'var(--shadow-xs)' : 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        style={{
          padding: '2px 8px',
          borderRadius: 'var(--radius-xs)',
          fontSize: '0.6875rem',
          fontWeight: 700,
          backgroundColor: language === 'hi' ? 'var(--bg-surface)' : 'transparent',
          color: language === 'hi' ? 'var(--text-primary)' : 'var(--text-muted)',
          boxShadow: language === 'hi' ? 'var(--shadow-xs)' : 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        हिंदी
      </button>
    </div>
  );
};

import React from 'react';

export interface ThemeTokens {
  banner: string;
  bannerText: string;
  bannerBorder: string;
  header: string;
  headerBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentLight: string;
  accentBorder: string;
  surface: string;
  surfaceElevated: string;
  muted: string;
  border: string;
}

export interface SahyogTheme {
  id: 'customer' | 'worker' | 'cooperative';
  name: string;
  nameHi: string;
  label: string;
  tagline: string;
  taglineHi: string;
  tokens: ThemeTokens;
}

const MASTER_TOKENS: ThemeTokens = {
  banner: '#FCFBF4',            // --sahyog-cream
  bannerText: '#0B0B0B',        // --sahyog-ink
  bannerBorder: '#E5E7EB',
  header: '#FFFFFF',            // --sahyog-white
  headerBorder: '#E5E7EB',
  text: '#0B0B0B',              // --sahyog-ink
  textSecondary: '#374151',
  textMuted: '#8A8A8A',         // --sahyog-grey
  accent: '#1DAA5C',            // --sahyog-green
  accentHover: '#0F7A3E',       // --sahyog-green-dark
  accentLight: '#F0FDF4',
  accentBorder: '#D9E9C8',      // --sahyog-sage
  surface: '#FFFFFF',           // --sahyog-white
  surfaceElevated: '#FFFFFF',
  muted: '#FCFBF4',             // --sahyog-cream
  border: '#E5E7EB',
};

export const THEMES: Record<'customer' | 'worker' | 'cooperative', SahyogTheme> = {
  customer: {
    id: 'customer',
    name: 'Customer',
    nameHi: 'ग्राहक',
    label: 'Customer Marketplace',
    tagline: 'Verified Home Services at Standard Cooperative Rates',
    taglineHi: 'मानक सहकारी दरों पर प्रमाणित घरेलू सेवाएं',
    tokens: { ...MASTER_TOKENS },
  },
  worker: {
    id: 'worker',
    name: 'Worker',
    nameHi: 'कारीगर',
    label: 'Artisan Partner Portal',
    tagline: 'Skill-Verified Jobs & Fair Cooperative Earnings',
    taglineHi: 'कौशल-सत्यापित कार्य और उचित सहकारी पारिश्रमिक',
    tokens: { ...MASTER_TOKENS },
  },
  cooperative: {
    id: 'cooperative',
    name: 'Cooperative',
    nameHi: 'सहकारी संघ',
    label: 'Cooperative Federation Admin',
    tagline: 'Workforce Allocation, Verification & Service Monitoring',
    taglineHi: 'कार्यबल आवंटन, सत्यापन और सेवा निगरानी',
    tokens: { ...MASTER_TOKENS },
  },
};

/**
 * Returns CSS custom properties object for a given theme to inject inline or on root element.
 */
export function getThemeCssVariables(themeKey: 'customer' | 'worker' | 'cooperative'): React.CSSProperties {
  const theme = THEMES[themeKey] || THEMES.customer;
  const { tokens } = theme;

  return {
    ['--theme-banner' as any]: tokens.banner,
    ['--theme-banner-text' as any]: tokens.bannerText,
    ['--theme-banner-border' as any]: tokens.bannerBorder,
    ['--theme-header' as any]: tokens.header,
    ['--theme-header-border' as any]: tokens.headerBorder,
    ['--theme-text' as any]: tokens.text,
    ['--theme-text-secondary' as any]: tokens.textSecondary,
    ['--theme-text-muted' as any]: tokens.textMuted,
    ['--theme-accent' as any]: tokens.accent,
    ['--theme-accent-hover' as any]: tokens.accentHover,
    ['--theme-accent-light' as any]: tokens.accentLight,
    ['--theme-accent-border' as any]: tokens.accentBorder,
    ['--theme-surface' as any]: tokens.surface,
    ['--theme-surface-elevated' as any]: tokens.surfaceElevated,
    ['--theme-muted' as any]: tokens.muted,
    ['--theme-border' as any]: tokens.border,
  };
}

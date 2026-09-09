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

export const THEMES: Record<'customer' | 'worker' | 'cooperative', SahyogTheme> = {
  customer: {
    id: 'customer',
    name: 'Customer',
    nameHi: 'ग्राहक',
    label: 'Customer Marketplace',
    tagline: 'Verified Home Services at Standard Cooperative Rates',
    taglineHi: 'मानक सहकारी दरों पर प्रमाणित घरेलू सेवाएं',
    tokens: {
      banner: '#FFFBEB',            // Subtle warm saffron cream
      bannerText: '#92400E',        // Deep amber text
      bannerBorder: '#FDE68A',      // Warm gold border
      header: '#FFFFFF',            // Clean crisp white
      headerBorder: '#E5E7EB',
      text: '#111827',              // High contrast dark charcoal
      textSecondary: '#374151',
      textMuted: '#6B7280',
      accent: '#0C831F',            // Fresh Indian quick-commerce action green
      accentHover: '#096818',
      accentLight: '#F0FDF4',
      accentBorder: '#BBF7D0',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      muted: '#F8F9FA',             // Soft neutral fill
      border: '#E5E7EB',
    },
  },
  worker: {
    id: 'worker',
    name: 'Worker',
    nameHi: 'कारीगर',
    label: 'Artisan Partner Portal',
    tagline: 'Skill-Verified Jobs & Fair Cooperative Earnings',
    taglineHi: 'कौशल-सत्यापित कार्य और उचित सहकारी पारिश्रमिक',
    tokens: {
      banner: '#F0FDFA',            // Subtle artisan teal tint
      bannerText: '#115E59',        // Deep teal text
      bannerBorder: '#99F6E4',      // Soft teal border
      header: '#FFFFFF',
      headerBorder: '#E2E8F0',
      text: '#0F172A',              // Slate charcoal
      textSecondary: '#334155',
      textMuted: '#64748B',
      accent: '#0D9488',            // Dependable Artisan Pro Teal
      accentHover: '#0F766E',
      accentLight: '#F0FDFA',
      accentBorder: '#99F6E4',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      muted: '#F8FAFC',
      border: '#E2E8F0',
    },
  },
  cooperative: {
    id: 'cooperative',
    name: 'Cooperative',
    nameHi: 'सहकारी संघ',
    label: 'Cooperative Federation Admin',
    tagline: 'Workforce Allocation, Verification & Service Monitoring',
    taglineHi: 'कार्यबल आवंटन, सत्यापन और सेवा निगरानी',
    tokens: {
      banner: '#FFF7ED',            // Warm federation terracotta ochre tint
      bannerText: '#9A3412',        // Deep terracotta text
      bannerBorder: '#FED7AA',      // Warm terracotta border
      header: '#FFFFFF',
      headerBorder: '#E2E8F0',
      text: '#0F172A',
      textSecondary: '#334155',
      textMuted: '#64748B',
      accent: '#EA580C',            // Federation Terracotta / Warm Ochre
      accentHover: '#C2410C',
      accentLight: '#FFF7ED',
      accentBorder: '#FED7AA',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      muted: '#F8FAFC',
      border: '#E2E8F0',
    },
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

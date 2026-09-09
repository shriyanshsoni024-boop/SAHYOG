import React, { useState } from 'react';
import { SPOTLIGHT_PROMOTIONS, SpotlightItem } from '../../data/marketplaceData';
import { useLanguage } from '../../i18n/LanguageContext';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export interface SpotlightBannerProps {
  onSelectPromotion: (promo: SpotlightItem) => void;
}

export const SpotlightBanner: React.FC<SpotlightBannerProps> = ({ onSelectPromotion }) => {
  const { language } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);

  const current = SPOTLIGHT_PROMOTIONS[activeIdx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--theme-text, #111827)', letterSpacing: '-0.01em', margin: 0 }}>
            {language === 'hi' ? 'विशेष ऑफर एवं अभियान' : 'Featured Deals & Offers'}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted, #6B7280)', margin: '2px 0 0' }}>
            {language === 'hi' ? 'सहकारी गारंटी के साथ मौसमी छूट' : 'Seasonal discounts backed by 30-day rework cover'}
          </p>
        </div>

        {/* Carousel indicators */}
        <div style={{ display: 'flex', gap: '5px' }}>
          {SPOTLIGHT_PROMOTIONS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              style={{
                width: i === activeIdx ? '20px' : '6px',
                height: '6px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: i === activeIdx ? 'var(--theme-accent, #0C831F)' : 'var(--border-strong)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                padding: 0,
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Main Promotional Card with Realistic Trade Image & Clean Overlay */}
      <div
        onClick={() => onSelectPromotion(current)}
        style={{
          borderRadius: 'var(--radius-md)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-xs)',
          minHeight: '150px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '18px 22px',
          color: '#FFFFFF',
          border: '1px solid var(--border-default)',
        }}
        className="hover-card"
      >
        {/* Background Image with Dark Dimmer */}
        {current.image && (
          <img
            src={current.image}
            alt={current.title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.75) 60%, rgba(15, 23, 42, 0.4) 100%)',
            zIndex: 1,
          }}
        />

        {/* Top Tag & Price */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              backgroundColor: '#F8CB46',
              color: '#111827',
              padding: '2px 8px',
              borderRadius: 'var(--radius-xs)',
              textTransform: 'uppercase',
            }}
          >
            {language === 'hi' ? current.tagHi : current.tag}
          </span>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#FEF08A',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid rgba(254, 240, 138, 0.3)',
            }}
          >
            {current.priceTag}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div style={{ position: 'relative', zIndex: 2, margin: '8px 0' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25, margin: '0 0 3px' }}>
            {language === 'hi' ? current.titleHi : current.title}
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#E2E8F0', margin: 0, lineHeight: 1.35, maxWidth: '80%' }}>
            {language === 'hi' ? current.subtitleHi : current.subtitle}
          </p>
        </div>

        {/* Bottom CTA Row */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', color: '#CBD5E1' }}>
            <ShieldCheck size={14} color="#34D399" />
            <span>{language === 'hi' ? '30-दिन नि:शुल्क वारंटी' : '30-Day SAHYOG Guarantee'}</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#FFFFFF',
              color: '#111827',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '5px 12px',
              borderRadius: 'var(--radius-xs)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <span>{language === 'hi' ? current.ctaTextHi : current.ctaText}</span>
            <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </div>
  );
};


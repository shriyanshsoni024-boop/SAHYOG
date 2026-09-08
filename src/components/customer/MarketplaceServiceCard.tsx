import React, { useState } from 'react';
import { MarketplaceService } from '../../data/marketplaceData';
import { useLanguage } from '../../i18n/LanguageContext';
import { Star, Clock, Wrench } from 'lucide-react';

export interface MarketplaceServiceCardProps {
  service: MarketplaceService;
  onSelect: (service: MarketplaceService) => void;
  layout?: 'horizontal' | 'grid';
}

export const MarketplaceServiceCard: React.FC<MarketplaceServiceCardProps> = ({
  service,
  onSelect,
  layout = 'horizontal',
}) => {
  const { language } = useLanguage();
  const [imageError, setImageError] = useState(false);

  const title = language === 'hi' ? service.titleHi : service.title;
  const badge = language === 'hi' ? (service.badgeHi || service.badge) : service.badge;
  const duration = language === 'hi' ? service.durationHi : service.duration;

  const formatReviewCount = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div
      onClick={() => onSelect(service)}
      style={{
        width: layout === 'horizontal' ? '210px' : '100%',
        minWidth: layout === 'horizontal' ? '210px' : 'auto',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-xs)',
        position: 'relative',
        transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast)',
        flexShrink: 0,
        scrollSnapAlign: 'start',
      }}
      className="hover-card"
    >
      <div>
        {/* 1. Image (Visually dominant, sharp) */}
        <div
          style={{
            height: '128px',
            width: '100%',
            backgroundColor: '#F1F5F9',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {service.image && !imageError ? (
            <img
              src={service.image}
              alt={title}
              onError={() => setImageError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.2s ease',
              }}
              loading="lazy"
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F8FAFC',
                color: 'var(--text-muted)',
              }}
            >
              <Wrench size={24} strokeWidth={1.5} />
            </div>
          )}

          {/* Clean Subtle Top-Left Badge (if any) */}
          {badge && (
            <span
              style={{
                position: 'absolute',
                top: '6px',
                left: '6px',
                backgroundColor: 'rgba(15, 23, 42, 0.82)',
                color: '#FFFFFF',
                fontSize: '0.5625rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 'var(--radius-xs)',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              {badge}
            </span>
          )}
        </div>

        {/* 2. Service Details Body */}
        <div style={{ padding: '8px 10px 4px' }}>
          {/* Service Name */}
          <h3
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
              margin: '0 0 4px',
              minHeight: '32px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </h3>

          {/* 3. Rating & Reviews */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              <Star size={11} fill="#F59E0B" color="#F59E0B" />
              {service.rating}
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              ({formatReviewCount(service.reviewCount)})
            </span>
          </div>

          {/* 4. Duration */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            <Clock size={11} />
            <span>{duration}</span>
          </div>
        </div>
      </div>

      {/* 5. Price & Simple CTA Row */}
      <div
        style={{
          padding: '6px 10px 8px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '2px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹{service.price}
            </span>
            {service.originalPrice > service.price && (
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{service.originalPrice}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(service);
          }}
          style={{
            padding: '4px 12px',
            backgroundColor: 'var(--secondary-light)',
            color: 'var(--secondary)',
            border: '1.5px solid var(--secondary)',
            borderRadius: 'var(--radius-xs)',
            fontWeight: 800,
            fontSize: '0.6875rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
          }}
          className="sahyog-btn"
        >
          {language === 'hi' ? 'जोड़ें' : 'Add'}
        </button>
      </div>
    </div>
  );
};

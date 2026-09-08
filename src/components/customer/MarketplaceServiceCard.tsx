import React, { useState } from 'react';
import { MarketplaceService } from '../../data/marketplaceData';
import { useLanguage } from '../../i18n/LanguageContext';
import { Star, ShieldCheck, Clock, Wrench } from 'lucide-react';

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
  const savings = service.originalPrice - service.price;
  const discountPercent = service.originalPrice > service.price
    ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
    : 0;

  const formatReviewCount = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div
      onClick={() => onSelect(service)}
      style={{
        width: layout === 'horizontal' ? '230px' : '100%',
        minWidth: layout === 'horizontal' ? '230px' : 'auto',
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
        {/* Real Photographic Thumbnail */}
        <div
          style={{
            height: '124px',
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
                transition: 'transform 0.25s ease',
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
              <Wrench size={28} strokeWidth={1.5} />
            </div>
          )}

          {/* Badge Overlay */}
          {badge && (
            <span
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                color: '#FFFFFF',
                fontSize: '0.625rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 'var(--radius-xs)',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              {badge}
            </span>
          )}

          {/* Discount Tag on Image */}
          {discountPercent > 0 && (
            <span
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                backgroundColor: '#047857',
                color: '#FFFFFF',
                fontSize: '0.625rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Card Body */}
        <div style={{ padding: '10px 12px 6px' }}>
          {/* Category Tag */}
          <div
            style={{
              fontSize: '0.625rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '3px',
            }}
          >
            {service.categoryName}
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
              margin: '0 0 6px',
              minHeight: '36px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </h3>

          {/* Rating & Reviews */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                fontSize: '0.6875rem',
                fontWeight: 800,
                padding: '1px 4px',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              <Star size={10} fill="#D97706" color="#D97706" />
              {service.rating}
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              ({formatReviewCount(service.reviewCount)})
            </span>
          </div>

          {/* Duration & 30d Cover */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '6px',
              fontSize: '0.6875rem',
              color: 'var(--text-muted)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Clock size={11} /> {duration}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--success-dark)' }}>
              <ShieldCheck size={11} /> 30d cover
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & Add/Book CTA Row */}
      <div
        style={{
          padding: '8px 12px 10px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '4px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹{service.price}
            </span>
            {service.originalPrice > service.price && (
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{service.originalPrice}
              </span>
            )}
          </div>
          {savings > 0 && (
            <div style={{ fontSize: '0.5625rem', fontWeight: 700, color: 'var(--success-dark)' }}>
              Save ₹{savings}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(service);
          }}
          style={{
            padding: '5px 12px',
            backgroundColor: '#FFFFFF',
            color: 'var(--primary)',
            border: '1.5px solid var(--primary)',
            borderRadius: 'var(--radius-xs)',
            fontWeight: 800,
            fontSize: '0.75rem',
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

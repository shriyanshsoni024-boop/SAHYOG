import React, { useState } from 'react';
import { ServiceCategory } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { Zap, Snowflake, Wrench, Hammer, Tv, Paintbrush, Sparkles, ShieldAlert, LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Snowflake,
  Wrench,
  Hammer,
  Tv,
  Paintbrush,
  Sparkles,
  ShieldAlert,
};

export interface ServiceCardProps {
  category: ServiceCategory;
  onClick: (cat: ServiceCategory) => void;
  selected?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ category, onClick, selected = false }) => {
  const { language } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const IconComponent = ICON_MAP[category.icon] || Wrench;
  const displayName = language === 'hi' ? category.nameHi : category.name;

  return (
    <div
      onClick={() => onClick(category)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        padding: '4px 2px 6px',
        userSelect: 'none',
        borderRadius: '6px',
        transition: 'background-color 120ms ease',
      }}
      className="sahyog-btn"
    >
      {/* Category Image Thumbnail */}
      <div
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '10px',
          backgroundColor: '#F3F4F6',
          border: `1px solid ${selected ? 'var(--sahyog-green, #1DAA5C)' : '#E5E7EB'}`,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '5px',
          boxShadow: selected ? '0 0 0 2px var(--sahyog-sage, #D9E9C8)' : 'none',
          position: 'relative',
        }}
      >
        {category.image && !imageError ? (
          <img
            src={category.image}
            alt={displayName}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            loading="lazy"
          />
        ) : (
          <div style={{ color: 'var(--sahyog-green, #1DAA5C)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconComponent size={22} strokeWidth={1.8} />
          </div>
        )}
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: '0.71875rem',
          fontWeight: selected ? 800 : 600,
          color: selected ? 'var(--sahyog-green, #1DAA5C)' : 'var(--sahyog-ink, #0B0B0B)',
          lineHeight: 1.2,
          minHeight: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '82px',
        }}
      >
        {displayName}
      </span>

      {/* Starting Price */}
      <span
        style={{
          fontSize: '0.625rem',
          color: '#64748B',
          marginTop: '1px',
          fontWeight: 500,
        }}
      >
        ₹{category.basePrice}+
      </span>
    </div>
  );
};


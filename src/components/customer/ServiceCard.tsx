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
        padding: '6px 2px 8px',
        borderRadius: 'var(--radius-sm)',
        transition: 'transform var(--transition-fast), background-color var(--transition-fast)',
        userSelect: 'none',
        backgroundColor: selected ? 'var(--theme-accent-light, #F0FDF4)' : 'transparent',
      }}
      className="hover-card"
    >
      {/* Category Image Thumbnail */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#F3F4F6',
          border: `1px solid ${selected ? 'var(--theme-accent, #0C831F)' : 'var(--border-default)'}`,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '6px',
          boxShadow: selected ? '0 0 0 2px var(--theme-accent-light, #F0FDF4)' : 'none',
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
          <div style={{ color: 'var(--theme-accent, #0C831F)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconComponent size={24} strokeWidth={1.8} />
          </div>
        )}
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: '0.75rem',
          fontWeight: selected ? 800 : 600,
          color: selected ? 'var(--theme-accent, #0C831F)' : 'var(--theme-text, #111827)',
          lineHeight: 1.25,
          minHeight: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '85px',
        }}
      >
        {displayName}
      </span>

      {/* Starting Price */}
      <span
        style={{
          fontSize: '0.625rem',
          color: 'var(--theme-text-muted, #6B7280)',
          marginTop: '1px',
          fontWeight: 600,
        }}
      >
        ₹{category.basePrice}+
      </span>
    </div>
  );
};


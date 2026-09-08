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
        position: 'relative',
        padding: '4px 2px',
        borderRadius: 'var(--radius-sm)',
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
      }}
      className="hover-card"
    >
      {/* Category Visual Tile */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#FFFFFF',
          border: `1.5px solid ${selected ? 'var(--primary-hover)' : 'var(--border-default)'}`,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '5px',
          boxShadow: selected ? '0 0 0 2px var(--primary-light)' : 'var(--shadow-xs)',
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
          <div style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconComponent size={22} strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: '0.6875rem',
          fontWeight: selected ? 700 : 600,
          color: selected ? 'var(--primary-dark)' : 'var(--text-primary)',
          lineHeight: 1.2,
          minHeight: '22px',
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
          color: 'var(--secondary)',
          marginTop: '1px',
          fontWeight: 700,
        }}
      >
        ₹{category.basePrice}+
      </span>
    </div>
  );
};

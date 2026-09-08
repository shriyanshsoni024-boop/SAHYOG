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
        padding: '6px 4px',
        borderRadius: 'var(--radius-sm)',
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
      }}
      className="hover-card"
    >
      {/* Category Visual Tile */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#F1F5F9',
          border: `1.5px solid ${selected ? 'var(--primary)' : 'var(--border-default)'}`,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '6px',
          boxShadow: selected ? '0 0 0 2px var(--primary-border)' : 'var(--shadow-xs)',
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
          <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconComponent size={26} strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: selected ? 'var(--primary)' : 'var(--text-primary)',
          lineHeight: 1.25,
          minHeight: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '90px',
        }}
      >
        {displayName}
      </span>

      {/* Starting Price */}
      <span
        style={{
          fontSize: '0.625rem',
          color: 'var(--text-muted)',
          marginTop: '1px',
          fontWeight: 600,
        }}
      >
        ₹{category.basePrice}+
      </span>
    </div>
  );
};

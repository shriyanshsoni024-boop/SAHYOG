import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { CategoryTheme } from '../../styles/categoryThemes';

export interface ServiceItemData {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewsCount: string;
  image: string;
  duration: string;
  isPopular?: boolean;
}

interface ProntoServiceCardProps {
  service: ServiceItemData;
  theme: CategoryTheme;
  onBook: () => void;
}

export const ProntoServiceCard: React.FC<ProntoServiceCardProps> = ({ service, theme, onBook }) => {
  return (
    <div
      onClick={onBook}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        padding: '14px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        gap: '14px',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 180ms ease',
      }}
      className="hover-card"
    >
      {/* Service Image with Popular Tag */}
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#F1F5F9',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <img
          src={service.image}
          alt={service.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {service.isPopular && (
          <div
            style={{
              position: 'absolute',
              top: '6px',
              left: '6px',
              backgroundColor: theme.primary,
              color: '#FFFFFF',
              fontSize: '0.5625rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
            }}
          >
            Popular
          </div>
        )}
      </div>

      {/* Info & Pricing */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <h3
            style={{
              fontSize: '0.9375rem',
              fontWeight: 800,
              color: '#0F172A',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {service.name}
          </h3>
        </div>

        <p
          style={{
            fontSize: '0.75rem',
            color: '#64748B',
            margin: 0,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {service.description}
        </p>

        {/* Rating & Reviews */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '0.6875rem',
              fontWeight: 800,
              color: '#0F172A',
            }}
          >
            <Star size={12} fill="#F59E0B" color="#F59E0B" />
            <span>{service.rating}</span>
          </div>
          <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>•</span>
          <span style={{ fontSize: '0.6875rem', color: '#64748B' }}>
            {service.reviewsCount}
          </span>
          <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>•</span>
          <span style={{ fontSize: '0.6875rem', color: '#0C831F', fontWeight: 600 }}>
            {service.duration}
          </span>
        </div>

        {/* Price & Book Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '6px',
          }}
        >
          <div>
            <span style={{ fontSize: '0.625rem', color: '#94A3B8', fontWeight: 600 }}>Starts at</span>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A' }}>
              ₹{service.price}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBook();
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: theme.primaryLight,
              color: theme.primaryDark,
              border: `1px solid ${theme.primaryBorder}`,
              borderRadius: '10px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 120ms ease',
            }}
          >
            <span>Book</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

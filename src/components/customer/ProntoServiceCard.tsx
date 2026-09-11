import React from 'react';
import { Star, Plus } from 'lucide-react';
import { CategoryTheme } from '../../styles/categoryThemes';

export interface ServiceItemData {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: string;
  image: string;
  duration: string;
  isPopular?: boolean;
}

interface ProntoServiceCardProps {
  service: ServiceItemData;
  theme?: CategoryTheme;
  onBook: () => void;
}

export const ProntoServiceCard: React.FC<ProntoServiceCardProps> = ({ service, onBook }) => {
  // Extract review count in compact format e.g. "3.4k" from "3.4k reviews"
  const compactReviewCount = service.reviewsCount
    .replace(' reviews', '')
    .replace(' review', '');

  // Calculate strikethrough original price if not provided
  const originalPrice = service.originalPrice || Math.round(service.price * 1.35);

  return (
    <div
      onClick={onBook}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '5px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        height: '100%',
        boxSizing: 'border-box',
        userSelect: 'none',
        minWidth: 0,
      }}
      className="hover-card"
    >
      <div>
        {/* 1. Large Top Service Image with Floating Rating & Floating Plus (+) Button */}
        <div
          style={{
            width: '100%',
            height: '88px',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#F1F5F9',
            position: 'relative',
          }}
        >
          <img
            src={service.image}
            alt={service.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="lazy"
          />

          {/* Floating Rating Pill: ★ 4.9 (23.7k) */}
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              backgroundColor: 'rgba(15, 23, 42, 0.78)',
              backdropFilter: 'blur(4px)',
              color: '#FFFFFF',
              fontSize: '0.5rem',
              fontWeight: 800,
              padding: '1.5px 4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              lineHeight: 1,
              boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
            }}
          >
            <Star size={8} fill="#F59E0B" color="#F59E0B" />
            <span>{service.rating}</span>
            <span style={{ opacity: 0.8, fontSize: '0.45rem' }}>
              ({compactReviewCount})
            </span>
          </div>

          {/* Floating (+) Action Button on Image */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBook();
            }}
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: '#0C831F',
              color: '#FFFFFF',
              border: '1.5px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
              cursor: 'pointer',
              transition: 'transform 120ms ease, background-color 120ms ease',
              padding: 0,
            }}
            className="sahyog-btn"
            aria-label={`Book ${service.name}`}
          >
            <Plus size={13} strokeWidth={3} />
          </button>
        </div>

        {/* 2. Service Title */}
        <h3
          style={{
            fontSize: '0.6875rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '5px 1px 2px',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.4em',
          }}
          title={service.name}
        >
          {service.name}
        </h3>
      </div>

      {/* 3. Pricing Row: Current Price & Strikethrough Original Price */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '3px',
          margin: '2px 1px 1px',
          paddingTop: '1px',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.01em',
          }}
        >
          ₹{service.price}
        </span>
        {originalPrice > service.price && (
          <span
            style={{
              fontSize: '0.59375rem',
              color: '#94A3B8',
              fontWeight: 500,
              textDecoration: 'line-through',
            }}
          >
            ₹{originalPrice}
          </span>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Star } from 'lucide-react';

export interface RatingProps {
  value: number;
  count?: number;
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (val: number) => void;
  size?: number;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  count,
  showValue = true,
  interactive = false,
  onChange,
  size = 14,
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {interactive ? (
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= Math.round(value);
            return (
              <button
                key={star}
                type="button"
                onClick={() => onChange && onChange(star)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '2px',
                  cursor: 'pointer',
                  color: isFilled ? '#D97706' : '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={`Rate ${star} stars`}
              >
                <Star size={size} fill={isFilled ? '#D97706' : 'transparent'} strokeWidth={1.75} />
              </button>
            );
          })}
        </div>
      ) : (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            backgroundColor: '#FEF3C7',
            color: '#92400E',
            border: '1px solid #FDE68A',
            padding: '1px 5px',
            borderRadius: 'var(--radius-xs)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          <Star size={10} fill="#D97706" color="#D97706" />
          {showValue && <span>{value.toFixed(1)}</span>}
        </span>
      )}
      {count !== undefined && (
        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          ({count})
        </span>
      )}
    </div>
  );
};

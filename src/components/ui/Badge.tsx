import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'verified' | 'emergency' | 'match' | 'tier' | 'success' | 'warning' | 'neutral' | 'accent';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  style,
  className = '',
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'verified':
        return {
          backgroundColor: 'var(--success-light)',
          color: 'var(--sahyog-green-dark)',
          border: '1px solid var(--sahyog-sage)',
        };
      case 'emergency':
        return {
          backgroundColor: 'var(--danger-light)',
          color: 'var(--sahyog-red)',
          border: '1px solid var(--danger-border)',
          fontWeight: 700,
        };
      case 'match':
        return {
          backgroundColor: 'var(--accent-warm-light)',
          color: 'var(--accent-warm-dark)',
          border: '1px solid var(--accent-warm-border)',
          fontWeight: 700,
        };
      case 'tier':
        return {
          backgroundColor: 'var(--accent-warm-light)',
          color: 'var(--accent-warm-dark)',
          border: '1px solid var(--accent-warm-border)',
        };
      case 'success':
        return {
          backgroundColor: 'var(--success-light)',
          color: 'var(--sahyog-green-dark)',
          border: '1px solid var(--sahyog-sage)',
        };
      case 'warning':
        return {
          backgroundColor: 'var(--accent-warm-light)',
          color: 'var(--accent-warm-dark)',
          border: '1px solid var(--accent-warm-border)',
        };
      case 'accent':
        return {
          backgroundColor: 'var(--sahyog-blue-tint)',
          color: 'var(--sahyog-navy)',
          border: '1px solid #BFDBFE',
        };
      case 'neutral':
      default:
        return {
          backgroundColor: 'var(--bg-muted)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-default)',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '1px 6px', fontSize: '0.6875rem' };
      case 'md':
      default:
        return { padding: '2px 8px', fontSize: '0.75rem' };
    }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 600,
        lineHeight: 1.25,
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      className={`sahyog-badge ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};

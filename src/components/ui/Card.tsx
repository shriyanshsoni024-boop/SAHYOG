import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'emergency' | 'muted';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  style,
  ...props
}) => {
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none': return '0';
      case 'sm': return 'var(--space-3)';
      case 'lg': return 'var(--space-5)';
      case 'md':
      default: return 'var(--space-4)';
    }
  };

  const getVariantStyle = (): React.CSSProperties => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-default)',
        };
      case 'emergency':
        return {
          backgroundColor: 'var(--danger-light)',
          border: '1px solid var(--danger-border)',
        };
      case 'muted':
        return {
          backgroundColor: 'var(--bg-muted)',
          border: '1px solid var(--border-default)',
        };
      case 'interactive':
        return {
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xs)',
          cursor: 'pointer',
        };
      case 'default':
      default:
        return {
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xs)',
        };
    }
  };

  return (
    <div
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: getPaddingStyle(),
        ...getVariantStyle(),
        ...style,
      }}
      className={`sahyog-card ${variant === 'interactive' ? 'hover-card' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

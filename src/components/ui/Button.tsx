import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'emergency' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'var(--secondary)',
          color: '#ffffff',
          border: '1px solid transparent',
        };
      case 'emergency':
        return {
          backgroundColor: 'var(--danger)',
          color: '#ffffff',
          border: '1px solid transparent',
        };
      case 'outline':
        return {
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-strong)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid transparent',
        };
      case 'success':
        return {
          backgroundColor: 'var(--success)',
          color: '#ffffff',
          border: '1px solid transparent',
        };
      case 'primary':
      default:
        return {
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-text)',
          border: '1px solid var(--primary-hover)',
          fontWeight: 700,
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)' };
      case 'lg':
        return { padding: '12px 20px', fontSize: '0.9375rem', borderRadius: 'var(--radius-md)', fontWeight: 600 };
      case 'md':
      default:
        return { padding: '9px 16px', fontSize: '0.875rem', borderRadius: 'var(--radius-md)', fontWeight: 600 };
    }
  };

  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        width: fullWidth ? '100%' : 'auto',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.6 : 1,
        transition: 'background-color var(--transition-fast), border-color var(--transition-fast)',
        fontFamily: 'var(--font-sans)',
        lineHeight: 1.25,
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      disabled={disabled || isLoading}
      className={`sahyog-btn ${className}`}
      {...props}
    >
      {isLoading ? (
        <span
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      ) : leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  id,
  style,
  className = '',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          {label}
        </label>
      )}
      <div
        className="sahyog-input-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '0 12px',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast), background-color var(--transition-fast)',
        }}
      >
        {leftIcon && <span style={{ marginRight: '8px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>{leftIcon}</span>}
        <input
          id={inputId}
          style={{
            flex: 1,
            padding: '10px 0',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: '0.9375rem',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            ...style,
          }}
          className={`sahyog-input ${className}`}
          {...props}
        />
        {rightIcon && <span style={{ marginLeft: '8px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>{rightIcon}</span>}
      </div>
      {error && (
        <span
          style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
          className="animate-fade-in"
        >
          {error}
        </span>
      )}
      {hint && !error && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  );
};

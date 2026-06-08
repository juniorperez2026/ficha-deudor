import React, { useState } from 'react';

interface PasswordFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  wrapperClassName?: string;
  error?: string;
  layout?: 'vertical' | 'inline';
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  wrapperClassName,
  error,
  layout = 'vertical',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const input = (
    <div className="password-input-wrapper">
      <input
        className={`form-input ${error ? 'form-input--error' : ''}`}
        type={showPassword ? 'text' : 'password'}
        {...props}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setShowPassword((prev) => !prev)}
        tabIndex={-1}
        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {showPassword ? '🙈' : '👁️'}
      </button>
    </div>
  );

  // Layout inline
  if (layout === 'inline' && label) {
    return (
      <div className={`form-row-inline ${wrapperClassName ?? ''}`}>
        <label className="form-label form-label--inline">
          {label}
          {props.required && <span style={{ color: 'var(--ap-red)', marginLeft: '4px' }}>*</span>}
        </label>
        <div style={{ flex: 1, minWidth: 0 }}>
          {input}
          {error && <span className="form-error">{error}</span>}
        </div>
      </div>
    );
  }

  // Layout vertical (default)
  return (
    <div className={`form-group ${wrapperClassName ?? ''}`}>
      {label && <label className="form-label">{label}</label>}
      {input}
      {error && <span className="form-error" style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>{error}</span>}
    </div>
  );
};
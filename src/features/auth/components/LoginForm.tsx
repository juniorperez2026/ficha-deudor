import React, { useState, useCallback } from 'react';
import { InputField, PasswordField } from '../../../shared/components/ui';
import { validateLoginForm, hasErrors, type LoginFormErrors } from '../validations';
import type { LoginPayload } from '../types';

interface LoginFormProps {
  onSubmit: (payload: LoginPayload) => void;
  isLoading: boolean;
  error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, error }) => {
  const [values, setValues] = useState<LoginPayload>({ username: '', password: '' });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback((field: keyof LoginPayload) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [errors]);

  const handleBlur = useCallback((field: keyof LoginPayload) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validation = validateLoginForm(values);
    if (validation[field]) {
      setErrors((prev) => ({ ...prev, [field]: validation[field]! }));
    }
  }, [values]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateLoginForm(values);
    setErrors(validation);
    setTouched({ username: true, password: true });

    if (hasErrors(validation)) return;

    onSubmit(values);
  }, [values, onSubmit]);

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-form__header">
        <h2 className="login-form__title">Iniciar Sesión</h2>
        <p className="login-form__subtitle">Sistema de Gestión de Cobranzas</p>
      </div>

      <div className="login-form__body">
        <InputField
          label="Usuario"
          placeholder="Ingrese su usuario"
          value={values.username}
          onChange={(e) => handleChange('username')(e.target.value)}
          onBlur={handleBlur('username')}
          error={touched.username ? errors.username : undefined}
          autoComplete="username"
          autoFocus
          required
        />

        <PasswordField
          label="Contraseña"
          placeholder="Ingrese su contraseña"
          value={values.password}
          onChange={(e) => handleChange('password')(e.target.value)}
          onBlur={handleBlur('password')}
          error={touched.password ? errors.password : undefined}
          autoComplete="current-password"
          required
        />

        {error && (
          <div className="login-form__error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}
      </div>

        <div className="login-form__footer">
        <button
          type="submit"
          className="btn btn-primary2 btn-md login-form__submit"
          disabled={isLoading}
        >
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </div>
    </form>
  );
};
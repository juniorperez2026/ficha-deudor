// src/features/auth/contexts/AuthContext.tsx

import React, { createContext, useState, useCallback, useMemo } from 'react';
import type { AuthContextValue, AuthState, Cliente, LoginPayload } from '../types';

const initialState: AuthState = {
  isAuthenticated: false,
  usuario: null,
  clienteSeleccionada: null,
  isLoading: false,
  error: null,
};

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  const login = useCallback(async (payload: LoginPayload) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Importamos dinámicamente para evitar circular dependency si fuera necesario
      const { login: loginApi } = await import('../api/authApi');
      const response = await loginApi(payload);

      if (!response.success) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.message,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        usuario: response.usuario,
        isLoading: false,
        error: null,
      }));

      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  const logout = useCallback(() => {
    setState(initialState);
    // Limpiar cualquier dato en localStorage si se usa en el futuro
    localStorage.removeItem('auth_token');
  }, []);

  const seleccionarCliente = useCallback((cliente: Cliente) => {
    setState((prev) => ({
      ...prev,
      clienteSeleccionada: cliente,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      seleccionarCliente,
      clearError,
    }),
    [state, login, logout, seleccionarCliente, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
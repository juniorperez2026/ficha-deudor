import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import { AuthContext } from './authContextValue';
import { login as loginApi } from '../api/authApi';

import type {
  AuthContextValue,
  AuthState,
  Cliente,
  LoginPayload,
  LoginResponse,
} from '../types';

const AUTH_STORAGE_KEY = 'ficha_deudor_auth_state';

const initialState: AuthState = {
  isAuthenticated: false,
  usuario: null,
  clienteSeleccionada: null,
  isLoading: false,
  error: null,
};

function loadStoredAuthState(): AuthState {
  try {
    const rawState = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawState) {
      return initialState;
    }

    const parsedState = JSON.parse(rawState) as Partial<AuthState>;

    if (!parsedState.usuario) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return initialState;
    }

    return {
      ...initialState,
      isAuthenticated: true,
      usuario: parsedState.usuario,
      clienteSeleccionada: parsedState.clienteSeleccionada ?? null,
      isLoading: false,
      error: null,
    };
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return initialState;
  }
}

function saveStoredAuthState(state: AuthState) {
  try {
    if (!state.usuario) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    const stateToStore: AuthState = {
      ...state,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stateToStore));
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

function clearStoredAuthState() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const buildLoginErrorResponse = (message: string): LoginResponse => {
  return {
    success: false,
    message,
    usuario: null,
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => loadStoredAuthState());

  const login = useCallback(
    async (payload: LoginPayload): Promise<LoginResponse> => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await loginApi(payload);

        if (!response.success || !response.usuario) {
          clearStoredAuthState();

          setState((prev) => ({
            ...prev,
            isAuthenticated: false,
            usuario: null,
            clienteSeleccionada: null,
            isLoading: false,
            error: response.message,
          }));

          return response;
        }

        setState((prev) => {
          const nextState: AuthState = {
            ...prev,
            isAuthenticated: true,
            usuario: response.usuario,
            clienteSeleccionada: null,
            isLoading: false,
            error: null,
          };

          saveStoredAuthState(nextState);

          return nextState;
        });

        return response;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Error al iniciar sesión.';

        clearStoredAuthState();

        setState((prev) => ({
          ...prev,
          isAuthenticated: false,
          usuario: null,
          clienteSeleccionada: null,
          isLoading: false,
          error: message,
        }));

        return buildLoginErrorResponse(message);
      }
    },
    []
  );

  const logout = useCallback(() => {
    clearStoredAuthState();
    setState(initialState);
  }, []);

  const seleccionarCliente = useCallback((cliente: Cliente) => {
    setState((prev) => {
      const nextState: AuthState = {
        ...prev,
        isAuthenticated: !!prev.usuario,
        clienteSeleccionada: cliente,
        isLoading: false,
        error: null,
      };

      saveStoredAuthState(nextState);

      return nextState;
    });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => {
      const nextState: AuthState = {
        ...prev,
        error: null,
      };

      if (nextState.usuario) {
        saveStoredAuthState(nextState);
      }

      return nextState;
    });
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
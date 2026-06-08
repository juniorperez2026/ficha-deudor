import { useState, useCallback } from 'react';
import { login as loginApi } from '../api';
import type { LoginPayload, LoginResponse } from '../types';

interface UseLoginState {
  isLoading: boolean;
  error: string | null;
  data: LoginResponse | null;
}

export const useLogin = () => {
  const [state, setState] = useState<UseLoginState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const execute = useCallback(async (payload: LoginPayload): Promise<LoginResponse> => {
    setState({ isLoading: true, error: null, data: null });

    try {
      const response = await loginApi(payload);
      
      if (!response.success) {
        setState({ isLoading: false, error: response.message, data: response });
        return response;
      }

      setState({ isLoading: false, error: null, data: response });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado al iniciar sesión';
      const errorResponse: LoginResponse = {
        success: false,
        message,
        usuario: null as unknown as LoginResponse['usuario'],
      };
      setState({ isLoading: false, error: message, data: errorResponse });
      return errorResponse;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, data: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};
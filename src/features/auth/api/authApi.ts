import { apiClient } from '../../../shared/api/apiClient';
import { env } from '../../../app/config/env';
import { mockLogin, mockGetClientesByUsuario } from '../mocks';
import type { LoginPayload, LoginResponse, ClientesResponse } from '../types';

/**
 * POST /api/auth/login
 */
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  /*if (env.useMocks) {
    return mockLogin(payload);
  }

  return apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });*/
  return mockLogin(payload);
};

/**
 * GET /api/auth/clientes/:id_usuario
 */
export const fetchClientesByUsuario = async (id_usuario: string): Promise<ClientesResponse> => {
  /*if (env.useMocks) {
    return mockGetClientesByUsuario(id_usuario);
  }

  return apiClient<ClientesResponse>(`/auth/clientes/${id_usuario}`);*/
  return mockGetClientesByUsuario(id_usuario);
};
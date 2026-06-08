import type { SelectOption } from '../../../shared/types';

// ─────────────────────────────────────────────
// ENTIDADES
// ─────────────────────────────────────────────

/** Representa una cartera de cobranza (CLARO, BITEL, DERRAMA, etc.) */
export interface Cliente {
  id_cliente: string;
  nombre: string;
  codigo: string;
  activa: boolean;
}

/** Representa un usuario del sistema */
export interface Usuario {
  id_usuario: string;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  perfil: string;
  clientesAsignados: string[]; // IDs de carteras que puede ver
}

// ─────────────────────────────────────────────
// PAYLOADS / REQUESTS
// ─────────────────────────────────────────────

export interface LoginPayload {
  username: string;
  password: string;
}

export interface SeleccionarClientePayload {
  id_usuario: string;
  id_cliente: string;
}

// ─────────────────────────────────────────────
// RESPUESTAS API
// ─────────────────────────────────────────────

export interface LoginResponse {
  success: boolean;
  message: string;
  usuario: Usuario;
  token?: string; // Para futura implementación de JWT
}

export interface ClientesResponse {
  success: boolean;
  clientes: Cliente[];
}

// ─────────────────────────────────────────────
// ESTADO DE AUTENTICACIÓN
// ─────────────────────────────────────────────

export interface AuthState {
  isAuthenticated: boolean;
  usuario: Usuario | null;
  clienteSeleccionada: Cliente | null;
  isLoading: boolean;
  error: string | null;
}

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────

export interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  seleccionarCliente: (cliente: Cliente) => void;
  clearError: () => void;
}

// Helper para convertir Cliente[] a SelectOption[]
export const clienteToSelectOptions = (carteras: Cliente[]): SelectOption[] =>
  carteras.map((c) => ({
    id: c.id_cliente,
    label: c.nombre,
  }));
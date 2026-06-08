import type { Cliente, LoginResponse, Usuario, ClientesResponse } from '../types';

// ─────────────────────────────────────────────
// USUARIOS MOCK
// ─────────────────────────────────────────────

const usuariosMock: Record<string, { usuario: Usuario; password: string }> = {
  'admin': {
    password: 'admin123',
    usuario: {
      id_usuario: 'USR001',
      nombre: 'Carlos',
      apellido: 'Ramírez',
      username: 'admin',
      email: 'c.ramirez@avalperu.pe',
      perfil: 'SUPERVISOR',
      clientesAsignados: ['95'],
    },
  },
  'gestor1': {
    password: 'gestor123',
    usuario: {
      id_usuario: 'USR002',
      nombre: 'María',
      apellido: 'López',
      username: 'gestor1',
      email: 'm.lopez@avalperu.pe',
      perfil: 'GESTOR',
      clientesAsignados: ['95'],
    },
  },
  'gestor2': {
    password: 'gestor456',
    usuario: {
      id_usuario: 'USR003',
      nombre: 'Juan',
      apellido: 'Pérez',
      username: 'gestor2',
      email: 'j.perez@avalperu.pe',
      perfil: 'GESTOR',
      clientesAsignados: ['95'],
    },
  },
};

// ─────────────────────────────────────────────
// CLIENTES MOCK
// ─────────────────────────────────────────────

export const clientesMock: Cliente[] = [
  { id_cliente: '95', nombre: 'CLARO CORPORATIVO', codigo: 'CLARO', activa: true },
];

// ─────────────────────────────────────────────
// MOCK FUNCTIONS (simulan la API)
// ─────────────────────────────────────────────

/**
 * Simula el endpoint de login
 * POST /api/auth/login
 */
export const mockLogin = async (payload: { username: string; password: string }): Promise<LoginResponse> => {
  // Simular latencia de red
  await new Promise((resolve) => setTimeout(resolve, 800));

  const registro = usuariosMock[payload.username];

  if (!registro) {
    return {
      success: false,
      message: 'Usuario no encontrado',
      usuario: null as unknown as Usuario,
    };
  }

  if (registro.password !== payload.password) {
    return {
      success: false,
      message: 'Contraseña incorrecta',
      usuario: null as unknown as Usuario,
    };
  }

  return {
    success: true,
    message: 'Login exitoso',
    usuario: registro.usuario,
    token: `mock-jwt-token-${Date.now()}`,
  };
};

/**
 * Simula el endpoint de obtener <clientes> por usuario
 * GET /api/auth/clientes/:id_usuario
 */
export const mockGetClientesByUsuario = async (id_usuario: string): Promise<ClientesResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const usuarioEntry = Object.values(usuariosMock).find(
    (u) => u.usuario.id_usuario === id_usuario
  );

  if (!usuarioEntry) {
    return { success: false, clientes: [] };
  }

  const clientesFiltrados = clientesMock.filter(
    (c) => usuarioEntry.usuario.clientesAsignados.includes(c.id_cliente) && c.activa
  );

  return {
    success: true,
    clientes: clientesFiltrados,
  };
};
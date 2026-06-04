// src/services/apiClient.ts
import { USE_MOCK, API_BASE } from './config';

// Tipo para tus funciones mock
type MockFn<T> = () => T | Promise<T>;

interface ApiClientOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  mock?: MockFn<unknown>;
}

/**
 * Cliente universal: si USE_MOCK es true y hay mock, lo usa.
 * Si no, hace fetch real.
 */
export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  
  // 🟡 MODO MOCK: usa la función mock sin tocar la red
  if (USE_MOCK && options.mock) {
    // Simula delay de red para que se vea real
    await new Promise(r => setTimeout(r, 300));
    return options.mock() as T;
  }

  // 🔵 MODO REAL: fetch normal
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
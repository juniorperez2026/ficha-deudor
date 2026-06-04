import { apiClient } from '../apiClient';
import { mockDeudorHeader } from '../../data/mocks/deudorHeaderMock'; // adapta ruta
import type { DeudorInfo } from '../../types';

export async function fetchDeudorHeader(
  id_cliente: string,
  id_cartera: string
): Promise<DeudorInfo> {
  return apiClient<DeudorInfo>(
    `/deudor-header?id_cliente=${id_cliente}&id_cartera=${id_cartera}`,
    {
      mock: () => mockDeudorHeader[id_cliente] ?? mockDeudorHeader['default'],
    }
  );
}
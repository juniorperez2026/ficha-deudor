import { apiClient } from '../../../shared/api/apiClient';
import { mockDeudorHeader, mockCabeceraHeader} from '../mocks/mocks/deudorHeaderMock';
import type { CabeceraInfo, DeudorInfo } from '../../../shared/types';

export async function fetchCabeceraHeader(
  id_cliente: string,
  id_cartera: string,
  id_deudor: string
): Promise<CabeceraInfo> {
  return apiClient<CabeceraInfo>(
    `/cabecera-header?id_cliente=${id_cliente}&id_cartera=${id_cartera}&id_deudor=${id_deudor}`,
    {
      mock: () => mockCabeceraHeader[id_cliente] ?? mockCabeceraHeader['default'],
    }
  );
}

export async function fetchDeudorHeader(
  id_cliente: string,
  id_cartera: string,
  id_deudor: string
): Promise<DeudorInfo> {
  return apiClient<DeudorInfo>(
    `/deudor-header?id_cliente=${id_cliente}&id_cartera=${id_cartera}&id_deudor=${id_deudor}`,
    {
      mock: () => mockDeudorHeader[id_cliente] ?? mockDeudorHeader['default'],
    }
  );
}
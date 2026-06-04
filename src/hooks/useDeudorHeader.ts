import { useCallback } from 'react';
import { useApiResource } from './useApiResource';
import { fetchDeudorHeader } from '../services/modules/deudorHeaderApi';
import type { DeudorInfo } from '../types';

export function useDeudorHeader(id_cliente: string, id_cartera: string) {
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchDeudorHeader(id_cliente, id_cartera),
    [id_cliente, id_cartera]
  );

  return useApiResource<DeudorInfo>(fetcher, [id_cliente, id_cartera]);
}
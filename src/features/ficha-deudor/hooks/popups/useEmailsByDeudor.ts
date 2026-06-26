import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createEmail, fetchEmailById, fetchEmailsByDeudor, fetchEmailStatuses } from '../../api/popups/emailsApi';
import type { Email, EmailByIdApi, EmailFormData, EmailStatus } from '../../../../shared/types';
import { useClientSideTable, type TextFilters, type SelectedFilters } from '../../../../shared/hooks/useClientSideTable';
import { useApiResource } from '../../../../shared/hooks/useApiResource';

export type { TextFilters, SelectedFilters };

interface UseEmailsByDeudorReturn {
  allData: Email[];
  filteredData: Email[];
  paginatedData: Email[];
  isLoading: boolean;
  error: string | null;
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  setPageNumber: (page: number) => void;
  setPageSize: (size: number) => void;
  refetch: () => void;
  textFilters: TextFilters;
  selectedFilters: SelectedFilters;
  onTextFilterChange: (columnKey: string, value: string) => void;
  onSelectedFilterChange: (columnKey: string, values: string[]) => void;
  resetFilters: () => void;
}

export function useEmailsByDeudor(
  id_cliente: string,
  id_deudor: string
): UseEmailsByDeudorReturn {
  const [allData, setAllData] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoizar dependencias de reset para evitar referencias nuevas en cada render
  const resetDeps = useMemo(() => [id_cliente, id_deudor] as const, [id_cliente, id_deudor]);

  const table = useClientSideTable<Email>(
    allData,
    resetDeps,
    { initialPageSize: 10 }
  );

  // Flag para evitar setState si el componente se desmonta durante un refetch manual
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ─── Carga inicial ───
  useEffect(() => {
    if (!id_cliente || !id_deudor) {
      setAllData([]);
      setError('Faltan parámetros: id_cliente o id_deudor');
      return;
    }

    const controller = new AbortController();

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchEmailsByDeudor(
          id_cliente,
          id_deudor,
          controller.signal
        );
        if (controller.signal.aborted) return;
        setAllData(result);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Error cargando emails');
          setAllData([]);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadData();
    return () => controller.abort();
  }, [id_cliente, id_deudor]);

  // ─── Refetch manual ───
  const refetch = useCallback(() => {
    if (!id_cliente || !id_deudor) return;

    setIsLoading(true);
    setError(null);

    fetchEmailsByDeudor(id_cliente, id_deudor)
      .then((result) => {
        if (!isMountedRef.current) return;
        setAllData(result);
      })
      .catch((err) => {
        if (!isMountedRef.current) return;
        setError(err instanceof Error ? err.message : 'Error cargando emails');
        setAllData([]);
      })
      .finally(() => {
        if (!isMountedRef.current) return;
        setIsLoading(false);
      });
  }, [id_cliente, id_deudor]);

  return {
    allData,
    filteredData: table.filteredData,
    paginatedData: table.paginatedData,
    isLoading,
    error,
    pageNumber: table.pageNumber,
    pageSize: table.pageSize,
    totalRecords: table.totalRecords,
    totalPages: table.totalPages,
    setPageNumber: table.setPageNumber,
    setPageSize: table.setPageSize,
    refetch,
    textFilters: table.textFilters,
    selectedFilters: table.selectedFilters,
    onTextFilterChange: table.onTextFilterChange,
    onSelectedFilterChange: table.onSelectedFilterChange,
    resetFilters: table.resetFilters,
  };
}

// ─── GET: Status de email (catálogo) ───
export function useEmailStatuses() {
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchEmailStatuses(signal),
    []
  );

  return useApiResource<EmailStatus[]>(fetcher, []);
}

// ─── CREATE: Crear email ───
export function useCreateEmail(
  id_cliente: string,
  id_deudor: string,
  id_usuario: string
) {
  const create = useCallback(
    async (formData: EmailFormData) => {
      return createEmail(id_cliente, id_deudor, id_usuario, formData);
    },
    [id_cliente, id_deudor, id_usuario]
  );

  return { create };
}

// ─── GET por ID ───
export function useEmailById(idEmail: string | null) {
  const [data, setData] = useState<EmailByIdApi | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idEmail) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetchEmailById(idEmail, controller.signal)
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setData(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [idEmail]);

  return { data, isLoading, error };
}
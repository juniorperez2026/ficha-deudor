import { useState, useEffect, useCallback } from 'react';
import {
  fetchEstadosGestion,
  fetchEstadosGestionHistoricos,
} from '../api/estadosGestionApi';
import {
  useClientSideTable,
  type TextFilters,
  type SelectedFilters,
} from '../../../shared/hooks/useClientSideTable';
import type {
  EstadoGestion,
  EstadoGestionCompleta,
} from '../../../shared/types/indexApi';

export type { TextFilters, SelectedFilters };

export interface UseEstadosGestionReturn {
  allData: EstadoGestion[];
  filteredData: EstadoGestion[];
  paginatedData: EstadoGestion[];
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

  completo: EstadoGestionCompleta[];
  completoLoading: boolean;
  completoError: string | null;
  completoPageNumber: number;
  completoPageSize: number;
  completoTotalRecords: number;
  completoTotalPages: number;
  setCompletoPageNumber: (page: number) => void;
  setCompletoPageSize: (size: number) => void;
  refetchCompleto: () => void;
}

export function useEstadosGestion(
  id_cliente: string,
  id_cartera: string,
  id_deudor: string
): UseEstadosGestionReturn {
  const [allData, setAllData] = useState<EstadoGestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const table = useClientSideTable<EstadoGestion>(
    allData,
    [id_cliente, id_cartera, id_deudor],
    { initialPageSize: 10 }
  );

  const [completo, setCompleto] = useState<EstadoGestionCompleta[]>([]);
  const [completoLoading, setCompletoLoading] = useState(false);
  const [completoError, setCompletoError] = useState<string | null>(null);
  const [completoPageNumber, setCompletoPageNumberState] = useState(1);
  const [completoPageSize, setCompletoPageSizeState] = useState(50);

  useEffect(() => {
    if (!id_cliente || !id_cartera || !id_deudor) return;

    const controller = new AbortController();

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchEstadosGestion(
          id_cliente,
          id_cartera,
          id_deudor
        );

        if (controller.signal.aborted) return;

        setAllData(result.resumido);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Error cargando estados de gestión'
          );
          setAllData([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      controller.abort();
    };
  }, [id_cliente, id_cartera, id_deudor]);

  useEffect(() => {
    if (!id_cliente || !id_cartera || !id_deudor) return;

    const controller = new AbortController();

    const loadCompleto = async () => {
      setCompletoLoading(true);
      setCompletoError(null);

      try {
        const result = await fetchEstadosGestionHistoricos(
          id_cliente,
          id_cartera,
          id_deudor,
          completoPageNumber,
          completoPageSize
        );

        if (controller.signal.aborted) return;

        setCompleto(result.completo);
      } catch (err) {
        if (!controller.signal.aborted) {
          setCompletoError(
            err instanceof Error
              ? err.message
              : 'Error cargando estados de gestión históricos'
          );
          setCompleto([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCompletoLoading(false);
        }
      }
    };

    void loadCompleto();

    return () => {
      controller.abort();
    };
  }, [
    id_cliente,
    id_cartera,
    id_deudor,
    completoPageNumber,
    completoPageSize,
  ]);

  const setCompletoPageNumber = useCallback((page: number) => {
    setCompletoPageNumberState(page);
  }, []);

  const setCompletoPageSize = useCallback((size: number) => {
    setCompletoPageSizeState(size);
    setCompletoPageNumberState(1);
  }, []);

  const refetch = useCallback(() => {
    if (!id_cliente || !id_cartera || !id_deudor) return;

    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    fetchEstadosGestion(id_cliente, id_cartera, id_deudor)
      .then((result) => {
        if (controller.signal.aborted) return;

        setAllData(result.resumido);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Error cargando estados de gestión'
          );
          setAllData([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [id_cliente, id_cartera, id_deudor]);

  const refetchCompleto = useCallback(() => {
    if (!id_cliente || !id_cartera || !id_deudor) return;

    const controller = new AbortController();

    setCompletoLoading(true);
    setCompletoError(null);

    fetchEstadosGestionHistoricos(
      id_cliente,
      id_cartera,
      id_deudor,
      completoPageNumber,
      completoPageSize
    )
      .then((result) => {
        if (controller.signal.aborted) return;

        setCompleto(result.completo);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setCompletoError(
            err instanceof Error
              ? err.message
              : 'Error cargando estados de gestión históricos'
          );
          setCompleto([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCompletoLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [
    id_cliente,
    id_cartera,
    id_deudor,
    completoPageNumber,
    completoPageSize,
  ]);

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

    completo,
    completoLoading,
    completoError,
    completoPageNumber,
    completoPageSize,
    completoTotalRecords: completo.length,
    completoTotalPages: Math.max(
      1,
      Math.ceil(completo.length / completoPageSize)
    ),
    setCompletoPageNumber,
    setCompletoPageSize,
    refetchCompleto,
  };
}
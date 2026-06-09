import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchEstadosGestion } from '../api/estadosGestionApi';
import type { EstadoGestion, EstadoGestionCompleta } from '../../../shared/types';

export interface TextFilters {
  [columnKey: string]: string;
}

export interface SelectedFilters {
  [columnKey: string]: string[];
}

interface UseEstadosGestionReturn {
  allData: EstadoGestion[];
  filteredData: EstadoGestion[];
  paginatedData: EstadoGestion[];
  completo: EstadoGestionCompleta[];
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
}

export function useEstadosGestion(
  id_cliente: string,
  id_cartera: string,
  id_deudor: string
): UseEstadosGestionReturn {
  const [allData, setAllData] = useState<EstadoGestion[]>([]);
  const [completo, setCompleto] = useState<EstadoGestionCompleta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [textFilters, setTextFilters] = useState<TextFilters>({});
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});

  // ─── Efecto: Cargar estados de gestión resumidos ───
  useEffect(() => {
    if (!id_cliente || !id_cartera || !id_deudor) return;

    const controller = new AbortController();

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchEstadosGestion(id_cliente, id_cartera, id_deudor);
        if (controller.signal.aborted) return;
        setAllData(result.resumido);
        setCompleto(result.completo);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Error cargando estados de gestión');
          setAllData([]);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadData();
    return () => controller.abort();
  }, [id_cliente, id_cartera, id_deudor]);

  // ─── Resetear página y filtros cuando cambian IDs ───
  useEffect(() => {
    setPageNumber(1);
    setTextFilters({});
    setSelectedFilters({});
  }, [id_cliente, id_cartera, id_deudor]);

  // Resetear página cuando cambia pageSize
  useEffect(() => {
    setPageNumber(1);
  }, [pageSize]);

  // ─── Filtros client-side ───
  const filteredData = useMemo(() => {
    return allData.filter((row) => {
      for (const [columnKey, filterText] of Object.entries(textFilters)) {
        if (!filterText) continue;
        const cellValue = String(row[columnKey as keyof EstadoGestion] ?? '').toLowerCase();
        if (!cellValue.includes(filterText.toLowerCase())) return false;
      }

      for (const [columnKey, selectedValues] of Object.entries(selectedFilters)) {
        if (!selectedValues || selectedValues.length === 0) continue;
        const cellValue = String(row[columnKey as keyof EstadoGestion] ?? '');
        if (!selectedValues.includes(cellValue)) return false;
      }

      return true;
    });
  }, [allData, textFilters, selectedFilters]);

  // ─── Paginación client-side ───
  const totalRecords = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const indiceInicio = (pageNumber - 1) * pageSize;
  const indiceFin = Math.min(indiceInicio + pageSize, totalRecords);
  const paginatedData = filteredData.slice(indiceInicio, indiceFin);

  // ─── Refetch ───
  const refetch = useCallback(() => {
    if (!id_cliente || !id_cartera || !id_deudor) return;
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetchEstadosGestion(id_cliente, id_cartera, id_deudor)
      .then((result) => {
        if (controller.signal.aborted) return;
        setAllData(result.resumido);
        setCompleto(result.completo);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Error cargando estados de gestión');
          setAllData([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [id_cliente, id_cartera, id_deudor]);

  // ─── Handlers de filtros ───
  const onTextFilterChange = useCallback((columnKey: string, value: string) => {
    setTextFilters((prev) => ({ ...prev, [columnKey]: value }));
    setPageNumber(1);
  }, []);

  const onSelectedFilterChange = useCallback((columnKey: string, values: string[]) => {
    setSelectedFilters((prev) => ({ ...prev, [columnKey]: values }));
    setPageNumber(1);
  }, []);

  return {
    allData,
    filteredData,
    paginatedData,
    completo,
    isLoading,
    error,
    pageNumber,
    pageSize,
    totalRecords,
    totalPages,
    setPageNumber,
    setPageSize,
    refetch,
    textFilters,
    selectedFilters,
    onTextFilterChange,
    onSelectedFilterChange,
  };
}
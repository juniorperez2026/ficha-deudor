import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchGestionesRealizadas, fetchGestionesHistoricas } from '../api/gestionesRealizadasApi';
import type { GestionRealizada, GestionCompleta } from '../../../shared/types';

export interface TextFilters {
  [columnKey: string]: string;
}

export interface SelectedFilters {
  [columnKey: string]: string[];
}

interface UseGestionesRealizadasReturn {
  // ─── Resumido ───
  allData: GestionRealizada[];
  filteredData: GestionRealizada[];
  paginatedData: GestionRealizada[];
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
  setResumido: React.Dispatch<React.SetStateAction<GestionRealizada[]>>;

  // ─── Expandido / Completo ───
  completo: GestionCompleta[];
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

export function useGestionesRealizadas(
  id_cliente: string,
  id_cartera: string,
  id_deudor: string,
  id_usuario: string
): UseGestionesRealizadasReturn {
  // ═══════════════════════════════════════
  // ESTADO: Resumido
  // ═══════════════════════════════════════
  const [allData, setAllData] = useState<GestionRealizada[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [textFilters, setTextFilters] = useState<TextFilters>({});
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});

  // ═══════════════════════════════════════
  // ESTADO: Expandido / Completo
  // ═══════════════════════════════════════
  const [completo, setCompleto] = useState<GestionCompleta[]>([]);
  const [completoLoading, setCompletoLoading] = useState(false);
  const [completoError, setCompletoError] = useState<string | null>(null);
  const [completoPageNumber, setCompletoPageNumber] = useState(1);
  const [completoPageSize, setCompletoPageSize] = useState(50);

  // ═══════════════════════════════════════
  // EFECTO: Cargar gestiones resumidas
  // ═══════════════════════════════════════
  useEffect(() => {
    if (!id_cliente || !id_cartera || !id_deudor || !id_usuario) return;

    const controller = new AbortController();

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchGestionesRealizadas(id_cliente, id_cartera, id_deudor, id_usuario);
        if (controller.signal.aborted) return;
        setAllData(result.resumido);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Error cargando gestiones');
          setAllData([]);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadData();
    return () => controller.abort();
  }, [id_cliente, id_cartera, id_deudor, id_usuario]);

  // ═══════════════════════════════════════
  // EFECTO: Cargar gestiones históricas (completo)
  // ═══════════════════════════════════════
  useEffect(() => {
    if (!id_cliente || !id_cartera || !id_deudor) return;

    const controller = new AbortController();

    const loadCompleto = async () => {
      setCompletoLoading(true);
      setCompletoError(null);
      try {
        const result = await fetchGestionesHistoricas(
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
          setCompletoError(err instanceof Error ? err.message : 'Error cargando gestiones históricas');
          setCompleto([]);
        }
      } finally {
        if (!controller.signal.aborted) setCompletoLoading(false);
      }
    };

    loadCompleto();
    return () => controller.abort();
  }, [id_cliente, id_cartera, id_deudor, completoPageNumber, completoPageSize]);

  // ═══════════════════════════════════════
  // Resetear página y filtros cuando cambian IDs
  // ═══════════════════════════════════════
  useEffect(() => {
    setPageNumber(1);
    setCompletoPageNumber(1);
    setTextFilters({});
    setSelectedFilters({});
  }, [id_cliente, id_cartera, id_deudor, id_usuario]);

  // Resetear página cuando cambia pageSize
  useEffect(() => {
    setPageNumber(1);
  }, [pageSize]);

  useEffect(() => {
    setCompletoPageNumber(1);
  }, [completoPageSize]);

  // ═══════════════════════════════════════
  // Filtros client-side (solo resumido)
  // ═══════════════════════════════════════
  const filteredData = useMemo(() => {
    return allData.filter((row) => {
      for (const [columnKey, filterText] of Object.entries(textFilters)) {
        if (!filterText) continue;
        const cellValue = String(row[columnKey as keyof GestionRealizada] ?? '').toLowerCase();
        if (!cellValue.includes(filterText.toLowerCase())) return false;
      }

      for (const [columnKey, selectedValues] of Object.entries(selectedFilters)) {
        if (!selectedValues || selectedValues.length === 0) continue;
        const cellValue = String(row[columnKey as keyof GestionRealizada] ?? '');
        if (!selectedValues.includes(cellValue)) return false;
      }

      return true;
    });
  }, [allData, textFilters, selectedFilters]);

  // ═══════════════════════════════════════
  // Paginación client-side (solo resumido)
  // ═══════════════════════════════════════
  const totalRecords = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const indiceInicio = (pageNumber - 1) * pageSize;
  const indiceFin = Math.min(indiceInicio + pageSize, totalRecords);
  const paginatedData = filteredData.slice(indiceInicio, indiceFin);

  // ═══════════════════════════════════════
  // Refetch Resumido
  // ═══════════════════════════════════════
  const refetch = useCallback(() => {
    if (!id_cliente || !id_cartera || !id_deudor || !id_usuario) return;
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetchGestionesRealizadas(id_cliente, id_cartera, id_deudor, id_usuario)
      .then((result) => {
        if (controller.signal.aborted) return;
        setAllData(result.resumido);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Error cargando gestiones');
          setAllData([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [id_cliente, id_cartera, id_deudor, id_usuario]);

  // ═══════════════════════════════════════
  // Refetch Completo
  // ═══════════════════════════════════════
  const refetchCompleto = useCallback(() => {
    if (!id_cliente || !id_cartera || !id_deudor) return;
    const controller = new AbortController();
    setCompletoLoading(true);
    setCompletoError(null);

    fetchGestionesHistoricas(id_cliente, id_cartera, id_deudor, completoPageNumber, completoPageSize)
      .then((result) => {
        if (controller.signal.aborted) return;
        setCompleto(result.completo);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setCompletoError(err instanceof Error ? err.message : 'Error cargando gestiones históricas');
          setCompleto([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCompletoLoading(false);
      });

    return () => controller.abort();
  }, [id_cliente, id_cartera, id_deudor, completoPageNumber, completoPageSize]);

  // ═══════════════════════════════════════
  // Handlers de filtros (solo resumido)
  // ═══════════════════════════════════════
  const onTextFilterChange = useCallback((columnKey: string, value: string) => {
    setTextFilters((prev) => ({ ...prev, [columnKey]: value }));
    setPageNumber(1);
  }, []);

  const onSelectedFilterChange = useCallback((columnKey: string, values: string[]) => {
    setSelectedFilters((prev) => ({ ...prev, [columnKey]: values }));
    setPageNumber(1);
  }, []);

  const setResumido = useCallback((updater: React.SetStateAction<GestionRealizada[]>) => {
    setAllData(updater);
  }, []);

  return {
    // Resumido
    allData,
    filteredData,
    paginatedData,
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
    setResumido,

    // Expandido / Completo
    completo,
    completoLoading,
    completoError,
    completoPageNumber,
    completoPageSize,
    completoTotalRecords: completo.length, // La API ya pagina, usamos el total de la respuesta si lo expones
    completoTotalPages: Math.max(1, Math.ceil(completo.length / completoPageSize)),
    setCompletoPageNumber,
    setCompletoPageSize,
    refetchCompleto,
  };
}
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  fetchDireccionesReferenciadas,
  createDireccion,
  updateDireccion,
  fetchDepartamentos,
  fetchProvincias,
  fetchDistritos,
  fetchDireccionUbicaciones,
  fetchDireccionById,
} from '../api/direccionesReferenciadasApi';
import type { DireccionReferenciada, DireccionFormData, DireccionEditFormData, Departamento, Provincia, Distrito, DireccionUbicacion, DireccionByIdApi } from '../../../shared/types';
import { useApiResource } from '../../../shared/hooks/useApiResource';
import { useClientSideTable, type TextFilters, type SelectedFilters } from '../../../shared/hooks/useClientSideTable';

export type { TextFilters, SelectedFilters };

interface UseDireccionesReferenciadasReturn {
  allData: DireccionReferenciada[];
  filteredData: DireccionReferenciada[];
  paginatedData: DireccionReferenciada[];
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
  create: (formData: DireccionFormData) => Promise<void>;
  update: (id: string, formData: DireccionEditFormData) => Promise<void>;
}

export function useDireccionesReferenciadas(
  id_cliente: string,
  id_deudor: string,
  id_usuario: string
): UseDireccionesReferenciadasReturn {
  const [allData, setAllData] = useState<DireccionReferenciada[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoizar dependencias de reset para evitar referencias nuevas en cada render
  const resetDeps = useMemo(() => [id_cliente, id_deudor] as const, [id_cliente, id_deudor]);

  const table = useClientSideTable<DireccionReferenciada>(
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

  // ─── Efecto: Cargar todos los registros ───
  useEffect(() => {
    if (!id_cliente || !id_deudor) return;

    const controller = new AbortController();

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchDireccionesReferenciadas(id_cliente, id_deudor);
        if (controller.signal.aborted) return;
        setAllData(result);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Error cargando direcciones');
          setAllData([]);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadData();
    return () => controller.abort();
  }, [id_cliente, id_deudor]);

  // ─── Refetch ───
  const refetch = useCallback(() => {
    if (!id_cliente || !id_deudor) return;

    setIsLoading(true);
    setError(null);

    fetchDireccionesReferenciadas(id_cliente, id_deudor)
      .then((result) => {
        if (!isMountedRef.current) return;
        setAllData(result);
      })
      .catch((err) => {
        if (!isMountedRef.current) return;
        setError(err instanceof Error ? err.message : 'Error cargando direcciones');
        setAllData([]);
      })
      .finally(() => {
        if (!isMountedRef.current) return;
        setIsLoading(false);
      });
  }, [id_cliente, id_deudor]);

  // ─── CREATE ───
  const create = useCallback(
    async (formData: DireccionFormData) => {
      try {
        await createDireccion(id_cliente, id_deudor, id_usuario, formData);
        await refetch();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error al crear dirección';
        setError(msg);
        throw err;
      }
    },
    [id_cliente, id_deudor, id_usuario, refetch]
  );

  // ─── UPDATE ───
  const update = useCallback(
    async (id: string, formData: DireccionEditFormData) => {
      try {
        await updateDireccion(id_cliente, id_deudor, id_usuario, id, formData);
        await refetch();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error al actualizar dirección';
        setError(msg);
        throw err;
      }
    },
    [id_cliente, id_deudor, id_usuario, refetch]
  );

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
    create,
    update,
  };
}

// ─── GET por ID ───
export function useDireccionById(idDireccion: string | null) {
  const [data, setData] = useState<DireccionByIdApi | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idDireccion) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetchDireccionById(idDireccion, controller.signal)
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
  }, [idDireccion]);

  return { data, isLoading, error };
}

export function useDepartamentos() {
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchDepartamentos(signal),
    []
  );

  return useApiResource<Departamento[]>(fetcher, []);
}

export function useProvincias(idDepartamento: string | null) {
  const fetcher = useCallback(
    (signal: AbortSignal) => {
      if (!idDepartamento) {
        return Promise.resolve([] as Provincia[]);
      }
      return fetchProvincias(idDepartamento, signal);
    },
    [idDepartamento]
  );

  return useApiResource<Provincia[]>(fetcher, [idDepartamento]);
}

export function useDistritos(
  idDepartamento: string | null,
  idProvincia: string | null
) {
  const fetcher = useCallback(
    (signal: AbortSignal) => {
      if (!idDepartamento || !idProvincia) {
        return Promise.resolve([] as Distrito[]);
      }
      return fetchDistritos(idDepartamento, idProvincia, signal);
    },
    [idDepartamento, idProvincia]
  );

  return useApiResource<Distrito[]>(fetcher, [idDepartamento, idProvincia]);
}

export function useDireccionUbicaciones() {
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchDireccionUbicaciones(signal),
    []
  );

  return useApiResource<DireccionUbicacion[]>(fetcher, []);
}
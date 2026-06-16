import { useState, useEffect, useMemo, useCallback } from 'react';
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

export interface TextFilters {
  [columnKey: string]: string;
}

export interface SelectedFilters {
  [columnKey: string]: string[];
}

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

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [textFilters, setTextFilters] = useState<TextFilters>({});
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});

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

  // ─── Resetear página y filtros cuando cambian IDs ───
  useEffect(() => {
    setPageNumber(1);
    setTextFilters({});
    setSelectedFilters({});
  }, [id_cliente, id_deudor]);

  // Resetear página cuando cambia pageSize
  useEffect(() => {
    setPageNumber(1);
  }, [pageSize]);

  // ─── Filtros client-side ───
  const filteredData = useMemo(() => {
    return allData.filter((row) => {
      for (const [columnKey, filterText] of Object.entries(textFilters)) {
        if (!filterText) continue;
        const cellValue = String(row[columnKey as keyof DireccionReferenciada] ?? '').toLowerCase();
        if (!cellValue.includes(filterText.toLowerCase())) return false;
      }

      for (const [columnKey, selectedValues] of Object.entries(selectedFilters)) {
        if (!selectedValues || selectedValues.length === 0) continue;
        const cellValue = String(row[columnKey as keyof DireccionReferenciada] ?? '');
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
    if (!id_cliente || !id_deudor) return;
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetchDireccionesReferenciadas(id_cliente, id_deudor)
      .then((result) => {
        if (controller.signal.aborted) return;
        setAllData(result);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Error cargando direcciones');
          setAllData([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [id_cliente, id_deudor]);

  // ─── Handlers de filtros ───
  const onTextFilterChange = useCallback((columnKey: string, value: string) => {
    setTextFilters((prev) => ({ ...prev, [columnKey]: value }));
    setPageNumber(1);
  }, []);

  const onSelectedFilterChange = useCallback((columnKey: string, values: string[]) => {
    setSelectedFilters((prev) => ({ ...prev, [columnKey]: values }));
    setPageNumber(1);
  }, []);

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
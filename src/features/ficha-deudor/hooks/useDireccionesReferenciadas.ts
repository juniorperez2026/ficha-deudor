import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useReducer,
} from 'react';
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
import type {
  DireccionReferenciada,
  DireccionFormData,
  DireccionEditFormData,
  Departamento,
  Provincia,
  Distrito,
  DireccionUbicacion,
  DireccionByIdApi,
} from '../../../shared/types';
import { useApiResource } from '../../../shared/hooks/useApiResource';
import {
  useClientSideTable,
  type TextFilters,
  type SelectedFilters,
} from '../../../shared/hooks/useClientSideTable';

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

interface DireccionByIdState {
  data: DireccionByIdApi | null;
  isLoading: boolean;
  error: string | null;
}

type DireccionByIdAction =
  | { type: 'RESET' }
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; data: DireccionByIdApi }
  | { type: 'LOAD_ERROR'; error: string };

const direccionByIdInitialState: DireccionByIdState = {
  data: null,
  isLoading: false,
  error: null,
};

function direccionByIdReducer(
  state: DireccionByIdState,
  action: DireccionByIdAction
): DireccionByIdState {
  switch (action.type) {
    case 'RESET':
      return direccionByIdInitialState;

    case 'LOAD_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOAD_SUCCESS':
      return {
        data: action.data,
        isLoading: false,
        error: null,
      };

    case 'LOAD_ERROR':
      return {
        data: null,
        isLoading: false,
        error: action.error,
      };

    default:
      return state;
  }
}

export function useDireccionesReferenciadas(
  id_cliente: string,
  id_deudor: string,
  id_usuario: string
): UseDireccionesReferenciadasReturn {
  const [allData, setAllData] = useState<DireccionReferenciada[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetDeps = useMemo(
    () => [id_cliente, id_deudor] as const,
    [id_cliente, id_deudor]
  );

  const table = useClientSideTable<DireccionReferenciada>(
    allData,
    resetDeps,
    { initialPageSize: 10 }
  );

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!id_cliente || !id_deudor) return;

    const controller = new AbortController();

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchDireccionesReferenciadas(
          id_cliente,
          id_deudor
        );

        if (controller.signal.aborted) return;

        setAllData(result);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : 'Error cargando direcciones'
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
  }, [id_cliente, id_deudor]);

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

        setError(
          err instanceof Error ? err.message : 'Error cargando direcciones'
        );
        setAllData([]);
      })
      .finally(() => {
        if (!isMountedRef.current) return;

        setIsLoading(false);
      });
  }, [id_cliente, id_deudor]);

  const create = useCallback(
    async (formData: DireccionFormData) => {
      try {
        await createDireccion(id_cliente, id_deudor, id_usuario, formData);
        await refetch();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Error al crear dirección';

        setError(msg);
        throw err;
      }
    },
    [id_cliente, id_deudor, id_usuario, refetch]
  );

  const update = useCallback(
    async (id: string, formData: DireccionEditFormData) => {
      try {
        await updateDireccion(id_cliente, id_deudor, id_usuario, id, formData);
        await refetch();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Error al actualizar dirección';

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

export function useDireccionById(idDireccion: string | null) {
  const [state, dispatch] = useReducer(
    direccionByIdReducer,
    direccionByIdInitialState
  );

  useEffect(() => {
    if (!idDireccion) {
      dispatch({ type: 'RESET' });
      return;
    }

    const controller = new AbortController();

    dispatch({ type: 'LOAD_START' });

    fetchDireccionById(idDireccion, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;

        dispatch({
          type: 'LOAD_SUCCESS',
          data,
        });
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        const message =
          err instanceof Error ? err.message : 'Error cargando dirección';

        dispatch({
          type: 'LOAD_ERROR',
          error: message,
        });
      });

    return () => {
      controller.abort();
    };
  }, [idDireccion]);

  return state;
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
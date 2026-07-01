import { useState, useEffect, useCallback, useReducer } from 'react';
import {
  fetchTelefonosReferenciados,
  fetchTelefonoResultados,
  createTelefono,
  updateTelefono,
  fetchTelefonoOperadores,
  fetchTelefonoUbicaciones,
  fetchTelefonoHorarioGestion,
  fetchTelefonoFuenteBusqueda,
  fetchTelefonoById,
} from '../api/telefonosReferenciadosApi';
import {
  useClientSideTable,
  type TextFilters,
  type SelectedFilters,
} from '../../../shared/hooks/useClientSideTable';
import type {
  TelefonoReferenciado,
  TelefonoFormData,
  TelefonoList,
  TelefonoEditarApi,
} from '../../../shared/types';
import { useApiResource } from '../../../shared/hooks/useApiResource';

export type { TextFilters, SelectedFilters };

export interface UseTelefonosReferenciadosReturn {
  allData: TelefonoReferenciado[];
  filteredData: TelefonoReferenciado[];
  paginatedData: TelefonoReferenciado[];
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
  create: (formData: TelefonoFormData) => Promise<void>;
  update: (id: number, formData: TelefonoFormData) => Promise<void>;
}

interface TelefonoByIdState {
  data: TelefonoEditarApi | null;
  isLoading: boolean;
  error: string | null;
}

type TelefonoByIdAction =
  | { type: 'RESET' }
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; data: TelefonoEditarApi }
  | { type: 'LOAD_ERROR'; error: string };

const telefonoByIdInitialState: TelefonoByIdState = {
  data: null,
  isLoading: false,
  error: null,
};

function telefonoByIdReducer(
  state: TelefonoByIdState,
  action: TelefonoByIdAction
): TelefonoByIdState {
  switch (action.type) {
    case 'RESET':
      return telefonoByIdInitialState;

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

export function useTelefonosReferenciados(
  id_cliente: string,
  id_deudor: string,
  id_usuario: string
): UseTelefonosReferenciadosReturn {
  const [allData, setAllData] = useState<TelefonoReferenciado[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const table = useClientSideTable<TelefonoReferenciado>(
    allData,
    [id_cliente, id_deudor],
    { initialPageSize: 10 }
  );

  useEffect(() => {
    if (!id_cliente || !id_deudor) return;

    const controller = new AbortController();

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchTelefonosReferenciados(
          id_cliente,
          id_deudor
        );

        if (controller.signal.aborted) return;

        setAllData(result);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : 'Error cargando teléfonos'
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

    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    fetchTelefonosReferenciados(id_cliente, id_deudor)
      .then((result) => {
        if (controller.signal.aborted) return;

        setAllData(result);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : 'Error cargando teléfonos'
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
  }, [id_cliente, id_deudor]);

  const create = useCallback(
    async (formData: TelefonoFormData) => {
      try {
        await createTelefono(id_cliente, id_deudor, id_usuario, formData);
        await refetch();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Error al crear teléfono';

        setError(msg);
        throw err;
      }
    },
    [id_cliente, id_deudor, id_usuario, refetch]
  );

  const update = useCallback(
    async (id: number, formData: TelefonoFormData) => {
      try {
        await updateTelefono(id_cliente, id_deudor, id_usuario, id, formData);
        await refetch();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Error al actualizar teléfono';

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
    create,
    update,
  };
}

export function useTelefonoById(idTelefono: number | null) {
  const [state, dispatch] = useReducer(
    telefonoByIdReducer,
    telefonoByIdInitialState
  );

  useEffect(() => {
    if (!idTelefono) {
      dispatch({ type: 'RESET' });
      return;
    }

    const controller = new AbortController();

    dispatch({ type: 'LOAD_START' });

    fetchTelefonoById(idTelefono, controller.signal)
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
          err instanceof Error ? err.message : 'Error cargando teléfono';

        dispatch({
          type: 'LOAD_ERROR',
          error: message,
        });
      });

    return () => {
      controller.abort();
    };
  }, [idTelefono]);

  return state;
}

export function useTelefonoResultados() {
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchTelefonoResultados(signal),
    []
  );

  return useApiResource<TelefonoList[]>(fetcher, []);
}

export function useTelefonoOperadores() {
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchTelefonoOperadores(signal),
    []
  );

  return useApiResource<TelefonoList[]>(fetcher, []);
}

export function useTelefonoUbicaciones() {
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchTelefonoUbicaciones(signal),
    []
  );

  return useApiResource<TelefonoList[]>(fetcher, []);
}

export function useTelefonoHorarioGestion() {
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchTelefonoHorarioGestion(signal),
    []
  );

  return useApiResource<TelefonoList[]>(fetcher, []);
}

export function useTelefonoFuenteBusqueda() {
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchTelefonoFuenteBusqueda(signal),
    []
  );

  return useApiResource<TelefonoList[]>(fetcher, []);
}
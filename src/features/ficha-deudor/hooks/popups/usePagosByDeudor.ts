import {
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useReducer,
} from 'react';
import { fetchPagosByDeudor } from '../../api/popups/pagosApi';
import type { Pago } from '../../../../shared/types';
import {
  useClientSideTable,
  type TextFilters,
  type SelectedFilters,
} from '../../../../shared/hooks/useClientSideTable';

export type { TextFilters, SelectedFilters };

interface UsePagosByDeudorReturn {
  allData: Pago[];
  filteredData: Pago[];
  paginatedData: Pago[];
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

interface PagosState {
  allData: Pago[];
  isLoading: boolean;
  error: string | null;
}

type PagosAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; data: Pago[] }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'RESET_WITH_ERROR'; error: string };

const initialState: PagosState = {
  allData: [],
  isLoading: false,
  error: null,
};

function pagosReducer(state: PagosState, action: PagosAction): PagosState {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOAD_SUCCESS':
      return {
        allData: action.data,
        isLoading: false,
        error: null,
      };

    case 'LOAD_ERROR':
    case 'RESET_WITH_ERROR':
      return {
        allData: [],
        isLoading: false,
        error: action.error,
      };

    default:
      return state;
  }
}

export function usePagosByDeudor(
  id_cliente: string,
  id_cartera: string,
  id_deudor: string
): UsePagosByDeudorReturn {
  const [state, dispatch] = useReducer(pagosReducer, initialState);
  const { allData, isLoading, error } = state;

  const resetDeps = useMemo(
    () => [id_cliente, id_cartera, id_deudor] as const,
    [id_cliente, id_cartera, id_deudor]
  );

  const table = useClientSideTable<Pago>(allData, resetDeps, {
    initialPageSize: 10,
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!id_cliente || !id_cartera || !id_deudor) {
      dispatch({
        type: 'RESET_WITH_ERROR',
        error: 'Faltan parámetros requeridos',
      });
      return;
    }

    const controller = new AbortController();

    const loadData = async () => {
      dispatch({
        type: 'LOAD_START',
      });

      try {
        const result = await fetchPagosByDeudor(
          id_cliente,
          id_cartera,
          id_deudor,
          controller.signal
        );

        if (controller.signal.aborted) return;

        dispatch({
          type: 'LOAD_SUCCESS',
          data: result,
        });
      } catch (err) {
        if (!controller.signal.aborted) {
          dispatch({
            type: 'LOAD_ERROR',
            error: err instanceof Error ? err.message : 'Error cargando pagos',
          });
        }
      }
    };

    void loadData();

    return () => {
      controller.abort();
    };
  }, [id_cliente, id_cartera, id_deudor]);

  const refetch = useCallback(() => {
    if (!id_cliente || !id_cartera || !id_deudor) return;

    dispatch({
      type: 'LOAD_START',
    });

    fetchPagosByDeudor(id_cliente, id_cartera, id_deudor)
      .then((result) => {
        if (!isMountedRef.current) return;

        dispatch({
          type: 'LOAD_SUCCESS',
          data: result,
        });
      })
      .catch((err) => {
        if (!isMountedRef.current) return;

        dispatch({
          type: 'LOAD_ERROR',
          error: err instanceof Error ? err.message : 'Error cargando pagos',
        });
      });
  }, [id_cliente, id_cartera, id_deudor]);

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
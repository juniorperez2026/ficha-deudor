import {
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useReducer,
} from 'react';
import {
  createEmail,
  fetchEmailById,
  fetchEmailsByDeudor,
  fetchEmailStatuses,
} from '../../api/popups/emailsApi';
import type {
  Email,
  EmailByIdApi,
  EmailFormData,
  EmailStatus,
} from '../../../../shared/types';
import {
  useClientSideTable,
  type TextFilters,
  type SelectedFilters,
} from '../../../../shared/hooks/useClientSideTable';
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

interface EmailsState {
  allData: Email[];
  isLoading: boolean;
  error: string | null;
}

type EmailsAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; data: Email[] }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'RESET_WITH_ERROR'; error: string };

const emailsInitialState: EmailsState = {
  allData: [],
  isLoading: false,
  error: null,
};

function emailsReducer(state: EmailsState, action: EmailsAction): EmailsState {
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

interface EmailByIdState {
  data: EmailByIdApi | null;
  isLoading: boolean;
  error: string | null;
}

type EmailByIdAction =
  | { type: 'RESET' }
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; data: EmailByIdApi }
  | { type: 'LOAD_ERROR'; error: string };

const emailByIdInitialState: EmailByIdState = {
  data: null,
  isLoading: false,
  error: null,
};

function emailByIdReducer(
  state: EmailByIdState,
  action: EmailByIdAction
): EmailByIdState {
  switch (action.type) {
    case 'RESET':
      return emailByIdInitialState;

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

export function useEmailsByDeudor(
  id_cliente: string,
  id_deudor: string
): UseEmailsByDeudorReturn {
  const [state, dispatch] = useReducer(emailsReducer, emailsInitialState);
  const { allData, isLoading, error } = state;

  const resetDeps = useMemo(
    () => [id_cliente, id_deudor] as const,
    [id_cliente, id_deudor]
  );

  const table = useClientSideTable<Email>(allData, resetDeps, {
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
    if (!id_cliente || !id_deudor) {
      dispatch({
        type: 'RESET_WITH_ERROR',
        error: 'Faltan parámetros: id_cliente o id_deudor',
      });
      return;
    }

    const controller = new AbortController();

    const loadData = async () => {
      dispatch({
        type: 'LOAD_START',
      });

      try {
        const result = await fetchEmailsByDeudor(
          id_cliente,
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
            error: err instanceof Error ? err.message : 'Error cargando emails',
          });
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

    dispatch({
      type: 'LOAD_START',
    });

    fetchEmailsByDeudor(id_cliente, id_deudor)
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
          error: err instanceof Error ? err.message : 'Error cargando emails',
        });
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

export function useEmailStatuses() {
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchEmailStatuses(signal),
    []
  );

  return useApiResource<EmailStatus[]>(fetcher, []);
}

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

export function useEmailById(idEmail: string | null) {
  const [state, dispatch] = useReducer(
    emailByIdReducer,
    emailByIdInitialState
  );

  useEffect(() => {
    if (!idEmail) {
      dispatch({
        type: 'RESET',
      });
      return;
    }

    const controller = new AbortController();

    dispatch({
      type: 'LOAD_START',
    });

    fetchEmailById(idEmail, controller.signal)
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

        dispatch({
          type: 'LOAD_ERROR',
          error: err instanceof Error ? err.message : 'Error cargando email',
        });
      });

    return () => {
      controller.abort();
    };
  }, [idEmail]);

  return state;
}
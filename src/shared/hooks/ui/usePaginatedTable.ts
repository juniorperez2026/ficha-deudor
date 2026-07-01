import {
  useMemo,
  useEffect,
  useCallback,
  useReducer,
  type DependencyList,
  type Dispatch,
  type SetStateAction,
} from 'react';

export interface UsePaginatedTableOptions<T> {
  data: T[];
  defaultPageSize?: number;
  resetDeps?: DependencyList;
}

export interface UsePaginatedTableResult<T> {
  paginaActual: number;
  setPaginaActual: Dispatch<SetStateAction<number>>;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  totalPaginas: number;
  indiceInicio: number;
  indiceFin: number;
  datosPaginados: T[];
  datosFiltrados: T[];

  textFilters: Record<string, string>;
  selectedFilters: Record<string, string[]>;
  setTextFilters: Dispatch<SetStateAction<Record<string, string>>>;
  setSelectedFilters: Dispatch<SetStateAction<Record<string, string[]>>>;
  onTextFilterChange: (colKey: string, text: string) => void;
  onSelectedFilterChange: (colKey: string, selected: string[]) => void;

  resetAll: () => void;
}

interface PaginatedTableState {
  paginaActual: number;
  pageSize: number;
  textFilters: Record<string, string>;
  selectedFilters: Record<string, string[]>;
}

type PaginatedTableAction =
  | { type: 'SET_PAGINA_ACTUAL'; value: SetStateAction<number> }
  | { type: 'SET_PAGE_SIZE'; value: SetStateAction<number> }
  | {
      type: 'SET_TEXT_FILTERS';
      value: SetStateAction<Record<string, string>>;
    }
  | {
      type: 'SET_SELECTED_FILTERS';
      value: SetStateAction<Record<string, string[]>>;
    }
  | { type: 'SET_TEXT_FILTER'; colKey: string; text: string }
  | { type: 'SET_SELECTED_FILTER'; colKey: string; selected: string[] }
  | { type: 'RESET_ALL'; defaultPageSize: number };

function createInitialState(defaultPageSize: number): PaginatedTableState {
  return {
    paginaActual: 1,
    pageSize: defaultPageSize,
    textFilters: {},
    selectedFilters: {},
  };
}

function resolveStateAction<TValue>(
  value: SetStateAction<TValue>,
  previousValue: TValue
): TValue {
  if (typeof value === 'function') {
    return (value as (prev: TValue) => TValue)(previousValue);
  }

  return value;
}

function paginatedTableReducer(
  state: PaginatedTableState,
  action: PaginatedTableAction
): PaginatedTableState {
  switch (action.type) {
    case 'SET_PAGINA_ACTUAL':
      return {
        ...state,
        paginaActual: resolveStateAction(action.value, state.paginaActual),
      };

    case 'SET_PAGE_SIZE':
      return {
        ...state,
        paginaActual: 1,
        pageSize: resolveStateAction(action.value, state.pageSize),
      };

    case 'SET_TEXT_FILTERS':
      return {
        ...state,
        paginaActual: 1,
        textFilters: resolveStateAction(action.value, state.textFilters),
      };

    case 'SET_SELECTED_FILTERS':
      return {
        ...state,
        paginaActual: 1,
        selectedFilters: resolveStateAction(
          action.value,
          state.selectedFilters
        ),
      };

    case 'SET_TEXT_FILTER':
      return {
        ...state,
        paginaActual: 1,
        textFilters: {
          ...state.textFilters,
          [action.colKey]: action.text,
        },
      };

    case 'SET_SELECTED_FILTER':
      return {
        ...state,
        paginaActual: 1,
        selectedFilters: {
          ...state.selectedFilters,
          [action.colKey]: action.selected,
        },
      };

    case 'RESET_ALL':
      return createInitialState(action.defaultPageSize);

    default:
      return state;
  }
}

function getRowValue(row: unknown, key: string): unknown {
  if (typeof row !== 'object' || row === null) {
    return undefined;
  }

  return (row as Record<string, unknown>)[key];
}

export function usePaginatedTable<T extends object>({
  data,
  defaultPageSize = 5,
  resetDeps = [],
}: UsePaginatedTableOptions<T>): UsePaginatedTableResult<T> {
  const [state, dispatch] = useReducer(
    paginatedTableReducer,
    defaultPageSize,
    createInitialState
  );

  const { paginaActual, pageSize, textFilters, selectedFilters } = state;

  const resetDepsKey = JSON.stringify(resetDeps);

  useEffect(() => {
    dispatch({
      type: 'RESET_ALL',
      defaultPageSize,
    });
  }, [resetDepsKey, defaultPageSize]);

  const datosFiltrados = useMemo(() => {
    let filtered = [...data];

    Object.entries(textFilters).forEach(([key, text]) => {
      if (text) {
        filtered = filtered.filter((item) => {
          const value = getRowValue(item, key);

          return (
            value != null &&
            String(value).toLowerCase().includes(text.toLowerCase())
          );
        });
      }
    });

    Object.entries(selectedFilters).forEach(([key, selectedVals]) => {
      if (selectedVals.length) {
        filtered = filtered.filter((item) => {
          const value = getRowValue(item, key);

          return value != null && selectedVals.includes(String(value));
        });
      }
    });

    return filtered;
  }, [data, textFilters, selectedFilters]);

  const totalPaginas = Math.ceil(datosFiltrados.length / pageSize) || 1;
  const paginaActualSegura = Math.min(paginaActual, totalPaginas);
  const indiceInicio = (paginaActualSegura - 1) * pageSize;
  const datosPaginados = datosFiltrados.slice(
    indiceInicio,
    indiceInicio + pageSize
  );
  const indiceFin = Math.min(indiceInicio + pageSize, datosFiltrados.length);

  const setPaginaActual = useCallback<Dispatch<SetStateAction<number>>>(
    (value) => {
      dispatch({
        type: 'SET_PAGINA_ACTUAL',
        value,
      });
    },
    []
  );

  const setPageSize = useCallback<Dispatch<SetStateAction<number>>>((value) => {
    dispatch({
      type: 'SET_PAGE_SIZE',
      value,
    });
  }, []);

  const setTextFilters = useCallback<
    Dispatch<SetStateAction<Record<string, string>>>
  >((value) => {
    dispatch({
      type: 'SET_TEXT_FILTERS',
      value,
    });
  }, []);

  const setSelectedFilters = useCallback<
    Dispatch<SetStateAction<Record<string, string[]>>>
  >((value) => {
    dispatch({
      type: 'SET_SELECTED_FILTERS',
      value,
    });
  }, []);

  const onTextFilterChange = useCallback((colKey: string, text: string) => {
    dispatch({
      type: 'SET_TEXT_FILTER',
      colKey,
      text,
    });
  }, []);

  const onSelectedFilterChange = useCallback(
    (colKey: string, selected: string[]) => {
      dispatch({
        type: 'SET_SELECTED_FILTER',
        colKey,
        selected,
      });
    },
    []
  );

  const resetAll = useCallback(() => {
    dispatch({
      type: 'RESET_ALL',
      defaultPageSize,
    });
  }, [defaultPageSize]);

  return {
    paginaActual: paginaActualSegura,
    setPaginaActual,
    pageSize,
    setPageSize,
    totalPaginas,
    indiceInicio,
    indiceFin,
    datosPaginados,
    datosFiltrados,
    textFilters,
    selectedFilters,
    setTextFilters,
    setSelectedFilters,
    onTextFilterChange,
    onSelectedFilterChange,
    resetAll,
  };
}
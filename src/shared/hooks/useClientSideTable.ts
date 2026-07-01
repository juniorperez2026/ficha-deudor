import { useReducer, useMemo, useCallback, useEffect } from 'react';

export interface TextFilters {
  [columnKey: string]: string;
}

export interface SelectedFilters {
  [columnKey: string]: string[];
}

interface UseClientSideTableOptions {
  initialPageSize?: number;
}

interface TableState {
  pageNumber: number;
  pageSize: number;
  textFilters: TextFilters;
  selectedFilters: SelectedFilters;
}

type TableAction =
  | { type: 'SET_PAGE_NUMBER'; page: number }
  | { type: 'SET_PAGE_SIZE'; size: number }
  | { type: 'SET_TEXT_FILTER'; columnKey: string; value: string }
  | { type: 'SET_SELECTED_FILTER'; columnKey: string; values: string[] }
  | { type: 'RESET_FILTERS' }
  | { type: 'RESET_ALL' };

interface UseClientSideTableReturn<T> {
  filteredData: T[];
  paginatedData: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  setPageNumber: (page: number) => void;
  setPageSize: (size: number) => void;
  textFilters: TextFilters;
  selectedFilters: SelectedFilters;
  onTextFilterChange: (columnKey: string, value: string) => void;
  onSelectedFilterChange: (columnKey: string, values: string[]) => void;
  resetFilters: () => void;
}

function createInitialState(initialPageSize: number): TableState {
  return {
    pageNumber: 1,
    pageSize: initialPageSize,
    textFilters: {},
    selectedFilters: {},
  };
}

function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case 'SET_PAGE_NUMBER':
      return {
        ...state,
        pageNumber: action.page,
      };

    case 'SET_PAGE_SIZE':
      return {
        ...state,
        pageNumber: 1,
        pageSize: action.size,
      };

    case 'SET_TEXT_FILTER':
      return {
        ...state,
        pageNumber: 1,
        textFilters: {
          ...state.textFilters,
          [action.columnKey]: action.value,
        },
      };

    case 'SET_SELECTED_FILTER':
      return {
        ...state,
        pageNumber: 1,
        selectedFilters: {
          ...state.selectedFilters,
          [action.columnKey]: action.values,
        },
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        pageNumber: 1,
        textFilters: {},
        selectedFilters: {},
      };

    case 'RESET_ALL':
      return {
        ...state,
        pageNumber: 1,
        textFilters: {},
        selectedFilters: {},
      };

    default:
      return state;
  }
}

function getRowValue(row: unknown, columnKey: string): unknown {
  if (typeof row !== 'object' || row === null) {
    return undefined;
  }

  return (row as Record<string, unknown>)[columnKey];
}

export function useClientSideTable<T>(
  data: T[],
  resetDeps: readonly unknown[] = [],
  options: UseClientSideTableOptions = {}
): UseClientSideTableReturn<T> {
  const { initialPageSize = 10 } = options;

  const [state, dispatch] = useReducer(
    tableReducer,
    initialPageSize,
    createInitialState
  );

  const { pageNumber, pageSize, textFilters, selectedFilters } = state;

  const resetDepsKey = JSON.stringify(resetDeps);

  useEffect(() => {
    dispatch({ type: 'RESET_ALL' });
  }, [resetDepsKey]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      for (const [columnKey, filterText] of Object.entries(textFilters)) {
        if (!filterText) continue;

        const cellValue = String(getRowValue(row, columnKey) ?? '').toLowerCase();

        if (!cellValue.includes(filterText.toLowerCase())) {
          return false;
        }
      }

      for (const [columnKey, selectedValues] of Object.entries(selectedFilters)) {
        if (!selectedValues || selectedValues.length === 0) continue;

        const cellValue = String(getRowValue(row, columnKey) ?? '');

        if (!selectedValues.includes(cellValue)) {
          return false;
        }
      }

      return true;
    });
  }, [data, textFilters, selectedFilters]);

  const totalRecords = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const indiceInicio = (pageNumber - 1) * pageSize;
  const indiceFin = Math.min(indiceInicio + pageSize, totalRecords);
  const paginatedData = filteredData.slice(indiceInicio, indiceFin);

  const handleSetPageNumber = useCallback((page: number) => {
    dispatch({
      type: 'SET_PAGE_NUMBER',
      page,
    });
  }, []);

  const handleSetPageSize = useCallback((size: number) => {
    dispatch({
      type: 'SET_PAGE_SIZE',
      size,
    });
  }, []);

  const onTextFilterChange = useCallback((columnKey: string, value: string) => {
    dispatch({
      type: 'SET_TEXT_FILTER',
      columnKey,
      value,
    });
  }, []);

  const onSelectedFilterChange = useCallback(
    (columnKey: string, values: string[]) => {
      dispatch({
        type: 'SET_SELECTED_FILTER',
        columnKey,
        values,
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
    dispatch({
      type: 'RESET_FILTERS',
    });
  }, []);

  return {
    filteredData,
    paginatedData,
    pageNumber,
    pageSize,
    totalRecords,
    totalPages,
    setPageNumber: handleSetPageNumber,
    setPageSize: handleSetPageSize,
    textFilters,
    selectedFilters,
    onTextFilterChange,
    onSelectedFilterChange,
    resetFilters,
  };
}
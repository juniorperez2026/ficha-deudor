import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type DependencyList,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  usePaginatedTable,
  type UsePaginatedTableResult,
} from './usePaginatedTable';

interface UseDualViewTableOptions<TResumido, TExpandido> {
  dataResumido: TResumido[];
  dataExpandido: TExpandido[];
  defaultPageSize?: number;
  resetDeps?: DependencyList;
}

interface UseDualViewTableResult<TResumido, TExpandido> {
  vistaExpandida: boolean;
  setVistaExpandida: Dispatch<SetStateAction<boolean>>;
  handleVerMas: () => void;
  handleVolver: () => void;
  resumido: UsePaginatedTableResult<TResumido>;
  expandido: UsePaginatedTableResult<TExpandido>;
  resetAll: () => void;
}

interface DualViewState {
  vistaExpandida: boolean;
}

type DualViewAction =
  | { type: 'SET_VISTA_EXPANDIDA'; value: SetStateAction<boolean> }
  | { type: 'EXPANDIR' }
  | { type: 'COLAPSAR' }
  | { type: 'RESET_VIEW' };

const initialState: DualViewState = {
  vistaExpandida: false,
};

function resolveStateAction<TValue>(
  value: SetStateAction<TValue>,
  previousValue: TValue
): TValue {
  if (typeof value === 'function') {
    return (value as (prev: TValue) => TValue)(previousValue);
  }

  return value;
}

function dualViewReducer(
  state: DualViewState,
  action: DualViewAction
): DualViewState {
  switch (action.type) {
    case 'SET_VISTA_EXPANDIDA':
      return {
        ...state,
        vistaExpandida: resolveStateAction(
          action.value,
          state.vistaExpandida
        ),
      };

    case 'EXPANDIR':
      return {
        ...state,
        vistaExpandida: true,
      };

    case 'COLAPSAR':
    case 'RESET_VIEW':
      return {
        ...state,
        vistaExpandida: false,
      };

    default:
      return state;
  }
}

export function useDualViewTable<
  TResumido extends object,
  TExpandido extends object,
>({
  dataResumido,
  dataExpandido,
  defaultPageSize = 5,
  resetDeps = [],
}: UseDualViewTableOptions<
  TResumido,
  TExpandido
>): UseDualViewTableResult<TResumido, TExpandido> {
  const [state, dispatch] = useReducer(dualViewReducer, initialState);
  const { vistaExpandida } = state;

  const resetDepsKey = useMemo(() => JSON.stringify(resetDeps), [resetDeps]);

  const resumido = usePaginatedTable<TResumido>({
    data: dataResumido,
    defaultPageSize,
    resetDeps,
  });

  const expandido = usePaginatedTable<TExpandido>({
    data: dataExpandido,
    defaultPageSize,
    resetDeps,
  });

  useEffect(() => {
    dispatch({
      type: 'RESET_VIEW',
    });
  }, [resetDepsKey]);

  const setVistaExpandida = useCallback<Dispatch<SetStateAction<boolean>>>(
    (value) => {
      dispatch({
        type: 'SET_VISTA_EXPANDIDA',
        value,
      });
    },
    []
  );

  const handleVerMas = useCallback(() => {
    dispatch({
      type: 'EXPANDIR',
    });

    expandido.setPaginaActual(1);
  }, [expandido]);

  const handleVolver = useCallback(() => {
    dispatch({
      type: 'COLAPSAR',
    });

    resumido.setPaginaActual(1);
  }, [resumido]);

  const resetAll = useCallback(() => {
    dispatch({
      type: 'RESET_VIEW',
    });

    resumido.resetAll();
    expandido.resetAll();
  }, [resumido, expandido]);

  return {
    vistaExpandida,
    setVistaExpandida,
    handleVerMas,
    handleVolver,
    resumido,
    expandido,
    resetAll,
  };
}
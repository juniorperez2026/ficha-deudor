import { useEffect, useCallback, useRef, useReducer } from 'react';
import {
  fetchInfDeudorCabeceraFalse,
  fetchInfDeudorCabeceraTrue,
  fetchInfDeudorParams,
} from '../../api/popups/infDeudorApi';
import type {
  InfDeudorTableRow,
  InfDeudorCabeceraApi,
  InfDeudorParamApi,
} from '../../../../shared/types';

interface UseInfDeudorReturn {
  rows: InfDeudorTableRow[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

interface InfDeudorState {
  rows: InfDeudorTableRow[];
  isLoading: boolean;
  error: string | null;
}

type InfDeudorAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; rows: InfDeudorTableRow[] }
  | { type: 'LOAD_ERROR'; error: string };

const initialState: InfDeudorState = {
  rows: [],
  isLoading: false,
  error: null,
};

function infDeudorReducer(
  state: InfDeudorState,
  action: InfDeudorAction
): InfDeudorState {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOAD_SUCCESS':
      return {
        rows: action.rows,
        isLoading: false,
        error: null,
      };

    case 'LOAD_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    default:
      return state;
  }
}

function buildRow(
  id: string,
  tipo: string,
  source: InfDeudorCabeceraApi | InfDeudorParamApi,
  prefix: 'cNombre_Param' | 'cPersInf_Param'
): InfDeudorTableRow {
  const row: InfDeudorTableRow = { id, tipo };

  for (let i = 1; i <= 80; i++) {
    const idx = i.toString().padStart(2, '0');
    const apiKey = `${prefix}${idx}`;
    const val = (source as Record<string, unknown>)[apiKey];

    row[`param${idx}`] = typeof val === 'string' ? val : '';
  }

  return row;
}

export function useInfDeudor(id_deudor: string): UseInfDeudorReturn {
  const [state, dispatch] = useReducer(infDeudorReducer, initialState);
  const { rows, isLoading, error } = state;

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadData = useCallback(
    async (signal: AbortSignal) => {
      dispatch({
        type: 'LOAD_START',
      });

      try {
        const [cabFalse, cabTrue, params] = await Promise.all([
          fetchInfDeudorCabeceraFalse(signal),
          fetchInfDeudorCabeceraTrue(signal),
          fetchInfDeudorParams(id_deudor, signal),
        ]);

        if (signal.aborted || !isMountedRef.current) return;

        dispatch({
          type: 'LOAD_SUCCESS',
          rows: [
            buildRow(
              'cab_false',
              'Cabecera Principal (false)',
              cabFalse,
              'cNombre_Param'
            ),
            buildRow(
              'cab_true',
              'Cabecera Adicional (true)',
              cabTrue,
              'cNombre_Param'
            ),
            buildRow('valores', 'Valores Deudor', params, 'cPersInf_Param'),
          ],
        });
      } catch (err) {
        if (!signal.aborted && isMountedRef.current) {
          dispatch({
            type: 'LOAD_ERROR',
            error:
              err instanceof Error
                ? err.message
                : 'Error cargando información',
          });
        }
      }
    },
    [id_deudor]
  );

  useEffect(() => {
    if (!id_deudor) return;

    const controller = new AbortController();

    void loadData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [id_deudor, loadData]);

  const refetch = useCallback(() => {
    if (!id_deudor) return;

    const controller = new AbortController();

    void loadData(controller.signal);
  }, [id_deudor, loadData]);

  return {
    rows,
    isLoading,
    error,
    refetch,
  };
}
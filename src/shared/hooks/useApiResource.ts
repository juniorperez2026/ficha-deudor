import { useEffect, useCallback, useRef, useReducer } from 'react';

interface UseApiResourceState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiResourceReturn<T> extends UseApiResourceState<T> {
  refetch: () => void;
}

type UseApiResourceAction<T> =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; data: T }
  | { type: 'LOAD_ERROR'; error: string };

function apiResourceReducer<T>(
  state: UseApiResourceState<T>,
  action: UseApiResourceAction<T>
): UseApiResourceState<T> {
  switch (action.type) {
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

function createInitialState<T>(): UseApiResourceState<T> {
  return {
    data: null,
    isLoading: true,
    error: null,
  };
}

export function useApiResource<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[]
): UseApiResourceReturn<T> {
  const fetcherRef = useRef(fetcher);
  const cleanupRef = useRef<(() => void) | null>(null);
  const depsKey = JSON.stringify(deps);

  const [state, dispatch] = useReducer(
    apiResourceReducer<T>,
    undefined,
    createInitialState<T>
  );

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const runFetch = useCallback(() => {
    cleanupRef.current?.();

    const controller = new AbortController();

    cleanupRef.current = () => {
      controller.abort();
    };

    dispatch({
      type: 'LOAD_START',
    });

    fetcherRef.current(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;

        dispatch({
          type: 'LOAD_SUCCESS',
          data,
        });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        const message =
          err instanceof Error ? err.message : 'Error al cargar información';

        dispatch({
          type: 'LOAD_ERROR',
          error: message,
        });
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const cleanup = runFetch();

    return () => {
      cleanup();
    };
  }, [runFetch, depsKey]);

  const refetch = useCallback(() => {
    runFetch();
  }, [runFetch]);

  return {
    ...state,
    refetch,
  };
}
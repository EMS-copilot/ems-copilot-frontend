import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseApiState {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useApi(
  apiFunction: (...args: any[]) => Promise,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const data = await apiFunction(...args);
        setState({ data, loading: false, error: null });
        
        if (options.onSuccess) {
          options.onSuccess(data);
        }
        
        return data;
      } catch (error) {
        const err = error as Error | AxiosError;
        setState({ data: null, loading: false, error: err });
        
        if (options.onError) {
          options.onError(err);
        }
        
        throw error;
      }
    },
    [apiFunction, options]
  );

  return {
    ...state,
    execute,
    reset: () => setState({ data: null, loading: false, error: null }),
  };
}

// 사용 예시:
// const { data, loading, error, execute } = useApi(apiClient.getHospitals);
// useEffect(() => { execute(); }, []);
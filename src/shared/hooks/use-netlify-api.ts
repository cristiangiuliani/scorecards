import {
  useState, useEffect, useCallback,
  useContext,
} from 'react';

import type { IApiEndpoint } from '../../constants/api';
import { GLOBALS } from '../../constants/config';
import DashboardContext from '../../dashboard/dashboard.context';
import type { IDashboardContext } from '../../interfaces/dashboard';

interface IUseApiOptions {
  autoFetch?: boolean;
  params?: Record<string, string>;
}

interface IUseApiResult {
  data: any;
  loading: boolean;
  error: string | null;
  cacheHit: boolean;
  refetch: () => Promise<void>;
  forceRefresh: () => Promise<void>;
}

interface IUseNetlifyApiProps {
  apiFunction: IApiEndpoint;
  options?: IUseApiOptions;
}

export const useNetlifyApi = ({
  apiFunction,
  options,
}:IUseNetlifyApiProps):IUseApiResult => {
  const [data, setData] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheHit, setCacheHit] = useState(false);
  const { isDemo } = useContext<IDashboardContext>(DashboardContext);

  const { autoFetch = true, params = {} } = options || {};
  console.log('apiFunction', apiFunction);

  const { functionName, mockData } = apiFunction;

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      if (isDemo) {
        setTimeout(() => {
          setData(mockData);
          setLoading(false);
        }, 1000); // API delay simulation
        return;
      }

      const queryParams = new URLSearchParams({
        ...params,
        ...forceRefresh && { refresh: 'true' },
      });

      const url = `${GLOBALS.ApiBaseUrl}/${functionName}${
        queryParams.toString() ? `?${queryParams}` : ''
      }`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setData(result);

      const cacheHeader = response.headers.get('X-Cache');
      setCacheHit(cacheHeader === 'HIT');

      console.log(
        cacheHeader === 'HIT'
          ? '✅ Da cache MongoDB'
          : cacheHeader === 'REFRESHED'
            ? '🔄 Cache refreshata'
            : '🌐 Da API esterna'
      );
    } catch (err: any) {
      setError(err.message);
      console.error('Errore fetch:', err);
    } finally {
      setLoading(false);
    }
  }, [functionName, isDemo]);

  const refetch = useCallback(() => fetchData(false), [fetchData]);
  const forceRefresh = useCallback(() => fetchData(true), [fetchData]);

  useEffect(() => {
    if (autoFetch && functionName) {
      fetchData(false);
    }
  }, [functionName, autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    cacheHit,
    refetch,
    forceRefresh,
  };
};

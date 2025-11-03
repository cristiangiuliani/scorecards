import {
  useState, useEffect, useCallback,
  useContext,
} from 'react';

import type { IApiEndpoint } from '../../constants/api';
import { GLOBALS } from '../../constants/config';
import DashboardContext from '../../dashboard/dashboard.context';
import { errorHandler } from '../../error-handler/error.service';
import type { IDashboardContext } from '../../interfaces/dashboard';

interface IUseApiOptions {
  autoFetch?: boolean;
  params?: Record<string, string>;
}

interface IUseApiResult<T> {
  data: T | null;
  loading: boolean;
  cacheHit: boolean;
  cacheExpiresAt: string | null;
  cacheCreatedAt: string | null;
  refetch: () => Promise<void>;
  forceRefresh: () => Promise<void>;
}

interface IUseNetlifyApiProps {
  apiFunction: IApiEndpoint;
  options?: IUseApiOptions;
}

export const useNetlifyApi = <T = unknown>({
  apiFunction,
  options,
}:IUseNetlifyApiProps):IUseApiResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [cacheHit, setCacheHit] = useState(false);
  const [cacheExpiresAt, setCacheExpiresAt] = useState<string | null>(null);
  const [cacheCreatedAt, setCacheCreatedAt] = useState<string | null>(null);
  const { isDemo } = useContext<IDashboardContext>(DashboardContext);

  const { autoFetch = true, params = {} } = options || {};

  const { functionName, mockData } = apiFunction;

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);

      if (isDemo) {
        setTimeout(() => {
          setData(mockData as T);
          setLoading(false);
        }, Math.floor(Math.random() * 2001) + 3000); // API delay simulation
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
        // Try to parse error response from backend
        try {
          const errorData = await response.json();
          if (errorData.error) {
            // Backend returned structured error
            const error = new Error(errorData.error);
            (error as any).type = errorData.type;
            (error as any).statusCode = response.status;
            throw error;
          }
        } catch (parseError) {
          // If parsing fails, throw generic HTTP error
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Check if result contains an error field (some APIs return 200 with error)
      if (result.error) {
        const error = new Error(result.error);
        (error as any).type = result.type || 'API';
        throw error;
      }

      setData(result);

      const cacheHeader = response.headers.get('X-Cache');
      setCacheHit(cacheHeader === 'HIT');

      const expiresAt = response.headers.get('X-Cache-Expires-At');
      const createdAt = response.headers.get('X-Cache-Created-At');
      setCacheExpiresAt(expiresAt);
      setCacheCreatedAt(createdAt);

      // console.log(
      //   cacheHeader === 'HIT'
      //     ? '✅ Da cache MongoDB'
      //     : cacheHeader === 'REFRESHED'
      //       ? '🔄 Cache refreshata'
      //       : '🌐 Da API esterna'
      // );
    } catch (err: unknown) {
      errorHandler.handleError(err, 'API');
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
  }, [functionName, autoFetch]);

  return {
    data,
    loading,
    cacheHit,
    cacheExpiresAt,
    cacheCreatedAt,
    refetch,
    forceRefresh,
  };
};

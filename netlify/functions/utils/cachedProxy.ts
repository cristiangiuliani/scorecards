import {
  Handler, HandlerEvent, HandlerContext,
} from '@netlify/functions';

import { CacheService } from './cache';
import { CACHE_CONFIG } from './cacheConfig';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

interface CachedProxyOptions {
  cacheTTL?: number;
  includeCacheHeader?: boolean;
  requestHeaders?: Record<string, string>;
  disableCache?: boolean;
}

export const createCachedProxyHandler = (
  urlBuilder: (event: HandlerEvent) => string | Promise<string>,
  options: CachedProxyOptions = {}
): Handler => {
  const {
    cacheTTL = CACHE_CONFIG.DEFAULT_TTL,
    includeCacheHeader = true,
    requestHeaders = {},
    disableCache = false,
  } = options;

  return async (event: HandlerEvent, _context: HandlerContext) => {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: '',
      };
    }

    try {
      const url = await urlBuilder(event);
      const cacheKey = `api_${url}`;

      const forceRefresh = event.queryStringParameters?.refresh === 'true';

      if (forceRefresh) {
        await CacheService.delete(cacheKey);
      }

      if (!disableCache && !forceRefresh) {
        const cachedData = await CacheService.get(cacheKey);

        if (cachedData) {
          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              ...includeCacheHeader && {
                'X-Cache': 'HIT',
                'X-Cache-Expires-At': cachedData.expiresAt.toISOString(),
                'X-Cache-Created-At': cachedData.createdAt.toISOString(),
              },
              ...CORS_HEADERS,
            },
            body: JSON.stringify(cachedData.data),
          };
        }
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          ...requestHeaders,
        },
      });

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const data = await response.json();

      if (!disableCache) {
        CacheService.set(cacheKey, data, cacheTTL).catch((err) => {
          throw new Error(`Save to Cache error:  ${err}`);
        });
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          ...includeCacheHeader && {
            'X-Cache': forceRefresh ? 'REFRESHED' : 'MISS',
          },
          ...CORS_HEADERS,
        },
        body: JSON.stringify(data),
      };
    } catch (error: any) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
        body: JSON.stringify({ error: error.message }),
      };
    }
  };
};

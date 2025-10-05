import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export const createProxyHandler = (urlBuilder: (event: HandlerEvent) => string | Promise<string>): Handler => {
  return async (event: HandlerEvent, context: HandlerContext) => {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: '',
      };
    }

    try {
      const url = await urlBuilder(event);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const data = await response.json();

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
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
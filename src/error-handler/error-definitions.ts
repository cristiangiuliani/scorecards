import type { IAppError } from './error';

// API Errors
export const ALPHA_VANTAGE_RSI_ERROR: IAppError = {
  type: 'API',
  message: 'Alpha Vantage API limit reached for RSI data.',
  timestamp: new Date(),
  userMessage: 'Unable to fetch RSI data at the moment. Please try again later.',
};

export const API_RATE_LIMIT_ERROR: IAppError = {
  type: 'API',
  message: 'API rate limit exceeded',
  timestamp: new Date(),
  userMessage: 'Too many requests. Please wait a few minutes before trying again.',
};

export const API_TIMEOUT_ERROR: IAppError = {
  type: 'API',
  message: 'API request timeout',
  timestamp: new Date(),
  userMessage: 'The request is taking too long. Please try again shortly.',
};

export const API_UNAVAILABLE_ERROR: IAppError = {
  type: 'API',
  message: 'API service unavailable',
  timestamp: new Date(),
  userMessage: 'The service is currently unavailable. Please try again later.',
};

// Network Errors
export const NETWORK_ERROR: IAppError = {
  type: 'NETWORK',
  message: 'Network connection failed',
  timestamp: new Date(),
  userMessage: 'Unable to connect to the server. Please check your internet connection.',
};

export const NETWORK_TIMEOUT_ERROR: IAppError = {
  type: 'NETWORK',
  message: 'Network request timeout',
  timestamp: new Date(),
  userMessage: 'Connection timeout. Please check your connection and try again.',
};

// MongoDB/Database Errors
export const DATABASE_CONNECTION_ERROR: IAppError = {
  type: 'DATABASE',
  message: 'MongoDB connection failed',
  timestamp: new Date(),
  userMessage: 'Database connection error. We are working to resolve the issue.',
};

export const DATABASE_QUERY_ERROR: IAppError = {
  type: 'DATABASE',
  message: 'Database query failed',
  timestamp: new Date(),
  userMessage: 'Error retrieving data. Please try again shortly.',
};

export const CACHE_ERROR: IAppError = {
  type: 'DATABASE',
  message: 'Cache operation failed',
  timestamp: new Date(),
  userMessage: 'Temporary cache issue. Data may take longer than usual to load.',
};

// Netlify Function Errors
export const FUNCTION_ERROR: IAppError = {
  type: 'API',
  message: 'Netlify function error',
  timestamp: new Date(),
  userMessage: 'Error processing the request. Please try again later.',
};

export const FUNCTION_TIMEOUT_ERROR: IAppError = {
  type: 'API',
  message: 'Netlify function timeout',
  timestamp: new Date(),
  userMessage: 'The server is taking too long to respond. Please try again shortly.',
};

// HTTP Status Errors
export const HTTP_400_ERROR: IAppError = {
  type: 'VALIDATION',
  message: 'Bad request',
  timestamp: new Date(),
  userMessage: 'Invalid request. Please check the parameters and try again.',
};

export const HTTP_401_ERROR: IAppError = {
  type: 'API',
  message: 'Unauthorized',
  timestamp: new Date(),
  userMessage: 'Unauthorized access. Please verify your credentials.',
};

export const HTTP_403_ERROR: IAppError = {
  type: 'API',
  message: 'Forbidden',
  timestamp: new Date(),
  userMessage: 'You do not have permission to access this resource.',
};

export const HTTP_404_ERROR: IAppError = {
  type: 'API',
  message: 'Resource not found',
  timestamp: new Date(),
  userMessage: 'Resource not found. It may have been removed or moved.',
};

export const HTTP_500_ERROR: IAppError = {
  type: 'API',
  message: 'Internal server error',
  timestamp: new Date(),
  userMessage: 'Server error. We are working to resolve the issue.',
};

export const HTTP_502_ERROR: IAppError = {
  type: 'API',
  message: 'Bad gateway',
  timestamp: new Date(),
  userMessage: 'Server communication issue. Please try again shortly.',
};

export const HTTP_503_ERROR: IAppError = {
  type: 'API',
  message: 'Service unavailable',
  timestamp: new Date(),
  userMessage: 'Service temporarily unavailable. Please try again in a few minutes.',
};

// Generic Errors
export const UNKNOWN_ERROR: IAppError = {
  type: 'UNKNOWN',
  message: 'Unknown error occurred',
  timestamp: new Date(),
  userMessage: 'An unexpected error occurred. Please try again later.',
};

// Error mapping helper
export const ERROR_DEFINITIONS = {
  ALPHA_VANTAGE_RSI_ERROR,
  API_RATE_LIMIT_ERROR,
  API_TIMEOUT_ERROR,
  API_UNAVAILABLE_ERROR,
  NETWORK_ERROR,
  NETWORK_TIMEOUT_ERROR,
  DATABASE_CONNECTION_ERROR,
  DATABASE_QUERY_ERROR,
  CACHE_ERROR,
  FUNCTION_ERROR,
  FUNCTION_TIMEOUT_ERROR,
  HTTP_400_ERROR,
  HTTP_401_ERROR,
  HTTP_403_ERROR,
  HTTP_404_ERROR,
  HTTP_500_ERROR,
  HTTP_502_ERROR,
  HTTP_503_ERROR,
  UNKNOWN_ERROR,
} as const;

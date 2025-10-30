import type { IAppError } from './error';

export const ALPHA_VANTAGE_RSI_ERROR: IAppError = {
  type: 'API',
  message: 'Alpha Vantage API limit reached for RSI data.',
  timestamp: new Date(),
  userMessage: 'Unable to fetch RSI data at the moment. Please try again later.',
};

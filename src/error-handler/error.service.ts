import type { IAppError, TErrorType } from './error';

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: Array<(error: IAppError) => void> = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  subscribe(listener: (error: IAppError) => void) {
    this.errorListeners.push(listener);
    return () => {
      this.errorListeners = this.errorListeners.filter((l) => l !== listener);
    };
  }

  handleError(error: unknown, type?: TErrorType): IAppError {
    const appError = this.parseError(error, type);
    this.errorListeners.forEach((listener) => listener(appError));
    return appError;
  }

  private parseError(error: unknown, type?: TErrorType): IAppError {
    if (error instanceof Error) {
      return {
        type: type || this.detectErrorType(error),
        message: error.message,
        originalError: error,
        timestamp: new Date(),
        userMessage: this.getUserFriendlyMessage(error, type),
      };
    }

    return {
      type: 'UNKNOWN',
      message: String(error),
      originalError: error,
      timestamp: new Date(),
      userMessage: 'An unexpected error occurred.',
    };
  }

  private detectErrorType(error: Error): TErrorType {
    const message = error.message.toLowerCase();

    // Network errors
    if (
      message.includes('fetch') ||
      message.includes('network') ||
      message.includes('connection') ||
      message.includes('timeout') ||
      message.includes('cors')
    ) {
      return 'NETWORK';
    }

    // Database/Cache errors
    if (
      message.includes('mongodb') ||
      message.includes('database') ||
      message.includes('cache') ||
      message.includes('db')
    ) {
      return 'DATABASE';
    }

    // Validation errors
    if (
      message.includes('validation') ||
      message.includes('invalid') ||
      message.includes('bad request') ||
      message.includes('status 400')
    ) {
      return 'VALIDATION';
    }

    return 'API';
  }

  private getUserFriendlyMessage(error: Error, type?: TErrorType): string {
    const message = error.message.toLowerCase();

    // Check for specific error patterns first
    // HTTP Status Codes
    if (message.includes('status 400') || message.includes('400')) {
      return 'Invalid request. Please check the parameters and try again.';
    }
    if (message.includes('status 401') || message.includes('401') || message.includes('unauthorized')) {
      return 'Unauthorized access. Please verify your credentials.';
    }
    if (message.includes('status 403') || message.includes('403') || message.includes('forbidden')) {
      return 'You do not have permission to access this resource.';
    }
    if (message.includes('status 404') || message.includes('404') || message.includes('not found')) {
      return 'Resource not found. It may have been removed or moved.';
    }
    if (message.includes('status 429') || message.includes('429') || message.includes('rate limit')) {
      return 'Too many requests. Please wait a few minutes before trying again.';
    }
    if (message.includes('status 500') || message.includes('500') || message.includes('internal server')) {
      return 'Server error. We are working to resolve the issue.';
    }
    if (message.includes('status 502') || message.includes('502') || message.includes('bad gateway')) {
      return 'Server communication issue. Please try again shortly.';
    }
    if (message.includes('status 503') || message.includes('503') || message.includes('unavailable')) {
      return 'Service temporarily unavailable. Please try again in a few minutes.';
    }

    // Specific error patterns
    if (message.includes('timeout')) {
      return 'The request is taking too long. Please try again shortly.';
    }
    if (message.includes('mongodb') || message.includes('database')) {
      return 'Database connection error. We are working to resolve the issue.';
    }
    if (message.includes('cache')) {
      return 'Temporary cache issue. Data may take longer than usual to load.';
    }
    if (message.includes('netlify') || message.includes('function')) {
      return 'Error processing the request. Please try again later.';
    }
    if (message.includes('alpha vantage')) {
      return 'Unable to fetch data at the moment. Please try again later.';
    }

    // Fallback to error type
    const errorType = type || this.detectErrorType(error);

    const messages: Record<TErrorType, string> = {
      NETWORK: 'Unable to connect to the server. Please check your internet connection.',
      API: 'Error retrieving data. Please try again later.',
      DATABASE: 'Error loading data from cache.',
      VALIDATION: 'The entered data is not valid.',
      UNKNOWN: 'An unexpected error occurred.',
    };

    return messages[errorType];
  }
}

export const errorHandler = ErrorHandler.getInstance();

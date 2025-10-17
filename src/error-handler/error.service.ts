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
      userMessage: 'Si è verificato un errore imprevisto',
    };
  }

  private detectErrorType(error: Error): TErrorType {
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'NETWORK';
    }
    if (error.message.includes('MongoDB') || error.message.includes('database')) {
      return 'DATABASE';
    }
    if (error.message.includes('validation')) {
      return 'VALIDATION';
    }
    return 'API';
  }

  private getUserFriendlyMessage(error: Error, type?: TErrorType): string {
    const errorType = type || this.detectErrorType(error);

    const messages = {
      ['NETWORK']: 'Impossibile connettersi al server. Verifica la tua connessione.',
      ['API']: 'Errore nel recupero dei dati. Riprova più tardi.',
      ['DATABASE']: 'Errore nel caricamento dei dati dalla cache.',
      ['VALIDATION']: 'I dati inseriti non sono validi.',
      ['UNKNOWN']: 'Si è verificato un errore imprevisto.',
    };

    return messages[errorType];
  }
}

export const errorHandler = ErrorHandler.getInstance();

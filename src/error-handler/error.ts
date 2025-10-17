export type IErrorContext = IErrorProvider & {
    updateError: (newState: IErrorProvider) => void;
};

export type TErrorType = 'NETWORK' | 'API' | 'DATABASE' | 'VALIDATION' | 'UNKNOWN';

export interface IAppError {
  type: TErrorType;
  message: string;
  originalError?: unknown;
  timestamp: Date;
  userMessage: string;
}

export interface IErrorProvider {
  errors: IAppError[];
  addError: (error: IAppError) => void;
  clearError: (timestamp: Date) => void;
  clearAllErrors: () => void;
}

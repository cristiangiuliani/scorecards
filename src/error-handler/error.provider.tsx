import {
  useState, type ReactNode,
} from 'react';

import type { IAppError, IErrorProvider } from './error';
import { ErrorContext } from './error.context';

export const ErrorProvider = ({
  children,
}: { children: ReactNode }) => {
  const [errors, setErrors] = useState<IAppError[]>([]);

  const addError = (error: IAppError) => {
    setErrors((prevErrors) => {
      // Check if an error with the same message already exists
      const errorExists = prevErrors.some((existingError) => existingError.message === error.message);

      if (errorExists) {
        return prevErrors;
      }

      return [...prevErrors, { ...error, timestamp: new Date() }];
    });
  };

  const clearError = (timestamp: Date) => {
    setErrors((prevErrors) => prevErrors.filter((error) => error.timestamp !== timestamp));
  };

  const clearAllErrors = () => {
    setErrors([]);
  };

  const updateError = (newState: IErrorProvider) => {
    setErrors(newState.errors);
  };

  return (
    <ErrorContext.Provider value={{
      errors,
      addError,
      clearError,
      clearAllErrors,
      updateError,
    }}
    >
      { children }
    </ErrorContext.Provider>
  );
};

import {
  useState, type ReactNode,
} from 'react';

import type { IErrorProvider } from './error';
import { ErrorContext } from './error.context';

export const ErrorProvider = ({
  children,
}: { children: ReactNode }) => {
  const errorProviderValue = {
    errors: [],
    addError: () => {},
    clearError: () => {},
    clearAllErrors: () => {},
  };
  const [error, setError] = useState<IErrorProvider>(errorProviderValue);

  const updateError = (newState: IErrorProvider = errorProviderValue) => {
    setError((prevState: IErrorProvider) => ({
      ...prevState,
      ...newState,
    }));
  };

  return (
    <ErrorContext.Provider value={{
      ...error,
      updateError,
    }}
    >
      { children }
    </ErrorContext.Provider>
  );
};

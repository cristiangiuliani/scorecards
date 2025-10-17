import { useContext } from 'react';

import { ErrorContext } from '../../error-handler/error.context';

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within ErrorProvider');
  }
  return context;
}

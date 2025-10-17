// src/contexts/ErrorContext.tsx
import { createContext } from 'react';

import type { IErrorContext } from './error';

export const ErrorContext = createContext<IErrorContext>({
  errors: [],
  addError: () => {},
  clearError: () => {},
  clearAllErrors: () => {},
  updateError: () => {},
});

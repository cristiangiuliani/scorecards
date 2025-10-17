import {
  Alert, Snackbar, Stack,
} from '@mui/material';

import { useError } from '../hooks/use-error';

export const ErrorDisplay = () => {
  const { errors, clearError } = useError();

  if (errors.length === 0) return null;

  return (
    <Stack spacing={8}>
      {errors.map((error) => (
        <>
          <Snackbar
            key={error.timestamp.getTime()}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={!!error.timestamp}
            autoHideDuration={6000}
            onClose={() => clearError(error.timestamp)}
          >
            <Alert
              onClose={() => clearError(error.timestamp)}
              severity="error"
              variant="filled"
              sx={{ width: '100%' }}
            >
              {error.type}: {error.userMessage}
            </Alert>
          </Snackbar>
        </>
      )
      )};
    </Stack>
  );
};

import { Box, Typography } from '@mui/material';

import packageInfo from '../../../package.json';

interface VersionComponentProps {
  position?: 'fixed' | 'static';
  bottom?: string | number;
  right?: string | number;
  opacity?: number;
  fontSize?: string;
}

export const VersionComponent = ({
  position = 'fixed',
  bottom = 10,
  right = 10,
  opacity = 0.5,
  fontSize = '0.75rem',
}: VersionComponentProps) => {
  return (
    <Box
      sx={{
        position,
        bottom,
        right,
        opacity,
        zIndex: 1000,
      }}
    >
      <Typography variant="caption" sx={{ fontSize }}>
        v{packageInfo.version}
      </Typography>
    </Box>
  );
};

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
} from '@mui/material';
import React from 'react';

interface TIndicatorCardLayoutProps {
    label: string;
    value: number | string;
    score: number;
    weight: string;
    suffix?: string;
    icon?: React.ElementType;
  }

const IndicatorCardLayout = ({
  label, value, score, weight, suffix = '', icon: Icon,
}: TIndicatorCardLayoutProps) => (
  <Card
    elevation={2}
    sx={{
      height: '100%',
    }}
  >
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
        <Box display="flex" alignItems="center" gap={1}>
          {Icon && <Icon fontSize="small" color="action" />}
          <Typography variant="body2" color="text.secondary" fontWeight="medium">
            {label}
          </Typography>
        </Box>
        <Chip
          size="small"
          label={score > 0 ? `+${score}` : score}
          color={score > 0 ? 'success' : score < 0 ? 'error' : 'default'}
          variant="outlined"
        />
      </Box>

      <Typography variant="h5" component="div" fontWeight="bold" mb={1}>
        {typeof value === 'number' ? value.toFixed(2) : value}{suffix}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        Weight: {weight}x
      </Typography>
    </CardContent>
  </Card>
);

export default IndicatorCardLayout;

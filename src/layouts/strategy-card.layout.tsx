import {
  Box,
  Typography,
  Paper,
  Divider,
} from '@mui/material';

type TStrategyCardLayoutProps = {
  title: string;
  items: { label: string; value: string | number }[];
  color: string
};

const StrategyCardLayout = ({
  title, items, color = 'primary',
}:TStrategyCardLayoutProps) => (
  <Paper
    elevation={1}
    sx={{
      p: 3,
      height: '100%',
      borderTop: '4px solid',
      borderTopColor: `${color}.main`,
    }}
  >
    <Typography variant="h6" gutterBottom fontWeight="bold">
      {title}
    </Typography>
    <Divider sx={{
      mb: 2,
    }}
    />
    {items.map((item, index) => (
      <Box key={index} mb={2}>
        <Typography variant="subtitle2" color="text.primary" fontWeight="medium" gutterBottom>
          {item.label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.value}
        </Typography>
      </Box>
    ))}
  </Paper>
);

export default StrategyCardLayout;

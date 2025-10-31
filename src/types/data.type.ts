export type TInterpretation = {
  text: string;
  color: 'secondary' | 'primary' | 'info' | 'error' | 'success' | 'warning' | 'default';
    severity: 'success' | 'warning' | 'error' | 'info';
};

export type TIndicatorsListItem = {
  label?: string;
  weight?: number;
  value?: number;
  score?: number;
  isLoading?: boolean;
};

export type TStrategiesListItem = {
  title?: string
  color?: 'secondary' | 'primary' | 'info' | 'error' | 'success' | 'warning' | 'default'
  isLoading?: boolean
  items: {
    label: string
    value: string
  }[]
}

export type TCryptoMetrics = {
  cryptoScore: number;
  btcDominance: number;
  btcRsi: number;
  btcFearGreed: number;
  athDistance: number; // Percentuale (es. 98 = 98% dell'ATH)
  momentum7d: number;
}

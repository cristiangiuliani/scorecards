export type TInterpretation = {
  text: string;
  color: 'success' | 'warning' | 'error' | 'info' | 'default';
    severity: 'success' | 'warning' | 'error' | 'info';
};

export type TIndicatorsListItem = {
  label?: string;
  weight?: number;
  value?: number;
  score?: number;
};

export type TStrategiesListItem = {
  title?: string
  color?: 'secondary' | 'primary' | 'info' | 'error' | 'success' | 'warning'
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

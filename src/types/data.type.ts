export type TInterpretation = {
  text: string;
  color: 'secondary' | 'primary' | 'info' | 'error' | 'success' | 'warning';
    severity: 'success' | 'warning' | 'error' | 'info';
};

export type TIndicatorsListItem = {
  label?: string;
  description?: string;
  decimals?: number;
  weight?: number;
  value?: number;
  score?: number;
  isLoading?: boolean;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  alert?: string;
  suffix?: string;
  prefix?: string;
};

export type TStrategiesListItem = {
  title?: string
  color?: 'secondary' | 'primary' | 'info' | 'error' | 'success' | 'warning'
  isLoading?: boolean
  items: {
    label?: string
    value: string
  }[]
}

export type TCryptoMetrics = {
  cryptoScore: number;
  btcDominance: number;
  btcRsi: number;
  btcFearGreed: number;
  athDistance: number;
  momentum7d: number;
}

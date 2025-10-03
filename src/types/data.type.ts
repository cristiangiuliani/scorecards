export type TCryptoData = {
  btcFearGreed?: number;
  btcRsi?: number;
  btcDominance?: number;
  altSeasonIndex?: number;
  lastUpdated?: string;
}

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
  items: [{
    label: string
    value: string
  }]
}

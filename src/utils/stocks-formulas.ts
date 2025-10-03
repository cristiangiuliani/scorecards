import type { TStocksData } from '../interfaces/market-stocks';
import type {
  TInterpretation,
} from '../types/data.type';

export const calculateVixScore = (value = 0):number => {
  if (value < 12) return -2;
  if (value < 15) return 1;
  if (value > 40) return 4;
  if (value > 30) return 3;
  return 0;
};
export const calculateRsiScore = (value = 0):number => {
  if (value > 85) return -4;
  if (value > 80) return -3;
  if (value < 15) return 4;
  if (value < 20) return 3;
  if (value < 35) return 1;
  return 0;
};
export const calculateEurUsdScore = (value = 0):number => {
  if (value < 1.05) return 2;
  if (value > 1.25) return -1;
  return 0;
};
export const calculateFearGreedScore = (value = 0):number => {
  if (value < 20) return 3;
  if (value < 30) return 2;
  if (value > 80) return -3;
  if (value > 70) return -2;
  return 0;
};

export const calculateStocksScore = (data:TStocksData):number => {
  if (!data) return 0;
  const vixScore = data?.vix ? calculateVixScore(data.vix) : 0;
  const rsiScore = data?.rsiSP500 ? calculateRsiScore(data.rsiSP500) : 0;
  const eurUsdScore = data?.eurUsd ? calculateEurUsdScore(data.eurUsd) : 0;
  const fearGreedScore = data?.fearGreed ? calculateFearGreedScore(data.fearGreed) : 0;

  const weightedScore = (vixScore * 1.3) + (rsiScore * 1.2) + (eurUsdScore * 0.8) + (fearGreedScore * 1.2);
  return weightedScore * 0.6;
};

export const getStockInterpretation = (score:number):TInterpretation => {
  if (score > 6) return {
    text: '🟢 STRONG BULLISH',
    color: 'success',
    severity: 'success',
  };
  if (score > 3) return {
    text: '🟡 BULLISH',
    color: 'success',
    severity: 'info',
  };
  if (score > -3) return {
    text: '⚪ NEUTRAL',
    color: 'default',
    severity: 'info',
  };
  if (score > -6) return {
    text: '🟡 BEARISH',
    color: 'warning',
    severity: 'warning',
  };
  return {
    text: '🔴 STRONG BEARISH',
    color: 'error',
    severity: 'error',
  };
};

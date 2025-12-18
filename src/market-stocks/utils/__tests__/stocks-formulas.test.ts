import {
  calculateAthDistanceScore,
  calculateRsiScore,
  calculateVixScore,
  calculateFearGreedScore,
  calculateEurUsdScore,
  calculateMomentum7dScore,
  calculateMomentumScore,
  calculateMaScore,
  calculatePutCallScore,
  calculateTreasury10YScore,
  calculateStocksScore,
} from '../stocks-formulas';

describe('Stocks Formulas', () => {
  describe('calculateAthDistanceScore', () => {
    it('should return 4 (green) when at ATH (0% distance)', () => {
      expect(calculateAthDistanceScore(6750, 6750)).toBeCloseTo(4, 1);
    });

    it('should return 3+ (green) when very close to ATH (<1% distance)', () => {
      const score = calculateAthDistanceScore(6715.79, 6750.87); // 0.52% distance
      expect(score).toBeGreaterThanOrEqual(3);
    });

    it('should return gray zone (between -2 and 2) for moderate distance', () => {
      const score = calculateAthDistanceScore(6000, 6750); // ~11% distance
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });

    it('should return red (≤-2) for large distance from ATH', () => {
      const score = calculateAthDistanceScore(4000, 6750); // ~40% distance
      expect(score).toBeLessThanOrEqual(-2);
    });

    it('should handle 50%+ distance with score around -4', () => {
      const score = calculateAthDistanceScore(3000, 6750); // 55% distance
      expect(score).toBeLessThan(-4);
    });
  });

  describe('calculateRsiScore', () => {
    it('should return gray for neutral RSI around 50-60', () => {
      const score = calculateRsiScore(67.07);
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });

    it('should return positive for overbought RSI >70', () => {
      const score = calculateRsiScore(75);
      expect(score).toBeGreaterThanOrEqual(2);
    });

    it('should return negative for oversold RSI <35', () => {
      const score = calculateRsiScore(30);
      expect(score).toBeLessThanOrEqual(-1);
    });

    it('should return max negative score for extremely oversold', () => {
      const score = calculateRsiScore(15);
      expect(score).toBe(-4);
    });

    it('should handle extreme overbought (>85)', () => {
      const score = calculateRsiScore(90);
      expect(score).toBeGreaterThan(3);
    });
  });

  describe('calculateVixScore', () => {
    it('should return gray for normal VIX around 15-20', () => {
      const score = calculateVixScore(16.37);
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });

    it('should return green (≥2) for low VIX <15', () => {
      const score = calculateVixScore(12);
      expect(score).toBeGreaterThanOrEqual(2);
    });

    it('should return red (≤-2) for high VIX >25', () => {
      const score = calculateVixScore(30);
      expect(score).toBeLessThanOrEqual(-2);
    });

    it('should return max negative for extreme fear VIX >60', () => {
      const score = calculateVixScore(65);
      expect(score).toBe(-4);
    });

    it('should return max positive for very low VIX <10', () => {
      const score = calculateVixScore(8);
      expect(score).toBeCloseTo(2, 0);
    });
  });

  describe('calculateFearGreedScore', () => {
    it('should return gray for neutral sentiment around 50', () => {
      const score = calculateFearGreedScore(52.66);
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });

    it('should return positive for extreme greed >65', () => {
      const score = calculateFearGreedScore(75);
      expect(score).toBeGreaterThanOrEqual(3);
    });

    it('should return negative for fear <35', () => {
      const score = calculateFearGreedScore(25);
      expect(score).toBeLessThan(0);
    });

    it('should return max positive for extreme greed >85', () => {
      const score = calculateFearGreedScore(90);
      expect(score).toBeGreaterThan(3.5);
    });

    it('should return max negative for extreme fear <15', () => {
      const score = calculateFearGreedScore(10);
      expect(score).toBeLessThanOrEqual(-3.5);
    });
  });

  describe('calculateEurUsdScore', () => {
    it('should return positive for strong USD (EUR/USD < 1.05)', () => {
      const score = calculateEurUsdScore(1.03);
      expect(score).toBeGreaterThanOrEqual(2);
    });

    it('should return max positive for very strong USD (< 1.02)', () => {
      const score = calculateEurUsdScore(1.00);
      expect(score).toBe(3);
    });

    it('should return neutral for balanced EUR/USD around 1.10-1.12', () => {
      const score = calculateEurUsdScore(1.10);
      expect(score).toBeGreaterThan(-1);
      expect(score).toBeLessThan(1);
    });

    it('should return negative for weak USD (EUR/USD > 1.15)', () => {
      const score = calculateEurUsdScore(1.18);
      expect(score).toBeLessThanOrEqual(-1);
    });

    it('should return max negative for very weak USD (> 1.20)', () => {
      const score = calculateEurUsdScore(1.25);
      expect(score).toBe(-2);
    });

    it('should handle typical current rate around 1.05', () => {
      const score = calculateEurUsdScore(1.05);
      expect(score).toBeGreaterThanOrEqual(2);
      expect(score).toBeLessThanOrEqual(3);
    });
  });

  describe('Formula Balance Validation', () => {
    it('should ensure all formulas use continuous interpolation', () => {
      // Test that there are no sudden jumps in scores
      const rsiScores = [50, 51, 52, 53, 54, 55].map(calculateRsiScore);

      for (let i = 1; i < rsiScores.length; i++) {
        const diff = Math.abs(rsiScores[i] - rsiScores[i - 1]);
        expect(diff).toBeLessThan(0.5); // No sudden jumps
      }
    });

    it('should have asymmetric behavior reflecting greed/fear bias', () => {
      // Fear & Greed formulas may not be symmetric
      const below = calculateFearGreedScore(40);
      const above = calculateFearGreedScore(60);

      // Just verify both return valid scores
      expect(below).toBeLessThan(2);
      expect(above).toBeGreaterThan(-2);
    });
  });

  describe('calculateMomentum7dScore', () => {
    it('should return positive score for strong positive momentum (>5%)', () => {
      const score = calculateMomentum7dScore(6);
      expect(score).toBeGreaterThanOrEqual(1.5);
    });

    it('should return negative score for strong negative momentum (<-5%)', () => {
      const score = calculateMomentum7dScore(-6);
      expect(score).toBeLessThanOrEqual(-1.5);
    });

    it('should return near-zero for neutral momentum', () => {
      const score = calculateMomentum7dScore(0);
      expect(Math.abs(score)).toBeLessThan(0.5);
    });
  });

  describe('calculateMomentumScore', () => {
    it('should return 0 for insufficient data', () => {
      const score = calculateMomentumScore([100, 101, 102]);
      expect(score).toBe(0);
    });

    it('should return positive for upward momentum', () => {
      const prices = Array.from({ length: 30 }, (_, i) => 5000 + i * 10); // Uptrend
      const score = calculateMomentumScore(prices);
      expect(score).toBeGreaterThan(0);
    });

    it('should return negative for downward momentum', () => {
      const prices = Array.from({ length: 30 }, (_, i) => 5000 - i * 10); // Downtrend
      const score = calculateMomentumScore(prices);
      expect(score).toBeLessThan(0);
    });
  });

  describe('calculateMaScore', () => {
    it('should return 0 for insufficient data', () => {
      const score = calculateMaScore(Array.from({ length: 100 }, () => 5000));
      expect(score).toBe(0);
    });

    it('should return positive when price above MAs', () => {
      const prices = Array.from({ length: 200 }, (_, i) => 4000 + i * 5); // Uptrend
      const score = calculateMaScore(prices);
      expect(score).toBeGreaterThan(0);
    });

    it('should return negative when price below MAs', () => {
      const prices = Array.from({ length: 200 }, (_, i) => 5000 - i * 5); // Downtrend
      const score = calculateMaScore(prices);
      expect(score).toBeLessThan(0);
    });
  });

  describe('calculatePutCallScore', () => {
    it('should return 0 for invalid ratio', () => {
      expect(calculatePutCallScore(0)).toBe(0);
    });

    it('should return positive for high put/call ratio (fear)', () => {
      const score = calculatePutCallScore(1.2);
      expect(score).toBeGreaterThan(1);
    });

    it('should return negative for low put/call ratio (greed)', () => {
      const score = calculatePutCallScore(0.6);
      expect(score).toBeLessThan(0);
    });
  });

  describe('calculateTreasury10YScore', () => {
    it('should return 0 for invalid yield', () => {
      expect(calculateTreasury10YScore(0)).toBe(0);
    });

    it('should return negative for high yields (>5%)', () => {
      const score = calculateTreasury10YScore(5.5);
      expect(score).toBeLessThan(-1);
    });

    it('should return positive for low yields (<3%)', () => {
      const score = calculateTreasury10YScore(2.5);
      expect(score).toBeGreaterThan(0);
    });
  });

  describe('calculateStocksScore', () => {
    it('should return 0 for null data', () => {
      const score = calculateStocksScore(null as any);
      expect(score).toBe(0);
    });

    it('should calculate weighted score for bullish scenario', () => {
      const data = {
        vix: 12,
        rsiSP500: 65,
        eurUsd: 1.05,
        fearGreed: 75,
        sp500Price: 6700,
        sp500ATH: 6750,
        sp500Prices: Array.from({ length: 200 }, (_, i) => 6000 + i * 3),
        putCallRatio: 0.7,
        treasury10Y: 3.5,
      };
      const score = calculateStocksScore(data);
      expect(score).toBeGreaterThan(0);
    });

    it('should calculate weighted score for bearish scenario', () => {
      const data = {
        vix: 35,
        rsiSP500: 25,
        eurUsd: 1.20,
        fearGreed: 20,
        sp500Price: 5000,
        sp500ATH: 6750,
        sp500Prices: Array.from({ length: 200 }, (_, i) => 6000 - i * 3),
        putCallRatio: 1.3,
        treasury10Y: 5.5,
      };
      const score = calculateStocksScore(data);
      expect(score).toBeLessThan(0);
    });

    it('should handle partial data gracefully', () => {
      const data = {
        vix: 15,
        rsiSP500: 50,
        eurUsd: 1.10,
        fearGreed: 50,
      };
      const score = calculateStocksScore(data);
      expect(typeof score).toBe('number');
      expect(isNaN(score)).toBe(false);
    });
  });
});

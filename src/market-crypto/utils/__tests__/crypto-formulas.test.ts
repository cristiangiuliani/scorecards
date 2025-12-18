import {
  calculateAthDistanceScore,
  calculateBtcRsiScore,
  calculateBtcDominanceScore,
  calculateBtcFearGreedScore,
  calculateAltSeasonScore,
  calculateMomentum7dScore,
  calculateMomentumScore,
  calculateMaScore,
  calculateVolumeScore,
  calculateCryptoScore,
  calculateAthDistance,
  calculateMomentum7d,
  calculateAltcoinSeasonIndex,
} from '../crypto-formulas';

describe('Crypto Formulas', () => {
  describe('calculateAthDistanceScore', () => {
    it('should return 4 (green) when at ATH', () => {
      expect(calculateAthDistanceScore(124128, 124128)).toBeCloseTo(4, 1);
    });

    it('should return 3+ (green) when very close to ATH (<2% distance)', () => {
      const score = calculateAthDistanceScore(122638, 124128); // ~1.2% distance
      expect(score).toBeGreaterThanOrEqual(3);
    });

    it('should return gray zone for moderate distance (10-30%)', () => {
      const score = calculateAthDistanceScore(100000, 124128); // ~19% distance
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });

    it('should return red (≤-2) for large distance >40%', () => {
      const score = calculateAthDistanceScore(70000, 124128); // ~43% distance
      expect(score).toBeLessThanOrEqual(-2);
    });

    it('should handle extreme bear market (>70% down)', () => {
      const score = calculateAthDistanceScore(35000, 124128); // ~71% down
      expect(score).toBe(-4);
    });
  });

  describe('calculateBtcRsiScore', () => {
    it('should return GRAY for RSI 30-35 (zone grigia oversold)', () => {
      const score = calculateBtcRsiScore(31.9);
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(0);
    });

    it('should return RED (≤-2) for RSI <30 (oversold)', () => {
      const score = calculateBtcRsiScore(28);
      expect(score).toBeLessThanOrEqual(-2);
    });

    it('should return gray for neutral RSI 45-65', () => {
      const score = calculateBtcRsiScore(55);
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });

    it('should return positive for overbought RSI >70', () => {
      const score = calculateBtcRsiScore(75);
      expect(score).toBeGreaterThanOrEqual(2);
    });

    it('should return neutral for healthy RSI 45-55', () => {
      const score = calculateBtcRsiScore(50);
      expect(score).toBeGreaterThan(-1);
      expect(score).toBeLessThan(1);
    });

    it('should handle extreme oversold RSI <15', () => {
      const score = calculateBtcRsiScore(10);
      expect(score).toBe(-4);
    });
  });

  describe('calculateBtcDominanceScore', () => {
    it('should return positive for healthy dominance 40-50%', () => {
      const score = calculateBtcDominanceScore(45);
      expect(score).toBeGreaterThan(0);
    });

    it('should return positive for extreme dominance >65%', () => {
      const score = calculateBtcDominanceScore(70);
      expect(score).toBeGreaterThan(0);
    });

    it('should return negative for very low dominance <30%', () => {
      const score = calculateBtcDominanceScore(25);
      expect(score).toBeLessThan(0);
    });
  });

  describe('calculateBtcFearGreedScore', () => {
    it('should return gray for neutral sentiment around 50', () => {
      const score = calculateBtcFearGreedScore(50);
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });

    it('should return positive for extreme greed >75', () => {
      const score = calculateBtcFearGreedScore(80);
      expect(score).toBeGreaterThanOrEqual(2);
    });

    it('should return negative for fear <35', () => {
      const score = calculateBtcFearGreedScore(25);
      expect(score).toBeLessThanOrEqual(-1);
    });
  });

  describe('RSI Oversold Fix Validation', () => {
    it('should correctly implement the RSI 30-35 gray zone', () => {
      // Zone 30-35 should be gray (between -2 and 0)
      expect(calculateBtcRsiScore(32)).toBeGreaterThan(-2);
      expect(calculateBtcRsiScore(35)).toBeLessThan(0);
    });

    it('should correctly implement RSI <30 red zone', () => {
      // Below 30 should be red (≤-2)
      expect(calculateBtcRsiScore(29)).toBeLessThanOrEqual(-2);
      expect(calculateBtcRsiScore(25)).toBeLessThanOrEqual(-2);
      expect(calculateBtcRsiScore(20)).toBeLessThanOrEqual(-2);
    });

    it('should have continuous transition through the zones', () => {
      const scores = [15, 20, 25, 30, 32, 35, 40].map(calculateBtcRsiScore);

      // Verify monotonic increase (no sudden jumps)
      for (let i = 1; i < scores.length; i++) {
        expect(scores[i]).toBeGreaterThan(scores[i - 1]);
      }
    });
  });

  describe('calculateAltSeasonScore', () => {
    it('should return positive for altcoin season (low dominance)', () => {
      const score = calculateAltSeasonScore(30);
      expect(score).toBeGreaterThan(0);
    });

    it('should return negative for Bitcoin dominance (high dominance)', () => {
      const score = calculateAltSeasonScore(70);
      expect(score).toBeLessThan(0);
    });

    it('should return neutral for balanced market', () => {
      const score = calculateAltSeasonScore(50);
      expect(Math.abs(score)).toBeLessThan(1);
    });
  });

  describe('calculateMomentum7dScore', () => {
    it('should return positive for strong upward momentum', () => {
      const score = calculateMomentum7dScore(15);
      expect(score).toBeGreaterThan(1);
    });

    it('should return negative for strong downward momentum', () => {
      const score = calculateMomentum7dScore(-15);
      expect(score).toBeLessThan(-1);
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

    it('should return positive for strong uptrend', () => {
      // Strong uptrend: 50000 to 60000 (+20%)
      const prices = Array.from({ length: 30 }, (_, i) => 50000 + i * 333);
      const score = calculateMomentumScore(prices);
      expect(score).toBeGreaterThan(0);
    });

    it('should return negative for strong downtrend', () => {
      // Strong downtrend: 50000 to 40000 (-20%)
      const prices = Array.from({ length: 30 }, (_, i) => 50000 - i * 333);
      const score = calculateMomentumScore(prices);
      expect(score).toBeLessThan(0);
    });
  });

  describe('calculateMaScore', () => {
    it('should return 0 for insufficient data', () => {
      const score = calculateMaScore(Array.from({ length: 100 }, () => 50000));
      expect(score).toBe(0);
    });

    it('should return positive when price above MAs', () => {
      const prices = Array.from({ length: 200 }, (_, i) => 40000 + i * 50);
      const score = calculateMaScore(prices);
      expect(score).toBeGreaterThan(0);
    });

    it('should return negative when price below MAs', () => {
      const prices = Array.from({ length: 200 }, (_, i) => 60000 - i * 50);
      const score = calculateMaScore(prices);
      expect(score).toBeLessThan(0);
    });
  });

  describe('calculateVolumeScore', () => {
    it('should return 0 for insufficient data', () => {
      const score = calculateVolumeScore([1000, 1100]);
      expect(score).toBe(0);
    });

    it('should return positive for significantly increasing volume (recent > 1.2x average)', () => {
      // Array with much lower historical volumes, higher recent volumes
      const volumes = [800, 800, 800, 800, 800, 1600, 1700, 1800, 1900, 2000, 2100];
      const score = calculateVolumeScore(volumes);
      expect(score).toBeGreaterThan(0);
    });

    it('should return negative for significantly decreasing volume (recent < 0.8x average)', () => {
      // Array with higher historical volumes, much lower recent volumes
      const volumes = [2000, 2000, 2000, 2000, 2000, 800, 800, 800, 800, 800, 800];
      const score = calculateVolumeScore(volumes);
      expect(score).toBeLessThan(0);
    });
  });

  describe('calculateAthDistance', () => {
    it('should return 0 for undefined values', () => {
      expect(calculateAthDistance(undefined, 100000)).toBe(0);
      expect(calculateAthDistance(50000, undefined)).toBe(0);
    });

    it('should calculate percentage of current price vs ATH', () => {
      // 95000 / 100000 * 100 = 95%
      const distance = calculateAthDistance(95000, 100000);
      expect(distance).toBeCloseTo(95, 0);
    });
  });

  describe('calculateMomentum7d', () => {
    it('should return 0 for undefined or insufficient data', () => {
      expect(calculateMomentum7d(undefined)).toBe(0);
      expect(calculateMomentum7d([])).toBe(0);
      expect(calculateMomentum7d([100, 101])).toBe(0);
    });

    it('should calculate 7-day momentum correctly', () => {
      const prices = [50000, 51000, 52000, 53000, 54000, 55000, 56000, 57000];
      const momentum = calculateMomentum7d(prices);
      expect(momentum).toBeGreaterThan(0);
    });
  });

  describe('calculateAltcoinSeasonIndex', () => {
    it('should return index based on BTC dominance', () => {
      // Formula: ((70 - btcDominance) / 30) * 100, clamped 0-100
      // btcDominance 40 → (70-40)/30*100 = 100 (max altcoin season)
      expect(calculateAltcoinSeasonIndex(40)).toBe(100);
      // btcDominance 60 → (70-60)/30*100 = 33.33
      expect(calculateAltcoinSeasonIndex(60)).toBeCloseTo(33.33, 0);
      // btcDominance 70 → (70-70)/30*100 = 0 (no altcoin season)
      expect(calculateAltcoinSeasonIndex(70)).toBe(0);
    });

    it('should handle undefined or 0 dominance', () => {
      // undefined → 0 → (70-0)/30*100 = 233.33, clamped to 100
      expect(calculateAltcoinSeasonIndex(undefined)).toBe(100);
      expect(calculateAltcoinSeasonIndex(0)).toBe(100);
    });
  });

  describe('calculateCryptoScore', () => {
    it('should return 0 for null data', () => {
      const score = calculateCryptoScore(null as any, 50, 50);
      expect(score).toBe(0);
    });

    it('should calculate weighted score for bullish scenario', () => {
      const data = {
        btcFearGreed: 75,
        btcDominance: 45,
        currentPrice: 95000,
        ath: 100000,
        prices: Array.from({ length: 200 }, (_, i) => 80000 + i * 50),
        volumes: [1000, 1100, 1200, 1300, 1400, 1500, 1600],
      };
      const score = calculateCryptoScore(data, 65, 60);
      expect(score).toBeGreaterThan(0);
    });

    it('should calculate weighted score for bearish scenario', () => {
      const data = {
        btcFearGreed: 20,
        btcDominance: 60,
        currentPrice: 50000,
        ath: 100000,
        prices: Array.from({ length: 200 }, (_, i) => 80000 - i * 50),
        volumes: [1600, 1500, 1400, 1300, 1200, 1100, 1000],
      };
      const score = calculateCryptoScore(data, 25, 30);
      expect(score).toBeLessThan(0);
    });

    it('should handle partial data gracefully', () => {
      const data = {
        btcFearGreed: 50,
        btcDominance: 50,
      };
      const score = calculateCryptoScore(data, 50, 50);
      expect(typeof score).toBe('number');
      expect(isNaN(score)).toBe(false);
    });
  });
});

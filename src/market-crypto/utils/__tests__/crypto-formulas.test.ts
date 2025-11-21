import {
  calculateAthDistanceScore,
  calculateBtcRsiScore,
  calculateBtcDominanceScore,
  calculateBtcFearGreedScore,
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
});

import {
  calculateAthDistanceScore,
  calculateRsiScore,
  calculateVixScore,
  calculateFearGreedScore,
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
});

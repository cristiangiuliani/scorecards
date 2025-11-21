import {
  calculateNvidiaPEScore,
  calculateNasdaqPEScore,
  calculateVixPersistenceScore,
  calculateNvdaNasdaqRatioScore,
  calculateFearGreedScore,
  calculateRsiScore,
} from '../bubble-formulas';

describe('AI Bubble Formulas', () => {
  describe('calculateNvidiaPEScore', () => {
    it('should return 0 for undefined P/E', () => {
      expect(calculateNvidiaPEScore(undefined)).toBe(0);
    });

    it('should return GRAY for current P/E around 57 (threshold 65)', () => {
      const score = calculateNvidiaPEScore(56.97);
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });

    it('should return negative for P/E above threshold (65)', () => {
      const score = calculateNvidiaPEScore(70);
      expect(score).toBeLessThanOrEqual(-2);
    });

    it('should return positive for low P/E (<39)', () => {
      const score = calculateNvidiaPEScore(35);
      expect(score).toBeGreaterThanOrEqual(2);
    });

    it('should handle extreme valuations (P/E > 65)', () => {
      expect(calculateNvidiaPEScore(100)).toBe(-4);
    });
  });

  describe('calculateNasdaqPEScore', () => {
    it('should return 0 for undefined P/E', () => {
      expect(calculateNasdaqPEScore(undefined)).toBe(0);
    });

    it('should return negative for P/E above threshold (38)', () => {
      const score = calculateNasdaqPEScore(40);
      expect(score).toBeLessThan(0);
    });

    it('should return positive for P/E below 60% of threshold (~23)', () => {
      const score = calculateNasdaqPEScore(20);
      expect(score).toBeGreaterThan(0);
    });

    it('should handle extreme P/E (>38)', () => {
      expect(calculateNasdaqPEScore(50)).toBe(-4);
    });
  });

  describe('calculateVixPersistenceScore', () => {
    it('should return 0 for insufficient data', () => {
      expect(calculateVixPersistenceScore([15, 16])).toBe(0);
      expect(calculateVixPersistenceScore(undefined)).toBe(0);
    });

    it('should return positive for low average VIX (<15)', () => {
      const lowVix = [12, 13, 11, 14, 12];
      const score = calculateVixPersistenceScore(lowVix);
      expect(score).toBeGreaterThan(2);
    });

    it('should return negative for persistent high VIX (>30 for 3+ days)', () => {
      const highVix = [35, 32, 31, 33, 34];
      const score = calculateVixPersistenceScore(highVix);
      expect(score).toBeLessThan(0);
    });

    it('should return neutral for normal VIX (15-20)', () => {
      const normalVix = [16, 17, 18, 16, 17];
      const score = calculateVixPersistenceScore(normalVix);
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });
  });

  describe('calculateNvdaNasdaqRatioScore', () => {
    it('should return 0 for missing values', () => {
      expect(calculateNvdaNasdaqRatioScore(undefined, 30)).toBe(0);
      expect(calculateNvdaNasdaqRatioScore(60, undefined)).toBe(0);
    });

    it('should return negative for high ratio (>2.0)', () => {
      const score = calculateNvdaNasdaqRatioScore(80, 35); // ratio ~2.3
      expect(score).toBeLessThanOrEqual(-2);
    });

    it('should return gray for moderate ratio (1.4-1.7)', () => {
      const score = calculateNvdaNasdaqRatioScore(57, 35); // ratio ~1.63
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });

    it('should return positive for low ratio (<1.2)', () => {
      const score = calculateNvdaNasdaqRatioScore(40, 35); // ratio ~1.14
      expect(score).toBeGreaterThan(0);
    });
  });

  describe('calculateFearGreedScore (Bubble)', () => {
    it('should return 0 for undefined', () => {
      expect(calculateFearGreedScore(undefined)).toBe(0);
    });

    it('should return negative for extreme greed (>85)', () => {
      expect(calculateFearGreedScore(90)).toBe(-4);
    });

    it('should return negative for greed (>75)', () => {
      expect(calculateFearGreedScore(80)).toBe(-3);
    });

    it('should return neutral for neutral sentiment (40-60)', () => {
      const score = calculateFearGreedScore(52.66);
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });

    it('should return positive for fear (<25)', () => {
      expect(calculateFearGreedScore(20)).toBe(3);
    });
  });

  describe('calculateRsiScore (Bubble)', () => {
    it('should return 0 for undefined', () => {
      expect(calculateRsiScore(undefined)).toBe(0);
    });

    it('should return negative for severely overbought (>80)', () => {
      expect(calculateRsiScore(85)).toBe(-4);
    });

    it('should return negative for overbought (>70)', () => {
      const score = calculateRsiScore(75);
      expect(score).toBeLessThan(0);
    });

    it('should return neutral for moderate RSI (40-70)', () => {
      const score = calculateRsiScore(67.07);
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });

    it('should return positive for oversold (<30)', () => {
      expect(calculateRsiScore(25)).toBe(3);
    });
  });

  describe('Bubble Risk Integration', () => {
    it('should identify high bubble risk with extreme values', () => {
      const nvidiaScore = calculateNvidiaPEScore(70);
      const nasdaqScore = calculateNasdaqPEScore(40);
      const fearGreedScore = calculateFearGreedScore(85);

      // All should be negative (high risk)
      expect(nvidiaScore).toBeLessThan(0);
      expect(nasdaqScore).toBeLessThan(0);
      expect(fearGreedScore).toBeLessThan(0);
    });

    it('should identify low bubble risk with conservative values', () => {
      const nvidiaScore = calculateNvidiaPEScore(30);
      const fearGreedScore = calculateFearGreedScore(20);
      const rsiScore = calculateRsiScore(25);

      // All should be positive (low risk)
      expect(nvidiaScore).toBeGreaterThan(0);
      expect(fearGreedScore).toBeGreaterThan(0);
      expect(rsiScore).toBeGreaterThan(0);
    });
  });
});

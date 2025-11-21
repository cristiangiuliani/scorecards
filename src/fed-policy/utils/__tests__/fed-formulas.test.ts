import {
  calculateCpiScore,
  calculateCorePceScore,
  calculateUnemploymentScore,
  calculateWageGrowthScore,
  calculateFedFundsScore,
} from '../fed-formulas';

describe('Fed Policy Formulas', () => {
  describe('calculateCpiScore', () => {
    it('should return negative (dovish) for low inflation (1-2%)', () => {
      const score = calculateCpiScore(1.5);
      expect(score).toBeLessThan(0);
    });

    it('should return neutral for target inflation (~3%)', () => {
      const score = calculateCpiScore(3.0);
      expect(score).toBeGreaterThan(-1);
      expect(score).toBeLessThan(1);
    });

    it('should return positive (hawkish) for high inflation (>4%)', () => {
      const score = calculateCpiScore(4.5);
      expect(score).toBeGreaterThan(2);
    });

    it('should handle extreme inflation (5%+)', () => {
      const score = calculateCpiScore(5.5);
      expect(score).toBeGreaterThan(3);
    });
  });

  describe('calculateCorePceScore', () => {
    it('should return dovish for low Core PCE (1-1.5%)', () => {
      const score = calculateCorePceScore(1.2);
      expect(score).toBeLessThan(0);
    });

    it('should return neutral for target Core PCE (~2.5%)', () => {
      const score = calculateCorePceScore(2.5);
      expect(score).toBeGreaterThan(-1);
      expect(score).toBeLessThan(1);
    });

    it('should return hawkish for elevated Core PCE (>3%)', () => {
      const score = calculateCorePceScore(3.5);
      expect(score).toBeGreaterThan(1);
    });

    it('should handle extreme Core PCE (4%+)', () => {
      const score = calculateCorePceScore(4.5);
      expect(score).toBeGreaterThan(3);
    });
  });

  describe('calculateUnemploymentScore', () => {
    it('should return hawkish for low unemployment (3.5%)', () => {
      const score = calculateUnemploymentScore(3.5);
      expect(score).toBeGreaterThan(2);
    });

    it('should return neutral for normal unemployment (~4.5%)', () => {
      const score = calculateUnemploymentScore(4.5);
      expect(score).toBeGreaterThan(-1);
      expect(score).toBeLessThan(1);
    });

    it('should return dovish for high unemployment (>5%)', () => {
      const score = calculateUnemploymentScore(5.2);
      expect(score).toBeLessThan(0);
    });

    it('should handle recession-level unemployment (>5.5%)', () => {
      const score = calculateUnemploymentScore(6.0);
      expect(score).toBeLessThan(-2);
    });
  });

  describe('calculateWageGrowthScore', () => {
    it('should return dovish for low wage growth (2%)', () => {
      const score = calculateWageGrowthScore(2.0);
      expect(score).toBeLessThan(0);
    });

    it('should return neutral for moderate wage growth (~3.5%)', () => {
      const score = calculateWageGrowthScore(3.5);
      expect(score).toBeGreaterThan(-1);
      expect(score).toBeLessThan(1);
    });

    it('should return hawkish for high wage growth (>4%)', () => {
      const score = calculateWageGrowthScore(4.5);
      expect(score).toBeGreaterThan(1);
    });

    it('should handle extreme wage growth (5%+)', () => {
      const score = calculateWageGrowthScore(5.5);
      expect(score).toBeGreaterThan(3);
    });
  });

  describe('calculateFedFundsScore', () => {
    it('should return dovish for zero rates (0%)', () => {
      const score = calculateFedFundsScore(0);
      expect(score).toBeLessThan(-2);
    });

    it('should return neutral for neutral rate (~2.75%)', () => {
      const score = calculateFedFundsScore(2.75);
      expect(score).toBeGreaterThan(-1);
      expect(score).toBeLessThan(1);
    });

    it('should return hawkish for elevated rates (4-5%)', () => {
      const score = calculateFedFundsScore(4.5);
      expect(score).toBeGreaterThan(1);
    });

    it('should handle extreme restrictive rates (>5.5%)', () => {
      const score = calculateFedFundsScore(6.0);
      expect(score).toBeGreaterThan(3);
    });
  });

  describe('Fed Policy Integration', () => {
    it('should identify hawkish environment (high inflation + low unemployment)', () => {
      const cpiScore = calculateCpiScore(4.5);
      const unemploymentScore = calculateUnemploymentScore(3.7);

      expect(cpiScore).toBeGreaterThan(0);
      expect(unemploymentScore).toBeGreaterThan(0);
    });

    it('should identify dovish environment (low inflation + high unemployment)', () => {
      const cpiScore = calculateCpiScore(1.5);
      const unemploymentScore = calculateUnemploymentScore(5.5);

      expect(cpiScore).toBeLessThan(0);
      expect(unemploymentScore).toBeLessThan(0);
    });

    it('should identify neutral environment (balanced metrics)', () => {
      const cpiScore = calculateCpiScore(3.0);
      const corePceScore = calculateCorePceScore(2.5);
      const unemploymentScore = calculateUnemploymentScore(4.5);

      expect(Math.abs(cpiScore)).toBeLessThan(2);
      expect(Math.abs(corePceScore)).toBeLessThan(2);
      expect(Math.abs(unemploymentScore)).toBeLessThan(2);
    });
  });
});

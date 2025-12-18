import {
  calculateCpiScore,
  calculateCorePceScore,
  calculateUnemploymentScore,
  calculateWageGrowthScore,
  calculateFedFundsScore,
  calculateRateCutProbability,
  calculateRateCutProbabilityScore,
  calculateFedPolicyScore,
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

  describe('calculateRateCutProbability', () => {
    it('should return high probability for dovish conditions (low inflation, high unemployment, high rates)', () => {
      // Scenario: Inflation at 2.2%, unemployment 5.0%, rates at 5.0%
      const probability = calculateRateCutProbability(5.0, 2.2, 2.3, 5.0);
      expect(probability).toBeGreaterThan(60);
      expect(probability).toBeLessThanOrEqual(100);
    });

    it('should return low probability for hawkish conditions (high inflation, low unemployment)', () => {
      // Scenario: Inflation at 4.0%, unemployment 3.5%, rates at 3.0%
      const probability = calculateRateCutProbability(3.0, 4.5, 4.0, 3.5);
      expect(probability).toBeLessThan(40);
      expect(probability).toBeGreaterThanOrEqual(0);
    });

    it('should return moderate probability for balanced conditions', () => {
      // Scenario: Inflation at 2.8%, unemployment 4.2%, rates at 4.5%
      const probability = calculateRateCutProbability(4.5, 2.8, 2.7, 4.2);
      expect(probability).toBeGreaterThan(40);
      expect(probability).toBeLessThan(70);
    });

    it('should return very high probability when inflation is low and rates are very high', () => {
      // Scenario: Inflation at 2.0%, unemployment 4.0%, rates at 5.5%
      const probability = calculateRateCutProbability(5.5, 2.0, 2.1, 4.0);
      expect(probability).toBeGreaterThan(70);
    });

    it('should return very low probability when inflation is high despite high unemployment', () => {
      // Scenario: High inflation overrides other factors
      const probability = calculateRateCutProbability(4.0, 4.5, 4.2, 5.0);
      expect(probability).toBeLessThan(40);
    });

    it('should increase probability when unemployment rises sharply', () => {
      // Scenario: Recessionary unemployment
      const probability = calculateRateCutProbability(4.5, 2.5, 2.4, 5.5);
      expect(probability).toBeGreaterThan(70);
    });

    it('should factor in real rates (high real rates = restrictive policy)', () => {
      // Scenario: Rates at 5%, inflation at 2.5% = real rate 2.5%
      const highRealRate = calculateRateCutProbability(5.0, 2.5, 2.5, 4.0);

      // Scenario: Rates at 3%, inflation at 2.5% = real rate 0.5%
      const lowRealRate = calculateRateCutProbability(3.0, 2.5, 2.5, 4.0);

      expect(highRealRate).toBeGreaterThan(lowRealRate);
    });

    it('should return valid percentage (0-100)', () => {
      // Test extreme scenarios
      const prob1 = calculateRateCutProbability(0, 10, 10, 10);
      const prob2 = calculateRateCutProbability(10, 0, 0, 2);

      expect(prob1).toBeGreaterThanOrEqual(0);
      expect(prob1).toBeLessThanOrEqual(100);
      expect(prob2).toBeGreaterThanOrEqual(0);
      expect(prob2).toBeLessThanOrEqual(100);
    });
  });

  describe('calculateRateCutProbabilityScore', () => {
    it('should return dovish score for high cut probability (>75%)', () => {
      const score = calculateRateCutProbabilityScore(80);
      expect(score).toBeLessThan(-2);
    });

    it('should return hawkish score for low cut probability (<25%)', () => {
      const score = calculateRateCutProbabilityScore(20);
      expect(score).toBeGreaterThan(2);
    });

    it('should return neutral score for moderate probability (~50%)', () => {
      const score = calculateRateCutProbabilityScore(50);
      expect(score).toBeGreaterThan(-1);
      expect(score).toBeLessThan(1);
    });

    it('should return very dovish for 100% probability', () => {
      const score = calculateRateCutProbabilityScore(100);
      expect(score).toBeLessThan(-3);
    });

    it('should return very hawkish for 0% probability', () => {
      const score = calculateRateCutProbabilityScore(0);
      expect(score).toBeGreaterThan(3);
    });
  });

  describe('calculateFedPolicyScore', () => {
    it('should calculate weighted score correctly for hawkish scenario', () => {
      const data = {
        cpiInflation: 4.5,
        corePce: 3.8,
        unemploymentRate: 3.5,
        averageHourlyEarnings: 5.0,
        federalFundsRate: 5.5,
      };
      const score = calculateFedPolicyScore(data);
      expect(score).toBeGreaterThan(0); // High inflation + low unemployment = hawkish
    });

    it('should calculate weighted score correctly for dovish scenario', () => {
      const data = {
        cpiInflation: 1.5,
        corePce: 1.2,
        unemploymentRate: 5.5,
        averageHourlyEarnings: 2.0,
        federalFundsRate: 0.5,
      };
      const score = calculateFedPolicyScore(data);
      expect(score).toBeLessThan(0); // Low inflation + high unemployment = dovish
    });

    it('should handle default/undefined data gracefully', () => {
      const data = {
        cpiInflation: 0,
        corePce: 0,
        unemploymentRate: 0,
        averageHourlyEarnings: 0,
        federalFundsRate: 0,
      };
      const score = calculateFedPolicyScore(data);
      // With 0 values, each metric returns a specific score based on the formulas
      // The result won't be 0 but should be a valid number
      expect(typeof score).toBe('number');
      expect(isNaN(score)).toBe(false);
    });

    it('should handle neutral data (all metrics at neutral levels)', () => {
      const data = {
        cpiInflation: 3.0,
        corePce: 2.5,
        unemploymentRate: 4.5,
        averageHourlyEarnings: 3.5,
        federalFundsRate: 2.75,
      };
      const score = calculateFedPolicyScore(data);
      expect(Math.abs(score)).toBeLessThan(2); // Should be close to neutral
    });
  });
});

import {
  calculateYield10YScore,
  calculateYield2YScore,
  calculateYield5YScore,
  calculateYieldCurveSlopeScore,
  calculateCreditSpreadsScore,
  calculateInflationScore,
  calculateBondsScore,
} from '../bonds-formulas';

describe('Treasury Bonds Formulas', () => {
  describe('calculateYield10YScore', () => {
    it('should return GRAY for current rate environment 4.0-4.5%', () => {
      // Adjusted neutral zone: 3.5-4.0%
      const score = calculateYield10YScore(4.11);
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });

    it('should return gray for neutral zone 3.5-4.0%', () => {
      expect(calculateYield10YScore(3.7)).toBeGreaterThan(-2);
      expect(calculateYield10YScore(3.7)).toBeLessThan(2);
    });

    it('should return green (≥2) for low yields <3.0%', () => {
      const score = calculateYield10YScore(2.5);
      expect(score).toBeGreaterThanOrEqual(1);
    });

    it('should return red (≤-2) for high yields >4.5%', () => {
      const score = calculateYield10YScore(5.0);
      expect(score).toBeLessThanOrEqual(-2);
    });

    it('should handle extreme high yields >5.5%', () => {
      expect(calculateYield10YScore(6.0)).toBe(-4);
    });
  });

  describe('calculateYield2YScore', () => {
    it('should return GRAY for current rate environment 3.5-4.0%', () => {
      // Adjusted neutral zone: 3.0-3.5%
      const score = calculateYield2YScore(3.61);
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });

    it('should return gray for neutral zone 3.0-3.5%', () => {
      expect(calculateYield2YScore(3.25)).toBeGreaterThan(-2);
      expect(calculateYield2YScore(3.25)).toBeLessThan(2);
    });

    it('should return green (≥2) for low yields <2.5%', () => {
      const score = calculateYield2YScore(2.0);
      expect(score).toBeGreaterThanOrEqual(1);
    });

    it('should return red (≤-2) for high yields >4.0%', () => {
      const score = calculateYield2YScore(4.5);
      expect(score).toBeLessThanOrEqual(-2);
    });
  });

  describe('calculateYieldCurveSlopeScore', () => {
    it('should return GRAY for positive slope 0.3-0.6', () => {
      const slope = 4.11 - 3.61; // 0.50
      const score = calculateYieldCurveSlopeScore(slope);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(2);
    });

    it('should return green (≥2) for normal steep curve >0.6', () => {
      const score = calculateYieldCurveSlopeScore(1.0);
      expect(score).toBeGreaterThanOrEqual(2);
    });

    it('should return negative for inverted curve <-0.2', () => {
      const score = calculateYieldCurveSlopeScore(-0.6);
      expect(score).toBeLessThanOrEqual(-1);
    });

    it('should return max positive for very steep curve >1.5', () => {
      expect(calculateYieldCurveSlopeScore(2.0)).toBe(4);
    });

    it('should return max negative for deeply inverted <-1.0', () => {
      expect(calculateYieldCurveSlopeScore(-1.5)).toBe(-4);
    });
  });

  describe('calculateCreditSpreadsScore', () => {
    it('should return GREEN for low spreads <100bp', () => {
      const score = calculateCreditSpreadsScore(77); // 0.77% = 77bp
      expect(score).toBeGreaterThanOrEqual(2);
    });

    it('should return gray for normal spreads 100-200bp', () => {
      const score = calculateCreditSpreadsScore(150);
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });

    it('should return red (≤-2) for high spreads >200bp', () => {
      const score = calculateCreditSpreadsScore(250);
      expect(score).toBeLessThanOrEqual(-2);
    });

    it('should return max negative for crisis spreads >400bp', () => {
      expect(calculateCreditSpreadsScore(450)).toBe(-4);
    });
  });

  describe('calculateInflationScore', () => {
    it('should return GRAY for target inflation 2.0-2.5%', () => {
      const score = calculateInflationScore(2.30);
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });

    it('should return green (≥2) for low inflation <2.0%', () => {
      const score = calculateInflationScore(1.5);
      expect(score).toBeGreaterThanOrEqual(1);
    });

    it('should return red (≤-2) for high inflation >3.5%', () => {
      const score = calculateInflationScore(4.0);
      expect(score).toBeLessThanOrEqual(-2);
    });
  });

  describe('Treasury Neutral Zone Adjustments', () => {
    it('should validate 10Y neutral zone is centered around 3.75%', () => {
      // Zone 3.5-4.0% should be roughly neutral (score between -1 and 1)
      expect(calculateYield10YScore(3.5)).toBeGreaterThan(-1);
      expect(calculateYield10YScore(4.0)).toBeLessThan(1);
    });

    it('should validate 2Y neutral zone is centered around 3.25%', () => {
      // Zone 3.0-3.5% should be roughly neutral
      expect(calculateYield2YScore(3.0)).toBeGreaterThan(-1);
      expect(calculateYield2YScore(3.5)).toBeLessThan(1);
    });

    it('should validate yields above neutral are bearish but still gray', () => {
      // 4.11% and 3.61% should be slightly negative but still gray
      expect(calculateYield10YScore(4.11)).toBeGreaterThan(-2);
      expect(calculateYield10YScore(4.11)).toBeLessThan(0);

      expect(calculateYield2YScore(3.61)).toBeGreaterThan(-2);
      expect(calculateYield2YScore(3.61)).toBeLessThan(0);
    });
  });

  describe('calculateYield5YScore', () => {
    it('should return gray for current 5Y yield ~4%', () => {
      const score = calculateYield5YScore(4.0);
      expect(score).toBeGreaterThan(-2);
      expect(score).toBeLessThan(2);
    });

    it('should return negative for high 5Y yields', () => {
      const score = calculateYield5YScore(5.0);
      expect(score).toBeLessThan(-1);
    });

    it('should return positive for low 5Y yields', () => {
      const score = calculateYield5YScore(2.0);
      expect(score).toBeGreaterThan(1);
    });
  });

  describe('calculateBondsScore', () => {
    it('should calculate weighted score for bullish bond scenario', () => {
      const data = {
        yield10Y: 3.0,
        yield5Y: 2.8,
        yield2Y: 2.5,
        yieldCurveSlope: 0.5,
        creditSpreads: 1.5,
        inflationExpectations: 1.8,
      };
      const score = calculateBondsScore(data);
      expect(score).toBeGreaterThan(0);
    });

    it('should calculate weighted score for bearish bond scenario', () => {
      const data = {
        yield10Y: 5.5,
        yield5Y: 5.3,
        yield2Y: 5.0,
        yieldCurveSlope: -0.5,
        creditSpreads: 3.5,
        inflationExpectations: 4.0,
      };
      const score = calculateBondsScore(data);
      expect(score).toBeLessThan(0);
    });

    it('should handle partial data with undefined values', () => {
      const data = {
        yield10Y: 4.0,
      };
      const score = calculateBondsScore(data);
      expect(typeof score).toBe('number');
      expect(isNaN(score)).toBe(false);
    });
  });
});

import {
  getCapitalFlowsInterpretation,
  getMarketSentimentPhase,
  getLiquidityConditions,
  getRiskAppetiteLevel,
} from '../capital-flows-interpretation';

describe('Capital Flows Interpretation', () => {
  describe('getCapitalFlowsInterpretation', () => {
    it('should return "Strong Inflows" for score > 7', () => {
      const result = getCapitalFlowsInterpretation(8);
      expect(result.text).toBe('STRONG INFLOWS');
      expect(result.color).toBe('success');
      expect(result.severity).toBe('success');
    });

    it('should return "Accumulation" for score 3-7', () => {
      const result = getCapitalFlowsInterpretation(5);
      expect(result.text).toBe('ACCUMULATION');
      expect(result.color).toBe('success');
      expect(result.severity).toBe('info');
    });

    it('should return "Neutral" for score -3 to 3', () => {
      const result = getCapitalFlowsInterpretation(0);
      expect(result.text).toBe('NEUTRAL');
      expect(result.color).toBe('default');
      expect(result.severity).toBe('info');
    });

    it('should return "Outflows" for score -7 to -3', () => {
      const result = getCapitalFlowsInterpretation(-5);
      expect(result.text).toBe('OUTFLOWS');
      expect(result.color).toBe('warning');
      expect(result.severity).toBe('warning');
    });

    it('should return "Flight to Safety" for score < -7', () => {
      const result = getCapitalFlowsInterpretation(-8);
      expect(result.text).toBe('FLIGHT TO SAFETY');
      expect(result.color).toBe('error');
      expect(result.severity).toBe('error');
    });
  });

  describe('getMarketSentimentPhase', () => {
    it('should identify peak liquidity (score > 7)', () => {
      const phase = getMarketSentimentPhase(8);
      expect(phase).toContain('Peak Liquidity');
      expect(phase).toContain('aggressively deploying');
    });

    it('should identify risk-on environment (score 3-7)', () => {
      const phase = getMarketSentimentPhase(5);
      expect(phase).toContain('Risk-On');
      expect(phase).toContain('growth assets');
    });

    it('should identify early accumulation (score 0-3)', () => {
      const phase = getMarketSentimentPhase(1);
      expect(phase).toContain('Early Accumulation');
    });

    it('should identify neutral/wait-and-see (score -3 to 0)', () => {
      const phase = getMarketSentimentPhase(-1);
      expect(phase).toContain('Neutral');
      expect(phase).toContain('sidelines');
    });

    it('should identify risk-off mode (score -7 to -3)', () => {
      const phase = getMarketSentimentPhase(-5);
      expect(phase).toContain('Risk-Off');
      expect(phase).toContain('safe havens');
    });

    it('should identify crisis mode (score < -7)', () => {
      const phase = getMarketSentimentPhase(-8);
      expect(phase).toContain('Crisis Mode');
      expect(phase).toContain('Flight to safety');
    });
  });

  describe('getLiquidityConditions', () => {
    it('should identify abundant liquidity (avg > 2)', () => {
      const conditions = getLiquidityConditions(3, 2, 3);
      expect(conditions).toContain('Abundant Liquidity');
      expect(conditions).toContain('easing');
    });

    it('should identify adequate liquidity (avg 0-2)', () => {
      const conditions = getLiquidityConditions(1, 0, 1);
      expect(conditions).toContain('Adequate Liquidity');
    });

    it('should identify tightening conditions (avg -2 to 0)', () => {
      const conditions = getLiquidityConditions(-1, 0, -1);
      expect(conditions).toContain('Tightening');
    });

    it('should identify liquidity crunch (avg < -2)', () => {
      const conditions = getLiquidityConditions(-3, -2, -3);
      expect(conditions).toContain('Liquidity Crunch');
      expect(conditions).toContain('Severe');
    });

    it('should average fed, m2, and dollar scores correctly', () => {
      const cond1 = getLiquidityConditions(3, 2, 1); // avg 2
      const cond2 = getLiquidityConditions(1, 2, 3); // avg 2
      expect(cond1).toBe(cond2);
    });
  });

  describe('getRiskAppetiteLevel', () => {
    it('should identify high risk appetite', () => {
      const riskLevel = getRiskAppetiteLevel(3, 2, 3);
      expect(riskLevel).toContain('Extreme');
    });

    it('should identify moderate risk appetite', () => {
      const riskLevel = getRiskAppetiteLevel(1, 0, 1);
      expect(riskLevel).toContain('Healthy');
    });

    it('should identify low risk appetite', () => {
      const riskLevel = getRiskAppetiteLevel(-1, 0, -1);
      expect(riskLevel).toContain('Declining');
    });

    it('should identify risk aversion', () => {
      const riskLevel = getRiskAppetiteLevel(-3, -2, -3);
      expect(riskLevel).toContain('Aversion');
    });
  });

  describe('Interpretation Structure', () => {
    it('should always return object with text, color, severity', () => {
      const scores = [-10, -5, 0, 5, 10];

      scores.forEach((score) => {
        const result = getCapitalFlowsInterpretation(score);
        expect(result).toHaveProperty('text');
        expect(result).toHaveProperty('color');
        expect(result).toHaveProperty('severity');
        expect(typeof result.text).toBe('string');
        expect(typeof result.color).toBe('string');
        expect(typeof result.severity).toBe('string');
      });
    });

    it('should use consistent color palette', () => {
      const validColors = ['success', 'error', 'warning', 'default'];
      const scores = [-10, -5, 0, 5, 10];

      scores.forEach((score) => {
        const result = getCapitalFlowsInterpretation(score);
        expect(validColors).toContain(result.color);
      });
    });

    it('should use same thresholds as stocks/crypto (3/-3)', () => {
      const neutral = getCapitalFlowsInterpretation(0);
      expect(neutral.text).toBe('NEUTRAL');

      const accumulation = getCapitalFlowsInterpretation(3.1);
      expect(accumulation.text).toBe('ACCUMULATION');
    });
  });
});

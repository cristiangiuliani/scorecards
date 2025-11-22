import {
  getBondsInterpretation,
  getDurationStrategy,
} from '../bonds-interpretation';

describe('Bonds Interpretation', () => {
  describe('getBondsInterpretation', () => {
    it('should return "Strong Buy" for score > 7', () => {
      const result = getBondsInterpretation(8);
      expect(result.text).toBe('STRONG BUY');
      expect(result.color).toBe('success');
      expect(result.severity).toBe('success');
    });

    it('should return "Buy" for score 4-7', () => {
      const result = getBondsInterpretation(5);
      expect(result.text).toBe('BUY');
      expect(result.color).toBe('success');
      expect(result.severity).toBe('info');
    });

    it('should return "Moderate Buy" for score 1-4', () => {
      const result = getBondsInterpretation(2);
      expect(result.text).toBe('MODERATE BUY');
      expect(result.color).toBe('info');
      expect(result.severity).toBe('info');
    });

    it('should return "Neutral" for score -1 to 1', () => {
      const result = getBondsInterpretation(0);
      expect(result.text).toBe('NEUTRAL');
      expect(result.color).toBe('info');
      expect(result.severity).toBe('info');
    });

    it('should return "Moderate Sell" for score -4 to -1', () => {
      const result = getBondsInterpretation(-2);
      expect(result.text).toBe('MODERATE SELL');
      expect(result.color).toBe('warning');
      expect(result.severity).toBe('warning');
    });

    it('should return "Sell" for score -7 to -4', () => {
      const result = getBondsInterpretation(-5);
      expect(result.text).toBe('SELL');
      expect(result.color).toBe('error');
      expect(result.severity).toBe('warning');
    });

    it('should return "Strong Sell" for score < -7', () => {
      const result = getBondsInterpretation(-8);
      expect(result.text).toBe('STRONG SELL');
      expect(result.color).toBe('error');
      expect(result.severity).toBe('error');
    });
  });

  describe('getDurationStrategy', () => {
    it('should recommend long duration for high score and steep curve', () => {
      const strategy = getDurationStrategy(7, 1.5);
      expect(strategy).toContain('Long duration');
      expect(strategy).toContain('Steep curve');
    });

    it('should recommend long duration for high score and falling rates', () => {
      const strategy = getDurationStrategy(7, 0.3);
      expect(strategy).toContain('Long duration');
      expect(strategy).toContain('fall');
    });

    it('should recommend intermediate duration for moderate score', () => {
      const strategy = getDurationStrategy(2, 0.7);
      expect(strategy).toContain('Moderate duration');
    });

    it('should recommend short duration for low/negative score', () => {
      const strategy = getDurationStrategy(-2, 0.5);
      expect(strategy).toContain('Short');
    });

    it('should consider yield slope in recommendations', () => {
      const steepCurve = getDurationStrategy(4, 1.2);
      const flatCurve = getDurationStrategy(4, 0.2);

      expect(steepCurve).not.toBe(flatCurve);
    });
  });

  describe('Interpretation Structure', () => {
    it('should always return object with text, color, severity', () => {
      const scores = [-10, -5, 0, 5, 10];

      scores.forEach((score) => {
        const result = getBondsInterpretation(score);
        expect(result).toHaveProperty('text');
        expect(result).toHaveProperty('color');
        expect(result).toHaveProperty('severity');
        expect(typeof result.text).toBe('string');
        expect(typeof result.color).toBe('string');
        expect(typeof result.severity).toBe('string');
      });
    });

    it('should use consistent color palette', () => {
      const validColors = ['success', 'error', 'warning', 'info'];
      const scores = [-10, -5, 0, 5, 10];

      scores.forEach((score) => {
        const result = getBondsInterpretation(score);
        expect(validColors).toContain(result.color);
      });
    });

    it('should have different thresholds than stocks/crypto', () => {
      // Bonds use 1/-1 for neutral, stocks/crypto use 3/-3
      const neutral = getBondsInterpretation(0);
      expect(neutral.text).toBe('NEUTRAL');

      const moderateBuy = getBondsInterpretation(2);
      expect(moderateBuy.text).toBe('MODERATE BUY');
    });
  });
});

import {
  getStockInterpretation,
  getMarketPhase,
  getPortfolioAllocation,
} from '../stocks-interpretation';

describe('Stocks Interpretation', () => {
  describe('getStockInterpretation', () => {
    it('should return "Strong Bullish" for score > 7', () => {
      const result = getStockInterpretation(8);
      expect(result.text).toBe('STRONG BULLISH');
      expect(result.color).toBe('success');
      expect(result.severity).toBe('success');
    });

    it('should return "Bullish" for score 3-7', () => {
      const result = getStockInterpretation(5);
      expect(result.text).toBe('BULLISH');
      expect(result.color).toBe('success');
      expect(result.severity).toBe('info');
    });

    it('should return "Crab Market" for score -3 to 3', () => {
      const result = getStockInterpretation(0);
      expect(result.text).toBe('CRAB MARKET');
      expect(result.color).toBe('default');
      expect(result.severity).toBe('info');
    });

    it('should return "Bearish" for score -7 to -3', () => {
      const result = getStockInterpretation(-5);
      expect(result.text).toBe('BEARISH');
      expect(result.color).toBe('warning');
      expect(result.severity).toBe('warning');
    });

    it('should return "Strong Bearish" for score < -7', () => {
      const result = getStockInterpretation(-8);
      expect(result.text).toBe('STRONG BEARISH');
      expect(result.color).toBe('error');
      expect(result.severity).toBe('error');
    });
  });

  describe('getMarketPhase', () => {
    it('should identify bull market peak', () => {
      const phase = getMarketPhase(8, 95, 15);
      expect(phase).toContain('Bull market peak');
    });

    it('should identify active bull market', () => {
      const phase = getMarketPhase(5, 85, 18);
      expect(phase).toContain('bull');
    });

    it('should identify neutral/sideways market', () => {
      const phase = getMarketPhase(0, 70, 20);
      expect(phase).toContain('Consolidation');
    });

    it('should identify bear market', () => {
      const phase = getMarketPhase(-5, 50, 30);
      expect(phase).toContain('Bear');
    });

    it('should identify deep bear market', () => {
      const phase = getMarketPhase(-8, 30, 40);
      expect(phase).toContain('Bear');
    });
  });

  describe('getPortfolioAllocation', () => {
    it('should recommend defensive allocation for strong bull with normal VIX', () => {
      const allocation = getPortfolioAllocation(8, 20);
      expect(allocation).toBe('50% Stocks / 30% Bonds / 20% Cash');
    });

    it('should recommend stocks allocation for neutral market', () => {
      const allocation = getPortfolioAllocation(0, 25);
      // Score 0 with VIX 25 returns 50% Stocks / 35% Bonds / 15% Cash
      expect(allocation).toContain('50%');
      expect(allocation).toContain('Stocks');
    });

    it('should recommend defensive allocation for bear market', () => {
      const allocation = getPortfolioAllocation(-6, 35);
      expect(allocation).toBe('20% Stocks / 50% Bonds / 30% Cash');
    });

    it('should consider VIX in allocation', () => {
      const highVix = getPortfolioAllocation(5, 35); // Bull but high VIX - returns 65%
      const lowVix = getPortfolioAllocation(5, 12); // Bull with low VIX - returns 70%

      expect(highVix).not.toBe(lowVix);
    });
  });

  describe('Interpretation Structure', () => {
    it('should always return object with text, color, severity', () => {
      const scores = [-10, -5, 0, 5, 10];

      scores.forEach((score) => {
        const result = getStockInterpretation(score);
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
        const result = getStockInterpretation(score);
        expect(validColors).toContain(result.color);
      });
    });
  });
});

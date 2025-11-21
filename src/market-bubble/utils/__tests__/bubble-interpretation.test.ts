import type { IBubbleIndicator } from '../../../interfaces/market-bubble';
import {
  getBubbleInterpretation,
  getPortfolioRecommendation,
} from '../bubble-interpretation';

describe('Bubble Interpretation', () => {
  describe('getBubbleInterpretation', () => {
    it('should return "Very Low Risk" for score <= -7 (very low bubble risk)', () => {
      const indicator: IBubbleIndicator = {
        score: -8,
        factors: {
          nvidiaOvervalued: true,
          nasdaqOvervalued: true,
          vixPersistent: false,
        },
      };
      const result = getBubbleInterpretation(indicator);
      expect(result.text).toBe('🚀 VERY LOW RISK');
      expect(result.color).toBe('success');
      expect(result.severity).toBe('success');
    });

    it('should return "Low Risk" for score -7 to -3 (low bubble risk)', () => {
      const indicator: IBubbleIndicator = {
        score: -5,
        factors: {
          nvidiaOvervalued: false,
          nasdaqOvervalued: true,
          vixPersistent: false,
        },
      };
      const result = getBubbleInterpretation(indicator);
      expect(result.text).toBe('LOW RISK');
      expect(result.color).toBe('success');
      expect(result.severity).toBe('success');
    });

    it('should return "Moderate Risk" for score -3 to 3', () => {
      const indicator: IBubbleIndicator = {
        score: 0,
        factors: {
          nvidiaOvervalued: false,
          nasdaqOvervalued: false,
          vixPersistent: false,
        },
      };
      const result = getBubbleInterpretation(indicator);
      expect(result.text).toBe('MODERATE RISK');
      expect(result.color).toBe('default');
      expect(result.severity).toBe('warning');
    });

    it('should return "High Risk" for score 3 to 7', () => {
      const indicator: IBubbleIndicator = {
        score: 5,
        factors: {
          nvidiaOvervalued: false,
          nasdaqOvervalued: false,
          vixPersistent: false,
        },
      };
      const result = getBubbleInterpretation(indicator);
      expect(result.text).toBe('HIGH RISK');
      expect(result.color).toBe('error');
      expect(result.severity).toBe('error');
    });

    it('should return "Critical" for score >= 7', () => {
      const indicator: IBubbleIndicator = {
        score: 8,
        factors: {
          nvidiaOvervalued: false,
          nasdaqOvervalued: false,
          vixPersistent: false,
        },
      };
      const result = getBubbleInterpretation(indicator);
      expect(result.text).toBe('CRITICAL');
      expect(result.color).toBe('error');
      expect(result.severity).toBe('error');
    });
  });

  describe('getPortfolioRecommendation', () => {
    it('should recommend reducing AI/tech for extreme bubble (score <= -9)', () => {
      const recommendation = getPortfolioRecommendation(-9);
      expect(recommendation).toContain('Reduce');
      expect(recommendation).toContain('20-30%');
    });

    it('should recommend caution for high bubble risk', () => {
      const recommendation = getPortfolioRecommendation(-6);
      expect(recommendation).toContain('50%');
    });

    it('should recommend standard allocation for moderate risk', () => {
      const recommendation = getPortfolioRecommendation(0);
      expect(recommendation).toContain('50-60%');
    });

    it('should recommend standard allocation for low risk', () => {
      const recommendation = getPortfolioRecommendation(6);
      expect(recommendation).toContain('Standard diversified');
    });
  });

  describe('Bubble Logic Inversion', () => {
    it('should treat high positive scores as high risk (bubble warning)', () => {
      const highScore: IBubbleIndicator = {
        score: 8,
        factors: {
          nvidiaOvervalued: false,
          nasdaqOvervalued: false,
          vixPersistent: false,
        },
      };
      const result = getBubbleInterpretation(highScore);
      expect(result.severity).toBe('error');
    });

    it('should treat negative scores as low risk (good)', () => {
      const lowScore: IBubbleIndicator = {
        score: -8,
        factors: {
          nvidiaOvervalued: true,
          nasdaqOvervalued: true,
          vixPersistent: false,
        },
      };
      const result = getBubbleInterpretation(lowScore);
      expect(result.severity).toBe('success');
    });
  });

  describe('Interpretation Structure', () => {
    it('should always return object with text, color, severity', () => {
      const scores = [-10, -5, 0, 5, 10];

      scores.forEach((scoreValue) => {
        const indicator: IBubbleIndicator = {
          score: scoreValue,
          factors: {
            nvidiaOvervalued: scoreValue < 0,
            nasdaqOvervalued: scoreValue < -3,
            vixPersistent: scoreValue < -5,
          },
        };
        const result = getBubbleInterpretation(indicator);
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

      scores.forEach((scoreValue) => {
        const indicator: IBubbleIndicator = {
          score: scoreValue,
          factors: {
            nvidiaOvervalued: scoreValue < 0,
            nasdaqOvervalued: scoreValue < -3,
            vixPersistent: scoreValue < -5,
          },
        };
        const result = getBubbleInterpretation(indicator);
        expect(validColors).toContain(result.color);
      });
    });
  });
});

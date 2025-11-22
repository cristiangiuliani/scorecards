import {
  getCryptoInterpretation,
  getMarketPhase,
  getBtcAltBalance,
} from '../crypto-interpretation';

describe('Crypto Interpretation', () => {
  describe('getCryptoInterpretation', () => {
    it('should return "Strong Bullish" for score > 7', () => {
      const result = getCryptoInterpretation(8);
      expect(result.text).toBe('STRONG BULLISH');
      expect(result.color).toBe('success');
      expect(result.severity).toBe('success');
    });

    it('should return "Bullish" for score 3-7', () => {
      const result = getCryptoInterpretation(5);
      expect(result.text).toBe('BULLISH');
      expect(result.color).toBe('success');
      expect(result.severity).toBe('info');
    });

    it('should return "Crab Market" for score -3 to 3', () => {
      const result = getCryptoInterpretation(0);
      expect(result.text).toBe('CRAB MARKET');
      expect(result.color).toBe('info');
      expect(result.severity).toBe('info');
    });

    it('should return "Bearish" for score -7 to -3', () => {
      const result = getCryptoInterpretation(-5);
      expect(result.text).toBe('BEARISH');
      expect(result.color).toBe('warning');
      expect(result.severity).toBe('warning');
    });

    it('should return "Strong Bearish" for score < -7', () => {
      const result = getCryptoInterpretation(-8);
      expect(result.text).toBe('STRONG BEARISH');
      expect(result.color).toBe('error');
      expect(result.severity).toBe('error');
    });
  });

  describe('getMarketPhase', () => {
    it('should identify extreme bull near cycle top', () => {
      const phase = getMarketPhase(6, 50);
      expect(phase).toContain('Extreme bull');
    });

    it('should identify late bull at ATH', () => {
      const phase = getMarketPhase(4, 96);
      expect(phase).toContain('Late bull');
      expect(phase).toContain('ATH');
    });

    it('should identify active bull market', () => {
      const phase = getMarketPhase(4, 85);
      expect(phase).toContain('Active bull');
    });

    it('should identify early bull/recovery phase', () => {
      const phase = getMarketPhase(1, 70);
      expect(phase).toContain('Recovery');
    });

    it('should identify consolidation/accumulation', () => {
      const phase = getMarketPhase(-1, 60);
      expect(phase).toContain('Consolidation');
    });

    it('should identify bear market correction', () => {
      const phase = getMarketPhase(-5, 40);
      expect(phase).toContain('Bear market');
    });

    it('should identify crypto winter', () => {
      const phase = getMarketPhase(-8, 20);
      expect(phase).toContain('Crypto winter');
    });
  });

  describe('getBtcAltBalance', () => {
    it('should recommend heavy BTC for high dominance (>65%)', () => {
      const balance = getBtcAltBalance(67);
      expect(balance).toContain('Heavy BTC');
      expect(balance).toContain('Altcoins weak');
    });

    it('should recommend 70/30 for dominance 60-65%', () => {
      const balance = getBtcAltBalance(62);
      expect(balance).toContain('70% BTC');
      expect(balance).toContain('30%');
    });

    it('should adjust for alt season index', () => {
      const lowAltSeason = getBtcAltBalance(47, 30); // Dominance 45-50 range
      const highAltSeason = getBtcAltBalance(47, 80); // Dominance 45-50 range

      expect(lowAltSeason).not.toBe(highAltSeason);
    });
  });

  describe('Interpretation Structure', () => {
    it('should always return object with text, color, severity', () => {
      const scores = [-10, -5, 0, 5, 10];

      scores.forEach((score) => {
        const result = getCryptoInterpretation(score);
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
        const result = getCryptoInterpretation(score);
        expect(validColors).toContain(result.color);
      });
    });
  });
});

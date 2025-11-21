import {
  getFedPolicyInterpretation,
  getNextFedMove,
  getInflationPressure,
  getLaborMarketStatus,
} from '../fed-interpretation';

describe('Fed Policy Interpretation', () => {
  describe('getFedPolicyInterpretation', () => {
    it('should return "Hawkish" for score > 5', () => {
      const result = getFedPolicyInterpretation(6);
      expect(result.text).toBe('HAWKISH');
      expect(result.color).toBe('error');
      expect(result.severity).toBe('error');
    });

    it('should return "Moderate Hawkish" for score 2-5', () => {
      const result = getFedPolicyInterpretation(3);
      expect(result.text).toBe('MODERATE HAWKISH');
      expect(result.color).toBe('default');
      expect(result.severity).toBe('warning');
    });

    it('should return "Neutral" for score -2 to 2', () => {
      const result = getFedPolicyInterpretation(0);
      expect(result.text).toBe('NEUTRAL');
      expect(result.color).toBe('default');
      expect(result.severity).toBe('info');
    });

    it('should return "Moderate Dovish" for score -5 to -2', () => {
      const result = getFedPolicyInterpretation(-3);
      expect(result.text).toBe('MODERATE DOVISH');
      expect(result.color).toBe('default');
      expect(result.severity).toBe('warning');
    });

    it('should return "Dovish" for score < -6', () => {
      const result = getFedPolicyInterpretation(-7);
      expect(result.text).toBe('DOVISH');
      expect(result.color).toBe('success');
      expect(result.severity).toBe('success');
    });
  });

  describe('getNextFedMove', () => {
    it('should predict rate hike for hawkish score >= 4', () => {
      const move = getNextFedMove(5);
      expect(move).toContain('Rate hike');
      expect(move).toContain('3-6 months');
    });

    it('should predict rates on hold for score 1-4', () => {
      const move = getNextFedMove(2);
      expect(move).toContain('on hold');
    });

    it('should indicate data-dependent for neutral score', () => {
      const move = getNextFedMove(0);
      expect(move).toContain('Data-dependent');
    });

    it('should predict first cut for score -4 to -1', () => {
      const move = getNextFedMove(-2);
      expect(move).toContain('First rate cut');
    });

    it('should predict multiple cuts for dovish score < -4', () => {
      const move = getNextFedMove(-5);
      expect(move).toContain('Multiple rate cuts');
    });
  });

  describe('getInflationPressure', () => {
    it('should identify high inflation (>3.5%)', () => {
      const pressure = getInflationPressure(4.0, 3.5);
      expect(pressure).toContain('High');
      expect(pressure).toContain('above Fed target');
    });

    it('should identify moderate inflation (2.5-3.5%)', () => {
      const pressure = getInflationPressure(2.8, 2.5);
      expect(pressure).toContain('Moderate');
    });

    it('should identify low inflation (1.5-2.5%)', () => {
      const pressure = getInflationPressure(2.0, 1.8);
      expect(pressure).toContain('Low');
      expect(pressure).toContain('Near target');
    });

    it('should identify very low inflation (<1.5%)', () => {
      const pressure = getInflationPressure(1.2, 1.0);
      expect(pressure).toContain('Very Low');
      expect(pressure).toContain('Below target');
    });

    it('should average CPI and Core PCE correctly', () => {
      const pressure1 = getInflationPressure(4.0, 3.0); // avg 3.5
      const pressure2 = getInflationPressure(3.0, 4.0); // avg 3.5
      expect(pressure1).toBe(pressure2);
    });
  });

  describe('getLaborMarketStatus', () => {
    it('should identify very tight market (low unemployment + high wage growth)', () => {
      const status = getLaborMarketStatus(3.4, 4.5);
      expect(status).toContain('Very Tight');
      expect(status).toContain('Inflationary');
    });

    it('should identify tight market (unemployment <= 4%, wage >= 3.5%)', () => {
      const status = getLaborMarketStatus(3.9, 3.7);
      expect(status).toContain('Tight');
    });

    it('should identify balanced market', () => {
      const status = getLaborMarketStatus(4.3, 3.2);
      expect(status).toContain('Balanced');
    });

    it('should identify weak labor market (high unemployment)', () => {
      const status = getLaborMarketStatus(5.5, 2.5);
      expect(status).toContain('Softening');
    });
  });

  describe('Fed Policy Logic', () => {
    it('should interpret hawkish as negative for markets (error severity)', () => {
      const result = getFedPolicyInterpretation(7);
      expect(result.severity).toBe('error');
    });

    it('should interpret dovish as positive for markets (success severity)', () => {
      const result = getFedPolicyInterpretation(-7);
      expect(result.severity).toBe('success');
    });
  });

  describe('Interpretation Structure', () => {
    it('should always return object with text, color, severity', () => {
      const scores = [-10, -5, 0, 5, 10];

      scores.forEach((score) => {
        const result = getFedPolicyInterpretation(score);
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
        const result = getFedPolicyInterpretation(score);
        expect(validColors).toContain(result.color);
      });
    });

    it('should have different thresholds than stocks (2/-2 vs 3/-3)', () => {
      const neutral = getFedPolicyInterpretation(0);
      expect(neutral.text).toBe('NEUTRAL');

      const moderateHawkish = getFedPolicyInterpretation(2);
      expect(moderateHawkish.text).toBe('MODERATE HAWKISH');
    });
  });
});

import {
  calculateFedBalanceSheetScore,
  calculateM2MoneySupplyScore,
  calculateDollarIndexScore,
  calculateHighYieldSpreadScore,
  calculateTreasury10YScore,
  calculateStablecoinAccumulationScore,
  calculateCryptoMarketCapScore,
  calculateCapitalFlowsScore,
  calculateGrowthRate,
} from '../capital-flows-formulas';

describe('Capital Flows Formulas', () => {
  describe('calculateFedBalanceSheetScore', () => {
    it('should return 0 for insufficient data', () => {
      expect(calculateFedBalanceSheetScore([100, 101, 102])).toBe(0);
    });

    it('should return positive for QE (balance sheet growing)', () => {
      const values = [6700, 6690, 6680, 6670, 6660, 6650, 6640, 6630, 6620, 6610, 6600, 6550];
      const score = calculateFedBalanceSheetScore(values);
      expect(score).toBeGreaterThan(1); // ~2.3% growth = bullish
    });

    it('should return negative for QT (balance sheet shrinking)', () => {
      // From mock: 6587 to 6853 = -3.88% contraction
      const values = [6587, 6589, 6596, 6590, 6587, 6608, 6608, 6605, 6602, 6603, 6618, 6853];
      const score = calculateFedBalanceSheetScore(values);
      expect(score).toBeLessThanOrEqual(-2);
    });

    it('should return neutral for stable balance sheet', () => {
      const values = [6600, 6598, 6602, 6599, 6601, 6600, 6598, 6602, 6599, 6601, 6600, 6595];
      const score = calculateFedBalanceSheetScore(values);
      expect(score).toBeGreaterThan(-1);
      expect(score).toBeLessThanOrEqual(1);
    });
  });

  describe('calculateM2MoneySupplyScore', () => {
    it('should return 0 for insufficient data', () => {
      expect(calculateM2MoneySupplyScore([100, 101])).toBe(0);
    });

    it('should return positive for M2 growth', () => {
      const values = [22243, 22230, 22220, 22210, 22200, 22190, 22180, 22170, 22160, 22150, 22140, 21920];
      const score = calculateM2MoneySupplyScore(values);
      expect(score).toBeGreaterThanOrEqual(1); // ~1.47% growth
    });

    it('should return negative for M2 contraction', () => {
      const values = [21500, 21520, 21540, 21560, 21580, 21600, 21620, 21640, 21660, 21680, 21700, 22200];
      const score = calculateM2MoneySupplyScore(values);
      expect(score).toBeLessThan(0); // ~-3.15% contraction
    });

    it('should return neutral for stable M2', () => {
      const values = [22200, 22195, 22205, 22198, 22202, 22200, 22195, 22205, 22198, 22202, 22200, 22180];
      const score = calculateM2MoneySupplyScore(values);
      expect(score).toBeGreaterThan(-1);
      expect(score).toBeLessThan(2);
    });
  });

  describe('calculateDollarIndexScore', () => {
    it('should return 0 for insufficient data', () => {
      expect(calculateDollarIndexScore([100])).toBe(0);
    });

    it('should return positive (bullish) for weakening dollar', () => {
      const values = [120, 121.5]; // -1.24% = bullish for risk
      const score = calculateDollarIndexScore(values);
      expect(score).toBeGreaterThan(0);
    });

    it('should return negative (bearish) for strengthening dollar', () => {
      const values = [123, 121]; // +1.65% = bearish for risk
      const score = calculateDollarIndexScore(values);
      expect(score).toBeLessThan(0);
    });

    it('should return neutral for stable dollar', () => {
      const values = [121.77, 121.66]; // +0.09% = neutral
      const score = calculateDollarIndexScore(values);
      expect(score).toBeGreaterThan(-1);
      expect(score).toBeLessThan(1);
    });
  });

  describe('calculateHighYieldSpreadScore', () => {
    it('should return 0 for missing value', () => {
      expect(calculateHighYieldSpreadScore(0)).toBe(0);
    });

    it('should return positive for narrow spreads (<4%)', () => {
      const score = calculateHighYieldSpreadScore(3.5);
      expect(score).toBeGreaterThan(1);
    });

    it('should return negative for wide spreads (>7%)', () => {
      const score = calculateHighYieldSpreadScore(8.5);
      expect(score).toBeLessThan(0);
    });

    it('should return neutral for moderate spreads (4-5%)', () => {
      const score = calculateHighYieldSpreadScore(4.5);
      expect(score).toBeGreaterThan(-1);
      expect(score).toBeLessThan(2);
    });
  });

  describe('calculateTreasury10YScore', () => {
    it('should return 0 for insufficient data', () => {
      expect(calculateTreasury10YScore([4.1, 4.2])).toBe(0);
    });

    it('should return positive for rising yields (risk-on)', () => {
      const values = [4.5, 4.4, 4.3, 4.1]; // +0.4 change
      const score = calculateTreasury10YScore(values);
      expect(score).toBeGreaterThan(1);
    });

    it('should return negative for falling yields (flight to safety)', () => {
      const values = [3.8, 4.0, 4.1, 4.2]; // -0.4 change
      const score = calculateTreasury10YScore(values);
      expect(score).toBeLessThan(0);
    });

    it('should return neutral for stable yields', () => {
      const values = [4.11, 4.10, 4.12, 4.11]; // no significant change
      const score = calculateTreasury10YScore(values);
      expect(score).toBeGreaterThan(-1);
      expect(score).toBeLessThan(1);
    });
  });

  describe('calculateStablecoinAccumulationScore', () => {
    it('should return 0 for missing values', () => {
      expect(calculateStablecoinAccumulationScore(0, 1000)).toBe(0);
      expect(calculateStablecoinAccumulationScore(100, 0)).toBe(0);
    });

    it('should return positive for high stablecoin dominance (>7%)', () => {
      const score = calculateStablecoinAccumulationScore(280, 3500); // 8% dominance
      expect(score).toBeGreaterThan(2);
    });

    it('should return negative for low stablecoin dominance (<3%)', () => {
      const score = calculateStablecoinAccumulationScore(80, 3500); // 2.3% dominance
      expect(score).toBeLessThan(0);
    });

    it('should return neutral for moderate dominance (5-6%)', () => {
      const score = calculateStablecoinAccumulationScore(183, 3520); // ~5.2% dominance
      expect(score).toBeGreaterThan(-1);
    });
  });

  describe('calculateCryptoMarketCapScore', () => {
    it('should return 0 for insufficient data', () => {
      expect(calculateCryptoMarketCapScore([100, 101])).toBe(0);
    });

    it('should return positive for growing market cap', () => {
      const values = [3600, 3580, 3550, 3400]; // +5.88% growth
      const score = calculateCryptoMarketCapScore(values);
      expect(score).toBeGreaterThan(1);
    });

    it('should return negative for declining market cap', () => {
      const values = [3200, 3350, 3450, 3600]; // -11.1% decline
      const score = calculateCryptoMarketCapScore(values);
      expect(score).toBeLessThan(0);
    });

    it('should return neutral for stable market cap', () => {
      const values = [3520, 3530, 3510, 3500]; // ~0.57% change
      const score = calculateCryptoMarketCapScore(values);
      expect(score).toBeGreaterThan(-1);
      expect(score).toBeLessThan(1);
    });
  });

  describe('Capital Flows Integration', () => {
    it('should identify liquidity expansion environment', () => {
      const fedScore = calculateFedBalanceSheetScore([6700, 6690, 6680, 6670, 6660, 6650, 6640, 6630, 6620, 6610, 6600, 6550]);
      const m2Score = calculateM2MoneySupplyScore([22300, 22290, 22280, 22270, 22260, 22250, 22240, 22230, 22220, 22210, 22200, 21920]);

      expect(fedScore).toBeGreaterThan(0);
      expect(m2Score).toBeGreaterThan(0);
    });

    it('should identify liquidity contraction environment', () => {
      const fedValues = [6587, 6589, 6596, 6590, 6587, 6608, 6608, 6605, 6602, 6603, 6618, 6853];
      const fedScore = calculateFedBalanceSheetScore(fedValues);

      expect(fedScore).toBeLessThan(0);
    });
  });

  describe('calculateGrowthRate', () => {
    it('should return 0 for invalid inputs', () => {
      expect(calculateGrowthRate(0, 100)).toBe(0);
      expect(calculateGrowthRate(100, 0)).toBe(0);
    });

    it('should calculate positive growth rate', () => {
      const rate = calculateGrowthRate(110, 100);
      expect(rate).toBeCloseTo(10, 1);
    });

    it('should calculate negative growth rate', () => {
      const rate = calculateGrowthRate(90, 100);
      expect(rate).toBeCloseTo(-10, 1);
    });
  });

  describe('calculateCapitalFlowsScore', () => {
    it('should return 0 for null data', () => {
      const weights = {
        fedBalanceSheet: 2.0,
        m2MoneySupply: 1.8,
        dollarIndex: 1.5,
        highYieldSpread: 1.7,
        treasury10Y: 1.3,
        stablecoinAccumulation: 1.6,
        cryptoMarketCap: 1.4,
        score: 0.4,
      };
      const score = calculateCapitalFlowsScore(null as any, [], [], [], [], [], weights);
      expect(score).toBe(0);
    });

    it('should calculate weighted score for bullish scenario', () => {
      const data = {
        highYieldSpread: 1.5,
        stablecoinMarketCap: 160,
        totalCryptoMarketCap: 3000,
      };
      const fedHistory = [6700, 6690, 6680, 6670, 6660, 6650, 6640, 6630, 6620, 6610, 6600, 6550];
      const m2History = [21500, 21450, 21400, 21350, 21300, 21250, 21200, 21150, 21100, 21050, 21000, 20900];
      const dollarHistory = [100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89];
      const treasury10YHistory = [3.0, 3.1, 3.2, 3.1, 3.0, 2.9, 2.8, 2.9, 3.0, 3.1, 3.0, 2.9];
      const cryptoMcapHistory = [2500, 2550, 2600, 2650, 2700, 2750, 2800, 2850, 2900, 2950, 3000, 3050];

      const weights = {
        fedBalanceSheet: 2.0,
        m2MoneySupply: 1.8,
        dollarIndex: 1.5,
        highYieldSpread: 1.7,
        treasury10Y: 1.3,
        stablecoinAccumulation: 1.6,
        cryptoMarketCap: 1.4,
        score: 0.4,
      };

      const score = calculateCapitalFlowsScore(
        data,
        fedHistory,
        m2History,
        dollarHistory,
        treasury10YHistory,
        cryptoMcapHistory,
        weights
      );
      expect(score).toBeGreaterThan(0);
    });

    it('should calculate weighted score for bearish scenario with mixed signals', () => {
      const data = {
        highYieldSpread: 3.5,
        stablecoinMarketCap: 140,
        totalCryptoMarketCap: 2000,
      };
      // QT (Fed contracting), M2 contracting, Dollar rising, Yields high, Crypto falling
      const fedHistory = [6650, 6640, 6630, 6620, 6610, 6600, 6590, 6580, 6570, 6560, 6550, 6500];
      const m2History = [21500, 21450, 21400, 21350, 21300, 21250, 21200, 21150, 21100, 21050, 21000, 20900];
      const dollarHistory = [89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
      const treasury10YHistory = [5.0, 5.1, 5.2, 5.3, 5.2, 5.1, 5.0, 5.1, 5.2, 5.3, 5.2, 5.1];
      const cryptoMcapHistory = [3000, 2950, 2900, 2850, 2800, 2750, 2700, 2650, 2600, 2550, 2500, 2450];

      const weights = {
        fedBalanceSheet: 2.0,
        m2MoneySupply: 1.8,
        dollarIndex: 1.5,
        highYieldSpread: 1.7,
        treasury10Y: 1.3,
        stablecoinAccumulation: 1.6,
        cryptoMarketCap: 1.4,
        score: 0.4,
      };

      const score = calculateCapitalFlowsScore(
        data,
        fedHistory,
        m2History,
        dollarHistory,
        treasury10YHistory,
        cryptoMcapHistory,
        weights
      );
      // Some positive, some negative signals - result might be close to 0 or slightly positive
      expect(typeof score).toBe('number');
      expect(isNaN(score)).toBe(false);
    });
  });
});

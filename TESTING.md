# Testing Documentation

## Overview

This project uses **Jest** with TypeScript for comprehensive unit testing of all formula calculations and interpretation logic.

## Test Structure

### Formula Tests
Located in `src/**/utils/__tests__/*-formulas.test.ts`:
- **Stocks Formulas**: ATH distance, RSI, VIX, Fear & Greed calculations
- **Crypto Formulas**: BTC metrics, dominance, RSI zones
- **Treasury Bonds Formulas**: Yield scores, curve slope, credit spreads
- **Bubble Formulas**: NVIDIA/NASDAQ P/E ratios, VIX persistence
- **Fed Policy Formulas**: CPI, Core PCE, unemployment, wage growth
- **Capital Flows Formulas**: Fed balance sheet, M2, dollar index

### Interpretation Tests
Located in `src/**/utils/__tests__/*-interpretation.test.ts`:
- **Stocks Interpretation**: Market phases, portfolio allocation
- **Crypto Interpretation**: Bull/bear cycles, BTC/alt balance
- **Bonds Interpretation**: Buy/sell signals, duration strategy
- **Bubble Interpretation**: Risk levels, portfolio recommendations
- **Fed Interpretation**: Hawkish/dovish stance, next Fed moves
- **Capital Flows Interpretation**: Liquidity conditions, risk appetite

## Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage report
yarn test:coverage

# Run specific test file
yarn test stocks-formulas

# Run tests matching pattern
yarn test --testNamePattern="ATH distance"
```

## Coverage Reports

After running tests with coverage, open `coverage/index.html` in your browser to see detailed coverage reports.

### Current Coverage Targets
- **Branches**: 80%
- **Functions**: 90%
- **Lines**: 90%
- **Statements**: 90%

## CI/CD Integration

Tests run automatically on:
- ✅ Every push to `main` branch
- ✅ Every pull request
- ✅ Before deployment to production

### GitHub Actions Workflows

1. **test.yml** - Runs on PRs and pushes
   - Linting
   - Type checking
   - Unit tests with coverage
   - Coverage reports to Codecov
   - PR comments with coverage changes

2. **netifly-hosting.yml** - Deployment pipeline
   - Tests must pass before build
   - Build only if tests succeed
   - Deploy only on manual trigger

## Writing New Tests

### Formula Test Example

```typescript
import { calculateMyScore } from '../my-formulas';

describe('My Formulas', () => {
  describe('calculateMyScore', () => {
    it('should return positive score for bullish condition', () => {
      const score = calculateMyScore(100);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(4);
    });

    it('should return 0 for undefined input', () => {
      expect(calculateMyScore(undefined)).toBe(0);
    });

    it('should handle edge cases', () => {
      expect(calculateMyScore(0)).toBeDefined();
      expect(calculateMyScore(999999)).toBeLessThanOrEqual(4);
    });
  });
});
```

### Interpretation Test Example

```typescript
import { getMyInterpretation } from '../my-interpretation';

describe('My Interpretation', () => {
  it('should return correct structure', () => {
    const result = getMyInterpretation(5);
    
    expect(result).toHaveProperty('text');
    expect(result).toHaveProperty('color');
    expect(result).toHaveProperty('severity');
    expect(typeof result.text).toBe('string');
  });

  it('should use valid color palette', () => {
    const validColors = ['success', 'error', 'warning', 'default'];
    const result = getMyInterpretation(0);
    
    expect(validColors).toContain(result.color);
  });
});
```

## Test Best Practices

1. **Test Score Boundaries**: Always test edge cases (0, undefined, extreme values)
2. **Test Score Ranges**: Verify scores stay within expected bounds (-4 to +4)
3. **Test Thresholds**: Validate logic at threshold boundaries (e.g., RSI at 30, 70)
4. **Test Structure**: Ensure interpretation objects have required properties
5. **Use Mock Data**: Reference existing mocks in `src/_mocks/` when possible
6. **Descriptive Names**: Use clear test descriptions explaining what's being tested

## Debugging Tests

```bash
# Run tests with verbose output
yarn test --verbose

# Run single test file in watch mode
yarn test stocks-formulas.test.ts --watch

# Run with debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# Show which tests are slow
yarn test --verbose --detectOpenHandles
```

## Mock Data

Test data is located in `src/_mocks/`:
- `sp500.json` - S&P 500 historical data
- `btc.json` - Bitcoin price data
- `fredDGS10.json` - 10Y Treasury yields
- `vix.json` - VIX volatility data
- And more...

Use these mocks to test formulas with realistic data:

```typescript
import sp500Mock from '../../_mocks/sp500.json';

it('should calculate correct score from mock data', () => {
  const score = calculateAthDistanceScore(
    sp500Mock.currentPrice,
    sp500Mock.ath
  );
  expect(score).toBeDefined();
});
```

## Continuous Improvement

- Add tests for every new formula
- Update tests when formulas change
- Keep coverage above thresholds
- Review failed tests in PRs
- Monitor coverage trends

## Resources

- [Jest Documentation](https://jestjs.io/)
- [TypeScript Jest Guide](https://jestjs.io/docs/getting-started#via-ts-jest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

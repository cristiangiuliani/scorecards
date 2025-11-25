import { FED_POLICY_WEIGHTS } from '../../constants/config';
import type { IFedPolicyData } from '../../interfaces/fed-policy';

// Helper function to convert 0-100 score to -4 to +4 range for indicator display
const convertScoreToIndicatorRange = (score: number): number => {
  // 0 = -4 (very dovish), 50 = 0 (neutral), 100 = +4 (very hawkish)
  return ((score - 50) / 50) * 4;
};

// Calculate individual metric scores (0-100)
export const calculateCpiScore = (cpiInflation: number): number => {
  // Target: 2%, Range: 1-5%
  // 1% = dovish (0), 3% = neutral (50), 5% = hawkish (100)
  const min = 1;
  const max = 5;
  const neutral = 3;

  let rawScore: number;
  if (cpiInflation <= neutral) {
    rawScore = ((cpiInflation - min) / (neutral - min)) * 50;
  } else {
    rawScore = 50 + ((cpiInflation - neutral) / (max - neutral)) * 50;
  }
  return convertScoreToIndicatorRange(rawScore);
};

export const calculateCorePceScore = (corePce: number): number => {
  // Fed's preferred metric, Target: 2%, Range: 1-4%
  // 1% = dovish (0), 2.5% = neutral (50), 4% = hawkish (100)
  const min = 1;
  const max = 4;
  const neutral = 2.5;

  let rawScore: number;
  if (corePce <= neutral) {
    rawScore = ((corePce - min) / (neutral - min)) * 50;
  } else {
    rawScore = 50 + ((corePce - neutral) / (max - neutral)) * 50;
  }
  return convertScoreToIndicatorRange(rawScore);
};

export const calculateUnemploymentScore = (unemploymentRate: number): number => {
  // Lower unemployment = hawkish (tight labor market)
  // Range: 3.5-5.5%, neutral at 4.5%
  // 3.5% = hawkish (100), 4.5% = neutral (50), 5.5% = dovish (0)
  const min = 3.5;
  const max = 5.5;
  const neutral = 4.5;

  let rawScore: number;
  if (unemploymentRate <= neutral) {
    rawScore = 100 - ((unemploymentRate - min) / (neutral - min)) * 50;
  } else {
    rawScore = 50 - ((unemploymentRate - neutral) / (max - neutral)) * 50;
  }
  return convertScoreToIndicatorRange(rawScore);
};

export const calculateWageGrowthScore = (wageGrowth: number): number => {
  // Higher wage growth = inflation pressure = hawkish
  // Range: 2-5%, neutral at 3.5%
  // 2% = dovish (0), 3.5% = neutral (50), 5% = hawkish (100)
  const min = 2;
  const max = 5;
  const neutral = 3.5;

  let rawScore: number;
  if (wageGrowth <= neutral) {
    rawScore = ((wageGrowth - min) / (neutral - min)) * 50;
  } else {
    rawScore = 50 + ((wageGrowth - neutral) / (max - neutral)) * 50;
  }
  return convertScoreToIndicatorRange(rawScore);
};

export const calculateFedFundsScore = (fedFundsRate: number): number => {
  // Higher rates = already hawkish
  // Range: 0-5.5%, neutral at 2.75%
  // 0% = dovish (0), 2.75% = neutral (50), 5.5% = hawkish (100)
  const max = 5.5;
  const neutral = 2.75;

  let rawScore: number;
  if (fedFundsRate <= neutral) {
    rawScore = (fedFundsRate / neutral) * 50;
  } else {
    rawScore = 50 + ((fedFundsRate - neutral) / (max - neutral)) * 50;
  }
  return convertScoreToIndicatorRange(rawScore);
};

// Calculate Fed Rate Cut Probability (0-100%)
// Simulates CME FedWatch Tool using Fed dual mandate metrics
export const calculateRateCutProbability = (
  fedFundsRate: number,
  cpiInflation: number,
  corePce: number,
  unemploymentRate: number
): number => {
  // Media inflazione (YoY %)
  const avgInflation = (cpiInflation + corePce) / 2;

  // Calcolo probabilità base (50% = neutrale)
  let probability = 50;

  // 1. INFLAZIONE: Sotto target favorisce tagli, sopra favorisce hold/rialzi
  // Se inflazione è sotto 2.5% → favorisce tagli
  // Se inflazione è sopra 3% → sfavorisce tagli
  if (avgInflation < 2.5) {
    probability += (2.5 - avgInflation) * 20; // +20% per ogni punto sotto 2.5%
  } else if (avgInflation > 3.0) {
    probability -= (avgInflation - 3.0) * 25; // -25% per ogni punto sopra 3%
  }

  // 2. DISOCCUPAZIONE: Alta favorisce tagli, bassa è neutrale/sfavorisce
  // Se cresce sopra 4.5% → segnale recessivo, Fed taglia
  if (unemploymentRate > 4.5) {
    probability += (unemploymentRate - 4.5) * 30; // +30% per ogni punto sopra 4.5%
  } else if (unemploymentRate < 3.8) {
    probability -= (3.8 - unemploymentRate) * 10; // -10% se mercato troppo tight
  }

  // 3. LIVELLO TASSI: Tassi alti favoriscono tagli (c'è spazio)
  // Se tassi > 4.5% → molto spazio per tagliare
  if (fedFundsRate > 4.5) {
    probability += (fedFundsRate - 4.5) * 15; // +15% per ogni punto sopra 4.5%
  } else if (fedFundsRate < 2.0) {
    probability -= (2.0 - fedFundsRate) * 20; // Poco spazio per tagliare
  }

  // 4. CONTESTO: Se tassi sono molto sopra inflazione (politica restrittiva)
  const realRate = fedFundsRate - avgInflation;
  if (realRate > 2.0) {
    // Tassi reali molto alti → probabilmente taglieranno
    probability += (realRate - 2.0) * 10;
  }

  // Limita tra 0 e 100
  return Math.max(0, Math.min(100, Math.round(probability)));
};

// Calculate Rate Cut Probability Score for overall Fed Policy Score
// Convert 0-100 probability to -4 to +4 score
export const calculateRateCutProbabilityScore = (probability: number): number => {
  // 0% probability (rate hike likely) = +4 hawkish
  // 50% probability (neutral) = 0
  // 100% probability (rate cut likely) = -4 dovish
  const rawScore = 100 - probability; // Invert: low probability = hawkish
  return convertScoreToIndicatorRange(rawScore);
};

// Calculate overall Fed Policy score (-10 to +10)
// Negative = Dovish (rate cuts likely), Positive = Hawkish (rate hikes likely)
export const calculateFedPolicyScore = (data: IFedPolicyData): number => {
  const {
    cpiInflation = 0,
    corePce = 0,
    unemploymentRate = 0,
    averageHourlyEarnings = 0,
    federalFundsRate = 0,
  } = data;

  // Get individual scores (-4 to +4)
  const cpiScore = calculateCpiScore(cpiInflation);
  const pceScore = calculateCorePceScore(corePce);
  const unemploymentScore = calculateUnemploymentScore(unemploymentRate);
  const wageScore = calculateWageGrowthScore(averageHourlyEarnings);
  const fundsScore = calculateFedFundsScore(federalFundsRate);

  // Calculate rate cut probability
  const rateCutProb = calculateRateCutProbability(
    federalFundsRate,
    cpiInflation,
    corePce,
    unemploymentRate
  );
  const rateCutProbScore = calculateRateCutProbabilityScore(rateCutProb);

  // Weighted sum
  const weightedScore =
    (cpiScore * FED_POLICY_WEIGHTS.cpiInflation) +
    (pceScore * FED_POLICY_WEIGHTS.corePce) +
    (unemploymentScore * FED_POLICY_WEIGHTS.unemploymentRate) +
    (wageScore * FED_POLICY_WEIGHTS.averageHourlyEarnings) +
    (fundsScore * FED_POLICY_WEIGHTS.federalFundsRate) +
    (rateCutProbScore * FED_POLICY_WEIGHTS.rateCutProbability);

  // Apply final score weight
  return weightedScore * FED_POLICY_WEIGHTS.score;
};

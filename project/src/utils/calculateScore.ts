import type { DesirabilityScores, ViabilityScores, FeasibilityScores } from '../types';

export const calculateDesirabilityScore = (scores: DesirabilityScores): number => {
  const weightedScores = {
    enhancer: scores.enhancerScore * 0.2,
    productivity: scores.productivityScore * 0.2,
    riskMitigation: scores.riskMitigationScore * 0.2,
    marketSize: scores.marketSizeScore * 0.2,
    adoption: scores.adoptionScore * 0.1,
    validation: scores.validationScore * 0.1
  };

  return Number(Object.values(weightedScores).reduce((a, b) => a + b, 0).toFixed(2));
};

export const calculateViabilityScore = (scores: ViabilityScores): number => {
  const weightedScores = {
    strategy: scores.strategyAlignmentScore * 0.1,
    cashBenefit: scores.cashBenefitScore * 0.4,
    maintenance: scores.maintenanceCostScore * 0.2,
    nonFinancial: scores.nonFinancialScore * 0.1,
    payback: scores.paybackScore * 0.1,
    foundational: scores.foundationalScore * 0.1
  };

  return Number(Object.values(weightedScores).reduce((a, b) => a + b, 0).toFixed(2));
};

export const calculateFeasibilityScore = (scores: FeasibilityScores): number => {
  // All criteria weighted equally for feasibility
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  return Number((total / 6).toFixed(2));
};

export const calculateDVFScore = (
  desirabilityScores: DesirabilityScores,
  viabilityScores: ViabilityScores,
  feasibilityScores: FeasibilityScores
): number => {
  const desirability = calculateDesirabilityScore(desirabilityScores);
  const viability = calculateViabilityScore(viabilityScores);
  const feasibility = calculateFeasibilityScore(feasibilityScores);
  
  // Total score is the sum of all three scores
  return Number((desirability + viability + feasibility).toFixed(2));
};
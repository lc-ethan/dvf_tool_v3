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
  // Count how many "Yes" answers (value of 1) we have
  const yesCount = Object.values(scores).filter(score => score === 1).length;

  // Map number of "Yes" answers to corresponding score
  const scoreMap: Record<number, number> = {
    0: 15, // No "Yes" answers - highest score
    1: 14, // One "Yes" answer
    2: 12, // Two "Yes" answers
    3: 9,  // Three "Yes" answers
    4: 6,  // Four "Yes" answers
    5: 3,  // Five "Yes" answers
    6: 1   // All "Yes" answers - lowest score
  };

  return scoreMap[yesCount] || 1; // Default to lowest score if something goes wrong
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
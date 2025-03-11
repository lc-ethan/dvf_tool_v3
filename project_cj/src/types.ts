// Agent ID format: A1_AgentID1, A2_AgentID2, etc.
export type AgentID = `A${number}_AgentID${number}`;

export type AgentName = 
  | 'Wiremu' | 'Rāwiri' | 'Mikaere' | 'Nikau' | 'Koa' | 'Manaia' | 'Manaaki'
  | 'Kiwa' | 'Kaitoa' | 'Aroha' | 'Amaia' | 'Maia' | 'Anahera' | 'Moana'
  | 'Ataahua' | 'Marama' | 'Atarangi' | 'Tui' | 'Sarah' | 'Nicola'
  | 'Angela' | 'Lisa' | 'Michelle' | 'Rebecca' | 'Rachel' | 'Melanie'
  | 'Natasha' | 'Amanda' | 'Joanne' | 'Kylie' | 'Tania' | 'Karen'
  | 'Andrea' | 'Katrina' | 'Vanessa' | 'Kim' | 'Megan';

export type BusinessUnit = 'Enterprise' | 'T1' | 'Shared Services' | 'Networks & IT';
export type AgentType = 'Billing' | 'Inventory Checker' | 'Sales Coach';
export type CustomerJourney = 'Discover' | 'Buy' | 'Onboard' | 'Use' | 'Help' | 'Change' | 'Maintain';

export interface DesirabilityScores {
  enhancerScore: number;
  productivityScore: number;
  riskMitigationScore: number;
  marketSizeScore: number;
  adoptionScore: number;
  validationScore: number;
}

export interface ViabilityScores {
  strategyAlignmentScore: number;
  cashBenefitScore: number;
  maintenanceCostScore: number;
  nonFinancialScore: number;
  paybackScore: number;
  foundationalScore: number;
}

export interface FeasibilityScores {
  ootbScore: number;
  customScore: number;
  integrationScore: number;
  dependenciesScore: number;
  multiActionScore: number;
  externalDataScore: number;
}

export interface FormData {
  agentId: AgentID;
  name: AgentName;
  owner: string;
  description: string;
  businessUnit: BusinessUnit;
  agentType: AgentType;
  customerJourney: CustomerJourney;
  desirability: number;
  viability: number;
  feasibility: number;
  desirabilityScores: DesirabilityScores;
  viabilityScores: ViabilityScores;
  feasibilityScores: FeasibilityScores;
}

export interface AssessmentQuestion {
  key: string;
  label: string;
  description: string;
  options: {
    value: number;
    label: string;
  }[];
  weight: string;
}

export interface ReviewResult {
  agentId: string;
  status: 'Approved' | 'Rejected';
  date: string;
  notes: string;
  failedQuestions?: {
    category: string;
    questions: string[];
  }[];
}

export interface AIAgent {
  id: string;
  agentId: AgentID;
  name: AgentName;
  owner: string;
  description: string;
  businessUnit: BusinessUnit;
  agentType: AgentType;
  customerJourney: CustomerJourney;
  desirability: number;
  viability: number;
  feasibility: number;
  desirabilityScores: DesirabilityScores;
  viabilityScores: ViabilityScores;
  feasibilityScores: FeasibilityScores;
  totalScore?: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewNotes?: string;
  reviewDate?: string;
  reviewResults?: ReviewResult;
}
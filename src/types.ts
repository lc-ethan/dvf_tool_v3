// Business Unit mappings
export type BUBenefitting = 'Enterprise' | 'Consumer & Business' | 'All';
export type BusinessUnit = 'Enterprise' | 'T1' | 'Shared Services' | 'Networks & IT';
export type BUAcronym = 'Ent' | 'CB' | 'All';

// Customer Journey mappings
export type CustomerJourney = 'Discover' | 'Buy' | 'Onboard' | 'Use' | 'Help' | 'Change' | 'Maintain, Leave and Collaborate';
export type JourneyAcronym = 'D' | 'B' | 'O' | 'U' | 'H' | 'C' | 'M';

// Activator mappings
export type ActivatorName = 'T1' | 'Consumer & Business' | 'E&C' | 'Networks & IT' | 'Shared Services' | 'Enterprise';

// Platform options
export type Platform = 'AWS' | 'Agentforce' | 'SAP';

// Agent Type and Classification mappings
export type AgentType = 'A2C' | 'A2A' | 'A2E';
export type AgentClassification = 'R' | 'T' | 'C';

export type AgentTypeLabel = 'Agent to Consumer' | 'Agent to Agent' | 'Agent to Employee';
export type AgentClassLabel = 'Role' | 'Task' | 'Capability';

// Agent ID format: {AgentType}-{AgentClass}-{JobTitle}-{Journey}-{BU}
export type AgentID = string;

export type AgentName = 
  | 'Wiremu' | 'Rāwiri' | 'Mikaere' | 'Nikau' | 'Koa' | 'Manaia' | 'Manaaki'
  | 'Kiwa' | 'Kaitoa' | 'Aroha' | 'Amaia' | 'Maia' | 'Anahera' | 'Moana'
  | 'Ataahua' | 'Marama' | 'Atarangi' | 'Tui' | 'Sarah' | 'Nicola'
  | 'Angela' | 'Lisa' | 'Michelle' | 'Rebecca' | 'Rachel' | 'Melanie'
  | 'Natasha' | 'Amanda' | 'Joanne' | 'Kylie' | 'Tania' | 'Karen'
  | 'Andrea' | 'Katrina' | 'Vanessa' | 'Kim' | 'Megan';

export interface HRPerson {
  name: string;
  email: string;
}

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
  jobTitle: string;
  owner: string;
  ownerEmail: string;
  description: string;
  buBenefitting: BUBenefitting;
  activatorName: ActivatorName;
  platform: Platform;
  agentType: AgentType;
  agentClassification: AgentClassification;
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

export interface AIAgent extends FormData {
  id: string;
  totalScore?: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewNotes?: string;
  reviewDate?: string;
  reviewResults?: ReviewResult;
}
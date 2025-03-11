import React from 'react';
import { PlusCircle, ArrowRight, AlertCircle } from 'lucide-react';
import type { FormData, BusinessUnit, AgentType, CustomerJourney, AgentID, AgentName } from '../types';
import { DVFScoring } from './DVFScoring';
import { calculateDesirabilityScore, calculateViabilityScore, calculateFeasibilityScore } from '../utils/calculateScore';

interface AgentFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
  isEditing?: boolean;
  nameError?: string | null;
  onNameChange?: () => void;
  onStepChange?: () => void;
  existingAgents: Array<{ agentId: AgentID; name: AgentName; status: 'Pending' | 'Approved' | 'Rejected' }>;
}

const initialScores = {
  desirabilityScores: {
    enhancerScore: 2,
    productivityScore: 2,
    riskMitigationScore: 2,
    marketSizeScore: 2,
    adoptionScore: 2,
    validationScore: 2
  },
  viabilityScores: {
    strategyAlignmentScore: 1,
    cashBenefitScore: 1,
    maintenanceCostScore: 1,
    nonFinancialScore: 1,
    paybackScore: 1,
    foundationalScore: 1
  },
  feasibilityScores: {
    ootbScore: 2,
    customScore: 2,
    integrationScore: 2,
    dependenciesScore: 2,
    multiActionScore: 2,
    externalDataScore: 2
  }
};

// Generate Agent IDs
const generateAgentIds = (): AgentID[] => {
  const ids: AgentID[] = [];
  for (let i = 1; i <= 20; i++) {
    ids.push(`A${i}_AgentID${i}` as AgentID);
  }
  return ids;
};

// Agent Names
const allAgentNames: AgentName[] = [
  'Wiremu', 'Rāwiri', 'Mikaere', 'Nikau', 'Koa', 'Manaia', 'Manaaki',
  'Kiwa', 'Kaitoa', 'Aroha', 'Amaia', 'Maia', 'Anahera', 'Moana',
  'Ataahua', 'Marama', 'Atarangi', 'Tui', 'Sarah', 'Nicola',
  'Angela', 'Lisa', 'Michelle', 'Rebecca', 'Rachel', 'Melanie',
  'Natasha', 'Amanda', 'Joanne', 'Kylie', 'Tania', 'Karen',
  'Andrea', 'Katrina', 'Vanessa', 'Kim', 'Megan'
];

type FormStep = 'details' | 'desirability' | 'viability' | 'feasibility';

export function AgentForm({ 
  onSubmit, 
  initialData, 
  isEditing = false, 
  nameError, 
  onNameChange,
  onStepChange,
  existingAgents 
}: AgentFormProps) {
  const formRef = React.useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = React.useState<FormStep>(isEditing ? 'desirability' : 'details');

  // Filter out names that are already in use
  const availableNames = React.useMemo(() => {
    const usedNames = new Set(existingAgents.map(agent => agent.name));
    return allAgentNames.filter(name => !usedNames.has(name));
  }, [existingAgents]);

  // Filter out Agent IDs that are already approved
  const availableAgentIds = React.useMemo(() => {
    const usedIds = new Set(existingAgents.filter(agent => agent.status === 'Approved').map(agent => agent.agentId));
    return generateAgentIds().filter(id => !usedIds.has(id));
  }, [existingAgents]);

  const [formData, setFormData] = React.useState<FormData>(initialData || {
    agentId: availableAgentIds[0] || generateAgentIds()[0],
    name: availableNames[0] || allAgentNames[0],
    owner: '',
    description: '',
    businessUnit: 'Enterprise',
    agentType: 'Billing',
    customerJourney: 'Discover',
    desirability: 0,
    viability: 0,
    feasibility: 0,
    ...initialScores
  });

  const [descriptionError, setDescriptionError] = React.useState<string | null>(null);

  // Update form data when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setCurrentStep('desirability');
    } else {
      setFormData({
        agentId: availableAgentIds[0] || generateAgentIds()[0],
        name: availableNames[0] || allAgentNames[0],
        owner: '',
        description: '',
        businessUnit: 'Enterprise',
        agentType: 'Billing',
        customerJourney: 'Discover',
        desirability: 0,
        viability: 0,
        feasibility: 0,
        ...initialScores
      });
      setCurrentStep('details');
    }
  }, [initialData, availableNames, availableAgentIds]);

  const businessUnits: BusinessUnit[] = ['Enterprise', 'T1', 'Shared Services', 'Networks & IT'];
  const agentTypes: AgentType[] = ['Billing', 'Inventory Checker', 'Sales Coach'];
  const customerJourneys: CustomerJourney[] = [
    'Discover',
    'Buy',
    'Onboard',
    'Use',
    'Help',
    'Change',
    'Maintain'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const desirability = calculateDesirabilityScore(formData.desirabilityScores);
    const viability = calculateViabilityScore(formData.viabilityScores);
    const feasibility = calculateFeasibilityScore(formData.feasibilityScores);

    onSubmit({
      ...formData,
      desirability,
      viability,
      feasibility
    });

    if (!isEditing) {
      setFormData({
        agentId: availableAgentIds[0] || generateAgentIds()[0],
        name: availableNames[0] || allAgentNames[0],
        owner: '',
        description: '',
        businessUnit: 'Enterprise',
        agentType: 'Billing',
        customerJourney: 'Discover',
        desirability: 0,
        viability: 0,
        feasibility: 0,
        ...initialScores
      });
      setCurrentStep('details');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Don't allow name changes when editing
    if (isEditing && (name === 'name' || name === 'agentId')) return;
    
    if (name === 'name' && onNameChange) {
      onNameChange();
    }

    if (name === 'description') {
      setDescriptionError(null);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScoreChange = (
    type: 'desirability' | 'viability' | 'feasibility',
    field: string,
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [`${type}Scores`]: {
        ...prev[`${type}Scores`],
        [field]: value
      }
    }));
  };

  const scrollToTop = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    if (onStepChange) {
      onStepChange();
    }
  };

  const handleNext = () => {
    if (currentStep === 'details' && !formData.description.trim()) {
      setDescriptionError('Please provide a description before continuing');
      return;
    }

    switch (currentStep) {
      case 'details':
        setCurrentStep('desirability');
        break;
      case 'desirability':
        setCurrentStep('viability');
        break;
      case 'viability':
        setCurrentStep('feasibility');
        break;
      default:
        break;
    }
    requestAnimationFrame(() => {
      scrollToTop();
    });
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'desirability':
        if (!isEditing) setCurrentStep('details');
        break;
      case 'viability':
        setCurrentStep('desirability');
        break;
      case 'feasibility':
        setCurrentStep('viability');
        break;
      default:
        break;
    }
    requestAnimationFrame(() => {
      scrollToTop();
    });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {(['details', 'desirability', 'viability', 'feasibility'] as FormStep[])
        .filter(step => !isEditing || step !== 'details')
        .map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {isEditing ? index + 1 : index + 1}
            </div>
            {index < (isEditing ? 2 : 3) && (
              <div className="w-16 h-1 mx-2 bg-gray-200">
                <div
                  className={`h-full bg-blue-600 transition-all ${
                    index < ['details', 'desirability', 'viability', 'feasibility']
                      .filter(s => !isEditing || s !== 'details')
                      .indexOf(currentStep)
                      ? 'w-full'
                      : 'w-0'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
    </div>
  );

  const renderDetailsStep = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Update AI Agent' : 'Add New AI Agent'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Agent ID
          </label>
          <select
            name="agentId"
            value={formData.agentId}
            onChange={handleInputChange}
            required
            disabled={isEditing}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          >
            {availableAgentIds.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
          {isEditing && (
            <p className="mt-1 text-sm text-gray-500">
              Agent ID cannot be changed when updating
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Agent Name
          </label>
          <select
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isEditing}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
            } ${nameError ? 'border-red-300' : 'border-gray-300'}`}
          >
            {availableNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          {isEditing && (
            <p className="mt-1 text-sm text-gray-500">
              Agent name cannot be changed when updating
            </p>
          )}
          {nameError && (
            <p className="mt-1 text-sm text-red-600">
              {nameError}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Owner
          </label>
          <input
            type="text"
            name="owner"
            value={formData.owner}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter owner name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Unit
            </label>
            <select
              name="businessUnit"
              value={formData.businessUnit}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {businessUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Agent Type
            </label>
            <select
              name="agentType"
              value={formData.agentType}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {agentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Journey
            </label>
            <select
              name="customerJourney"
              value={formData.customerJourney}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {customerJourneys.map((journey) => (
                <option key={journey} value={journey}>
                  {journey}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              descriptionError ? 'border-red-300' : 'border-gray-300'
            }`}
            rows={3}
            placeholder="Example: This AI agent assists customers with billing inquiries by analyzing their account history and providing personalized solutions for payment issues."
          />
          {descriptionError && (
            <p className="mt-1 text-sm text-red-600">
              {descriptionError}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="w-full flex items-center justify-center px-3 py-2 text-sm md:px-4 md:py-2 md:text-base border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continue to Assessment <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8" ref={formRef}>
      {renderStepIndicator()}

      {currentStep === 'details' && !isEditing && renderDetailsStep()}

      {currentStep === 'desirability' && (
        <>
          <DVFScoring
            desirabilityScores={formData.desirabilityScores}
            viabilityScores={formData.viabilityScores}
            feasibilityScores={formData.feasibilityScores}
            onScoreChange={handleScoreChange}
            currentStep={currentStep}
          />
          <div className="flex justify-between gap-4">
            {!isEditing && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-3 py-2 text-sm md:px-4 md:py-2 md:text-base border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 px-3 py-2 text-sm md:px-4 md:py-2 md:text-base border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue to Viability
            </button>
          </div>
        </>
      )}

      {currentStep === 'viability' && (
        <>
          <DVFScoring
            desirabilityScores={formData.desirabilityScores}
            viabilityScores={formData.viabilityScores}
            feasibilityScores={formData.feasibilityScores}
            onScoreChange={handleScoreChange}
            currentStep={currentStep}
          />
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 px-3 py-2 text-sm md:px-4 md:py-2 md:text-base border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 px-3 py-2 text-sm md:px-4 md:py-2 md:text-base border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue to Feasibility
            </button>
          </div>
        </>
      )}

      {currentStep === 'feasibility' && (
        <>
          <DVFScoring
            desirabilityScores={formData.desirabilityScores}
            viabilityScores={formData.viabilityScores}
            feasibilityScores={formData.feasibilityScores}
            onScoreChange={handleScoreChange}
            currentStep={currentStep}
          />
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 px-3 py-2 text-sm md:px-4 md:py-2 md:text-base border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm md:px-4 md:py-2 md:text-base border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              {isEditing ? 'Update Agent' : 'Add Agent'}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
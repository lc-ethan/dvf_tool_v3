import React from 'react';
import { PlusCircle, ArrowRight, Plus } from 'lucide-react';
import type { 
  FormData,
  BUBenefitting,
  CustomerJourney,
  ActivatorName,
  Platform,
  AgentType,
  AgentClassification,
  AgentName,
  AgentID,
  AIAgent
} from '../types';
import { DVFScoring } from './DVFScoring';
import { calculateDesirabilityScore, calculateViabilityScore, calculateFeasibilityScore } from '../utils/calculateScore';
import { 
  AGENT_TYPE_MAPPING, 
  AGENT_CLASS_MAPPING, 
  JOURNEY_MAPPING, 
  BU_MAPPING, 
  AGENT_NAMES, 
  JOB_TITLES,
  HR_LIST 
} from '../utils/mappings';

type FormStep = 'type-selection' | 'details' | 'desirability' | 'viability' | 'feasibility';

interface AgentFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
  isEditing?: boolean;
  nameError?: string | null;
  onNameChange?: () => void;
  onStepChange?: () => void;
  existingAgents: Array<{ 
    agentId: AgentID; 
    name: AgentName; 
    status: AIAgent['status'] 
  }>;
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
    ootbScore: 0,
    customScore: 1,
    integrationScore: 1,
    dependenciesScore: 1,
    multiActionScore: 1,
    externalDataScore: 1
  }
};

const buBenefittingOptions: BUBenefitting[] = ['Enterprise', 'Consumer & Business', 'All'];
const customerJourneyOptions: CustomerJourney[] = [
  'Discover', 'Buy', 'Onboard', 'Use', 'Help', 'Change', 'Maintain, Leave and Collaborate'
];
const activatorOptions: ActivatorName[] = [
  'T1', 'Consumer & Business', 'E&C', 'Networks & IT', 'Shared Services', 'Enterprise'
];
const platformOptions: Platform[] = ['AWS', 'Agentforce', 'SAP'];

const agentTypes = Object.entries(AGENT_TYPE_MAPPING).map(([type, label]) => ({
  value: type,
  label: label
}));

const agentClassifications = Object.entries(AGENT_CLASS_MAPPING).map(([type, label]) => ({
  value: type,
  label: label
}));

const generateAgentId = (
  type: AgentType,
  classification: AgentClassification,
  jobTitle: string,
  journey: CustomerJourney,
  bu: BUBenefitting
): string => {
  if (!jobTitle) return '';
  
  const journeyAcronym = JOURNEY_MAPPING[journey];
  const buAcronym = BU_MAPPING[bu];

  return `${type} ${classification} ${jobTitle} ${journeyAcronym} ${buAcronym}`;
};

function StepIndicator({ currentStep, isEditing }: { currentStep: FormStep; isEditing: boolean }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {(['type-selection', 'details', 'desirability', 'viability', 'feasibility'] as FormStep[])
        .filter(step => !isEditing || (step !== 'type-selection' && step !== 'details'))
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
            {index < (isEditing ? 2 : 4) && (
              <div className="w-16 h-1 mx-2 bg-gray-200">
                <div
                  className={`h-full bg-blue-600 transition-all ${
                    index < ['type-selection', 'details', 'desirability', 'viability', 'feasibility']
                      .filter(s => !isEditing || (s !== 'type-selection' && s !== 'details'))
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
}

function TypeSelectionStep({ 
  formData, 
  onChange, 
  onNext, 
  errors,
  existingAgents 
}: { 
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onNext: () => void;
  errors?: { 
    jobTitle?: string | null;
    agentId?: string | null;
  };
  existingAgents: Array<{ 
    agentId: AgentID; 
    name: AgentName; 
    status: AIAgent['status'] 
  }>;
}) {
  const [useCustomJobTitle, setUseCustomJobTitle] = React.useState(false);

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({
      target: {
        name: 'jobTitle',
        value: e.target.value
      }
    });
  };

  const toggleJobTitleInput = () => {
    setUseCustomJobTitle(!useCustomJobTitle);
    handleJobTitleChange({
      target: {
        value: useCustomJobTitle ? JOB_TITLES[0] : ''
      }
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  const isAgentIdUnique = formData.agentId && !existingAgents.some(agent => agent.agentId === formData.agentId);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Agent Configuration</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Type
            </label>
            <select
              name="agentType"
              value={formData.agentType}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {agentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Classification
            </label>
            <select
              name="agentClassification"
              value={formData.agentClassification}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {agentClassifications.map(classification => (
                <option key={classification.value} value={classification.value}>
                  {classification.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <button
              type="button"
              onClick={toggleJobTitleInput}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              {useCustomJobTitle ? 'Use Existing Title' : 'Add Custom Title'}
            </button>
          </div>
          
          {useCustomJobTitle ? (
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleJobTitleChange}
              required
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors?.jobTitle ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter custom job title"
            />
          ) : (
            <select
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleJobTitleChange}
              required
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors?.jobTitle ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a job title</option>
              {JOB_TITLES.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          )}
          {errors?.jobTitle && (
            <p className="mt-1 text-sm text-red-600">
              {errors.jobTitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              BU Benefitting
            </label>
            <select
              name="buBenefitting"
              value={formData.buBenefitting}
              onChange={onChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {buBenefittingOptions.map((bu) => (
                <option key={bu} value={bu}>{bu}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer Journey
            </label>
            <select
              name="customerJourney"
              value={formData.customerJourney}
              onChange={onChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {customerJourneyOptions.map((journey) => (
                <option key={journey} value={journey}>{journey}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Activator Name
            </label>
            <select
              name="activatorName"
              value={formData.activatorName}
              onChange={onChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {activatorOptions.map((activator) => (
                <option key={activator} value={activator}>{activator}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Platform
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={onChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {platformOptions.map((platform) => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Agent ID
          </label>
          <input
            type="text"
            value={formData.agentId}
            disabled
            className={`mt-1 block w-full rounded-md border-gray-300 bg-gray-100 cursor-not-allowed ${
              errors?.agentId ? 'border-red-300' : ''
            }`}
          />
          {errors?.agentId ? (
            <p className="mt-1 text-sm text-red-600">
              {errors.agentId}
            </p>
          ) : (
            <p className="mt-1 text-sm text-gray-500">
              Auto-generated based on selected fields
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={!formData.jobTitle.trim() || !isAgentIdUnique}
          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white ${
            formData.jobTitle.trim() && isAgentIdUnique
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 cursor-not-allowed'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          Continue to Details <ArrowRight className="w-5 h-5 ml-2" />
        </button>
        
        {formData.agentId && !isAgentIdUnique && (
          <p className="text-sm text-red-600 text-center">
            This Agent ID already exists. Please modify the configuration to create a unique ID.
          </p>
        )}
      </div>
    </div>
  );
}

function DetailsStep({ 
  formData, 
  onChange, 
  onNext, 
  onBack, 
  errors,
  availableNames 
}: { 
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onNext: () => void;
  onBack: () => void;
  errors?: {
    name?: string | null;
    description?: string | null;
  };
  availableNames?: AgentName[];
}) {
  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ownerName = e.target.value;
    const hrPerson = HR_LIST.find(person => person.name.toLowerCase() === ownerName.toLowerCase());
    
    onChange(e); // Update owner name

    // Update owner email
    onChange({
      target: {
        name: 'ownerEmail',
        value: hrPerson?.email || ''
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Agent Details</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Agent Name
          </label>
          <select
            name="name"
            value={formData.name}
            onChange={onChange}
            required
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors?.name ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            {availableNames?.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          {errors?.name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Owner
            </label>
            <input
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleOwnerChange}
              required
              list="hr-list"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter owner name"
            />
            <datalist id="hr-list">
              {HR_LIST.map((person, index) => (
                <option key={`${person.email}-${index}`} value={person.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Owner Email
            </label>
            <input
              type="email"
              name="ownerEmail"
              value={formData.ownerEmail}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
              placeholder="Email will auto-populate"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            required
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors?.description ? 'border-red-300' : 'border-gray-300'
            }`}
            rows={3}
            placeholder="Describe the agent's purpose and functionality"
          />
          {errors?.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description}
            </p>
          )}
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!formData.description.trim()}
            className={`flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white ${
              formData.description.trim()
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            Continue to Assessment <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AgentForm({ 
  onSubmit, 
  initialData, 
  isEditing = false, 
  nameError, 
  onNameChange,
  onStepChange,
  existingAgents 
}: AgentFormProps) {
  const formRef = React.useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = React.useState<FormStep>(isEditing ? 'desirability' : 'type-selection');
  const [jobTitleError, setJobTitleError] = React.useState<string | null>(null);
  const [agentIdError, setAgentIdError] = React.useState<string | null>(null);
  const [descriptionError, setDescriptionError] = React.useState<string | null>(null);

  const availableNames = React.useMemo(() => {
    const usedNames = new Set(existingAgents.map(agent => agent.name));
    return AGENT_NAMES.filter(name => !usedNames.has(name as AgentName)) as AgentName[];
  }, [existingAgents]);

  const [formData, setFormData] = React.useState(initialData || {
    agentId: '',
    name: availableNames[0] || AGENT_NAMES[0] as AgentName,
    jobTitle: '',
    owner: '',
    ownerEmail: '',
    description: '',
    buBenefitting: 'Enterprise',
    activatorName: 'T1',
    platform: 'AWS',
    agentType: 'A2C',
    agentClassification: 'R',
    customerJourney: 'Discover',
    desirability: 0,
    viability: 0,
    feasibility: 0,
    ...initialScores
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setCurrentStep('desirability');
    }
  }, [initialData]);

  React.useEffect(() => {
    if (!isEditing) {
      const newAgentId = generateAgentId(
        formData.agentType,
        formData.agentClassification,
        formData.jobTitle,
        formData.customerJourney,
        formData.buBenefitting
      );
      setFormData(prev => ({ ...prev, agentId: newAgentId }));
    }
  }, [
    formData.agentType,
    formData.agentClassification,
    formData.jobTitle,
    formData.customerJourney,
    formData.buBenefitting,
    isEditing
  ]);

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
      setFormData(prev => ({
        ...prev,
        jobTitle: '',
        owner: '',
        ownerEmail: '',
        description: '',
        ...initialScores
      }));
      setCurrentStep('type-selection');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'name' && onNameChange) {
      onNameChange();
    }

    if (name === 'description') {
      setDescriptionError(null);
    }

    if (name === 'jobTitle') {
      setJobTitleError(null);
    }

    setFormData(prev => ({
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
    
    if (onStepChange) {
      onStepChange();
    }
  };

  const validateStep = () => {
    if (currentStep === 'type-selection') {
      const isAgentIdUnique = !existingAgents.some(agent => agent.agentId === formData.agentId);
      if (!isAgentIdUnique) {
        setAgentIdError('This Agent ID already exists');
        return false;
      }
    }
    if (currentStep === 'details') {
      if (!formData.jobTitle.trim()) {
        setJobTitleError('Please enter a job title');
        return false;
      }
      if (!formData.description.trim()) {
        setDescriptionError('Please provide a description');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    switch (currentStep) {
      case 'type-selection':
        setCurrentStep('details');
        break;
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
    scrollToTop();
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'details':
        if (!isEditing) setCurrentStep('type-selection');
        break;
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
    scrollToTop();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" ref={formRef}>
      <StepIndicator currentStep={currentStep} isEditing={isEditing} />

      {currentStep === 'type-selection' && !isEditing && (
        <TypeSelectionStep
          formData={formData}
          onChange={handleInputChange}
          onNext={handleNext}
          errors={{ 
            jobTitle: jobTitleError,
            agentId: agentIdError
          }}
          existingAgents={existingAgents}
        />
      )}

      {currentStep === 'details' && !isEditing && (
        <DetailsStep
          formData={formData}
          onChange={handleInputChange}
          onNext={handleNext}
          onBack={handleBack}
          errors={{
            name: nameError,
            description: descriptionError
          }}
          availableNames={availableNames}
        />
      )}

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
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

export { AgentForm };
import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { DesirabilityScores, ViabilityScores, FeasibilityScores } from '../types';

interface DVFScoringProps {
  desirabilityScores: DesirabilityScores;
  viabilityScores: ViabilityScores;
  feasibilityScores: FeasibilityScores;
  onScoreChange: (
    type: 'desirability' | 'viability' | 'feasibility',
    field: string,
    value: number
  ) => void;
  currentStep: 'details' | 'desirability' | 'viability' | 'feasibility';
}

const TOP_10_BUSINESS_RISKS = [
  { risk: 'Cyber security breach', description: 'Unauthorized access to systems and data' },
  { risk: 'Privacy breach', description: 'Unauthorized disclosure of personal/sensitive information' },
  { risk: 'Sustained economic downturn', description: 'Long-term negative economic conditions' },
  { risk: 'Health and Safety', description: 'Workplace health and safety incidents' },
  { risk: 'Business Interruption (IT)', description: 'Critical IT system failures or outages' },
  { risk: 'Retain competition dynamics', description: 'Market share and competitive position threats' },
  { risk: 'Business Interruption (Network)', description: 'Network infrastructure failures' },
  { risk: 'Business Transformation - Simplification', description: 'Change management and transformation challenges' },
  { risk: 'Consumer Law Compliance', description: 'Regulatory compliance violations' },
  { risk: 'Fraud Risk', description: 'Financial fraud and fraudulent activities' }
];

export function DVFScoring({
  desirabilityScores,
  viabilityScores,
  feasibilityScores,
  onScoreChange,
  currentStep,
}: DVFScoringProps) {
  const [showRiskGlossary, setShowRiskGlossary] = React.useState(false);

  const ScoreOption = ({ 
    value, 
    label, 
    checked, 
    onChange,
    disabled = false
  }: { 
    value: number; 
    label: string; 
    checked: boolean; 
    onChange: (value: number) => void;
    disabled?: boolean;
  }) => (
    <label className={`flex items-center space-x-2 p-2 rounded ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
    }`}>
      <input
        type="radio"
        checked={checked}
        onChange={() => !disabled && onChange(value)}
        disabled={disabled}
        className="form-radio text-blue-600"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );

  const ScoreSection = ({
    title,
    description,
    options,
    selectedValue,
    onChange,
    showGlossaryButton,
    warning,
    disabled = false
  }: {
    title: string;
    description: string;
    options: { value: number; label: string }[];
    selectedValue: number;
    onChange: (value: number) => void;
    showGlossaryButton?: boolean;
    warning?: string;
    disabled?: boolean;
  }) => (
    <div className="border-b pb-6 mb-6 last:border-b-0">
      <div className="mb-2">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-gray-900">{title}</h4>
          {showGlossaryButton && (
            <button
              type="button"
              onClick={() => setShowRiskGlossary(!showRiskGlossary)}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              View Top 10 Business Risks
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      
      {warning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">{warning}</p>
        </div>
      )}
      
      {showGlossaryButton && showRiskGlossary && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-3">Top 10 Business Risks</h5>
          <div className="space-y-2">
            {TOP_10_BUSINESS_RISKS.map((item, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium text-blue-800">{index + 1}. {item.risk}</span>
                <p className="text-blue-700 ml-4">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option) => (
          <ScoreOption
            key={option.value}
            value={option.value}
            label={option.label}
            checked={selectedValue === option.value}
            onChange={onChange}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );

  const renderDesirabilitySection = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Desirability Assessment</h3>
        <span className="text-sm font-medium px-3 py-1 bg-green-100 text-green-800 rounded-full">
          10 points max
        </span>
      </div>
      <div className="space-y-6">
        <ScoreSection
          title="Strong Enhancer of CX for customers and frontline users"
          description="How significantly does this enhance the customer and frontline user experience?"
          options={[
            { value: 2, label: "No" },
            { value: 4, label: "Limited Impact" },
            { value: 6, label: "Medium Impact" },
            { value: 8, label: "High Impact" },
            { value: 10, label: "Significant Impact" }
          ]}
          selectedValue={desirabilityScores.enhancerScore}
          onChange={(value) => onScoreChange('desirability', 'enhancerScore', value)}
        />

        <ScoreSection
          title="Use case drives productivity of employees, expediting work in timely manner"
          description="What is the impact on employee productivity and work efficiency?"
          options={[
            { value: 2, label: "No" },
            { value: 4, label: "Limited Impact" },
            { value: 6, label: "Medium Impact" },
            { value: 8, label: "High Impact" },
            { value: 10, label: "Significant Impact" }
          ]}
          selectedValue={desirabilityScores.productivityScore}
          onChange={(value) => onScoreChange('desirability', 'productivityScore', value)}
        />

        <ScoreSection
          title="Use case mitigates a key business risk (e.g. fraud)"
          description="How effectively does this address key business risks?"
          options={[
            { value: 2, label: "No" },
            { value: 4, label: "Impact Minor Risk" },
            { value: 6, label: "Medium Impact on Medium Risk" },
            { value: 8, label: "High Impact on Medium Risk, Medium Impact on Top 10 business risk" },
            { value: 10, label: "High Impact on Top 10 business Risk" }
          ]}
          selectedValue={desirabilityScores.riskMitigationScore}
          onChange={(value) => onScoreChange('desirability', 'riskMitigationScore', value)}
          showGlossaryButton={true}
        />

        <ScoreSection
          title="Size of Market impacted"
          description="What is the scale of the market impact?"
          options={[
            { value: 2, label: "Small or medium market, in decline" },
            { value: 4, label: "Small market, stable to growing" },
            { value: 6, label: "Medium market, stable to growing" },
            { value: 8, label: "Large market, stable" },
            { value: 10, label: "Large market, growing" }
          ]}
          selectedValue={desirabilityScores.marketSizeScore}
          onChange={(value) => onScoreChange('desirability', 'marketSizeScore', value)}
        />

        <ScoreSection
          title="Driver of AI Adoption"
          description="How significant is this as a driver for AI adoption?"
          options={[
            { value: 2, label: "No" },
            { value: 4, label: "Limited Impact" },
            { value: 6, label: "Medium Impact" },
            { value: 8, label: "High Impact" },
            { value: 10, label: "Significant Impact" }
          ]}
          selectedValue={desirabilityScores.adoptionScore}
          onChange={(value) => onScoreChange('desirability', 'adoptionScore', value)}
        />

        <ScoreSection
          title="User of use case has been validated desirability"
          description="To what extent has user validation been obtained?"
          options={[
            { value: 2, label: "No" },
            { value: 4, label: "Yes - limited buy in" },
            { value: 6, label: "Yes - sees value" },
            { value: 8, label: "Yes - advocate for use case" },
            { value: 10, label: "Yes - excited for use case" }
          ]}
          selectedValue={desirabilityScores.validationScore}
          onChange={(value) => onScoreChange('desirability', 'validationScore', value)}
        />
      </div>
    </div>
  );

  const renderViabilitySection = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Viability Assessment</h3>
        <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
          5 points max
        </span>
      </div>
      <div className="space-y-6">
        <ScoreSection
          title="Alignment to pillar of corporate strategy"
          description="How well does this align with corporate strategy pillars?"
          options={[
            { value: 1, label: "No" },
            { value: 2, label: "Yes - non-specific pillar" },
            { value: 3, label: "Yes - 1 pillar" },
            { value: 4, label: "Yes - 2 pillars" },
            { value: 5, label: "Yes - 3 pillars" }
          ]}
          selectedValue={viabilityScores.strategyAlignmentScore}
          onChange={(value) => onScoreChange('viability', 'strategyAlignmentScore', value)}
        />

        <ScoreSection
          title="Drives cash benefit (margin growth, cost savings or capex savings p.a.)"
          description="What is the financial impact?"
          options={[
            { value: 1, label: "<100k" },
            { value: 2, label: "0.1 - 0.25m" },
            { value: 3, label: "0.25 - 0.5m" },
            { value: 4, label: "0.5 - 1m" },
            { value: 5, label: ">1m" }
          ]}
          selectedValue={viabilityScores.cashBenefitScore}
          onChange={(value) => onScoreChange('viability', 'cashBenefitScore', value)}
        />

        <ScoreSection
          title="Cost to maintain use case (p.a.)"
          description="What are the maintenance costs?"
          options={[
            { value: 1, label: ">1m" },
            { value: 2, label: "0.5-1m" },
            { value: 3, label: "0.3-0.5m" },
            { value: 4, label: "0.1-0.3m" },
            { value: 5, label: "<0.1m" }
          ]}
          selectedValue={viabilityScores.maintenanceCostScore}
          onChange={(value) => onScoreChange('viability', 'maintenanceCostScore', value)}
        />

        <ScoreSection
          title="Non-financial benefits e.g. eNPS"
          description="What are the non-financial benefits?"
          options={[
            { value: 1, label: "None" },
            { value: 2, label: "Minimal" },
            { value: 3, label: "Medium" },
            { value: 4, label: "Strong" },
            { value: 5, label: "Significant" }
          ]}
          selectedValue={viabilityScores.nonFinancialScore}
          onChange={(value) => onScoreChange('viability', 'nonFinancialScore', value)}
        />

        <ScoreSection
          title="Payback period"
          description="What is the expected payback period?"
          options={[
            { value: 1, label: "> 3years" },
            { value: 2, label: "< 3 years" },
            { value: 3, label: "< 2 years" },
            { value: 4, label: "< 1 year" },
            { value: 5, label: "< 6 months" }
          ]}
          selectedValue={viabilityScores.paybackScore}
          onChange={(value) => onScoreChange('viability', 'paybackScore', value)}
        />

        <ScoreSection
          title="Use case foundational for others, scalable or reusable"
          description="Is this use case foundational, scalable, or reusable?"
          options={[
            { value: 1, label: "No" },
            { value: 5, label: "Yes" }
          ]}
          selectedValue={viabilityScores.foundationalScore}
          onChange={(value) => onScoreChange('viability', 'foundationalScore', value)}
        />
      </div>
    </div>
  );

  const renderFeasibilitySection = () => {
    const hasConflictingAnswers = feasibilityScores.ootbScore === feasibilityScores.customScore;
    
    const handleOotbChange = (value: number) => {
      onScoreChange('feasibility', 'ootbScore', value);
      // Automatically set the opposite value for customScore
      onScoreChange('feasibility', 'customScore', value === 1 ? 0 : 1);
    };

    const handleCustomChange = (value: number) => {
      onScoreChange('feasibility', 'customScore', value);
      // Automatically set the opposite value for ootbScore
      onScoreChange('feasibility', 'ootbScore', value === 1 ? 0 : 1);
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Feasibility Assessment</h3>
          <span className="text-sm font-medium px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
            15 points max
          </span>
        </div>
        <div className="space-y-6">
          <ScoreSection
            title="Out of the box use cases (no customisation)"
            description="Can this be implemented using out-of-the-box features without customization?"
            options={[
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ]}
            selectedValue={feasibilityScores.ootbScore}
            onChange={handleOotbChange}
            warning={hasConflictingAnswers ? "This answer must be opposite to the customization question below" : undefined}
          />

          <ScoreSection
            title="Custom Use cases and out of the box use cases with some customisation required"
            description="Does this require custom development or modifications to out-of-the-box features?"
            options={[
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ]}
            selectedValue={feasibilityScores.customScore}
            onChange={handleCustomChange}
            warning={hasConflictingAnswers ? "This answer must be opposite to the out-of-the-box question above" : undefined}
          />

          <ScoreSection
            title="This agent completes multiple actions"
            description="Does this agent need to handle multiple actions?"
            options={[
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ]}
            selectedValue={feasibilityScores.multiActionScore}
            onChange={(value) => onScoreChange('feasibility', 'multiActionScore', value)}
          />

          <ScoreSection
            title="Dependencies (other programs, data migration, downstream etc)"
            description="Are there external dependencies required?"
            options={[
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ]}
            selectedValue={feasibilityScores.dependenciesScore}
            onChange={(value) => onScoreChange('feasibility', 'dependenciesScore', value)}
          />

          <ScoreSection
            title="Integration that relies on technology that has not been implemented"
            description="Does this require integration with unimplemented technology?"
            options={[
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ]}
            selectedValue={feasibilityScores.integrationScore}
            onChange={(value) => onScoreChange('feasibility', 'integrationScore', value)}
          />

          <ScoreSection
            title="Relies on data that does not exist in the target platform today"
            description="Does this require data that doesn't currently exist in the target platform?"
            options={[
              { value: 0, label: "No" },
              { value: 1, label: "Yes" }
            ]}
            selectedValue={feasibilityScores.externalDataScore}
            onChange={(value) => onScoreChange('feasibility', 'externalDataScore', value)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {currentStep === 'desirability' && renderDesirabilitySection()}
      {currentStep === 'viability' && renderViabilitySection()}
      {currentStep === 'feasibility' && renderFeasibilitySection()}
    </div>
  );
}
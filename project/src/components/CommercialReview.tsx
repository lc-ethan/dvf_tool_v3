import React from 'react';
import { CheckCircle, XCircle, Clock, Star, Zap, Lightbulb, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { AIAgent, BusinessUnit, AssessmentQuestion } from '../types';

interface CommercialReviewProps {
  agents: AIAgent[];
  onUpdateStatus: (id: string, status: AIAgent['status'], notes: string, failedQuestions?: { category: string; questions: string[] }[]) => void;
}

interface QuestionApproval {
  approved: boolean;
  rejected?: boolean;
  notes?: string;
}

interface AssessmentApprovals {
  [questionKey: string]: QuestionApproval;
}

const desirabilityQuestions: AssessmentQuestion[] = [
  {
    key: 'enhancerScore',
    label: 'Strong Enhancer of CX',
    description: 'How significantly does this enhance the customer and frontline user experience?',
    options: [
      { value: 2, label: "No Impact" },
      { value: 4, label: "Limited Impact" },
      { value: 6, label: "Medium Impact" },
      { value: 8, label: "High Impact" },
      { value: 10, label: "Significant Impact" }
    ],
    weight: '20%'
  },
  {
    key: 'productivityScore',
    label: 'Productivity Impact',
    description: 'Use case drives productivity of employees, expediting work in timely manner',
    options: [
      { value: 2, label: "No Impact" },
      { value: 4, label: "Limited Impact" },
      { value: 6, label: "Medium Impact" },
      { value: 8, label: "High Impact" },
      { value: 10, label: "Significant Impact" }
    ],
    weight: '20%'
  },
  {
    key: 'riskMitigationScore',
    label: 'Risk Mitigation',
    description: 'How effectively does this address key business risks?',
    options: [
      { value: 2, label: "No Impact" },
      { value: 4, label: "Impact Minor Risk" },
      { value: 6, label: "Medium Impact on Medium Risk" },
      { value: 8, label: "High Impact on Medium Risk" },
      { value: 10, label: "High Impact on Top 10 Risk" }
    ],
    weight: '20%'
  },
  {
    key: 'marketSizeScore',
    label: 'Market Size Impact',
    description: 'What is the scale of the market impact?',
    options: [
      { value: 2, label: "Small/medium market, declining" },
      { value: 4, label: "Small market, stable/growing" },
      { value: 6, label: "Medium market, stable/growing" },
      { value: 8, label: "Large market, stable" },
      { value: 10, label: "Large market, growing" }
    ],
    weight: '20%'
  },
  {
    key: 'adoptionScore',
    label: 'AI Adoption Driver',
    description: 'How significant is this as a driver for AI adoption?',
    options: [
      { value: 2, label: "No Impact" },
      { value: 4, label: "Limited Impact" },
      { value: 6, label: "Medium Impact" },
      { value: 8, label: "High Impact" },
      { value: 10, label: "Significant Impact" }
    ],
    weight: '10%'
  },
  {
    key: 'validationScore',
    label: 'User Validation',
    description: 'To what extent has user validation been obtained?',
    options: [
      { value: 2, label: "No validation" },
      { value: 4, label: "Limited buy-in" },
      { value: 6, label: "Sees value" },
      { value: 8, label: "Advocate for use case" },
      { value: 10, label: "Excited for use case" }
    ],
    weight: '10%'
  }
];

const viabilityQuestions: AssessmentQuestion[] = [
  {
    key: 'strategyAlignmentScore',
    label: 'Strategy Alignment',
    description: 'Alignment to pillar of corporate strategy',
    options: [
      { value: 1, label: "No Alignment" },
      { value: 2, label: "Non-specific pillar" },
      { value: 3, label: "1 pillar" },
      { value: 4, label: "2 pillars" },
      { value: 5, label: "3 pillars" }
    ],
    weight: '10%'
  },
  {
    key: 'cashBenefitScore',
    label: 'Cash Benefit',
    description: 'Drives cash benefit (margin growth, cost savings or capex savings p.a.)',
    options: [
      { value: 1, label: "<100k" },
      { value: 2, label: "0.1 - 0.25m" },
      { value: 3, label: "0.25 - 0.5m" },
      { value: 4, label: "0.5 - 1m" },
      { value: 5, label: ">1m" }
    ],
    weight: '40%'
  },
  {
    key: 'maintenanceCostScore',
    label: 'Maintenance Cost',
    description: 'Cost to maintain use case (p.a.)',
    options: [
      { value: 1, label: ">1m" },
      { value: 2, label: "0.5-1m" },
      { value: 3, label: "0.3-0.5m" },
      { value: 4, label: "0.1-0.3m" },
      { value: 5, label: "<0.1m" }
    ],
    weight: '20%'
  },
  {
    key: 'nonFinancialScore',
    label: 'Non-Financial Benefits',
    description: 'Non-financial benefits e.g. eNPS',
    options: [
      { value: 1, label: "None" },
      { value: 2, label: "Minimal" },
      { value: 3, label: "Medium" },
      { value: 4, label: "Strong" },
      { value: 5, label: "Significant" }
    ],
    weight: '10%'
  },
  {
    key: 'paybackScore',
    label: 'Payback Period',
    description: 'Expected payback period',
    options: [
      { value: 1, label: "> 3 years" },
      { value: 2, label: "< 3 years" },
      { value: 3, label: "< 2 years" },
      { value: 4, label: "< 1 year" },
      { value: 5, label: "< 6 months" }
    ],
    weight: '10%'
  },
  {
    key: 'foundationalScore',
    label: 'Foundational Value',
    description: 'Use case foundational for others, scalable or reusable',
    options: [
      { value: 1, label: "No" },
      { value: 5, label: "Yes" }
    ],
    weight: '10%'
  }
];

const feasibilityQuestions: AssessmentQuestion[] = [
  {
    key: 'ootbScore',
    label: 'Out of the Box Capability',
    description: 'How much of the solution can be implemented using out-of-the-box features?',
    options: [
      { value: 2, label: "Highly Custom" },
      { value: 4, label: "Mostly Custom" },
      { value: 6, label: "Mixed" },
      { value: 8, label: "Mostly OOTB" }
    ],
    weight: '20%'
  },
  {
    key: 'customScore',
    label: 'Customization Complexity',
    description: 'How complex are the required customizations?',
    options: [
      { value: 2, label: "Very Complex" },
      { value: 4, label: "Moderately Complex" },
      { value: 6, label: "Simple" },
      { value: 8, label: "Minimal" }
    ],
    weight: '20%'
  },
  {
    key: 'integrationScore',
    label: 'Integration Requirements',
    description: 'How complex are the integration requirements?',
    options: [
      { value: 2, label: "Multiple Complex" },
      { value: 4, label: "Few Complex" },
      { value: 6, label: "Simple" },
      { value: 8, label: "Minimal/None" }
    ],
    weight: '15%'
  },
  {
    key: 'dependenciesScore',
    label: 'External Dependencies',
    description: 'Level of external dependencies required',
    options: [
      { value: 2, label: "Heavy" },
      { value: 4, label: "Moderate" },
      { value: 6, label: "Light" },
      { value: 8, label: "Minimal" }
    ],
    weight: '15%'
  },
  {
    key: 'multiActionScore',
    label: 'Multi-Action Complexity',
    description: 'Complexity of multiple action handling',
    options: [
      { value: 2, label: "Very Complex" },
      { value: 4, label: "Moderate" },
      { value: 6, label: "Simple" },
      { value: 8, label: "Single Action" }
    ],
    weight: '15%'
  },
  {
    key: 'externalDataScore',
    label: 'External Data Requirements',
    description: 'Complexity of external data requirements',
    options: [
      { value: 2, label: "Complex External" },
      { value: 4, label: "Moderate External" },
      { value: 6, label: "Simple External" },
      { value: 8, label: "Internal Only" }
    ],
    weight: '15%'
  }
];

export function CommercialReview({ agents, onUpdateStatus }: CommercialReviewProps) {
  const [selectedUnit, setSelectedUnit] = React.useState<BusinessUnit | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = React.useState<AIAgent['status']>('Pending');
  const [reviewNotes, setReviewNotes] = React.useState<Record<string, string>>({});
  const [questionApprovals, setQuestionApprovals] = React.useState<Record<string, AssessmentApprovals>>({});
  const [expandedAgents, setExpandedAgents] = React.useState<Set<string>>(new Set());
  const [rejectReasonModalOpen, setRejectReasonModalOpen] = React.useState<{
    agentId: string;
    category: string;
    questionKey: string;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState('');

  const businessUnits: (BusinessUnit | 'All')[] = ['All', 'Enterprise', 'T1', 'Shared Services', 'Networks & IT'];
  const statusOptions: AIAgent['status'][] = ['Pending', 'Approved', 'Rejected'];

  const filteredAgents = agents.filter(
    agent => (
      (selectedUnit === 'All' || agent.businessUnit === selectedUnit) &&
      agent.status === selectedStatus
    )
  );

  const toggleExpand = (agentId: string) => {
    setExpandedAgents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(agentId)) {
        newSet.delete(agentId);
      } else {
        newSet.add(agentId);
      }
      return newSet;
    });
  };

  const getStatusBadge = (status: AIAgent['status']) => {
    switch (status) {
      case 'Approved':
        return <span className="flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-1" /> Idea Approved</span>;
      case 'Rejected':
        return <span className="flex items-center text-red-600"><XCircle className="w-4 h-4 mr-1" /> Idea Backlog</span>;
      default:
        return <span className="flex items-center text-yellow-600"><Clock className="w-4 h-4 mr-1" /> Idea</span>;
    }
  };

  const getScoreLabel = (question: AssessmentQuestion, score: number) => {
    const option = question.options.find(opt => opt.value === score);
    return option ? option.label : 'N/A';
  };

  const handleQuestionApproval = (agentId: string, category: string, questionKey: string, approved: boolean) => {
    setQuestionApprovals(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        [category + '_' + questionKey]: { approved, rejected: false }
      }
    }));
  };

  const handleQuestionRejection = (agentId: string, category: string, questionKey: string) => {
    setRejectionReason('');
    setRejectReasonModalOpen({ agentId, category, questionKey });
  };

  const submitRejectionReason = () => {
    if (!rejectReasonModalOpen || !rejectionReason.trim()) return;

    const { agentId, category, questionKey } = rejectReasonModalOpen;
    setQuestionApprovals(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        [category + '_' + questionKey]: { approved: false, rejected: true, notes: rejectionReason.trim() }
      }
    }));
    setRejectReasonModalOpen(null);
    setRejectionReason('');
  };

  const isAllQuestionsReviewed = (agentId: string): boolean => {
    const approvals = questionApprovals[agentId];
    if (!approvals) return false;

    const allQuestions = [
      ...desirabilityQuestions.map(q => 'desirability_' + q.key),
      ...viabilityQuestions.map(q => 'viability_' + q.key),
      ...feasibilityQuestions.map(q => 'feasibility_' + q.key)
    ];

    return allQuestions.every(key => {
      const approval = approvals[key];
      return approval?.approved || approval?.rejected;
    });
  };

  const getFailedQuestions = (agentId: string) => {
    const approvals = questionApprovals[agentId];
    if (!approvals) return [];

    const failed: { category: string; questions: string[] }[] = [];
    
    ['desirability', 'viability', 'feasibility'].forEach(category => {
      const questions = category === 'desirability' ? desirabilityQuestions :
                       category === 'viability' ? viabilityQuestions :
                       feasibilityQuestions;

      const failedInCategory = questions
        .filter(q => approvals[category + '_' + q.key]?.rejected)
        .map(q => ({
          question: q.label,
          reason: approvals[category + '_' + q.key]?.notes || 'No reason provided'
        }));

      if (failedInCategory.length > 0) {
        failed.push({
          category,
          questions: failedInCategory.map(f => `${f.question} - ${f.reason}`)
        });
      }
    });

    return failed;
  };

  const handleStatusUpdate = (agent: AIAgent, status: AIAgent['status']) => {
    const failedQuestions = status === 'Rejected' ? getFailedQuestions(agent.id) : undefined;
    onUpdateStatus(agent.id, status, reviewNotes[agent.id] || '', failedQuestions);
    
    // Reset states
    setReviewNotes(prev => ({ ...prev, [agent.id]: '' }));
    setQuestionApprovals(prev => ({ ...prev, [agent.id]: {} }));
  };

  const renderQuestionAssessment = (
    agent: AIAgent,
    question: AssessmentQuestion,
    category: string,
    score: number
  ) => {
    const approvalKey = category + '_' + question.key;
    const approval = questionApprovals[agent.id]?.[approvalKey];

    return (
      <div key={question.key} className="border-b last:border-b-0 py-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h5 className="font-medium text-gray-900">{question.label}</h5>
            <p className="text-sm text-gray-600">{question.description}</p>
          </div>
          <span className="text-sm font-medium text-blue-600">Weight: {question.weight}</span>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-lg font-semibold">{score}</span>
            <span className="text-gray-600 ml-2">-</span>
            <span className="text-gray-600 ml-2">{getScoreLabel(question, score)}</span>
          </div>
          
          {agent.status === 'Pending' && (
            <div className="flex items-center gap-2">
              {approval?.rejected ? (
                <div className="flex items-center gap-2">
                  <div className="text-sm text-red-600 italic">
                    Rejected: {approval.notes}
                  </div>
                  <button
                    onClick={() => handleQuestionApproval(agent.id, category, question.key, true)}
                    className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-md text-sm"
                  >
                    Change to Approve
                  </button>
                  <button
                    onClick={() => handleQuestionRejection(agent.id, category, question.key)}
                    className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm"
                  >
                    Edit Reason
                  </button>
                </div>
              ) : approval?.approved ? (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm">
                    Approved
                  </span>
                  <button
                    onClick={() => handleQuestionRejection(agent.id, category, question.key)}
                    className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-md text-sm"
                  >
                    Change to Reject
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleQuestionApproval(agent.id, category, question.key, true)}
                    className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-md text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleQuestionRejection(agent.id, category, question.key)}
                    className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAssessmentSection = (
    agent: AIAgent,
    title: string,
    icon: React.ReactNode,
    questions: AssessmentQuestion[],
    scores: any,
    category: string
  ) => (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h4 className="font-semibold text-lg">{title}</h4>
      </div>
      
      <div className="space-y-2">
        {questions.map(question => 
          renderQuestionAssessment(agent, question, category, scores[question.key])
        )}
      </div>
    </div>
  );

  const renderAgentCard = (agent: AIAgent) => {
    const isExpanded = expandedAgents.has(agent.id);

    return (
      <div
        key={agent.id}
        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
      >
        <button
          onClick={() => toggleExpand(agent.id)}
          className="w-full p-6 text-left bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                {agent.agentId}
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Agent Name: {agent.name}</p>
              <p className="text-sm text-gray-600">{agent.businessUnit}</p>
              <p className="text-gray-600 mt-2">{agent.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {agent.totalScore?.toFixed(1)}
              </div>
              <p className="text-sm text-gray-500 mb-2">Total Score</p>
              <div className="flex items-center justify-end">
                {agent.status === 'Rejected' && agent.reviewResults?.failedQuestions && (
                  <div className="mr-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
                {getStatusBadge(agent.status)}
              </div>
            </div>
          </div>
        </button>

        {isExpanded && (
          <div className="border-t px-6 py-4 bg-gray-50">
            {renderAssessmentSection(
              agent,
              'Desirability Assessment',
              <Star className="w-5 h-5 text-yellow-500" />,
              desirabilityQuestions,
              agent.desirabilityScores,
              'desirability'
            )}

            {renderAssessmentSection(
              agent,
              'Viability Assessment',
              <Zap className="w-5 h-5 text-blue-500" />,
              viabilityQuestions,
              agent.viabilityScores,
              'viability'
            )}

            {renderAssessmentSection(
              agent,
              'Feasibility Assessment',
              <Lightbulb className="w-5 h-5 text-green-500" />,
              feasibilityQuestions,
              agent.feasibilityScores,
              'feasibility'
            )}

            {agent.status === 'Pending' && (
              <div className="space-y-4 mt-6 border-t pt-6">
                <textarea
                  placeholder="Add review notes..."
                  value={reviewNotes[agent.id] || ''}
                  onChange={(e) => setReviewNotes(prev => ({ ...prev, [agent.id]: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleStatusUpdate(agent, 'Approved')}
                    disabled={!isAllQuestionsReviewed(agent.id)}
                    className={`flex-1 px-4 py-2 rounded-md ${
                      isAllQuestionsReviewed(agent.id)
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(agent, 'Rejected')}
                    disabled={!isAllQuestionsReviewed(agent.id)}
                    className={`flex-1 px-4 py-2 rounded-md ${
                      isAllQuestionsReviewed(agent.id)
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}

            {agent.status !== 'Pending' && agent.reviewNotes && (
              <div className="mt-6 border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Review Notes:</h4>
                <p className="text-gray-600">{agent.reviewNotes}</p>
                {agent.reviewDate && (
                  <p className="text-sm text-gray-500 mt-2">
                    Reviewed on: {new Date(agent.reviewDate).toLocaleDateString()}
                  </p>
                )}
                
                {agent.status === 'Rejected' && agent.reviewResults?.failedQuestions && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg">
                    <h5 className="font-medium text-red-800 mb-2">Failed Assessment Areas:</h5>
                    {agent.reviewResults.failedQuestions.map((category, idx) => (
                      <div key={idx} className="mb-2 last:mb-0">
                        <p className="font-medium text-red-700">{category.category}:</p>
                        <ul className="list-disc list-inside text-red-600">
                          {category.questions.map((q, i) => (
                            <li key={i} className="text-sm">{q}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Business Review</h2>
        <div className="flex gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as AIAgent['status'])}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'Pending' ? 'Ideas' : status === 'Rejected' ? 'Idea Backlog' : 'Approved Ideas'}
              </option>
            ))}
          </select>
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value as BusinessUnit | 'All')}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {businessUnits.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAgents.length > 0 ? (
          filteredAgents.map(renderAgentCard)
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            {selectedStatus === 'Pending' ? (
              <div className="space-y-2">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <p className="text-xl font-medium text-gray-900">
                  All requests have been processed successfully
                </p>
                <p className="text-gray-600">
                  There are no pending requests to review at this time
                </p>
              </div>
            ) : (
              <p className="text-gray-500">
                No {selectedStatus.toLowerCase()} requests found for the selected business unit
              </p>
            )}
          </div>
        )}
      </div>

      {rejectReasonModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Provide Rejection Reason</h3>
            <textarea
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-4"
              rows={3}
              placeholder="Enter the reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectReasonModalOpen(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={submitRejectionReason}
                disabled={!rejectionReason.trim()}
                className={`px-4 py-2 rounded-md ${
                  rejectionReason.trim()
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
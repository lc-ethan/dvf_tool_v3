import React from 'react';
import { X, Star, Zap, Lightbulb, AlertCircle } from 'lucide-react';
import type { AIAgent } from '../types';

interface AgentDetailsModalProps {
  agent: AIAgent;
  onClose: () => void;
}

export function AgentDetailsModal({ agent, onClose }: AgentDetailsModalProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const formatScore = (score: number | undefined): string => {
    if (typeof score !== 'number' || isNaN(score)) {
      return '0';
    }
    return score.toFixed(1);
  };

  const getStatusLabel = (status: AIAgent['status']) => {
    switch (status) {
      case 'Pending': return 'Idea';
      case 'Rejected': return 'Idea Backlog';
      case 'Approved': return 'Idea Approved';
    }
  };

  const renderDesirabilityDetails = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Desirability Assessment Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700">CX Enhancement</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-600">{agent.desirabilityScores.enhancerScore}/10</span>
            <span className="text-xs text-blue-600">Weight: 20%</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Productivity Impact</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-600">{agent.desirabilityScores.productivityScore}/10</span>
            <span className="text-xs text-blue-600">Weight: 20%</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Risk Mitigation</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-600">{agent.desirabilityScores.riskMitigationScore}/10</span>
            <span className="text-xs text-blue-600">Weight: 20%</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Market Size Impact</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-600">{agent.desirabilityScores.marketSizeScore}/10</span>
            <span className="text-xs text-blue-600">Weight: 20%</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700">AI Adoption</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-600">{agent.desirabilityScores.adoptionScore}/10</span>
            <span className="text-xs text-blue-600">Weight: 10%</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700">User Validation</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-600">{agent.desirabilityScores.validationScore}/10</span>
            <span className="text-xs text-blue-600">Weight: 10%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderViabilityDetails = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Viability Assessment Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Strategy Alignment</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-600">{agent.viabilityScores.strategyAlignmentScore}/5</span>
            <span className="text-xs text-blue-600">Weight: 10%</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Cash Benefit</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-600">{agent.viabilityScores.cashBenefitScore}/5</span>
            <span className="text-xs text-blue-600">Weight: 40%</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Maintenance Cost</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-600">{agent.viabilityScores.maintenanceCostScore}/5</span>
            <span className="text-xs text-blue-600">Weight: 20%</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Non-Financial Benefits</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-600">{agent.viabilityScores.nonFinancialScore}/5</span>
            <span className="text-xs text-blue-600">Weight: 10%</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Payback Period</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-600">{agent.viabilityScores.paybackScore}/5</span>
            <span className="text-xs text-blue-600">Weight: 10%</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Foundational Value</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-600">{agent.viabilityScores.foundationalScore}/5</span>
            <span className="text-xs text-blue-600">Weight: 10%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeasibilityDetails = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Feasibility Assessment Details</h4>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-gray-700">Feasibility Score</p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-gray-600">{agent.feasibilityScores.ootbScore}/8</span>
          <span className="text-xs text-blue-600">Scale: 2-8</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{agent.agentId}</h2>
            <p className="text-sm text-gray-500">Agent Name: {agent.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {agent.businessUnit}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              {agent.agentType}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {agent.customerJourney}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              agent.status === 'Approved' 
                ? 'bg-green-100 text-green-800'
                : agent.status === 'Rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {getStatusLabel(agent.status)}
            </span>
          </div>
          
          <p className="text-gray-600">{agent.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 font-semibold mb-1">Total Score</div>
              <div className="text-2xl font-bold text-purple-700">{formatScore(agent.totalScore)}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="text-yellow-600 font-semibold">Desirability</span>
              </div>
              <div className="text-2xl font-bold text-yellow-700">{formatScore(agent.desirability)}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-blue-600 font-semibold">Viability</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">{formatScore(agent.viability)}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-1">
                <Lightbulb className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-semibold">Feasibility</span>
              </div>
              <div className="text-2xl font-bold text-green-700">{formatScore(agent.feasibility)}</div>
            </div>
          </div>

          <div className="space-y-8 mt-8">
            {renderDesirabilityDetails()}
            {renderViabilityDetails()}
            {renderFeasibilityDetails()}
          </div>

          {agent.reviewNotes && (
            <div className="border-t pt-6 mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">Review Notes</h4>
              <p className="text-gray-600">{agent.reviewNotes}</p>
              {agent.reviewDate && (
                <p className="text-sm text-gray-500 mt-2">
                  Reviewed on: {new Date(agent.reviewDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
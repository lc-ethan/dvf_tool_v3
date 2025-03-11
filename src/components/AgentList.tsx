import React from 'react';
import { BarChart2, AlertCircle, RefreshCw, Edit, Trash2 } from 'lucide-react';
import type { AIAgent } from '../types';
import { AgentDetailsModal } from './AgentDetailsModal';

interface AgentListProps {
  agents: AIAgent[];
  onResubmit: (agent: AIAgent) => void;
  onEditDetails?: (agent: AIAgent) => void;
  onDelete?: (agent: AIAgent) => void;
}

export function AgentList({ agents, onResubmit, onEditDetails, onDelete }: AgentListProps) {
  const [selectedAgent, setSelectedAgent] = React.useState<AIAgent | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState<string | null>(null);

  const sortedAgents = [...agents].sort((a, b) => {
    const scoreA = typeof a.totalScore === 'number' ? a.totalScore : 0;
    const scoreB = typeof b.totalScore === 'number' ? b.totalScore : 0;
    return scoreB - scoreA;
  });

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

  const handleDelete = (agent: AIAgent) => {
    if (showDeleteConfirm === agent.id) {
      onDelete?.(agent);
      setShowDeleteConfirm(null);
    } else {
      setShowDeleteConfirm(agent.id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">AI Agents Prioritization</h2>
        <BarChart2 className="w-6 h-6 text-blue-600" />
      </div>

      <div className="space-y-4">
        {sortedAgents.map((agent) => (
          <div
            key={agent.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <button
                  onClick={() => setSelectedAgent(agent)}
                  className="text-lg font-semibold hover:text-blue-600 transition-colors text-left flex items-center gap-2"
                >
                  {agent.agentId}
                  {agent.status === 'Rejected' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </button>
                <p className="text-gray-600 text-sm mt-1">{agent.description}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-blue-600">
                  {formatScore(agent.totalScore)}
                </span>
                <p className="text-xs text-gray-500">Total Score</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              {[
                { label: 'Desirability', value: agent.desirability },
                { label: 'Viability', value: agent.viability },
                { label: 'Feasibility', value: agent.feasibility },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-sm font-medium text-gray-500">{label}</div>
                  <div className="mt-1 text-lg font-semibold">{formatScore(value)}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {agent.activatorName && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  {agent.activatorName}
                </span>
              )}
              {agent.customerJourney && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  {agent.customerJourney}
                </span>
              )}
              <span className={`px-2 py-1 text-sm rounded-full ${
                agent.status === 'Approved' 
                  ? 'bg-green-100 text-green-800'
                  : agent.status === 'Rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {getStatusLabel(agent.status)}
              </span>
            </div>

            {agent.status !== 'Approved' && (
              <div className="mt-4 flex gap-2">
                {onEditDetails && (
                  <button
                    onClick={() => onEditDetails(agent)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Details
                  </button>
                )}
                {agent.status === 'Rejected' && agent.reviewResults?.failedQuestions && (
                  <button
                    onClick={() => onResubmit(agent)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Resubmit Agent
                  </button>
                )}
                {agent.status === 'Pending' && onDelete && (
                  <button
                    onClick={() => handleDelete(agent)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors flex-1 ${
                      showDeleteConfirm === agent.id
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-red-100 hover:bg-red-200 text-red-700'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    {showDeleteConfirm === agent.id ? 'Confirm Delete' : 'Delete'}
                  </button>
                )}
              </div>
            )}

            {agent.status === 'Rejected' && agent.reviewResults?.failedQuestions && (
              <div className="mt-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-800 mb-2">
                    Failed Assessment Areas:
                  </p>
                  {agent.reviewResults.failedQuestions.map((category, idx) => (
                    <div key={idx} className="mb-2 last:mb-0">
                      <p className="text-sm font-medium text-red-700 capitalize">
                        {category.category}:
                      </p>
                      <ul className="list-disc list-inside text-sm text-red-600 ml-2">
                        {category.questions.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {agents.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No AI agents added yet. Add your first agent using the form.
          </p>
        )}
      </div>

      {selectedAgent && (
        <AgentDetailsModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}
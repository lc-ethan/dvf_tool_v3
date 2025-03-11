import React from 'react';
import { BarChart2, Building2, Star, Zap, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import type { AIAgent, BusinessUnit } from '../types';
import { AgentDetailsModal } from './AgentDetailsModal';

interface ReportViewProps {
  agents: AIAgent[];
}

export function ReportView({ agents }: ReportViewProps) {
  const [selectedUnit, setSelectedUnit] = React.useState<BusinessUnit | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = React.useState<'All' | AIAgent['status']>('Approved');
  const [selectedAgent, setSelectedAgent] = React.useState<AIAgent | null>(null);
  
  const businessUnits: (BusinessUnit | 'All')[] = ['All', 'Enterprise', 'T1', 'Shared Services', 'Networks & IT'];
  const statusOptions: ('All' | AIAgent['status'])[] = ['All', 'Pending', 'Approved', 'Rejected'];

  const getStatusLabel = (status: AIAgent['status']) => {
    switch (status) {
      case 'Pending': return 'Idea';
      case 'Rejected': return 'Idea Backlog';
      case 'Approved': return 'Idea Approved';
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesUnit = selectedUnit === 'All' || agent.businessUnit === selectedUnit;
    const matchesStatus = selectedStatus === 'All' || agent.status === selectedStatus;
    return matchesUnit && matchesStatus;
  });

  const formatScore = (score: number | undefined): string => {
    if (typeof score !== 'number' || isNaN(score)) {
      return '0';
    }
    return score.toFixed(1);
  };

  const sortAgents = (agents: AIAgent[], key: keyof AIAgent) => {
    return [...agents].sort((a, b) => {
      const scoreA = typeof a[key] === 'number' ? (a[key] as number) : 0;
      const scoreB = typeof b[key] === 'number' ? (b[key] as number) : 0;
      return scoreB - scoreA;
    });
  };

  const sortedByTotal = sortAgents(filteredAgents, 'totalScore');
  const sortedByD = sortAgents(filteredAgents, 'desirability');
  const sortedByV = sortAgents(filteredAgents, 'viability');
  const sortedByF = sortAgents(filteredAgents, 'feasibility');

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'Desirability': return <Star className="w-5 h-5 text-yellow-500" />;
      case 'Viability': return <Zap className="w-5 h-5 text-blue-500" />;
      case 'Feasibility': return <Lightbulb className="w-5 h-5 text-green-500" />;
      default: return <BarChart2 className="w-5 h-5 text-purple-500" />;
    }
  };

  const RankingSection = ({ 
    title, 
    icon, 
    agents, 
    scoreKey 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    agents: AIAgent[]; 
    scoreKey: keyof AIAgent;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className="space-y-3">
        {agents.map((agent, index) => (
          <div key={agent.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl font-bold text-gray-400 w-8">{index + 1}</span>
            <div className="flex-1">
              <button
                onClick={() => setSelectedAgent(agent)}
                className="font-medium text-left hover:text-blue-600 transition-colors"
              >
                {agent.agentId}
              </button>
              <div className="flex gap-2 items-center">
                <p className="text-sm text-gray-600">{agent.businessUnit}</p>
                <span className={`text-sm px-2 py-0.5 rounded-full ${
                  agent.status === 'Approved' 
                    ? 'bg-green-100 text-green-800'
                    : agent.status === 'Rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {getStatusLabel(agent.status)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-semibold text-blue-600">
                {formatScore(agent[scoreKey] as number)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">DVF Ranking</h2>
        </div>
        <div className="flex gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as 'All' | AIAgent['status'])}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'All' ? 'All Status' : getStatusLabel(status as AIAgent['status'])}
              </option>
            ))}
          </select>
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value as BusinessUnit | 'All')}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
          >
            {businessUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredAgents.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No agents found for the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RankingSection
            title="Overall Score"
            icon={<BarChart2 className="w-5 h-5 text-purple-500" />}
            agents={sortedByTotal}
            scoreKey="totalScore"
          />
          <RankingSection
            title="Desirability"
            icon={<Star className="w-5 h-5 text-yellow-500" />}
            agents={sortedByD}
            scoreKey="desirability"
          />
          <RankingSection
            title="Viability"
            icon={<Zap className="w-5 h-5 text-blue-500" />}
            agents={sortedByV}
            scoreKey="viability"
          />
          <RankingSection
            title="Feasibility"
            icon={<Lightbulb className="w-5 h-5 text-green-500" />}
            agents={sortedByF}
            scoreKey="feasibility"
          />
        </div>
      )}

      {selectedAgent && (
        <AgentDetailsModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}
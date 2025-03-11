import React from 'react';
import { BarChart2, Building2, Star, Zap, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import type { AIAgent, ActivatorName } from '../types';
import { AgentDetailsModal } from './AgentDetailsModal';

interface ReportViewProps {
  agents: AIAgent[];
}

export function ReportView({ agents }: ReportViewProps) {
  const [selectedStatus, setSelectedStatus] = React.useState<'All' | AIAgent['status']>('Approved');
  const [selectedAgent, setSelectedAgent] = React.useState<AIAgent | null>(null);
  const [expandedActivators, setExpandedActivators] = React.useState<Set<ActivatorName>>(new Set());
  
  const activatorNames: ActivatorName[] = ['T1', 'Consumer & Business', 'E&C', 'Networks & IT', 'Shared Services', 'Enterprise'];
  const statusOptions: ('All' | AIAgent['status'])[] = ['All', 'Pending', 'Approved', 'Rejected'];

  const getStatusLabel = (status: AIAgent['status']) => {
    switch (status) {
      case 'Pending': return 'Idea';
      case 'Rejected': return 'Idea Backlog';
      case 'Approved': return 'Idea Approved';
    }
  };

  const filteredAgents = agents.filter(agent => 
    selectedStatus === 'All' || agent.status === selectedStatus
  );

  const formatScore = (score: number | undefined): string => {
    if (typeof score !== 'number' || isNaN(score)) {
      return '0';
    }
    return score.toFixed(1);
  };

  // Group agents by activator and sort by total score (highest to lowest)
  const agentsByActivator = activatorNames.reduce<Record<ActivatorName, AIAgent[]>>((acc, activator) => {
    acc[activator] = filteredAgents.filter(agent => agent.activatorName === activator)
      .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
    return acc;
  }, {} as Record<ActivatorName, AIAgent[]>);

  const toggleActivator = (activator: ActivatorName) => {
    setExpandedActivators(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activator)) {
        newSet.delete(activator);
      } else {
        newSet.add(activator);
      }
      return newSet;
    });
  };

  const getActivatorMetrics = (agents: AIAgent[]) => {
    if (agents.length === 0) return { total: 0, desirability: 0, viability: 0, feasibility: 0 };
    
    return {
      total: agents.reduce((sum, agent) => sum + (agent.totalScore || 0), 0) / agents.length,
      desirability: agents.reduce((sum, agent) => sum + (agent.desirability || 0), 0) / agents.length,
      viability: agents.reduce((sum, agent) => sum + (agent.viability || 0), 0) / agents.length,
      feasibility: agents.reduce((sum, agent) => sum + (agent.feasibility || 0), 0) / agents.length
    };
  };

  const renderActivator = (activator: ActivatorName) => {
    const activatorAgents = agentsByActivator[activator];
    const isExpanded = expandedActivators.has(activator);
    const metrics = getActivatorMetrics(activatorAgents);

    if (activatorAgents.length === 0) return null;

    return (
      <div key={activator} className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => toggleActivator(activator)}
          className="w-full p-6 text-left bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  {activator}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </h3>
                <p className="text-sm text-gray-600">{activatorAgents.length} agents</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {formatScore(metrics.total)}
              </div>
              <p className="text-sm text-gray-500">Average Score</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Desirability</p>
                <p className="font-semibold">{formatScore(metrics.desirability)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Viability</p>
                <p className="font-semibold">{formatScore(metrics.viability)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Feasibility</p>
                <p className="font-semibold">{formatScore(metrics.feasibility)}</p>
              </div>
            </div>
          </div>
        </button>

        {isExpanded && (
          <div className="border-t">
            <div className="divide-y">
              {activatorAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <button
                        onClick={() => setSelectedAgent(agent)}
                        className="font-medium text-left hover:text-blue-600 transition-colors"
                      >
                        {agent.agentId}
                      </button>
                      <p className="text-sm text-gray-600 mt-1">{agent.description}</p>
                      <div className="flex gap-2 items-center mt-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          {agent.businessUnit}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          {agent.customerJourney}
                        </span>
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
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold text-blue-600">
                        {formatScore(agent.totalScore)}
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                        <div className="text-yellow-600">{formatScore(agent.desirability)}</div>
                        <div className="text-blue-600">{formatScore(agent.viability)}</div>
                        <div className="text-green-600">{formatScore(agent.feasibility)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Activator Overview</h2>
        </div>
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
      </div>

      {filteredAgents.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No agents found for the selected filters.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activatorNames.map(activator => renderActivator(activator))}
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
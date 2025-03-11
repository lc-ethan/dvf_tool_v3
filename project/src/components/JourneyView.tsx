import React from 'react';
import { Map, Users } from 'lucide-react';
import type { AIAgent, CustomerJourney, AgentType } from '../types';
import { AgentDetailsModal } from './AgentDetailsModal';

interface JourneyViewProps {
  agents: AIAgent[];
}

interface JourneyMap {
  [key: string]: {
    [key: string]: AIAgent[];
  };
}

export function JourneyView({ agents }: JourneyViewProps) {
  const [selectedAgent, setSelectedAgent] = React.useState<AIAgent | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<'All' | AIAgent['status']>('Approved');
  
  const filteredAgents = agents.filter(agent => 
    selectedStatus === 'All' || agent.status === selectedStatus
  );
  
  const statusOptions: ('All' | AIAgent['status'])[] = ['All', 'Pending', 'Approved', 'Rejected'];

  const getStatusLabel = (status: AIAgent['status']) => {
    switch (status) {
      case 'Pending': return 'Idea';
      case 'Rejected': return 'Idea Backlog';
      case 'Approved': return 'Idea Approved';
    }
  };
  
  // Organize agents by journey and type using a plain object
  const journeyMap = filteredAgents.reduce<JourneyMap>((acc, agent) => {
    // Initialize journey if it doesn't exist
    if (!acc[agent.customerJourney]) {
      acc[agent.customerJourney] = {};
    }
    
    // Initialize agent type if it doesn't exist
    if (!acc[agent.customerJourney][agent.agentType]) {
      acc[agent.customerJourney][agent.agentType] = [];
    }
    
    // Add agent to the appropriate group
    acc[agent.customerJourney][agent.agentType].push(agent);
    
    return acc;
  }, {});

  // Sort agents by total score within each type
  Object.values(journeyMap).forEach(typeMap => {
    Object.values(typeMap).forEach(agents => {
      agents.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
    });
  });

  // Get sorted journeys for consistent ordering
  const journeys: CustomerJourney[] = [
    'Discover',
    'Buy',
    'Onboard',
    'Use',
    'Help',
    'Change',
    'Maintain'
  ];

  // Get sorted agent types for consistent ordering
  const agentTypes: AgentType[] = [
    'Billing',
    'Inventory Checker',
    'Sales Coach'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Journey Based View</h2>
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

      {journeys.map(journey => (
        journeyMap[journey] && Object.keys(journeyMap[journey]).length > 0 ? (
          <div key={journey} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center gap-2">
              <Users className="w-5 h-5" />
              {journey}
            </h3>

            <div className="space-y-6">
              {agentTypes.map(type => (
                journeyMap[journey][type]?.length > 0 && (
                  <div key={type} className="border-t pt-4 first:border-t-0 first:pt-0">
                    <h4 className="text-lg font-medium text-gray-700 mb-3">{type}</h4>
                    <div className="space-y-2">
                      {journeyMap[journey][type].map((agent) => (
                        <div
                          key={agent.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
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
                            <span className="text-lg font-semibold text-blue-600">
                              {agent.totalScore?.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null
      ))}

      {filteredAgents.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No agents found for the selected status.</p>
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
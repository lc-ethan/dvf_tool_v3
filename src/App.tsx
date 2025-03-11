import React from 'react';
import { AgentForm } from './components/AgentForm';
import { AgentList } from './components/AgentList';
import { CommercialReview } from './components/CommercialReview';
import { ReportView } from './components/ReportView';
import { calculateDVFScore } from './utils/calculateScore';
import { AuthProvider, useAuth } from './components/Auth';
import { LoginForm } from './components/LoginForm';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import type { AIAgent, FormData } from './types';

function AppContent() {
  const { user, loading, signOut } = useAuth();
  const [agents, setAgents] = React.useState<AIAgent[]>([]);
  const [view, setView] = React.useState<'submit' | 'review' | 'activator'>('submit');
  const [resubmitAgent, setResubmitAgent] = React.useState<AIAgent | null>(null);
  const [editAgent, setEditAgent] = React.useState<AIAgent | null>(null);
  const [nameError, setNameError] = React.useState<string | null>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = React.useState(false);
  const formRef = React.useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const scrollToTop = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddAgent = (formData: FormData) => {
    // Check if name already exists (case insensitive)
    const nameExists = agents.some(
      agent => agent.name.toLowerCase() === formData.name.toLowerCase() && 
      (!resubmitAgent || agent.id !== resubmitAgent.id) &&
      (!editAgent || agent.id !== editAgent.id)
    );

    if (nameExists) {
      setNameError('An agent with this name already exists. Please choose a different name.');
      return;
    }

    setNameError(null);
    const totalScore = calculateDVFScore(
      formData.desirabilityScores,
      formData.viabilityScores,
      formData.feasibilityScores
    );

    if (editAgent) {
      // Update existing agent
      setAgents(prev => prev.map(agent => 
        agent.id === editAgent.id 
          ? { ...agent, ...formData, totalScore }
          : agent
      ));
      setEditAgent(null);
    } else if (resubmitAgent) {
      // Handle resubmission
      const newAgent: AIAgent = {
        ...formData,
        id: resubmitAgent.id,
        totalScore,
        status: 'Pending',
        reviewNotes: undefined,
        reviewDate: undefined,
        reviewResults: undefined
      };
      setAgents(prev => prev.map(a => (a.id === resubmitAgent.id ? newAgent : a)));
      setResubmitAgent(null);
    } else {
      // Add new agent
      const newAgent: AIAgent = {
        ...formData,
        id: crypto.randomUUID(),
        totalScore,
        status: 'Pending',
      };
      setAgents(prev => [...prev, newAgent]);
    }
  };

  const handleUpdateStatus = (id: string, status: AIAgent['status'], notes: string, failedQuestions?: { category: string; questions: string[] }[]) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id
          ? {
              ...agent,
              status,
              reviewNotes: notes,
              reviewDate: new Date().toISOString(),
              reviewResults: status === 'Rejected' ? {
                agentId: id,
                status,
                date: new Date().toISOString(),
                notes,
                failedQuestions
              } : undefined
            }
          : agent
      )
    );
  };

  const handleResubmit = (agent: AIAgent) => {
    setResubmitAgent(agent);
    setEditAgent(null);
    setView('submit');
    scrollToTop();
  };

  const handleEditDetails = (agent: AIAgent) => {
    setEditAgent(agent);
    setResubmitAgent(null);
    setView('submit');
    scrollToTop();
  };

  const handleDeleteAgent = (agent: AIAgent) => {
    setAgents(prev => prev.filter(a => a.id !== agent.id));
    // Reset edit state if the deleted agent was being edited
    if (editAgent?.id === agent.id) {
      setEditAgent(null);
    }
    if (resubmitAgent?.id === agent.id) {
      setResubmitAgent(null);
    }
  };

  // Only show review and activator views for admin and decision_maker roles
  const canReview = user.role === 'admin' || user.role === 'decision_maker';

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              AI Agent DVF Prioritization
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Signed in as {user.email} ({user.role})
              </span>
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Change Password
              </button>
              <button
                onClick={() => signOut()}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Sign Out
              </button>
            </div>
          </div>
          <p className="mt-2 text-gray-600">
            Evaluate and prioritize AI agents based on Desirability, Viability, and Feasibility scores
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {
                setView('submit');
                if (view !== 'submit') {
                  setResubmitAgent(null);
                  setEditAgent(null);
                }
              }}
              className={`px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-md ${
                view === 'submit'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Submit Agent
            </button>
            {canReview && (
              <>
                <button
                  onClick={() => {
                    setView('review');
                    setResubmitAgent(null);
                    setEditAgent(null);
                  }}
                  className={`px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-md ${
                    view === 'review'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Business Review
                </button>
                <button
                  onClick={() => {
                    setView('activator');
                    setResubmitAgent(null);
                    setEditAgent(null);
                  }}
                  className={`px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-md ${
                    view === 'activator'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Activator Based View
                </button>
              </>
            )}
          </div>
        </header>

        {view === 'submit' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" ref={formRef}>
            <AgentForm 
              onSubmit={handleAddAgent}
              initialData={editAgent || resubmitAgent || undefined}
              isEditing={!!editAgent || !!resubmitAgent}
              nameError={nameError}
              onNameChange={() => setNameError(null)}
              onStepChange={scrollToTop}
              existingAgents={agents}
            />
            <AgentList 
              agents={agents}
              onResubmit={handleResubmit}
              onEditDetails={handleEditDetails}
              onDelete={handleDeleteAgent}
            />
          </div>
        ) : view === 'review' && canReview ? (
          <CommercialReview
            agents={agents}
            onUpdateStatus={handleUpdateStatus}
          />
        ) : canReview ? (
          <ReportView agents={agents} />
        ) : null}
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
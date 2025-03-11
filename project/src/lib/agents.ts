import { supabase } from './supabase';
import type { AIAgent, FormData } from '../types';

export async function getAgents(): Promise<AIAgent[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(agent => ({
    ...agent,
    id: agent.id,
    agentId: agent.agent_id,
    totalScore: agent.total_score,
    reviewNotes: agent.review_notes,
    reviewDate: agent.review_date,
    reviewResults: agent.review_results,
    desirabilityScores: agent.desirability_scores,
    viabilityScores: agent.viability_scores,
    feasibilityScores: agent.feasibility_scores
  }));
}

export async function createAgent(formData: FormData, userId: string, totalScore: number): Promise<AIAgent> {
  const { data, error } = await supabase
    .from('agents')
    .insert([{
      user_id: userId,
      agent_id: formData.agentId,
      name: formData.name,
      owner: formData.owner,
      description: formData.description,
      business_unit: formData.businessUnit,
      agent_type: formData.agentType,
      customer_journey: formData.customerJourney,
      desirability: formData.desirability,
      viability: formData.viability,
      feasibility: formData.feasibility,
      total_score: totalScore,
      status: 'Pending',
      desirability_scores: formData.desirabilityScores,
      viability_scores: formData.viabilityScores,
      feasibility_scores: formData.feasibilityScores
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    id: data.id,
    agentId: data.agent_id,
    totalScore: data.total_score,
    reviewNotes: data.review_notes,
    reviewDate: data.review_date,
    reviewResults: data.review_results,
    desirabilityScores: data.desirability_scores,
    viabilityScores: data.viability_scores,
    feasibilityScores: data.feasibility_scores
  };
}

export async function updateAgentStatus(
  id: string,
  status: AIAgent['status'],
  notes: string,
  failedQuestions?: { category: string; questions: string[] }[]
): Promise<void> {
  const { error } = await supabase
    .from('agents')
    .update({
      status,
      review_notes: notes,
      review_date: new Date().toISOString(),
      review_results: status === 'Rejected' ? {
        agentId: id,
        status,
        date: new Date().toISOString(),
        notes,
        failedQuestions
      } : null
    })
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export async function updateAgent(agent: AIAgent): Promise<void> {
  const { error } = await supabase
    .from('agents')
    .update({
      agent_id: agent.agentId,
      name: agent.name,
      owner: agent.owner,
      description: agent.description,
      business_unit: agent.businessUnit,
      agent_type: agent.agentType,
      customer_journey: agent.customerJourney,
      desirability: agent.desirability,
      viability: agent.viability,
      feasibility: agent.feasibility,
      total_score: agent.totalScore,
      status: agent.status,
      desirability_scores: agent.desirabilityScores,
      viability_scores: agent.viabilityScores,
      feasibility_scores: agent.feasibilityScores,
      review_notes: agent.reviewNotes,
      review_date: agent.reviewDate,
      review_results: agent.reviewResults
    })
    .eq('id', agent.id);

  if (error) {
    throw error;
  }
} 
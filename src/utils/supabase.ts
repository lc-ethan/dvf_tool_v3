import { createClient } from '@supabase/supabase-js';
import type { AIAgent } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Role = 'admin' | 'requestor' | 'decision_maker';

export interface Profile {
  id: string;
  email: string;
  role: Role;
}

export async function getCurrentUser(): Promise<Profile | null> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      roles (
        name
      )
    `)
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  return {
    id: profile.id,
    email: profile.email,
    role: profile.roles.name as Role
  };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function changePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    throw error;
  }
}

export async function createAgent(agent: Omit<AIAgent, 'id'>): Promise<AIAgent> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Convert camelCase to snake_case for database
  const dbAgent = {
    agent_id: agent.agentId,
    name: agent.name,
    job_title: agent.jobTitle,
    owner: agent.owner,
    owner_email: agent.ownerEmail,
    description: agent.description,
    bu_benefitting: agent.buBenefitting,
    activator_name: agent.activatorName,
    platform: agent.platform,
    agent_type: agent.agentType,
    agent_classification: agent.agentClassification,
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
    review_results: agent.reviewResults,
    user_id: user.id
  };

  const { data, error } = await supabase
    .from('agents')
    .insert([dbAgent])
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Convert snake_case back to camelCase for frontend
  return {
    id: data.id,
    agentId: data.agent_id,
    name: data.name,
    jobTitle: data.job_title,
    owner: data.owner,
    ownerEmail: data.owner_email,
    description: data.description,
    buBenefitting: data.bu_benefitting,
    activatorName: data.activator_name,
    platform: data.platform,
    agentType: data.agent_type,
    agentClassification: data.agent_classification,
    customerJourney: data.customer_journey,
    desirability: data.desirability,
    viability: data.viability,
    feasibility: data.feasibility,
    totalScore: data.total_score,
    status: data.status,
    desirabilityScores: data.desirability_scores,
    viabilityScores: data.viability_scores,
    feasibilityScores: data.feasibility_scores,
    reviewNotes: data.review_notes,
    reviewDate: data.review_date,
    reviewResults: data.review_results
  };
}

export async function updateAgent(agent: AIAgent): Promise<AIAgent> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Convert camelCase to snake_case for database
  const dbAgent = {
    agent_id: agent.agentId,
    name: agent.name,
    job_title: agent.jobTitle,
    owner: agent.owner,
    owner_email: agent.ownerEmail,
    description: agent.description,
    bu_benefitting: agent.buBenefitting,
    activator_name: agent.activatorName,
    platform: agent.platform,
    agent_type: agent.agentType,
    agent_classification: agent.agentClassification,
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
    review_results: agent.reviewResults,
    updated_at: new Date().toISOString()
  };

  // Use a Supabase transaction to ensure both operations succeed or fail together
  const { data: updatedAgent, error: updateError } = await supabase.rpc('update_agent_with_review', {
    p_agent_id: agent.id,
    p_agent_data: dbAgent,
    p_review_data: agent.status === 'Approved' || agent.status === 'Rejected' ? {
      agent_id: agent.id,
      reviewer_id: user.id,
      status: agent.status,
      notes: agent.reviewNotes,
      failed_questions: agent.status === 'Rejected' ? agent.reviewResults?.failedQuestions : null
    } : null
  });

  if (updateError) {
    throw updateError;
  }

  // Convert snake_case back to camelCase for frontend
  return {
    id: updatedAgent.id,
    agentId: updatedAgent.agent_id,
    name: updatedAgent.name,
    jobTitle: updatedAgent.job_title,
    owner: updatedAgent.owner,
    ownerEmail: updatedAgent.owner_email,
    description: updatedAgent.description,
    buBenefitting: updatedAgent.bu_benefitting,
    activatorName: updatedAgent.activator_name,
    platform: updatedAgent.platform,
    agentType: updatedAgent.agent_type,
    agentClassification: updatedAgent.agent_classification,
    customerJourney: updatedAgent.customer_journey,
    desirability: updatedAgent.desirability,
    viability: updatedAgent.viability,
    feasibility: updatedAgent.feasibility,
    totalScore: updatedAgent.total_score,
    status: updatedAgent.status,
    desirabilityScores: updatedAgent.desirability_scores,
    viabilityScores: updatedAgent.viability_scores,
    feasibilityScores: updatedAgent.feasibility_scores,
    reviewNotes: updatedAgent.review_notes,
    reviewDate: updatedAgent.review_date,
    reviewResults: updatedAgent.review_results
  };
}

export async function fetchAgents(): Promise<AIAgent[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Convert snake_case to camelCase for frontend
  return (data || []).map(agent => ({
    id: agent.id,
    agentId: agent.agent_id,
    name: agent.name,
    jobTitle: agent.job_title,
    owner: agent.owner,
    ownerEmail: agent.owner_email,
    description: agent.description,
    buBenefitting: agent.bu_benefitting,
    activatorName: agent.activator_name,
    platform: agent.platform,
    agentType: agent.agent_type,
    agentClassification: agent.agent_classification,
    customerJourney: agent.customer_journey,
    desirability: agent.desirability,
    viability: agent.viability,
    feasibility: agent.feasibility,
    totalScore: agent.total_score,
    status: agent.status,
    desirabilityScores: agent.desirability_scores,
    viabilityScores: agent.viability_scores,
    feasibilityScores: agent.feasibility_scores,
    reviewNotes: agent.review_notes,
    reviewDate: agent.review_date,
    reviewResults: agent.review_results
  }));
}

export async function deleteAgent(id: string): Promise<void> {
  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export async function fetchBusinessReviews(agentId: string) {
  const { data, error } = await supabase
    .from('business_reviews')
    .select(`
      *,
      reviewer:reviewer_id (
        email
      )
    `)
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
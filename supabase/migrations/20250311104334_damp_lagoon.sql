/*
  # Add database function for atomic agent updates with reviews

  1. New Functions
    - `update_agent_with_review`: Updates an agent and optionally creates a business review in a single transaction

  2. Purpose
    - Ensures that agent updates and business review creation happen atomically
    - Prevents partial updates where the agent is updated but the review fails to create
*/

CREATE OR REPLACE FUNCTION update_agent_with_review(
  p_agent_id uuid,
  p_agent_data jsonb,
  p_review_data jsonb DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_updated_agent jsonb;
BEGIN
  -- Update the agent
  UPDATE agents
  SET
    agent_id = p_agent_data->>'agent_id',
    name = p_agent_data->>'name',
    job_title = p_agent_data->>'job_title',
    owner = p_agent_data->>'owner',
    owner_email = p_agent_data->>'owner_email',
    description = p_agent_data->>'description',
    bu_benefitting = p_agent_data->>'bu_benefitting',
    activator_name = p_agent_data->>'activator_name',
    platform = p_agent_data->>'platform',
    agent_type = p_agent_data->>'agent_type',
    agent_classification = p_agent_data->>'agent_classification',
    customer_journey = p_agent_data->>'customer_journey',
    desirability = (p_agent_data->>'desirability')::numeric,
    viability = (p_agent_data->>'viability')::numeric,
    feasibility = (p_agent_data->>'feasibility')::numeric,
    total_score = (p_agent_data->>'total_score')::numeric,
    status = p_agent_data->>'status',
    desirability_scores = p_agent_data->'desirability_scores',
    viability_scores = p_agent_data->'viability_scores',
    feasibility_scores = p_agent_data->'feasibility_scores',
    review_notes = p_agent_data->>'review_notes',
    review_date = (p_agent_data->>'review_date')::timestamptz,
    review_results = p_agent_data->'review_results',
    updated_at = now()
  WHERE id = p_agent_id
  RETURNING jsonb_build_object(
    'id', id,
    'agent_id', agent_id,
    'name', name,
    'job_title', job_title,
    'owner', owner,
    'owner_email', owner_email,
    'description', description,
    'bu_benefitting', bu_benefitting,
    'activator_name', activator_name,
    'platform', platform,
    'agent_type', agent_type,
    'agent_classification', agent_classification,
    'customer_journey', customer_journey,
    'desirability', desirability,
    'viability', viability,
    'feasibility', feasibility,
    'total_score', total_score,
    'status', status,
    'desirability_scores', desirability_scores,
    'viability_scores', viability_scores,
    'feasibility_scores', feasibility_scores,
    'review_notes', review_notes,
    'review_date', review_date,
    'review_results', review_results,
    'updated_at', updated_at
  ) INTO v_updated_agent;

  -- If review data is provided, create a business review
  IF p_review_data IS NOT NULL THEN
    INSERT INTO business_reviews (
      agent_id,
      reviewer_id,
      status,
      notes,
      failed_questions
    ) VALUES (
      p_agent_id,
      (p_review_data->>'reviewer_id')::uuid,
      p_review_data->>'status',
      p_review_data->>'notes',
      p_review_data->'failed_questions'
    );
  END IF;

  RETURN v_updated_agent;
END;
$$;
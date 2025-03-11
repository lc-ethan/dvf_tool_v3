/*
  # Create agents table for DVF Tool

  1. New Tables
    - `agents`
      - `id` (uuid, primary key)
      - `agent_id` (text, unique identifier for the agent)
      - `name` (text, agent name)
      - `job_title` (text)
      - `owner` (text)
      - `owner_email` (text)
      - `description` (text)
      - `bu_benefitting` (text)
      - `activator_name` (text)
      - `platform` (text)
      - `agent_type` (text)
      - `agent_classification` (text)
      - `customer_journey` (text)
      - `desirability` (numeric)
      - `viability` (numeric)
      - `feasibility` (numeric)
      - `total_score` (numeric)
      - `status` (text)
      - `desirability_scores` (jsonb)
      - `viability_scores` (jsonb)
      - `feasibility_scores` (jsonb)
      - `review_notes` (text)
      - `review_date` (timestamptz)
      - `review_results` (jsonb)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `agents` table
    - Add policies for:
      - Authenticated users can insert their own agents
      - Users can view all agents
      - Users can update their own agents
      - Admin and decision_maker roles can update any agent
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS agents;

-- Create the agents table
CREATE TABLE agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id text NOT NULL,
  name text NOT NULL,
  job_title text NOT NULL,
  owner text NOT NULL,
  owner_email text NOT NULL,
  description text NOT NULL,
  bu_benefitting text NOT NULL,
  activator_name text NOT NULL,
  platform text NOT NULL,
  agent_type text NOT NULL,
  agent_classification text NOT NULL,
  customer_journey text NOT NULL,
  desirability numeric NOT NULL,
  viability numeric NOT NULL,
  feasibility numeric NOT NULL,
  total_score numeric NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  desirability_scores jsonb NOT NULL,
  viability_scores jsonb NOT NULL,
  feasibility_scores jsonb NOT NULL,
  review_notes text,
  review_date timestamptz,
  review_results jsonb,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT agents_agent_id_key UNIQUE (agent_id)
);

-- Enable Row Level Security
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own agents" ON agents;
DROP POLICY IF EXISTS "Users can view all agents" ON agents;
DROP POLICY IF EXISTS "Users can update their own agents" ON agents;

-- Create policies
CREATE POLICY "Users can insert their own agents"
  ON agents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all agents"
  ON agents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own agents"
  ON agents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name IN ('admin', 'decision_maker')
  ));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
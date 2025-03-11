/*
  # Create AI Agents table

  1. New Tables
    - `agents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `agent_id` (text)
      - `name` (text)
      - `owner` (text)
      - `description` (text)
      - `business_unit` (text)
      - `agent_type` (text)
      - `customer_journey` (text)
      - `desirability` (numeric)
      - `viability` (numeric)
      - `feasibility` (numeric)
      - `total_score` (numeric)
      - `status` (text)
      - `review_notes` (text)
      - `review_date` (timestamptz)
      - `desirability_scores` (jsonb)
      - `viability_scores` (jsonb)
      - `feasibility_scores` (jsonb)
      - `review_results` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `agents` table
    - Add policies for:
      - Users can read all agents
      - Users can insert their own agents
      - Users can update their own agents
      - Admins and decision makers can update any agent
*/

CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id text NOT NULL,
  name text NOT NULL,
  owner text NOT NULL,
  description text NOT NULL,
  business_unit text NOT NULL,
  agent_type text NOT NULL,
  customer_journey text NOT NULL,
  desirability numeric NOT NULL,
  viability numeric NOT NULL,
  feasibility numeric NOT NULL,
  total_score numeric NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  review_notes text,
  review_date timestamptz,
  desirability_scores jsonb NOT NULL,
  viability_scores jsonb NOT NULL,
  feasibility_scores jsonb NOT NULL,
  review_results jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Everyone can read all agents
CREATE POLICY "Users can read all agents"
  ON agents
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert their own agents
CREATE POLICY "Users can insert their own agents"
  ON agents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own agents
CREATE POLICY "Users can update their own agents"
  ON agents
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name IN ('admin', 'decision_maker')
    )
  );
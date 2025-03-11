/*
  # Add business reviews table

  1. New Tables
    - `business_reviews`
      - `id` (uuid, primary key)
      - `agent_id` (uuid, references agents)
      - `reviewer_id` (uuid, references auth.users)
      - `status` (text)
      - `notes` (text)
      - `review_date` (timestamptz)
      - `failed_questions` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `business_reviews` table
    - Add policies for:
      - Admin and decision_maker roles can insert reviews
      - Authenticated users can view all reviews
*/

CREATE TABLE business_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL,
  notes text,
  review_date timestamptz NOT NULL DEFAULT now(),
  failed_questions jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE business_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin and decision makers can insert reviews"
  ON business_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name IN ('admin', 'decision_maker')
    )
  );

CREATE POLICY "Users can view all reviews"
  ON business_reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_business_reviews_updated_at
  BEFORE UPDATE ON business_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
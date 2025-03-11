/*
  # Add agent deletion policy

  1. Security
    - Enable RLS on agents table (if not already enabled)
    - Add policy for users to delete their own agents
    - Add policy for admin and decision makers to delete any agent
*/

-- Enable RLS if not already enabled
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Create policy for users to delete their own agents
CREATE POLICY "Users can delete their own agents"
  ON agents
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1
      FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() 
      AND r.name IN ('admin', 'decision_maker')
    )
  );
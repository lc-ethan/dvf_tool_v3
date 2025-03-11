/*
  # Add delete function and policies for agent deletion

  1. Changes
    - Create a function to handle agent deletion with proper type casting
    - Add delete policies for agents and business_reviews tables
    - Ensure proper UUID handling throughout

  2. Security
    - Maintain role-based access control
    - Ensure data integrity during deletion
    - Proper type handling for UUIDs
*/

-- Create function to handle agent deletion
CREATE OR REPLACE FUNCTION delete_agent_with_reviews(agent_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete associated business reviews first
  DELETE FROM business_reviews
  WHERE agent_id = $1;

  -- Delete the agent
  DELETE FROM agents
  WHERE id = $1
  AND (
    -- User can delete their own pending agents
    (user_id = auth.uid()::uuid AND status = 'Pending')
    OR
    -- Admins and decision makers can delete any agent
    EXISTS (
      SELECT 1 
      FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid()::uuid
      AND r.name IN ('admin', 'decision_maker')
    )
  );
END;
$$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can delete their own pending agents" ON agents;
  DROP POLICY IF EXISTS "Cascade delete for business reviews" ON business_reviews;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add delete policy for agents table
CREATE POLICY "Users can delete their own pending agents" 
ON agents 
FOR DELETE 
TO authenticated 
USING (
  (
    -- User can delete their own pending agents
    user_id = auth.uid()::uuid
    AND status = 'Pending'
  ) OR 
  -- Admins and decision makers can delete any agent
  EXISTS (
    SELECT 1 
    FROM profiles p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid()::uuid
    AND r.name IN ('admin', 'decision_maker')
  )
);

-- Add delete policy for business_reviews table
CREATE POLICY "Cascade delete for business reviews"
ON business_reviews
FOR DELETE 
TO authenticated 
USING (
  -- Allow deletion if the user has permission to delete the associated agent
  EXISTS (
    SELECT 1 
    FROM agents a
    WHERE a.id = agent_id
    AND (
      (a.user_id = auth.uid()::uuid AND a.status = 'Pending') OR
      EXISTS (
        SELECT 1 
        FROM profiles p
        JOIN roles r ON p.role_id = r.id
        WHERE p.id = auth.uid()::uuid
        AND r.name IN ('admin', 'decision_maker')
      )
    )
  )
);
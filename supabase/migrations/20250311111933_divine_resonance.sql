/*
  # Add delete policies for agents and business reviews

  1. Changes
    - Add delete policy for agents table
    - Add delete policy for business_reviews table
    
  2. Security
    - Users can only delete their own agents if they are in 'Pending' status
    - Admins and decision makers can delete any agent
    - Cascade delete for business_reviews is handled by foreign key constraints
*/

-- Add delete policy for agents table
CREATE POLICY "Users can delete their own pending agents" 
ON agents 
FOR DELETE 
TO authenticated 
USING (
  (
    -- User can delete their own pending agents
    user_id = (SELECT id::uuid FROM auth.users WHERE id = auth.uid()) AND 
    status = 'Pending'
  ) OR 
  -- Admins and decision makers can delete any agent
  EXISTS (
    SELECT 1 
    FROM profiles p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = (SELECT id::uuid FROM auth.users WHERE id = auth.uid())
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
      (a.user_id = (SELECT id::uuid FROM auth.users WHERE id = auth.uid()) AND a.status = 'Pending') OR
      EXISTS (
        SELECT 1 
        FROM profiles p
        JOIN roles r ON p.role_id = r.id
        WHERE p.id = (SELECT id::uuid FROM auth.users WHERE id = auth.uid())
        AND r.name IN ('admin', 'decision_maker')
      )
    )
  )
);
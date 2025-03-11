/*
  # Update user role to decision_maker
  
  1. Changes
    - Updates a user's role to decision_maker in the profiles table
    - Only admins can execute this change due to RLS policies
*/

DO $$ 
BEGIN
  -- Check if the role exists first
  IF EXISTS (
    SELECT 1 FROM roles WHERE name = 'decision_maker'
  ) THEN
    -- Update the user's role
    UPDATE profiles
    SET role_id = (SELECT id FROM roles WHERE name = 'decision_maker')
    WHERE email = 'user@example.com'; -- Replace with actual user email
  END IF;
END $$;
/*
  # Fix profiles table policies

  1. Changes
    - Add INSERT policy for profiles table
    - Add missing RLS policies

  2. Security
    - Allow authenticated users to insert their own profile
    - Maintain existing SELECT and UPDATE policies
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create INSERT policy for profiles
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
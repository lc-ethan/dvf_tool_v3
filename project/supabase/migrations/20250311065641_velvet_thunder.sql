/*
  # Set up authentication and RBAC

  1. New Tables
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique) - role name (admin, requestor, decision_maker)
      - `created_at` (timestamp)
    
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `role_id` (uuid, references roles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
    - Insert default roles
    - Insert admin user
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role_id uuid REFERENCES roles(id) ON DELETE RESTRICT,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for roles table
CREATE POLICY "Roles are viewable by authenticated users" 
  ON roles FOR SELECT 
  TO authenticated 
  USING (true);

-- Policies for profiles table
CREATE POLICY "Users can view all profiles" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Insert default roles
INSERT INTO roles (name) VALUES
  ('admin'),
  ('requestor'),
  ('decision_maker')
ON CONFLICT (name) DO NOTHING;

-- Insert admin user (will be linked after user signs up)
INSERT INTO profiles (id, email, role_id)
SELECT 
  auth.uid(),
  'michael.lee@one.nz',
  roles.id
FROM roles 
WHERE roles.name = 'admin'
AND NOT EXISTS (
  SELECT 1 FROM profiles WHERE email = 'michael.lee@one.nz'
);
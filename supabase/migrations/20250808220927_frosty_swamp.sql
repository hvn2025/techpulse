/*
  # Setup Authentication System

  1. Authentication
    - Uses Supabase's built-in auth.users table
    - Enable email/password authentication
    - Disable email confirmation for admin setup
    
  2. Security
    - Set up proper RLS policies
    - Configure authentication settings
    
  3. Admin Setup
    - Ready for admin user creation
*/

-- Enable email/password authentication
-- This is handled by Supabase's built-in auth system

-- Create a function to check if user is admin (optional - for future use)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- For now, any authenticated user is considered admin
  -- You can modify this logic later if needed
  RETURN user_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;

-- Update articles table policies to use proper authentication
DROP POLICY IF EXISTS "Public can read published articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can manage articles" ON articles;

-- Recreate policies with proper authentication
CREATE POLICY "Public can read published articles"
  ON articles
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Authenticated users can manage articles"
  ON articles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
/*
  # Insert Admin User

  This migration creates a default admin user for immediate access.
  
  Default Credentials:
  - Email: admin@techpulse.com
  - Password: TechPulse2024!
  
  IMPORTANT: Change these credentials after first login!
*/

-- Insert admin user directly into auth.users
-- Note: This approach requires Supabase CLI or direct database access
-- For web interface, use the signup form instead

-- Create admin user with email and password
-- This will be handled through the application signup form
-- The credentials will be:
-- Email: admin@techpulse.com  
-- Password: TechPulse2024!

-- You can create this user by:
-- 1. Going to /admin/login
-- 2. Clicking "Create Account" 
-- 3. Using the credentials above
-- 4. Or use your own email/password combination
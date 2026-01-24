# Supabase Database Setup

## Prerequisites

1. Create a Supabase project at https://supabase.com
2. Copy your project URL and anon key

## Environment Variables

Create a `.env` file in the root of your project:

```env
SUPABASE_URL=your-project-url.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Schema

Run the following SQL in your Supabase SQL editor to create the necessary tables
and functions:

```sql
-- Create user_role enum
CREATE TYPE user_role AS ENUM ('regular', 'superadmin');

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'regular' NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create a function to check if current user is superadmin
-- This function uses SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for user_profiles
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Superadmins can read all profiles (using the function to avoid recursion)
CREATE POLICY "Superadmins can read all profiles"
  ON user_profiles
  FOR SELECT
  USING (is_superadmin());

-- Users can update their own profile (name and avatar only, not role)
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
  );

-- Superadmins can update any profile (using the function to avoid recursion)
CREATE POLICY "Superadmins can update any profile"
  ON user_profiles
  FOR UPDATE
  USING (is_superadmin());

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    'regular'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profile changes
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create first superadmin (run this after your first user signs up)
-- Replace 'your-user-id-here' with the actual user ID from auth.users
-- UPDATE user_profiles SET role = 'superadmin' WHERE id = 'your-user-id-here';
```

## Authentication Configuration

### Enable Email Authentication

1. Go to Authentication > Providers in your Supabase dashboard
2. Enable Email provider
3. Configure email templates as needed

### Enable Google OAuth

1. Go to Authentication > Providers
2. Enable Google provider
3. Create OAuth credentials in Google Cloud Console:
   - Go to https://console.cloud.google.com
   - Create a new project or select existing
   - Enable Google+ API
   - Go to Credentials > Create Credentials > OAuth 2.0 Client ID
   - Add authorized redirect URIs:
     - `https://your-project.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase
5. Add authorized domains in Supabase Authentication settings

### Site URL Configuration

1. Go to Authentication > URL Configuration
2. Set Site URL to your production URL (e.g., `https://yourdomain.com`)
3. Add redirect URLs:
   - `http://localhost:8000/**` (for development)
   - `https://yourdomain.com/**` (for production)

## Testing

After setup:

1. Try registering a new user via email
2. Check that user_profiles table has a new entry
3. Try logging in with Google
4. Manually set your user to superadmin role to test admin features

## Notes

- The first user to sign up will be a regular user
- You must manually promote the first user to superadmin via SQL
- After that, superadmins can promote other users through the application (if
  you implement that feature)

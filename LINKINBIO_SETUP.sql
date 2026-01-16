-- Link-in-Bio Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. Public Profiles Table
-- ============================================
-- Stores public-facing profile information for link-in-bio pages

CREATE TABLE IF NOT EXISTS public_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'default',
  is_published BOOLEAN DEFAULT false,
  page_views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_]+$'),
  CONSTRAINT bio_length CHECK (char_length(bio) <= 500)
);

-- Create unique index on user_id (one public profile per user)
CREATE UNIQUE INDEX IF NOT EXISTS public_profiles_user_id_idx ON public_profiles(user_id);

-- Create index for username lookups
CREATE INDEX IF NOT EXISTS public_profiles_username_idx ON public_profiles(username);

-- ============================================
-- 2. Links Table
-- ============================================
-- Stores the links displayed on user's public profile

CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 100),
  CONSTRAINT url_length CHECK (char_length(url) >= 1 AND char_length(url) <= 2000)
);

-- Create index for user's links
CREATE INDEX IF NOT EXISTS links_user_id_idx ON links(user_id);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS links_user_position_idx ON links(user_id, position);

-- ============================================
-- 3. Page Analytics Table (Optional - for future)
-- ============================================
-- Tracks page views and link clicks with more detail

CREATE TABLE IF NOT EXISTS page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public_profiles(id) ON DELETE CASCADE,
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'page_view' or 'link_click'
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS page_analytics_profile_id_idx ON page_analytics(profile_id);
CREATE INDEX IF NOT EXISTS page_analytics_link_id_idx ON page_analytics(link_id);
CREATE INDEX IF NOT EXISTS page_analytics_created_at_idx ON page_analytics(created_at);

-- ============================================
-- 4. Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- Public Profiles Policies
-- Anyone can view published profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public_profiles FOR SELECT
  USING (is_published = true);

-- Users can view their own profile (even if unpublished)
CREATE POLICY "Users can view own profile"
  ON public_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can create own profile"
  ON public_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON public_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Links Policies
-- Anyone can view links for published profiles
CREATE POLICY "Links are viewable for published profiles"
  ON links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public_profiles
      WHERE public_profiles.user_id = links.user_id
      AND public_profiles.is_published = true
    )
    OR auth.uid() = user_id
  );

-- Users can insert their own links
CREATE POLICY "Users can create own links"
  ON links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own links
CREATE POLICY "Users can update own links"
  ON links FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own links
CREATE POLICY "Users can delete own links"
  ON links FOR DELETE
  USING (auth.uid() = user_id);

-- Page Analytics Policies
-- Only allow inserts (for tracking) - no user auth required for page views
CREATE POLICY "Anyone can insert analytics"
  ON page_analytics FOR INSERT
  WITH CHECK (true);

-- Users can view analytics for their own profile
CREATE POLICY "Users can view own analytics"
  ON page_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public_profiles
      WHERE public_profiles.id = page_analytics.profile_id
      AND public_profiles.user_id = auth.uid()
    )
  );

-- ============================================
-- 5. Updated At Trigger
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for public_profiles
DROP TRIGGER IF EXISTS update_public_profiles_updated_at ON public_profiles;
CREATE TRIGGER update_public_profiles_updated_at
  BEFORE UPDATE ON public_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for links
DROP TRIGGER IF EXISTS update_links_updated_at ON links;
CREATE TRIGGER update_links_updated_at
  BEFORE UPDATE ON links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. Atomic Increment Functions
-- ============================================
-- Function for atomic click increment (avoids race conditions)

CREATE OR REPLACE FUNCTION increment_link_clicks(link_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE links
  SET clicks = clicks + 1
  WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for atomic page view increment
CREATE OR REPLACE FUNCTION increment_page_views(profile_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public_profiles
  SET page_views = page_views + 1
  WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to anon and authenticated users
GRANT EXECUTE ON FUNCTION increment_link_clicks(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_link_clicks(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_page_views(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_page_views(UUID) TO authenticated;

-- ============================================
-- 7. Available Themes
-- ============================================
-- These are the theme options users can choose from:
-- 'default'  - Clean white background
-- 'dark'     - Dark mode
-- 'gradient' - Purple/pink gradient
-- 'minimal'  - Minimalist black and white
-- 'ocean'    - Blue ocean theme

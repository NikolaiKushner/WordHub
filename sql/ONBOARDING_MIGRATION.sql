-- Onboarding flow: track whether user has completed or skipped onboarding
-- Run in Supabase SQL Editor

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

# Database Setup

## Prerequisites

1. Create a Supabase project at https://supabase.com
2. Copy your project URL and keys

## Environment Variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=your-project-url.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Schema

Run these SQL files in order in your Supabase SQL Editor:

1. [`sql/USER_AUTH_SETUP.sql`](../sql/USER_AUTH_SETUP.sql) -- User profiles,
   roles, RLS policies, auto-profile trigger
2. [`sql/LINKINBIO_SETUP.sql`](../sql/LINKINBIO_SETUP.sql) -- Public profiles,
   links, analytics, social links

## Avatar Storage

1. In Supabase Dashboard, go to **Storage > New Bucket**
2. Create bucket named `avatars` (public, 2MB limit)
3. Run [`sql/AVATAR_STORAGE_POLICIES.sql`](../sql/AVATAR_STORAGE_POLICIES.sql)
   to set up RLS policies

## Authentication

### Email Auth

Enable Email provider in **Authentication > Providers**.

### Google OAuth

1. Enable Google provider in **Authentication > Providers**
2. Create OAuth credentials in
   [Google Cloud Console](https://console.cloud.google.com)
3. Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret to Supabase

### URL Configuration

In **Authentication > URL Configuration**:

- Site URL: `https://yourdomain.com`
- Redirect URLs: `http://localhost:8000/**`, `https://yourdomain.com/**`

## First Superadmin

After your first user signs up, promote them via SQL:

```sql
UPDATE user_profiles SET role = 'superadmin' WHERE id = 'your-user-id';
```

# 🔧 Avatar Upload RLS Error - Quick Fix

## The Error You're Seeing

```
StorageApiError: new row violates row-level security policy
status: 400, statusCode: "403"
```

## What This Means

Supabase Storage has Row Level Security (RLS) enabled, but there are no policies
allowing authenticated users to upload files to the `avatars` bucket.

## Quick Fix (5 Minutes)

### Step 1: Go to Supabase Storage Policies

1. Open your Supabase Dashboard
2. Navigate to **Storage** → **Policies**
3. Select the `avatars` bucket from the dropdown

### Step 2: Add Upload Policy

Click **New Policy** and add this policy:

**Policy Name:** `Authenticated users can upload avatars`

**Policy Command:** `INSERT`

**Target Roles:** `authenticated`

**USING expression:** (leave empty)

**WITH CHECK expression:**

```sql
bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
```

**Or use SQL editor:**

```sql
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Step 3: Add Read Policy (For Public Access)

Click **New Policy** again:

**Policy Name:** `Public can read avatars`

**Policy Command:** `SELECT`

**Target Roles:** `public`

**USING expression:**

```sql
bucket_id = 'avatars'
```

**Or use SQL editor:**

```sql
CREATE POLICY "Public can read avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

### Step 4: Add Update Policy (For Replacing Avatars)

Click **New Policy** one more time:

**Policy Name:** `Users can update their own avatars`

**Policy Command:** `UPDATE`

**Target Roles:** `authenticated`

**USING expression:**

```sql
bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
```

**Or use SQL editor:**

```sql
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Test Again

After adding these policies:

1. Go back to your app
2. Try uploading an avatar again
3. It should work! ✅

## What Was Changed in Code

I also updated the API endpoint (`routes/api/profile/upload-avatar.ts`) to use
the authenticated Supabase client instead of the anonymous client. This ensures
the user's authentication token is used for the upload.

**Changes:**

- Now using `createSupabaseClient(session.accessToken)` for storage operations
- This passes the user's JWT token to Supabase
- RLS policies can now verify the user's identity

## Verify It Worked

After adding the policies, you should be able to:

1. ✅ Upload an avatar (file appears in Storage)
2. ✅ See the avatar in your profile editor
3. ✅ See the avatar on your public profile page
4. ✅ Upload a new avatar (it replaces the old one)

## Alternative: Disable RLS (Not Recommended)

If you want to skip RLS policies for testing (NOT recommended for production):

1. Go to Storage → `avatars` bucket
2. Click the bucket settings (⚙️)
3. Toggle **"Disable RLS"**

**Warning:** This allows anyone to upload to your bucket! Only use for local
testing.

## Still Having Issues?

### Check These:

1. **Bucket exists?**
   - Go to Storage → should see `avatars` bucket

2. **Bucket is public?**
   - Click on bucket → Settings → "Public bucket" should be checked

3. **Policies added?**
   - Storage → Policies → Select `avatars` → Should see 3 policies

4. **User is logged in?**
   - Make sure you're authenticated when trying to upload

### Debug Steps:

1. Check browser console for errors
2. Check Supabase logs (Dashboard → Logs → Storage)
3. Verify file is < 2MB and is an image
4. Try with a different image file

## Summary of What We Fixed

**Before:**

- ❌ Using anonymous Supabase client
- ❌ No RLS policies = access denied

**After:**

- ✅ Using authenticated Supabase client
- ✅ Added RLS policies for upload/read/update
- ✅ Upload works for logged-in users

---

**Once you've added these policies, your avatar upload should work perfectly!
🎉**

If you still have issues after adding the policies, let me know and we can debug
further.

# Avatar Upload Setup Guide

This guide will help you set up the Supabase Storage bucket for avatar uploads.

## Step 1: Create Storage Bucket in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Configure the bucket:
   - **Name**: `avatars`
   - **Public bucket**: ✅ **Check this box** (make it public)
   - **File size limit**: 2 MB (optional, we also validate in code)
   - **Allowed MIME types**: Leave empty or specify:
     `image/jpeg, image/png, image/webp`

5. Click **Create Bucket**

## Step 2: Configure Storage Policies (REQUIRED)

**IMPORTANT:** After creating the bucket, you MUST add RLS policies to allow
authenticated users to upload.

1. Go to **Storage** > **Policies** in your Supabase dashboard
2. Select the `avatars` bucket
3. Add these policies (click "New Policy" for each):

### Allow Authenticated Users to Upload (REQUIRED ⚠️)

```sql
-- Policy for INSERT (Upload) - REQUIRED!
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**This policy is REQUIRED!** It allows authenticated users to upload files only
to their own folder (`{user_id}/avatar.ext`). Without this, you'll get a
"row-level security policy" error.

### Allow Public Read Access (Required)

```sql
-- Policy for SELECT (Read)
CREATE POLICY "Public can read avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

### Allow Users to Update Their Own Avatars (Recommended)

```sql
-- Policy for UPDATE
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Allow Users to Delete Their Own Avatars (Optional)

```sql
-- Policy for DELETE
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 3: Test the Setup

1. Start your development server:
   ```bash
   deno task dev
   ```

2. Log in to your application

3. Navigate to the Links/Profile page (`/links`)

4. You should see the avatar upload section at the top of the Profile Settings

5. Try uploading an image:
   - Click "Upload Photo"
   - Select a JPG, PNG, or WebP image (max 2MB)
   - The upload should complete and show your new avatar

6. Check your public profile (`/@yourname`) to see the avatar displayed

## Troubleshooting

### "Failed to upload avatar" Error

**Possible causes:**

1. **Bucket doesn't exist**: Make sure you created the `avatars` bucket in
   Supabase Storage

2. **Bucket is not public**: Ensure you checked "Public bucket" when creating
   it, or add the read policy above

3. **File size too large**: Maximum is 2MB

4. **Invalid file type**: Only JPEG, PNG, and WebP are supported

5. **RLS Policies**: If you added custom policies, make sure they allow
   authenticated users to upload

### Avatar Not Showing on Public Profile

1. **Check the database**: Go to Supabase > Table Editor > `public_profiles` and
   verify the `avatar_url` column has a value

2. **Check the URL**: The avatar URL should look like:
   ```
   https://your-project.supabase.co/storage/v1/object/public/avatars/{user-id}/avatar.jpg
   ```

3. **CORS issues**: Make sure the bucket is public and accessible

### Avatar Upload is Slow

- Supabase Storage is quite fast. Slow uploads are usually due to:
  - Large file sizes (optimize images before uploading)
  - Slow internet connection
  - Geographic distance from Supabase server

## File Storage Structure

Avatars are stored with the following structure:

```
avatars/
├── {user-id-1}/
│   └── avatar.jpg (or .png, .webp)
├── {user-id-2}/
│   └── avatar.png
└── {user-id-3}/
    └── avatar.webp
```

Each user has their own folder (named by their user ID), and the avatar file is
always named `avatar.{ext}`. When a user uploads a new avatar, it overwrites the
previous one (thanks to `upsert: true` in the upload code).

## API Endpoint

The avatar upload uses the following API endpoint:

- **URL**: `/api/profile/upload-avatar`
- **Method**: `POST`
- **Body**: `multipart/form-data` with `avatar` field
- **Authentication**: Required (must be logged in)

### Response Format

**Success (200):**

```json
{
  "success": true,
  "avatar_url": "https://...supabase.co/storage/v1/object/public/avatars/xxx/avatar.jpg",
  "message": "Avatar uploaded successfully"
}
```

**Error (400/500):**

```json
{
  "error": "Error message here",
  "details": "Additional error details"
}
```

## Security Features

1. **File Type Validation**: Only allows image files (JPEG, PNG, WebP)
2. **File Size Limit**: Maximum 2MB per file
3. **User Isolation**: Users can only upload to their own folder
4. **Authentication Required**: Must be logged in to upload
5. **Automatic Overwrite**: Old avatars are replaced, preventing storage bloat

## Next Steps

After setting up avatar upload, consider:

1. ✅ **Image Optimization**: Add image resizing/compression on upload
2. ✅ **Crop Tool**: Let users crop images before uploading
3. ✅ **Delete Avatar**: Add ability to remove avatar
4. ✅ **Default Avatars**: Generate colorful default avatars (like Gravatar)
5. ✅ **Progress Bar**: Show upload progress for large files

---

**Setup Complete!** 🎉

Your users can now upload profile photos. The avatars will appear on:

- Their profile editor (`/links`)
- Their public profile page (`/@username`)
- The dashboard (if you add it there)

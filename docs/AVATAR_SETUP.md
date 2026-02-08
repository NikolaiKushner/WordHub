# Avatar Upload Setup

## 1. Create Storage Bucket

In Supabase Dashboard > **Storage > New Bucket**:

- **Name:** `avatars`
- **Public bucket:** Yes
- **File size limit:** 2MB
- **Allowed MIME types:** `image/jpeg, image/png, image/webp`

## 2. Apply Storage Policies

Run [`sql/AVATAR_STORAGE_POLICIES.sql`](../sql/AVATAR_STORAGE_POLICIES.sql) in
the Supabase SQL Editor.

## 3. Test

1. Start dev server: `deno task dev`
2. Log in and go to `/dashboard`
3. Upload a profile photo (JPG, PNG, or WebP, max 2MB)
4. Check your public profile at `/@yourname`

## API Endpoint

- **URL:** `POST /api/profile/upload-avatar`
- **Body:** `multipart/form-data` with `avatar` field
- **Auth:** Required

## Troubleshooting

| Problem                      | Solution                                       |
| ---------------------------- | ---------------------------------------------- |
| "Failed to upload avatar"    | Ensure `avatars` bucket exists and is public   |
| Avatar not on public profile | Check `public_profiles.avatar_url` in database |
| Upload rejected              | File must be < 2MB and JPEG/PNG/WebP           |

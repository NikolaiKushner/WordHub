# Launch Checklist

## Legal & Compliance

- [x] Privacy Policy page
- [x] Terms of Service page
- [x] Legal footer links on all pages
- [ ] GDPR consent banner (if targeting EU)

## Core Features Verified

- [x] Authentication (email + Google OAuth)
- [x] User profiles with avatar upload
- [x] Public profile pages with themes
- [x] Links CRUD with click tracking
- [x] Analytics dashboard with date filtering
- [x] Social links (6 platforms)
- [x] Onboarding wizard
- [x] Admin panel
- [x] SEO (OG tags, Twitter Cards, JSON-LD)

## Testing

- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] Mobile (iOS Safari, Android Chrome)
- [ ] Lighthouse score > 85
- [ ] Security audit (OWASP check)
- [ ] Database RLS policies verified
- [ ] All auth flows (signup, login, password reset, OAuth)
- [ ] Edge cases (long usernames, special characters, empty profiles)

## Infrastructure

- [ ] Production Supabase project
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Storage bucket (avatars) created with RLS
- [ ] Error logging (Sentry or similar)
- [ ] Database backups enabled
- [ ] SSL configured

## Security

- [ ] No sensitive data in localStorage
- [ ] Tokens stored as HttpOnly cookies
- [ ] CORS properly configured
- [ ] Secrets not committed to git
- [ ] `.env` in `.gitignore`

## Post-Launch (First 48 Hours)

Watch for: database errors, auth failures, upload failures, high error rates,
slow page loads.

**Day 1 success criteria:** Users can sign up, create profiles, publish pages,
analytics work, no critical errors, response < 2s.

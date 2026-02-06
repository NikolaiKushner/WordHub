# Quick Start

## Development

```bash
deno task dev      # Start dev server
deno task build    # Production build
deno task check    # Format, lint, type-check
deno task start    # Serve production build
```

## What's Done (MVP Complete)

**Core:** Authentication, user profiles, public pages, links CRUD, click
tracking, page views, 5 themes, publish/draft, social links, onboarding, admin
panel, landing page.

**Legal:** Privacy Policy, Terms of Service, footer links.

**Analytics & SEO:** Analytics dashboard with date filtering, OG tags, Twitter
Cards, JSON-LD, robots.txt.

**UX:** Mobile responsive, error handling, loading states, form validation.

## Next Steps (Post-Launch)

### Week 1 (Critical)

1. **Email Notifications** (8-12h) -- Welcome, password reset, digests
2. **Rate Limiting** (4-6h) -- Prevent brute force attacks

### Week 2-3 (High Priority)

3. **User Search & Discovery** (6-8h) -- Growth driver
4. **Link Preview Generation** (4-6h) -- Better social sharing
5. **Enhanced Analytics** (6-8h) -- Referrers, geo, device breakdown

### Week 4+ (Premium Features)

6. Team accounts, custom theme builder, email capture, custom domains

See [FEATURE_RECOMMENDATIONS.md](./FEATURE_RECOMMENDATIONS.md) for details.

## Before Launch

See [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) for the full checklist:

- [ ] Cross-browser & mobile testing
- [ ] Production Supabase project + migrations
- [ ] Storage bucket (avatars) with RLS policies
- [ ] Error logging (Sentry)
- [ ] Security audit (RLS, CORS, secrets)
- [ ] Lighthouse > 85

## Deployment

1. Create production Supabase project
2. Set env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`
3. Run `deno task build`
4. Deploy to Deno Deploy

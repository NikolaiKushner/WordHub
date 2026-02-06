# Getlnk - Project Summary

**Status:** MVP Complete -- Ready for Launch

## What is Getlnk?

An open-source link-in-bio platform built with Deno Fresh and Supabase. Users
create a shareable profile page at `getlnk.xyz/@username` with all their links.

## Tech Stack

| Layer        | Technology          |
| ------------ | ------------------- |
| **Frontend** | Fresh (Deno)        |
| **Backend**  | Deno + Fresh API    |
| **Database** | Supabase (Postgres) |
| **Auth**     | Supabase Auth       |
| **Storage**  | Supabase Storage    |
| **Hosting**  | Deno Deploy         |

## MVP Features (100% Complete)

- Authentication (email + Google OAuth)
- User profiles with avatar upload
- Public profile pages with 5 themes
- Links CRUD with click tracking
- Page view analytics with date filtering
- Social links (Instagram, X, YouTube, TikTok, LinkedIn, GitHub)
- 5-step onboarding wizard
- Admin panel with user management
- Landing page, Privacy Policy, Terms of Service
- SEO (OG tags, Twitter Cards, JSON-LD, robots.txt)
- Full mobile responsiveness

## Pricing Model

| Tier         | Price  | Key Features                        |
| ------------ | ------ | ----------------------------------- |
| **Free**     | $0     | 5 links, basic themes               |
| **Pro**      | $3/mo  | Unlimited links, all themes, no ads |
| **Business** | $9/mo | Pro + custom domain, scheduling     |

## Competitive Position

| Competitor   | Price  | Our Advantage           |
| ------------ | ------ | ----------------------- |
| **Linktree** | $9/mo  | Open-source, cheaper    |
| **Beacons**  | $10/mo | Lower price, self-host  |
| **Campsite** | $7/mo  | Open-source, comparable |

## Key Documents

- [QUICK_START.md](./QUICK_START.md) -- Development guide & next steps
- [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) -- Pre-launch validation
- [FEATURE_RECOMMENDATIONS.md](./FEATURE_RECOMMENDATIONS.md) -- Post-launch
  roadmap
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) -- Database & auth setup
- [product_strategy.md](./product_strategy.md) -- Business strategy

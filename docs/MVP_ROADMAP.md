# Roadmap

## Phase 1: MVP -- COMPLETE

All core features implemented and ready for launch.

- Authentication (email + Google OAuth)
- User profiles with avatar upload
- Public profile pages with 5 themes
- Links CRUD with click tracking and reordering
- Analytics dashboard with date filtering
- Social links (6 platforms with SVG icons)
- Onboarding wizard (5 steps)
- Admin panel with user management
- Landing page, Privacy Policy, Terms of Service
- SEO (OG tags, Twitter Cards, JSON-LD, robots.txt)
- Mobile responsiveness (44px touch targets)

## Phase 2: Launch Ready -- IN PROGRESS

- [ ] Cross-browser and mobile testing
- [ ] Production infrastructure setup
- [ ] Security audit
- [ ] Performance optimization (Lighthouse > 85)

## Phase 3: Monetization

### Stripe Integration (12-16h)

- Create Products and Prices in Stripe Dashboard
- Checkout session, customer portal, webhooks
- Database: `subscription_tier`, `stripe_customer_id`, `subscription_status`

### Feature Gating (8-10h)

| Tier         | Links     | Themes | Analytics | Custom Domain | Branding |
| ------------ | --------- | ------ | --------- | ------------- | -------- |
| **Free**     | 5         | 3      | Basic     | No            | Shown    |
| **Pro**      | Unlimited | All    | Advanced  | No            | Hidden   |
| **Business** | Unlimited | All    | Advanced  | Yes           | Hidden   |

### Billing Dashboard (6-8h)

- Current plan, usage stats, payment method, upgrade/downgrade, cancel

## Phase 4: Growth

| Feature           | Effort  | Priority |
| ----------------- | ------- | -------- |
| Custom domains    | 16-20h  | High     |
| Email capture     | 8-10h   | Medium   |
| Link scheduling   | 6-8h    | Medium   |
| Rich media embeds | 10-12h  | Medium   |
| Team accounts     | 24h+    | Low      |
| A/B testing       | 20h+    | Low      |
| Mobile app (PWA)  | 80-120h | Low      |

## Go-to-Market

1. **Pre-launch:** Waitlist landing page, 20-50 beta users, testimonials
2. **Launch day:** Product Hunt, social media, creator outreach
3. **Ongoing:** SEO content, freemium virality, affiliate program, community

## Infrastructure

| Cost          | Monthly     |
| ------------- | ----------- |
| Deno Deploy   | $10-20      |
| Supabase Pro  | $25         |
| Domain        | $1          |
| Email service | $0-15       |
| **Total**     | **~$40-60** |

**Break-even:** 8-12 Pro users

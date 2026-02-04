# Feature Recommendations 🎯

**Last Updated:** February 4, 2026\
**Status:** Post-MVP Feature Planning\
**Target Timeline:** Week 1-4 Post-Launch

---

## 🚀 Quick Impact Features (High Value, Low Effort)

These features add significant user value with minimal implementation effort.
**Recommended for Week 1 post-launch.**

### 1. Email Notifications System ⭐⭐⭐

**Priority:** CRITICAL\
**Estimated Effort:** 8-12 hours\
**Impact:** User engagement, retention

**What it does:**

- Welcome email when user signs up
- Password reset emails (already built, needs mailer)
- Activity notifications (optional: new visitor to profile)
- Digest emails (weekly summary of stats)

**Implementation:**

```typescript
// Create routes/api/emails/ endpoints
// Use SendGrid, Resend, or Mailgun
// Store email preferences in user_profiles table
// Add email templates (HTML)
```

**Why it matters:**

- Users expect transactional emails
- Drives engagement with analytics
- Required for password reset UX
- Increases retention through weekly digests

**Code sketch:**

```typescript
// routes/api/emails/send-welcome.ts
import { Resend } from "https://esm.sh/resend";

export const sendWelcomeEmail = async (email: string, username: string) => {
  const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
  await resend.emails.send({
    from: "welcome@getlnk.io",
    to: email,
    subject: "Welcome to Getlnk!",
    html: `<h1>Welcome ${username}!</h1>...`,
  });
};
```

---

### 2. Rate Limiting on Auth Endpoints ⭐⭐⭐

**Priority:** CRITICAL (Security)\
**Estimated Effort:** 4-6 hours\
**Impact:** Security, preventing abuse

**What it does:**

- Limit login attempts (5 per minute per IP)
- Limit signup attempts (3 per hour per IP)
- Prevent brute force attacks
- Return 429 Too Many Requests when exceeded

**Implementation:**

```typescript
// Create lib/rate-limit.ts
// Store in Redis or memory (for MVP, use memory with cleanup)
// Check in routes/api/auth/* endpoints

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count < maxAttempts) {
    entry.count++;
    return true;
  }

  return false;
}
```

**Why it matters:**

- Prevents brute force attacks on login
- Prevents account enumeration
- Prevents signup spam
- Required for responsible SaaS

---

### 3. User Profile Search & Discovery ⭐⭐

**Priority:** HIGH\
**Estimated Effort:** 6-8 hours\
**Impact:** Growth, user discovery

**What it does:**

- Search profiles by username or name
- Browse trending profiles
- Filter by category (creator, freelancer, etc.)
- Discover similar users

**Implementation:**

```typescript
// Create routes/api/search/profiles.ts
// Add full-text search on public_profiles.full_name and username
// Add category field to public_profiles (optional)
// Create routes/discover.tsx page
```

**Database change:**

```sql
ALTER TABLE public_profiles ADD COLUMN category TEXT;
CREATE INDEX idx_profiles_search ON public_profiles 
USING gin(to_tsvector('english', full_name || ' ' || username));
```

**Why it matters:**

- Increases viral potential
- Users can discover others (competitor analysis)
- Drives engagement
- Network effects

---

### 4. Link Preview Generation 🔗

**Priority:** MEDIUM\
**Estimated Effort:** 4-6 hours\
**Impact:** Link sharing, UX

**What it does:**

- Generate OG:image for shared links
- Show preview cards when shared on social
- Include link title, description, thumbnail
- Auto-fetch link preview data (optional)

**Implementation:**

```typescript
// Create routes/api/links/preview.ts
// Generate dynamic OG image using HTML to image service
// Store preview data in links table
// Return preview URL

import { png } from "https://esm.sh/html-to-image";

const generatePreview = async (link: Link) => {
  const html = `
    <div style="width: 1200px; height: 630px; padding: 40px; ...">
      <h1>${link.title}</h1>
      <p>${link.description}</p>
    </div>
  `;
  return await png(html);
};
```

**Why it matters:**

- Better sharing experience
- Increases click-through on social media
- Professional appearance
- Competitive feature

---

### 5. Improved Analytics Dashboard 📊

**Priority:** MEDIUM\
**Estimated Effort:** 4-8 hours\
**Impact:** User insights, monetization signal

**What it does:**

- Add referrer tracking (utm parameters)
- Add geographic data (country, city)
- Add device type breakdown (mobile, desktop, tablet)
- Add browser type breakdown
- Add traffic sources (direct, social, search, etc.)
- Export analytics as CSV

**Implementation:**

```typescript
// Enhance routes/api/analytics/stats.ts
// Add fields: referrer, country, device, browser
// Update page_analytics table schema
// Create analytics/detailed.tsx route with filters

ALTER TABLE page_analytics ADD COLUMN (
  referrer TEXT,
  country TEXT,
  device TEXT,
  browser TEXT
);
```

**Why it matters:**

- Better insights for users
- Understand audience
- Improve content strategy
- Premium feature opportunity

---

## 💎 Medium-Impact Features (Medium Effort)

These features add significant value but require more implementation time.
**Recommended for Week 2-3 post-launch.**

### 6. Team/Organization Accounts

**Priority:** MEDIUM\
**Estimated Effort:** 16-24 hours\
**Impact:** B2B potential, monetization

**What it does:**

- Create teams/organizations
- Add team members with different roles
- Manage multiple profiles from one account
- Shared analytics and settings
- Invite system with email

**Database changes:**

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES user_profiles(id),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE organization_members (
  id UUID PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  role TEXT DEFAULT 'member', -- 'owner', 'editor', 'viewer'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 7. Custom Theme Builder

**Priority:** MEDIUM\
**Estimated Effort:** 12-16 hours\
**Impact:** User customization, premium feature

**What it does:**

- Color picker UI
- Font selector
- Button style customizer
- Save custom themes
- Share theme templates

**Implementation:**

```typescript
// Add theme_settings to public_profiles
// Create islands/ThemeBuilder.tsx
// Add theme preview
// Export as CSS or JSON

ALTER TABLE public_profiles ADD COLUMN theme_settings JSONB;
```

---

### 8. Email Capture / Newsletter Integration

**Priority:** MEDIUM\
**Estimated Effort:** 8-12 hours\
**Impact:** Lead generation, user growth

**What it does:**

- Email signup form on public profiles
- Integration with Mailchimp, Substack, etc.
- Webhook handling
- Subscriber count tracking
- Export subscriber list

**Implementation:**

```typescript
// Create routes/api/links/email-capture.ts
// Store emails in separate table
// Add form to public profile display
// Integrate with 3rd party service
```

---

## 🎁 Premium Features (Post-Launch Monetization)

These features justify paid tiers and should be implemented post-launch.

### 9. Custom Domain Support

**Priority:** HIGH (Monetization)\
**Estimated Effort:** 20-24 hours\
**Impact:** Premium tier, revenue

**What it does:**

- Use custom domain instead of `username.getlnk.io`
- DNS CNAME verification
- SSL cert provisioning
- Wildcard redirect support

**Database changes:**

```sql
ALTER TABLE public_profiles ADD COLUMN (
  custom_domain TEXT UNIQUE,
  domain_verified BOOLEAN DEFAULT FALSE
);
```

---

### 10. Advanced Link Features

**Priority:** MEDIUM\
**Estimated Effort:** 12-20 hours\
**Impact:** Premium tier

**What it does:**

- Scheduled links (show/hide on date)
- Link expiration (auto-deactivate)
- Password-protected links
- Link categories/groups
- Link descriptions (for internal notes)

**Database changes:**

```sql
ALTER TABLE links ADD COLUMN (
  schedule_start_date TIMESTAMPTZ,
  schedule_end_date TIMESTAMPTZ,
  password_hash TEXT,
  category TEXT,
  notes TEXT
);
```

---

### 11. Integrations & Embeds

**Priority:** MEDIUM\
**Estimated Effort:** 16-32 hours per integration\
**Impact:** Premium tier, stickiness

**Suggested integrations:**

- YouTube embed (videos)
- Spotify embed (playlists, songs)
- Twitter/X embed (tweets)
- Instagram embed (posts)
- Shopify product embed
- Calendly embed (booking)
- Typeform embed (surveys)

---

### 12. A/B Testing for Links

**Priority:** LOW\
**Estimated Effort:** 16-24 hours\
**Impact:** Advanced analytics

**What it does:**

- Create A/B variants of links
- Show different titles/descriptions to different users
- Track conversion rates
- Recommend winning variant

---

## 🔍 Suggested Implementation Priority

**Week 1 (Post-Launch):**

1. Email notifications (critical for UX)
2. Rate limiting (critical for security)
3. Improved error messages and logging

**Week 2-3:** 4. User search & discovery (growth driver) 5. Link preview
generation (UX improvement) 6. Enhanced analytics (user retention)

**Week 4+:** 7. Team accounts (B2B, premium tier) 8. Custom theme builder
(premium tier) 9. Email capture (lead generation) 10. Custom domains (premium
tier, high revenue)

---

## 📊 Quick Decision Matrix

| Feature             | Effort  | Impact    | Priority |
| ------------------- | ------- | --------- | -------- |
| Email notifications | 🟡 8h   | 🟢 High   | Critical |
| Rate limiting       | 🟢 4h   | 🟢 High   | Critical |
| User search         | 🟡 6h   | 🟢 High   | High     |
| Link previews       | 🟡 4h   | 🟡 Medium | High     |
| Better analytics    | 🟡 6h   | 🟡 Medium | High     |
| Team accounts       | 🔴 20h  | 🟢 High   | Medium   |
| Custom themes       | 🔴 14h  | 🟡 Medium | Medium   |
| Email capture       | 🟡 10h  | 🟡 Medium | Medium   |
| Custom domains      | 🔴 22h  | 🟢 High   | Medium   |
| Advanced links      | 🔴 16h  | 🟡 Medium | Low      |
| Integrations        | 🔴 24h+ | 🟡 Medium | Low      |
| A/B testing         | 🔴 20h  | 🟡 Medium | Low      |

---

## 🎯 Questions to Ask Users (Post-Launch)

To prioritize these features, ask beta users:

1. **"What's the #1 thing you wish Getlnk could do?"**
2. **"Would you pay for [team accounts / custom domains / advanced
   analytics]?"**
3. **"What integrations would be most valuable to you?"**
4. **"How often do you check your analytics?"**
5. **"Do you need [feature X] for your use case?"**

Use their feedback to reprioritize before building.

---

## Notes

- All feature estimates assume 1 developer working full-time
- Email notifications are a UX necessity (not optional)
- Rate limiting is a security necessity (not optional)
- Custom domains should be your primary premium feature
- Team accounts unlock B2B revenue potential
- User feedback should drive all prioritization decisions

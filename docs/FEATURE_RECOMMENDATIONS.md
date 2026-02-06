# Feature Recommendations

Post-launch features prioritized by impact and effort.

## Week 1 (Critical)

### 1. Email Notifications (8-12h)

Welcome emails, password reset, weekly analytics digest. Use Resend, SendGrid,
or Mailgun.

### 2. Rate Limiting (4-6h)

Limit login attempts (5/min/IP), signup attempts (3/hr/IP). Prevents brute force
and spam.

## Week 2-3 (High Priority)

### 3. User Search & Discovery (6-8h)

Search by username/name, trending profiles, category filtering.

### 4. Link Preview Generation (4-6h)

Dynamic OG:image for shared profiles. Improves click-through on social media.

### 5. Enhanced Analytics (6-8h)

Referrer tracking (UTM), geographic data, device/browser breakdown, CSV export.

## Week 4+ (Premium Features)

### 6. Team Accounts (16-24h)

Organizations with member roles. Unlocks B2B revenue.

### 7. Custom Theme Builder (12-16h)

Color picker, font selector, button styles. Premium tier differentiator.

### 8. Email Capture (8-12h)

Email signup form on public profiles. Mailchimp/Substack integration.

### 9. Custom Domains (20-24h)

Use own domain instead of `getlnk.xyz/@username`. DNS verification + SSL.

### 10. Advanced Links (12-20h)

Scheduled links, expiration, password protection, categories.

## Decision Matrix

| Feature             | Effort | Impact | Priority |
| ------------------- | ------ | ------ | -------- |
| Email notifications | 8h     | High   | Critical |
| Rate limiting       | 4h     | High   | Critical |
| User search         | 6h     | High   | High     |
| Link previews       | 4h     | Medium | High     |
| Better analytics    | 6h     | Medium | High     |
| Team accounts       | 20h    | High   | Medium   |
| Custom themes       | 14h    | Medium | Medium   |
| Email capture       | 10h    | Medium | Medium   |
| Custom domains      | 22h    | High   | Medium   |
| Advanced links      | 16h    | Medium | Low      |

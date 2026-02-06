# Security Policy

## Reporting a Vulnerability

**Do not report security vulnerabilities through public GitHub issues.**

Report via:

- **Email:** security@getlnk.xyz
- **GitHub Security Advisory:** Use the "Report a vulnerability" button

Include: description, steps to reproduce, potential impact, suggested fix.

**Response time:** Acknowledgment within 48 hours, assessment within 7 days.

## Security Best Practices

- Keep Supabase credentials secure and rotate regularly
- Never commit `.env` files to version control
- Use Row-Level Security (RLS) in Supabase
- Never expose service role keys to client-side code
- Validate all user input server-side

See [docs/SECURITY_REFACTORING.md](./docs/SECURITY_REFACTORING.md) for the
security architecture.

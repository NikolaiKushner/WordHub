<div align="center">

# Getlnk

### One link. Every you.

The open-source link-in-bio platform for creators, freelancers, and businesses.

[Live Demo](https://getlnk.xyz) &bull; [Get Started](#get-started) &bull;
[Documentation](./docs/)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Launch%20Ready-brightgreen.svg)
![Deno](https://img.shields.io/badge/runtime-Deno-black.svg)

</div>

---

## Why Getlnk?

Most link-in-bio tools lock you in, charge too much, and own your data. Getlnk
is different.

| Feature            | Getlnk     | Linktree  | Beacons    |
| ------------------ | ---------- | --------- | ---------- |
| **Price**          | Free / $3  | Free / $9 | Free / $10 |
| **Open Source**    | Yes        | No        | No         |
| **Self-Hostable**  | Yes        | No        | No         |
| **Data Ownership** | 100%       | Theirs    | Theirs     |
| **Custom Themes**  | 5 included | 1 free    | Limited    |
| **Analytics**      | Built-in   | Paid only | Paid only  |

## Features

**For Creators**

- Beautiful public profile at `getlnk.xyz/@yourname`
- 5 themes (Default, Dark, Gradient, Minimal, Ocean)
- Unlimited links with drag-and-drop reordering
- Social links (Instagram, X, YouTube, TikTok, LinkedIn, GitHub)
- Profile photo upload
- Publish/draft toggle

**For Growth**

- Built-in analytics (views, clicks, trends, date filtering)
- SEO optimized (Open Graph, Twitter Cards, JSON-LD)
- Click tracking on every link
- Mobile-first responsive design

**For Business**

- Admin panel with user management
- Role-based access control
- Google OAuth + email authentication
- 5-step onboarding wizard
- Privacy Policy & Terms of Service included
- Ready for Stripe integration (paid tiers)

**For Developers**

- 100% open source (MIT license)
- Self-hostable on any Deno-compatible platform
- Modern stack: Deno, Fresh, Preact, Supabase, Tailwind
- TypeScript throughout, zero `dangerouslySetInnerHTML`
- Row-Level Security on all database tables
- Clean island architecture for optimal performance

## Get Started

### Prerequisites

- [Deno](https://deno.land/) installed
- [Supabase](https://supabase.com/) project (free tier works)

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/NikolaiKushner/Getlnk.git
cd Getlnk

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Set up the database (see docs/DATABASE_SETUP.md)

# Start development server
deno task dev
```

Visit `http://localhost:8000` and you're live.

### Commands

```bash
deno task dev      # Development server with hot reload
deno task build    # Production build
deno task check    # Format, lint, and type-check
deno task start    # Serve production build
```

## Architecture

```
routes/           Page routes and API endpoints
islands/          Client-side interactive components (Preact)
components/ui/    Reusable UI component library
lib/              Auth, Supabase client, validators
sql/              Database schemas and migrations
docs/             Documentation
```

## Pricing Model (SaaS)

Ready to monetize with three tiers:

| Tier         | Price | Links     | Themes | Analytics | Branding      |
| ------------ | ----- | --------- | ------ | --------- | ------------- |
| **Free**     | $0    | 5         | 3      | Basic     | Getlnk badge  |
| **Pro**      | $3/mo | Unlimited | All    | Advanced  | No badge      |
| **Business** | $9/mo | Unlimited | All    | Advanced  | Custom domain |

Stripe integration is planned for the next release. See
[docs/MVP_ROADMAP.md](./docs/MVP_ROADMAP.md) for the monetization roadmap.

## Documentation

| Document                                       | Description              |
| ---------------------------------------------- | ------------------------ |
| [Quick Start](./docs/QUICK_START.md)           | Dev setup and next steps |
| [Database Setup](./docs/DATABASE_SETUP.md)     | Schema and auth config   |
| [Launch Checklist](./docs/LAUNCH_CHECKLIST.md) | Pre-launch validation    |
| [Roadmap](./docs/MVP_ROADMAP.md)               | Full product roadmap     |
| [Features](./docs/FEATURE_RECOMMENDATIONS.md)  | Post-launch features     |
| [Strategy](./docs/product_strategy.md)         | Business and pricing     |
| [Components](./docs/COMPONENTS.md)             | UI component library     |
| [Security](./docs/SECURITY_REFACTORING.md)     | Security architecture    |

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for
guidelines.

```bash
# Before submitting a PR
deno task check
```

## Support

- [GitHub Issues](https://github.com/NikolaiKushner/Getlnk/issues) -- Bug
  reports
- [GitHub Discussions](https://github.com/NikolaiKushner/Getlnk/discussions) --
  Questions and ideas

## License

MIT -- Use it however you want. See [LICENSE](./LICENSE) for details.

---

<div align="center">

**Built with Deno Fresh** &bull; **Powered by Supabase** &bull; **Open Source
Forever**

_The link-in-bio platform you actually own._

</div>

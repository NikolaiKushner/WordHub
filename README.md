# Getlnk — One link. Every you.

Create a beautiful, shareable landing page with all your links in one place.

**Perfect for creators, freelancers, and small businesses.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-MVP%20Development-yellow.svg)

## What is Getlnk?

Getlnk is an **open-source** link-in-bio platform that lets you create a single,
shareable landing page with all your links. Unlike proprietary alternatives
(Linktree, etc.), you own your data and can self-host for free.

**Example:** `getlnk.xyz/@yourname`

### Why Getlnk?

- 🔓 **Open Source** - Own your data, customize everything
- 💰 **Affordable** - Free tier, Pro at $5/mo (coming soon)
- 🚀 **Fast & Modern** - Built with Deno + Fresh
- 🎨 **Beautiful Themes** - 5+ themes, more coming
- 📊 **Analytics Built-in** - Track views and clicks
- 🔒 **Privacy-First** - No tracking, no ads

## Current Features ✅

- **Beautiful Themes** - 5 stunning designs to match your brand
- **Unlimited Links** - Add, edit, delete, and reorder links
- **Click Analytics** - See which links perform best
- **Page View Tracking** - Monitor your profile's reach
- **Username System** - Clean URLs like `/@yourname`
- **Mobile Optimized** - Looks great on any device
- **Publish/Draft Mode** - Control when your page goes live
- **Admin Panel** - User management for site admins
- **Secure** - Row-level security with Supabase

## Coming Soon 🚧

- **Avatar Upload** - Profile photos (in progress)
- **Social Links** - Quick links to Instagram, Twitter, etc.
- **Premium Tiers** - Pro ($5/mo) and Business ($15/mo) plans
- **Advanced Analytics** - Charts, time-series, referrer data
- **Custom Domains** - Use your own domain
- **Email Capture** - Build your email list from your page

📋 **[View Full Roadmap →](./docs/MVP_ROADMAP.md)**

## Quick Start

```bash
# Clone the repo
git clone https://github.com/NikolaiKushner/Getlnk.git

# Set up environment variables
cp .env.example .env
# Add your Supabase credentials to .env

# Run the database setup
# Copy sql/LINKINBIO_SETUP.sql into Supabase SQL Editor

# Start the app
deno task dev
```

Visit `http://localhost:5173` and create your page!

## Tech Stack

- **Deno + Fresh** - Fast, modern web framework
- **Supabase** - Auth & database
- **Tailwind CSS** - Beautiful styling

## Self-Hosted & Open Source

Unlike other link-in-bio tools, Getlnk is **100% open source**. Host it
yourself, customize it, and own your data.

### For Developers

Want to contribute or customize? Check out these guides:

- **[MVP Roadmap](./docs/MVP_ROADMAP.md)** - Full development plan and feature
  roadmap
- **[Quick Start Guide](./docs/QUICK_START.md)** - Immediate next steps for
  development
- **[Product Strategy](./docs/product_strategy.md)** - Vision and long-term
  goals
- **[Database Setup](./docs/DATABASE_SETUP.md)** - Database configuration guide
- **[Security Docs](./docs/SECURITY_REFACTORING.md)** - Security architecture
  overview

## Project Status

**Current Phase:** MVP Development (~85% complete)

| Area          | Status         |
| ------------- | -------------- |
| Core Features | ✅ Complete    |
| UI/UX Polish  | 🟡 In Progress |
| Monetization  | 🔜 Planned     |
| Marketing     | 🔜 Planned     |

**Next Milestones:**

1. Avatar upload & social links (2 weeks)
2. Launch free tier (1 week)
3. Stripe integration (2-3 weeks)
4. Paid tiers launch (1 week)

**Target:** Revenue-generating MVP in 6-8 weeks

## Contributing

Contributions are welcome! Please check the [MVP Roadmap](./docs/MVP_ROADMAP.md)
for current priorities.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

- 📖 Documentation: See guides above
- 🐛 Issues: [GitHub Issues](https://github.com/NikolaiKushner/Getlnk/issues)
- 💬 Discussions:
  [GitHub Discussions](https://github.com/NikolaiKushner/Getlnk/discussions)

## License

MIT - Use it however you want. See [LICENSE](./LICENSE) for details.

---

**Made with ❤️ using Deno Fresh**

_The open-source link-in-bio_

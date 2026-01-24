# Contributing to Getlnk

Thank you for your interest in contributing to Getlnk! This document provides
guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and
inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in
   [Issues](https://github.com/NikolaiKushner/Getlnk/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Deno version, etc.)
   - Screenshots if applicable

### Suggesting Features

1. Check [Issues](https://github.com/NikolaiKushner/Getlnk/issues) and
   [Discussions](https://github.com/NikolaiKushner/Getlnk/discussions) first
2. Open a new issue or discussion with:
   - Clear description of the feature
   - Use case and benefits
   - Any implementation ideas (optional)

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following the project's code style
4. **Test your changes**:
   ```bash
   deno task check  # Format, lint, and type-check
   deno task dev    # Test locally
   ```
5. **Commit your changes** with clear, descriptive messages
6. **Push to your fork** and open a Pull Request

## Development Setup

See the [README.md](./README.md) Quick Start section for setup instructions.

### Required Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

See `.env.example` for all required variables.

## Code Style

- **TypeScript**: Use strict mode, prefer explicit types
- **Formatting**: Run `deno fmt` before committing
- **Linting**: Follow Deno's recommended rules
- **Imports**: Use the `@/` alias for project imports
- **Components**: Use shared UI components from `components/ui/` when possible

### Before Submitting

Run the check command to ensure everything passes:

```bash
deno task check
```

This runs:

- `deno fmt --check` - Formatting check
- `deno lint` - Linting
- `deno check` - Type checking

## Project Structure

- `routes/` - Page routes and API endpoints
- `islands/` - Client-side interactive components
- `components/ui/` - Reusable UI components
- `lib/` - Shared utilities (auth, supabase, validators)
- `docs/` - Documentation

See [AGENTS.md](./AGENTS.md) for detailed project structure and conventions.

## Areas for Contribution

### High Priority

- Avatar upload functionality
- Social links support
- User onboarding flow
- Mobile UX improvements
- Analytics dashboard enhancements

### Medium Priority

- Additional themes
- Email notifications
- Rate limiting
- Error logging/monitoring
- Automated testing

See [MVP_ROADMAP.md](./docs/MVP_ROADMAP.md) for the full roadmap.

## Questions?

- Open a [Discussion](https://github.com/NikolaiKushner/Getlnk/discussions) for
  questions
- Check existing [Documentation](./docs/) for guides
- Review [AGENTS.md](./AGENTS.md) for development guidelines

## License

By contributing, you agree that your contributions will be licensed under the
MIT License.

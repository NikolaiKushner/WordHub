# Contributing to Getlnk

Thank you for your interest in contributing!

## How to Contribute

### Reporting Bugs

1. Check [Issues](https://github.com/NikolaiKushner/Getlnk/issues) first
2. Create a new issue with steps to reproduce, expected vs actual behavior, and
   environment details

### Pull Requests

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes following the project's code style
4. Run checks: `deno task check`
5. Test locally: `deno task dev`
6. Submit a pull request

## Development Setup

See [README.md](./README.md) for quick setup and
[docs/DATABASE_SETUP.md](./docs/DATABASE_SETUP.md) for database configuration.

## Code Style

- TypeScript strict mode
- Run `deno fmt` before committing
- Use `@/` import alias for project imports
- Use shared UI components from `components/ui/`

## Project Structure

- `routes/` -- Pages and API endpoints
- `islands/` -- Client-side interactive components
- `components/ui/` -- Reusable UI components
- `lib/` -- Shared utilities (auth, supabase, validators)

See [AGENTS.md](./AGENTS.md) for detailed conventions.

## License

By contributing, you agree that your contributions will be licensed under the
MIT License.

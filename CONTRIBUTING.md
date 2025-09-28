# Contributing to OptiLM

Thank you for your interest in contributing to OptiLM! We welcome contributions from the community and appreciate your help in making this project better.

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- Docker & Docker Compose
- Git

### Development Setup

1. **Fork the repository**

   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/your-username/pulsecost-oss.git
   cd pulsecost-oss
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development environment**

   ```bash
   # Start all services
   OPENAI_API_KEY="your-api-key" docker-compose -f docker/compose.dev.yml --profile all up -d

   # Or start individual services
   docker-compose -f docker/compose.dev.yml --profile api up -d
   docker-compose -f docker/compose.dev.yml --profile dashboard up -d
   ```

5. **Run tests**

   ```bash
   pnpm test
   ```

6. **Run linting**
   ```bash
   pnpm lint
   ```

## Making Changes

### Branch Naming

Create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-documentation-update
```

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Follow the ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer(s)]
```

Examples:

- `feat(api): add caching support for chat completions`
- `fix(dashboard): resolve chart rendering issue`
- `docs(readme): update installation instructions`

### Testing

- Write tests for new features
- Ensure all existing tests pass
- Test your changes thoroughly

## Submitting Changes

### Pull Request Process

1. **Ensure your changes are ready**
   - All tests pass
   - Code is properly formatted
   - Documentation is updated if needed

2. **Push your changes**

   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**
   - Go to the GitHub repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template
   - Submit the PR

### Pull Request Template

When creating a PR, please include:

- **Description**: What changes were made and why
- **Type of change**: Bug fix, new feature, documentation, etc.
- **Testing**: How you tested your changes
- **Screenshots**: If applicable, include screenshots
- **Breaking changes**: List any breaking changes

## Development Guidelines

### Architecture

- Follow the hexagonal architecture pattern
- Keep business logic separate from infrastructure
- Use dependency injection where appropriate
- Write clean, maintainable code

### API Development

- Follow RESTful conventions
- Include proper error handling
- Add comprehensive logging
- Document API endpoints

### Dashboard Development

- Use React best practices
- Follow the existing component structure
- Ensure responsive design
- Write accessible code

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node.js version, etc.)
- Screenshots if applicable

### Feature Requests

When requesting features, please include:

- Clear description of the feature
- Use case and motivation
- Proposed implementation (if you have ideas)
- Any additional context

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Questions?

If you have questions about contributing, please:

- Check existing issues and discussions
- Open a new issue with the "question" label
- Join our community discussions

## Thank You

Thank you for contributing to OptiLM! Your contributions help make this project better for everyone.

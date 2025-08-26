# Contributing to FamiSpace

Thank you for considering contributing to FamiSpace! This document outlines the guidelines and processes for contributing to this family counseling platform.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Process](#contributing-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Architecture Guidelines](#architecture-guidelines)

## Code of Conduct

This project adheres to a code of conduct that promotes a welcoming and inclusive environment:

- Be respectful and considerate in all interactions
- Focus on constructive feedback and collaboration
- Respect diverse perspectives and experiences
- Maintain professionalism in all communications

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature/fix
4. Make your changes
5. Submit a pull request

## Development Setup

### Prerequisites
- Node.js 18.x or higher
- npm 8.x or higher
- Git
- Code editor (VS Code recommended)

### Initial Setup
```bash
# Clone your fork
git clone https://github.com/your-username/FamiSpace.git
cd FamiSpace/FamiliaCenterVue/FamiliaCenterSite

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Recommended VS Code Extensions
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense
- ESLint
- Prettier

## Contributing Process

### 1. Choose an Issue
- Check existing issues for bugs or feature requests
- Comment on issues you'd like to work on
- Wait for assignment to avoid duplicate work

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 3. Make Changes
- Follow coding standards outlined below
- Write/update tests as needed
- Update documentation if required

### 4. Test Your Changes
```bash
# Run type checking
npm run type-check

# Build project to ensure no build errors
npm run build

# Test in browser
npm run dev
```

## Coding Standards

### Vue Components
- Use Composition API with `<script setup>`
- TypeScript for all new components
- Single File Components (.vue files)
- Props and emits should be typed

```vue
<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
}

defineProps<Props>();
defineEmits<{
  click: [id: number];
}>();
</script>
```

### TypeScript
- Strict mode enabled
- Explicit typing for function parameters and return values
- Use interfaces for object types
- Export types from `src/types/index.ts`

### Styling
- Use Tailwind CSS utility classes
- Responsive design principles
- Consistent spacing and color schemes
- Avoid custom CSS unless absolutely necessary

### File Structure
```
src/
├── components/
│   └── FeatureName/
│       ├── ComponentName.vue
│       └── index.ts
├── composables/
│   └── useFeatureName.ts
├── services/
│   └── featureService.ts
└── types/
    └── feature.ts
```

### Naming Conventions
- **Components**: PascalCase (`UserProfile.vue`)
- **Files/Directories**: camelCase (`userProfile.ts`)
- **Variables/Functions**: camelCase (`fetchUserData`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- **CSS Classes**: Use Tailwind utilities

## Commit Messages

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

### Examples
```
feat(auth): add password reset functionality

fix(dashboard): resolve session loading issue

docs(readme): update installation instructions

refactor(api): simplify error handling logic
```

## Pull Request Process

### Before Submitting
- [ ] Code follows project standards
- [ ] All tests pass
- [ ] TypeScript types are properly defined
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] Responsive design is maintained

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] No console errors
- [ ] Responsive design verified

## Screenshots
Add screenshots for UI changes
```

### Review Process
1. Automated checks must pass
2. Code review by maintainers
3. Testing on multiple browsers/devices
4. Approval from at least one maintainer

## Issue Reporting

### Bug Reports
Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable
- Console errors

### Feature Requests
Include:
- Clear description of the feature
- Use case and benefits
- Proposed implementation approach
- Mockups or wireframes if applicable

### Issue Templates
Use provided issue templates when available.

## Architecture Guidelines

### Component Architecture
- Keep components focused and single-responsibility
- Use composables for business logic
- Props down, events up pattern
- Avoid deeply nested prop drilling

### State Management
- Use composables for local state
- Consider Pinia for global state if needed
- Keep state as close to usage as possible

### API Integration
- Use service layer for API calls
- Handle loading and error states
- Implement proper TypeScript interfaces
- Use consistent error handling

### Performance Considerations
- Lazy load components when appropriate
- Optimize bundle size
- Implement proper caching strategies
- Use efficient re-rendering patterns

## Security Guidelines

- Never commit sensitive data
- Sanitize user inputs
- Use HTTPS for all API calls
- Implement proper authentication checks
- Follow OWASP security guidelines

## Documentation

- Update README.md for new features
- Add JSDoc comments for complex functions
- Document API changes
- Include code examples in documentation

## Questions and Support

- Create an issue for questions
- Join project discussions
- Reach out to maintainers for guidance

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to FamiSpace! Your help makes this platform better for families everywhere.
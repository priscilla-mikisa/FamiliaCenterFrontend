# FamiliaCenterSite

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
# FamiSpace - Family Counseling Platform

A comprehensive Vue.js web application providing family counseling services, therapy sessions, and educational programs through a modern, accessible platform.

## Features

### Public Marketing Site
- Modern landing page with family counseling information
- Program showcase and feature highlights
- User testimonials and approach explanation
- Responsive design optimized for all devices

### Dashboard Application
- **Session Management**: Book, join, and manage counseling sessions
- **Program Enrollment**: Browse and enroll in structured family programs
- **Resource Library**: Access educational materials, worksheets, and videos
- **User Profile**: Manage account settings and preferences
- **Video Integration**: Join live counseling sessions via integrated video calls

## Technology Stack

- **Frontend**: Vue.js 3 (Composition API), TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide Vue Next
- **Routing**: Vue Router 4 with authentication guards
- **HTTP Client**: Axios with interceptors
- **Build Tool**: Vite

## Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FamiliaCenterVue/FamiliaCenterSite
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update environment variables:
```env
VITE_API_BASE_URL=https://your-api-endpoint.com/api
```

5. Start development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── Dashboard/           # Dashboard-specific components
│   ├── About/              # Marketing site components
│   ├── Header/
│   ├── Footer/
│   └── ...
├── composables/            # Vue composables for business logic
│   ├── useAuth.ts
│   ├── usePrograms.ts
│   ├── useSessions.ts
│   └── ...
├── services/               # API service layer
│   ├── apiClient.ts
│   └── apiServices.ts
├── views/
│   ├── dashboard/          # Dashboard page components
│   └── ...
├── types/                  # TypeScript type definitions
└── router/                 # Vue Router configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

## Routes

### Public Routes
- `/` - Marketing homepage
- `/login` - User authentication
- `/signup` - User registration

### Protected Dashboard Routes
- `/dashboard` - Dashboard overview
- `/dashboard/sessions` - Session management
- `/dashboard/programs` - Program enrollment
- `/dashboard/resources` - Resource library
- `/dashboard/settings` - User settings

### Demo Route
- `/demo` - Demo dashboard (bypasses authentication)

## Authentication

The application uses JWT token-based authentication with automatic token refresh. Tokens are stored in localStorage (remember me) or sessionStorage (session only).

### Route Guards
- Public routes redirect authenticated users to dashboard
- Protected routes redirect unauthenticated users to login
- Demo routes bypass authentication for demonstration purposes

## API Integration

The application connects to a RESTful API with the following service layers:

- **AuthService**: User authentication and profile management
- **SessionService**: Counseling session management
- **ProgramService**: Educational program enrollment
- **ResourceService**: File and resource management
- **UserService**: User profile and counselor management

## Development

### Adding New Features

1. Create composables for business logic in `src/composables/`
2. Add API service methods in `src/services/apiServices.ts`
3. Create Vue components in appropriate directories
4. Add routes to `src/router/index.ts`
5. Update TypeScript types in `src/types/index.ts`

### Code Style

- Use Composition API for all Vue components
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint and Prettier for code formatting

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist/` folder to your web server

3. Configure your web server to serve `index.html` for all routes (SPA routing)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API endpoint | `http://localhost:3000/api` |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## License

This project is proprietary software. All rights reserved.

## Support

For technical support or questions:
- Email: support@familiacenter.com
- Phone: +254 754235890

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
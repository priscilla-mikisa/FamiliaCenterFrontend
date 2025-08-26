# FamiSpace - Complete Repository Documentation

## Repository Overview

FamiSpace is a comprehensive family counseling and therapy platform built with Vue.js 3, providing both a marketing website and a full-featured dashboard for users, counselors, and administrators.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Architecture](#project-architecture)
3. [Installation Guide](#installation-guide)
4. [Environment Configuration](#environment-configuration)
5. [Development Workflow](#development-workflow)
6. [API Integration](#api-integration)
7. [Authentication System](#authentication-system)
8. [Component Documentation](#component-documentation)
9. [Deployment Guide](#deployment-guide)
10. [Troubleshooting](#troubleshooting)

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd FamiliaCenterVue/FamiliaCenterSite

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## Project Architecture

### Directory Structure
```
src/
├── components/           # Reusable Vue components
│   ├── Dashboard/        # Dashboard-specific components
│   │   ├── DashboardLayout.vue
│   │   └── LogoutModal.vue
│   ├── About/           # Marketing site components
│   ├── Header/
│   ├── Footer/
│   ├── HeroSection/
│   ├── FeatureSection/
│   ├── ProgramSection/
│   ├── SignUpPage/
│   ├── LogInPage/
│   └── UsersOptions/
├── composables/         # Vue 3 Composition API business logic
│   ├── useAuth.ts       # Authentication logic
│   ├── usePrograms.ts   # Program management
│   ├── useSessions.ts   # Session management
│   ├── useResources.ts  # Resource management
│   ├── useUser.ts       # User profile management
│   └── useValidation.ts # Form validation
├── services/            # API service layer
│   ├── apiClient.ts     # HTTP client configuration
│   └── apiServices.ts   # API endpoint functions
├── views/               # Page-level components
│   ├── dashboard/       # Dashboard pages
│   │   ├── DashboardOverview.vue
│   │   ├── ProgramsView.vue
│   │   ├── SessionsView.vue
│   │   ├── ResourcesView.vue
│   │   ├── SettingsView.vue
│   │   └── JoinSessionView.vue
│   ├── HomeView.vue
│   ├── LoginView.vue
│   └── SignUpView.vue
├── types/               # TypeScript type definitions
│   └── index.ts
├── router/              # Vue Router configuration
│   └── index.ts
├── assets/              # Static assets and styles
│   └── main.css
├── App.vue              # Root component
└── main.ts              # Application entry point
```

### Technology Stack
- **Frontend Framework**: Vue.js 3 with Composition API
- **Type Safety**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide Vue Next
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Router**: Vue Router 4

## Installation Guide

### Prerequisites
- Node.js 18.x or higher
- npm 8.x or higher
- Git

### Step-by-Step Installation

1. **Clone Repository**
```bash
git clone <repository-url>
cd FamiliaCenterVue/FamiliaCenterSite
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

4. **Development Server**
```bash
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Run TypeScript type checking
```

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the project root:

```env
# API Configuration
VITE_API_BASE_URL=https://your-api-endpoint.com/api

# Optional: Development settings
VITE_APP_NAME=FamiSpace
VITE_APP_VERSION=1.0.0
```

### Environment Files
- `.env` - Default environment variables
- `.env.local` - Local overrides (not committed)
- `.env.production` - Production-specific variables

## Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes
# Commit with conventional commit messages
git commit -m "feat(dashboard): add session booking modal"

# Push and create PR
git push origin feature/feature-name
```

### 2. Code Quality

The project enforces code quality through:
- TypeScript strict mode
- ESLint configuration
- Prettier code formatting
- Conventional commit messages

### 3. Testing Your Changes

```bash
# Type check
npm run type-check

# Build test
npm run build

# Manual testing
npm run dev
```

## API Integration

### Service Architecture

The application uses a layered API architecture:

1. **HTTP Client** (`apiClient.ts`)
   - Axios configuration
   - Request/response interceptors
   - Authentication token handling
   - Error handling

2. **Service Layer** (`apiServices.ts`)
   - Organized by domain (Auth, Sessions, Programs, etc.)
   - TypeScript interfaces
   - Consistent error handling

### API Services Available

```typescript
// Authentication
AuthService.login(credentials)
AuthService.register(userData)
AuthService.getProfile()
AuthService.logout()

// Sessions
SessionService.getSessions(params)
SessionService.bookSession(data)
SessionService.rescheduleSession(id, data)

// Programs
ProgramService.getPrograms()
ProgramService.enrollInProgram(id)

// Resources
ResourceService.getResources(params)
ResourceService.downloadResource(id)

// Users
UserService.updateUser(id, data)
UserService.getCounselors()
```

### Adding New API Endpoints

1. Define TypeScript interface in `types/index.ts`
2. Add service method in `apiServices.ts`
3. Create composable in `composables/`
4. Use in component

Example:
```typescript
// 1. Add type
export interface Payment {
  id: string;
  amount: number;
  status: string;
}

// 2. Add service
export const PaymentService = {
  async getPayments() {
    const response = await apiClient.get('/payments');
    return response.data;
  }
};

// 3. Create composable
export const usePayments = () => {
  const payments = ref<Payment[]>([]);
  // ... logic
  return { payments };
};
```

## Authentication System

### Flow Overview

1. User submits login credentials
2. API returns JWT token
3. Token stored in localStorage/sessionStorage
4. Token included in all API requests
5. Router guards protect routes

### Implementation Details

```typescript
// Token storage
localStorage.setItem('authToken', token); // Remember me
sessionStorage.setItem('authToken', token); // Session only

// Route protection
const isAuthenticated = (): boolean => {
  return !!(localStorage.getItem('authToken') || sessionStorage.getItem('authToken'));
};

// Automatic token inclusion
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Route Guards

```typescript
router.beforeEach((to, from, next) => {
  const authenticated = isAuthenticated();
  
  if (to.meta.requiresAuth && !authenticated) {
    return next('/login');
  }
  
  if (to.meta.requiresGuest && authenticated) {
    return next('/dashboard');
  }
  
  next();
});
```

## Component Documentation

### Marketing Components

**HeroSection.vue**
- Main landing page hero
- Call-to-action buttons
- Feature highlights

**FeatureSection.vue** 
- Platform capabilities overview
- Icon-based feature grid
- Benefit descriptions

**ProgramSection.vue**
- Available programs showcase
- Program categories
- Enrollment information

### Dashboard Components

**DashboardLayout.vue**
- Main dashboard wrapper
- Sidebar navigation
- User profile section
- Logout functionality

**DashboardOverview.vue**
- Dashboard home page
- Statistics cards
- Quick actions
- Recent activity feed

**SessionsView.vue**
- Session management
- Booking interface
- Join/reschedule options

**ProgramsView.vue**
- Program enrollment
- Progress tracking
- Resource access

### Composables Usage

```vue
<script setup lang="ts">
import { useSessions } from '@/composables/useSessions';

const { sessions, loading, error, fetchSessions } = useSessions();

onMounted(() => {
  fetchSessions();
});
</script>
```

## Deployment Guide

### Production Build

```bash
# Build application
npm run build

# Build output in dist/ directory
ls dist/
```

### Deployment Options

**1. Static Hosting (Netlify, Vercel)**
```bash
# Build command
npm run build

# Publish directory
dist

# Redirects for SPA routing (netlify.toml)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**2. Docker Deployment**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**3. Traditional Web Server**
- Upload `dist/` contents to web root
- Configure server for SPA routing
- Set up HTTPS

### Environment Variables in Production

```env
VITE_API_BASE_URL=https://production-api.com/api
```

## Troubleshooting

### Common Issues

**1. Styles Not Loading**
- Check Tailwind CSS configuration
- Verify PostCSS setup
- Clear browser cache

**2. API Calls Failing**
- Verify `VITE_API_BASE_URL` in `.env`
- Check network tab in browser
- Validate API endpoint accessibility

**3. Authentication Issues**
- Check token storage in browser
- Verify API token format
- Test login/logout flow

**4. Route Not Found**
- Verify route configuration in `router/index.ts`
- Check component imports
- Test route guards

**5. TypeScript Errors**
- Run `npm run type-check`
- Check interface definitions
- Verify import paths

### Development Tips

**Hot Reload Issues**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build Errors**
```bash
# Check for unused imports
# Verify all dependencies are installed
# Run type checking
npm run type-check
```

### Performance Optimization

**Bundle Size**
```bash
# Analyze bundle
npm run build
npx vite-bundle-analyzer dist/
```

**Code Splitting**
```typescript
// Lazy load components
const Dashboard = defineAsyncComponent(() => import('./Dashboard.vue'));
```

## Support and Maintenance

### Getting Help
1. Check existing issues in repository
2. Review this documentation
3. Create detailed issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS information
   - Console errors

### Updating Dependencies
```bash
# Check outdated packages
npm outdated

# Update specific package
npm install package-name@latest

# Update all packages (careful!)
npm update
```

### Security Considerations
- Keep dependencies updated
- Never commit sensitive data
- Use HTTPS in production
- Implement proper input validation
- Follow OWASP guidelines

---

This documentation covers the complete setup and usage of the FamiSpace repository. For additional questions or support, please refer to the issue tracker or contact the development team.
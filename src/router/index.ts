// import { createRouter, createWebHistory } from 'vue-router';
// import HomeView from '@/views/HomeView.vue';
// import LoginView from '@/views/LoginView.vue';
// import SignUpView from '@/views/SignUpView.vue';

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: HomeView
//     },
//     {
//       path: '/login',
//       name: 'login',
//       component: LoginView
//     },
//     {
//       path: '/signup',
//       name: 'signup',
//       component: SignUpView
//     }
//   ],
//   scrollBehavior(to, from, savedPosition) {
//     if (to.hash) {
//       return {
//         el: to.hash,
//         behavior: 'smooth',
//       };
//     } else if (savedPosition) {
//       return savedPosition;
//     } else {
//       return { top: 0 };
//     }
//   }
// });

// export default router;
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import SignUpView from '@/views/SignUpView.vue';

// Dashboard Views
import DashBoardLayout from '@/components/DashBoard/DashBoardLayout.vue';
import DashboardOverview from '@/views/dashboard/DashboardOverview.vue';
import ProgramsView from '@/views/dashboard/ProgramsView.vue';
import SessionsView from '@/views/dashboard/SessionsView.vue';
import ResourcesView from '@/views/dashboard/ResourcesView.vue';
import SettingsView from '@/views/dashboard/SettingsView.vue';
import JoinSessionView from '@/views/dashboard/JoinSessionView.vue';

// Check if user is authenticated
const isAuthenticated = (): boolean => {
  return !!(localStorage.getItem('authToken') || sessionStorage.getItem('authToken'));
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes (marketing site)
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresGuest: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
      meta: { requiresGuest: true }
    },

    // Protected dashboard routes
    {
      path: '/dashboard',
      component: DashBoardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard-overview',
          component: DashboardOverview
        },
        {
          path: 'programs',
          name: 'dashboard-programs',
          component: ProgramsView
        },
        {
          path: 'sessions',
          name: 'dashboard-sessions',
          component: SessionsView
        },
        {
          path: 'sessions/join/:sessionId',
          name: 'join-session',
          component: JoinSessionView,
          props: true
        },
        {
          path: 'resources',
          name: 'dashboard-resources',
          component: ResourcesView
        },
        {
          path: 'settings',
          name: 'dashboard-settings',
          component: SettingsView
        }
      ]
    },




    // DEMO
    // Add this route to your routes array in src/router/index.ts
// Place it BEFORE the catch-all redirect route

{
  path: '/demo',
  component: DashBoardLayout,
  children: [
    {
      path: '',
      name: 'demo-overview',
      component: DashboardOverview
    },
    {
      path: 'programs',
      name: 'demo-programs',
      component: ProgramsView
    },
    {
      path: 'sessions',
      name: 'demo-sessions',
      component: SessionsView
    },
    {
      path: 'sessions/join/:sessionId',
      name: 'demo-join-session',
      component: JoinSessionView,
      props: true
    },
    {
      path: 'resources',
      name: 'demo-resources',
      component: ResourcesView
    },
    {
      path: 'settings',
      name: 'demo-settings',
      component: SettingsView
    }
  ]
},

    // Catch-all redirect
    {
      path: '/:pathMatch(.*)*',
      redirect: () => {
        return isAuthenticated() ? '/dashboard' : '/';
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const authenticated = isAuthenticated();

  // Redirect authenticated users away from public pages
  if (to.meta.requiresGuest && authenticated) {
    return next('/dashboard');
  }

  // Redirect unauthenticated users to login
  if (to.meta.requiresAuth && !authenticated) {
    return next('/login');
  }

  next();
});

export default router;

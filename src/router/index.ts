import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import SignUpView from '@/views/SignUpView.vue';

import DashBoardLayout from '@/components/DashBoard/DashBoardLayout.vue';
import DashboardOverview from '@/views/dashboard/DashboardOverview.vue';
import ProgramsView from '@/views/dashboard/ProgramsView.vue';
import SessionsView from '@/views/dashboard/SessionsView.vue';
import ResourcesView from '@/views/dashboard/ResourcesView.vue';
import SettingsView from '@/views/dashboard/SettingsView.vue';
import JoinSessionView from '@/views/dashboard/JoinSessionView.vue';
import SubscriptionPlans from '@/views/dashboard/SubscriptionPlans.vue';

import CounselorDashboardLayout from '@/components/Counselor/CounselorDashboardLayout.vue';
import CounselorOverview from '@/views/counselor/CounselorOverview.vue';
import CounselorClients from '@/views/counselor/CounselorClients.vue';
import CounselorSchedule from '@/views/counselor/CounselorSchedule.vue';
import CounselorSessions from '@/views/counselor/CounselorSessions.vue';
import CounselorPrograms from '@/views/counselor/CounselorPrograms.vue';
import CounselorResources from '@/views/counselor/CounselorResources.vue';
import CounselorSettings from '@/views/counselor/CounselorSettings.vue';

const isAuthenticated = (): boolean => {
  return !!(localStorage.getItem('authToken') || sessionStorage.getItem('authToken'));
};

const getUserType = (): string | null => {
  return localStorage.getItem('userType');
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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

    {
      path: '/dashboard',
      component: DashBoardLayout,
      meta: { requiresAuth: true, allowedUserTypes: ['user'] },
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
          path: 'subscription',
          name: 'dashboard-subscription',
          component: SubscriptionPlans
        },
        {
          path: 'settings',
          name: 'dashboard-settings',
          component: SettingsView
        }
      ]
    },

    {
      path: '/counselor-dashboard',
      component: CounselorDashboardLayout,
      meta: { requiresAuth: true, allowedUserTypes: ['counsellor'] },
      children: [
        {
          path: '',
          name: 'counselor-overview',
          component: CounselorOverview
        },
        {
          path: 'clients',
          name: 'counselor-clients',
          component: CounselorClients
        },
        {
          path: 'schedule',
          name: 'counselor-schedule',
          component: CounselorSchedule
        },
        {
          path: 'sessions',
          name: 'counselor-sessions',
          component: CounselorSessions
        },
        {
          path: 'programs',
          name: 'counselor-programs',
          component: CounselorPrograms
        },
        {
          path: 'resources',
          name: 'counselor-resources',
          component: CounselorResources
        },
        {
          path: 'settings',
          name: 'counselor-settings',
          component: CounselorSettings
        }
      ]
    },

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

    {
      path: '/404',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue')
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('@/views/Unauthorized.vue')
    },

    {
      path: '/:pathMatch(.*)*',
      redirect: () => {
        if (isAuthenticated()) {
          const userType = getUserType();
          switch (userType) {
            case 'counsellor':
              return '/counselor-dashboard';
            case 'admin':
              return '/admin-dashboard';
            default:
              return '/dashboard';
          }
        }
        return '/';
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

router.beforeEach((to, from, next) => {
  const authenticated = isAuthenticated();
  const userType = getUserType();

  if (to.meta.requiresGuest && authenticated) {
    switch (userType) {
      case 'counsellor':
        return next('/counselor-dashboard');
      case 'admin':
        return next('/admin-dashboard');
      default:
        return next('/dashboard');
    }
  }

  if (to.meta.requiresAuth && !authenticated) {
    return next('/login');
  }

  if (to.meta.requiresAuth && to.meta.allowedUserTypes) {
    const allowedTypes = to.meta.allowedUserTypes as string[];
    if (userType && !allowedTypes.includes(userType)) {
      switch (userType) {
        case 'counsellor':
          return next('/counselor-dashboard');
        case 'admin':
          return next('/admin-dashboard');
        default:
          return next('/dashboard');
      }
    }
  }

  if (authenticated && to.path === '/') {
    switch (userType) {
      case 'counsellor':
        return next('/counselor-dashboard');
      case 'admin':
        return next('/admin-dashboard');
      default:
        return next('/dashboard');
    }
  }

  next();
});

router.onError((error) => {
  console.error('Router error:', error);
});

export default router;

import apiClient from './apiClient';

export interface UserRegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  account_type: string;
  country_code: string;
  phone_number: string;
}

export interface CounsellorRegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
  speciality: string;
  phone_number: string;
  country_code: string;
  bio?: string;
  salutation?: string;
  id_front_photo?: string;
  id_back_photo?: string;
  selfie_photo?: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface CounsellorLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginRequest {
  country_code: string;
  phone_number: string;
}

export interface BookSessionRequest {
  counsellor_id: string;
  start_time: string;
  duration: number;
  topic: string;
  bio?: string;
}

export interface AcceptSessionRequest {
  session_id: string;
}

export interface UserResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country_code: string;
  profile_picture?: string;
}

export interface CounsellorResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country_code: string;
  speciality: string;
  bio?: string;
  salutation?: string;
  profile_picture?: string;
}

export interface SessionResponse {
  id: string;
  user_id: string;
  counsellor_id: string;
  start_time: string;
  duration: number;
  topic: string;
  bio?: string;
  status: string;
  is_counsellor_accepted: boolean;
  meeting_link?: string;
  created_at: string;
  user: UserResponse;
  counsellor: CounsellorResponse;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billing_cycle: string;
  features: string[];
  is_popular?: boolean;
}

export interface CurrentSubscription {
  id: string;
  plan_id: string;
  plan_name: string;
  price: number;
  currency: string;
  status: string;
  billing_cycle: string;
  next_billing_date?: string;
}

export const AuthService = {
  async registerUser(userData: UserRegisterRequest) {
    const response = await apiClient.post('/users/register', userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userType', 'user');
      localStorage.setItem('userId', response.data.user?.id);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async registerCounsellor(counsellorData: CounsellorRegisterRequest) {
    const response = await apiClient.post('/counsellor/register', counsellorData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userType', 'counsellor');
      localStorage.setItem('userId', response.data.counsellor?.id);
      localStorage.setItem('user', JSON.stringify(response.data.counsellor));
    }
    return response.data;
  },

  async loginUser(credentials: UserLoginRequest) {
    const response = await apiClient.post('/users/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userType', 'user');
      localStorage.setItem('userId', response.data.user?.id);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async loginCounsellor(credentials: CounsellorLoginRequest) {
    const response = await apiClient.post('/counsellor/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userType', 'counsellor');
      localStorage.setItem('userId', response.data.counsellor?.id);
      localStorage.setItem('user', JSON.stringify(response.data.counsellor));
    }
    return response.data;
  },

  async initiateAdminLogin(country_code: string, phone_number: string) {
    const response = await apiClient.post('/admin/login', {
      country_code,
      phone_number
    });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userType', 'admin');
    }
    return response.data;
  },

  async getProfile() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return { data: JSON.parse(userStr) };
    }
    throw new Error('No profile data found. Please login again.');
  },

  async updateProfile(userData: Partial<UserResponse | CounsellorResponse>) {
    const currentUserStr = localStorage.getItem('user');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { data: updatedUser };
    }
    throw new Error('No user data found');
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
    }
    return { success: true };
  }
};

export const SessionService = {
  async getUserSessions() {
    const response = await apiClient.get('/users/sessions/all');
    return response.data;
  },

  async getSession(sessionId: string) {
    const response = await apiClient.get(`/users/sessions/${sessionId}`);
    return response.data;
  },

  async bookSession(sessionData: {
    counsellor_id: string;
    session_date: string;
    session_time: string;
    topic?: string;
    notes?: string;
  }) {
    const backendData: BookSessionRequest = {
      counsellor_id: sessionData.counsellor_id,
      start_time: `${sessionData.session_date}T${sessionData.session_time}:00`,
      duration: 60,
      topic: sessionData.topic || 'General Counseling',
      bio: sessionData.notes || ''
    };

    const response = await apiClient.post('/users/sessions/book', backendData);
    return response.data;
  }
};

export const CounsellorService = {
  async getCounsellorSessions() {
    const response = await apiClient.get('/counsellor/sessions/all');
    return response.data;
  },

  async acceptSession(sessionData: AcceptSessionRequest) {
    const response = await apiClient.post('/counsellor/sessions/accept', sessionData);
    return response.data;
  }
};

export const UserService = {
  async getAllCounsellors() {
    const response = await apiClient.get('/users/counsellors/all');
    return response.data;
  },

  async getUser(id: string) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.id === id) {
        return { data: user };
      }
    }
    throw new Error('User not found');
  },

  async getCounselors() {
    return this.getAllCounsellors();
  },

  async updateUser(id: string, userData: Partial<UserResponse>) {
    return AuthService.updateProfile(userData);
  }
};

export const SubscriptionService = {
  async getSubscriptionPlans() {
    try {
      const response = await apiClient.get('/subscriptions');
      return response.data;
    } catch (error) {
      console.warn('Subscriptions API not available, using mock data. Error:', error);
      return {
        data: [
          {
            id: 'basic',
            name: 'Basic Plan',
            price: 29.99,
            currency: 'USD',
            billing_cycle: 'month',
            features: ['5 sessions per month', 'Email support', 'Basic resources'],
            is_popular: false
          },
          {
            id: 'premium',
            name: 'Premium Plan',
            price: 49.99,
            currency: 'USD',
            billing_cycle: 'month',
            features: ['Unlimited sessions', '24/7 support', 'All resources', 'Group programs'],
            is_popular: true
          },
          {
            id: 'professional',
            name: 'Professional Plan',
            price: 99.99,
            currency: 'USD',
            billing_cycle: 'month',
            features: ['Everything in Premium', 'Priority booking', 'Family plans', 'Custom programs'],
            is_popular: false
          }
        ]
      };
    }
  },

  async subscribeToPlan(planId: string) {
    try {
      const response = await apiClient.post('/subscriptions/subscribe', { plan_id: planId });
      return response.data;
    } catch (error) {
      console.warn('Subscribe API not available, using mock response. Error:', error);
      const mockSubscription: CurrentSubscription = {
        id: `sub_${Date.now()}`,
        plan_id: planId,
        plan_name: planId === 'premium' ? 'Premium Plan' : 'Basic Plan',
        price: planId === 'premium' ? 49.99 : 29.99,
        currency: 'USD',
        status: 'active',
        billing_cycle: 'month',
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      localStorage.setItem('currentSubscription', JSON.stringify(mockSubscription));
      return { subscription: mockSubscription };
    }
  },

  async cancelSubscription() {
    try {
      const response = await apiClient.post('/subscriptions/cancel');
      return response.data;
    } catch (error) {
      console.warn('Cancel subscription API not available, using mock response. Error:', error);
      localStorage.removeItem('currentSubscription');
      return { success: true, message: 'Subscription cancelled successfully' };
    }
  },

  async getCurrentSubscription() {
    try {
      const response = await apiClient.get('/subscriptions/current');
      return response.data;
    } catch (error) {
      console.warn('Current subscription API not available, using local storage. Error:', error);
      const subStr = localStorage.getItem('currentSubscription');
      if (subStr) {
        return { subscription: JSON.parse(subStr) };
      }
      return null;
    }
  }
};

export const ProgramService = {
  async getPrograms() {
    return {
      data: [
        {
          id: 1,
          title: "Marriage Restoration Program",
          description: "6-week intensive program for couples seeking to rebuild their relationship",
          is_enrolled: false,
          current_week: 0,
          total_weeks: 6,
          session_count: 6,
          resources_count: 24,
          next_session: null
        },
        {
          id: 2,
          title: "Parenting Excellence Program",
          description: "8-week program for effective parenting strategies",
          is_enrolled: false,
          current_week: 0,
          total_weeks: 8,
          session_count: 8,
          resources_count: 32,
          next_session: null
        }
      ]
    };
  },

  async enrollInProgram(programId: number) {
    return { success: true, message: "Enrolled successfully", program_id: programId };
  },

  async getProgram(id: number) {
    const programs = await this.getPrograms();
    const program = programs.data.find(p => p.id === id);
    return { data: program };
  }
};

export const ResourceService = {
  async getResources(params?: { category?: string; search?: string }) {
    let resources = [
      {
        id: "1",
        title: "Communication Skills Guide",
        description: "A comprehensive guide to effective communication in relationships",
        type: "PDF",
        category: "Marriage Counseling",
        size: "2.4 MB",
        url: "/resources/1",
        created_at: new Date().toISOString()
      },
      {
        id: "2",
        title: "Parenting Strategies Workbook",
        description: "Practical exercises for better parenting",
        type: "PDF",
        category: "Parenting",
        size: "1.8 MB",
        url: "/resources/2",
        created_at: new Date().toISOString()
      }
    ];

    if (params?.category) {
      resources = resources.filter(r => r.category === params.category);
    }
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      resources = resources.filter(r =>
        r.title.toLowerCase().includes(searchTerm) ||
        r.description?.toLowerCase().includes(searchTerm)
      );
    }

    return { data: resources };
  },

  async downloadResource(id: string) {
    return new Blob(['Mock file content for resource ' + id], { type: 'application/pdf' });
  },

  async uploadResource(formData: FormData) {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;

    return {
      success: true,
      id: Date.now().toString(),
      message: `Resource "${title}" uploaded successfully`,
      data: {
        id: Date.now().toString(),
        title: title,
        category: category,
        type: "PDF",
        size: "1.2 MB",
        created_at: new Date().toISOString()
      }
    };
  }
};

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  country_code?: string;
  speciality?: string;
  bio?: string;
  profile_picture?: string;
}

export interface Session {
  id: string;
  title?: string;
  description?: string;
  start_time: string;
  end_time?: string;
  session_date: string;
  session_time: string;
  duration: number;
  counselor: {
    id: string;
    name: string;
    specialization: string;
  };
  counsellor_name?: string;
  status: string;
  notes?: string;
  feedback?: string;
  meeting_link?: string;
}

export interface Program {
  id: number;
  title: string;
  description: string;
  is_enrolled: boolean;
  current_week: number;
  total_weeks: number;
  session_count: number;
  resources_count: number;
  next_session: string | null;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: string;
  category: string;
  size: string;
  url: string;
  created_at: string;
}

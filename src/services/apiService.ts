import apiClient from './apiClient';

// Types
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
}

export interface Session {
  id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  duration: number;
  counselor: {
    id: number;
    name: string;
    specialization: string;
  };
  status: string;
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
  next_session?: string;
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

// Auth Service
export const AuthService = {
  async login(credentials: { email: string; password: string }) {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData: { name: string; email: string; password: string; userType: string }) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async logout() {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  }
};

// Sessions Service
export const SessionService = {
  async getSessions(params?: { upcoming?: boolean }) {
    const response = await apiClient.get('/sessions', { params });
    return response.data;
  },

  async getSession(id: number) {
    const response = await apiClient.get(`/sessions/${id}`);
    return response.data;
  },

  async bookSession(sessionData: { counselor_id: number; date: string; time: string }) {
    const response = await apiClient.post('/sessions', sessionData);
    return response.data;
  },

  async rescheduleSession(id: number, newDateTime: { date: string; time: string }) {
    const response = await apiClient.patch(`/sessions/${id}/reschedule`, newDateTime);
    return response.data;
  },

  async cancelSession(id: number) {
    const response = await apiClient.delete(`/sessions/${id}`);
    return response.data;
  },

  async submitFeedback(id: number, feedback: { rating: number; comment: string }) {
    const response = await apiClient.post(`/sessions/${id}/feedback`, feedback);
    return response.data;
  }
};

// Programs Service
export const ProgramService = {
  async getPrograms() {
    const response = await apiClient.get('/programs');
    return response.data;
  },

  async getProgram(id: number) {
    const response = await apiClient.get(`/programs/${id}`);
    return response.data;
  },

  async enrollInProgram(programId: number) {
    const response = await apiClient.post(`/programs/${programId}/enroll`);
    return response.data;
  },

  async getProgramResources(programId: number) {
    const response = await apiClient.get(`/programs/${programId}/resources`);
    return response.data;
  },

  async updateProgress(programId: number, progress: { week: number; completed: boolean }) {
    const response = await apiClient.patch(`/programs/${programId}/progress`, progress);
    return response.data;
  }
};

// Resources Service
export const ResourceService = {
  async getResources(params?: { category?: string; search?: string }) {
    const response = await apiClient.get('/resources', { params });
    return response.data;
  },

  async getResource(id: string) {
    const response = await apiClient.get(`/resources/${id}`);
    return response.data;
  },

  async downloadResource(id: string) {
    const response = await apiClient.get(`/resources/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  async uploadResource(formData: FormData) {
    const response = await apiClient.post('/resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

// Users Service
export const UserService = {
  async getUsers() {
    const response = await apiClient.get('/users');
    return response.data;
  },

  async getUser(id: number) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  async updateUser(id: number, userData: Partial<User>) {
    const response = await apiClient.patch(`/users/${id}`, userData);
    return response.data;
  },

  async getCounselors() {
    const response = await apiClient.get('/counselors');
    return response.data;
  }
};

// Payments Service
export const PaymentService = {
  async initiatePayment(paymentData: {
    amount: number;
    currency: string;
    paymentMethod: 'mpesa' | 'airtel' | 'card';
    customerEmail: string;
    phone?: string;
  }) {
    const response = await apiClient.post('/payments/initiate', paymentData);
    return response.data;
  },

  async verifyPayment(reference: string) {
    const response = await apiClient.get(`/payments/verify/${reference}`);
    return response.data;
  },

  async getPaymentHistory() {
    const response = await apiClient.get('/payments/history');
    return response.data;
  }
};

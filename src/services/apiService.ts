import apiClient from './apiClient';
import type { Forum } from '@/types';

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
  user?: UserResponse | Partial<UserResponse> | {
    id?: string;
    user_id?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    country_code?: string;
  };
  counsellor: CounsellorResponse;
}

export interface SubscriptionPlan {
  id: string; // Frontend normalized ID (maps from backend ID)
  ID?: string; // Backend ID field (capitalized)
  name: string;
  description?: string;
  price: number;
  currency?: string;
  billing_cycle?: string;
  duration?: number;
  features?: string[];
  is_popular?: boolean;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
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

export interface ProgramResponse {
  id: string;
  name: string;
  topic: string;
  bio: string;
  start_time: string;
  counsellor_ids: string[];
  counsellors?: CounsellorResponse[];
  program_type: string;
  is_active: boolean;
  end_date: string;
  sub_programs?: SubProgramResponse[];
  created_at: string;
  updated_at: string;
}

export interface SubProgramResponse {
  id: string;
  program_id: string;
  name: string;
  bio: string;
  duration: number;
  meeting_link: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProgramRequest {
  name: string;
  topic: string;
  bio: string;
  start_time: string;
  counsellor_ids?: string[];
  program_type: string;
  end_date: string;
}

export interface UpdateProgramRequest {
  name?: string;
  topic?: string;
  bio?: string;
  start_time?: string;
  counsellor_ids?: string[];
  program_type?: string;
  is_active?: boolean;
  end_date?: string;
}

export interface CreateSubProgramRequest {
  program_id: string;
  name: string;
  bio: string;
  duration: number;
  meeting_link?: string;
}

export interface UpdateSubProgramRequest {
  name?: string;
  bio?: string;
  duration?: number;
  meeting_link?: string;
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
    // Client-side logout only (backend doesn't have logout endpoint)
    localStorage.clear();
    sessionStorage.clear();
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
    // Create a proper ISO 8601 datetime string with timezone
    const dateTimeString = `${sessionData.session_date}T${sessionData.session_time}:00`;
    const dateObj = new Date(dateTimeString);
    const isoString = dateObj.toISOString(); // This includes the 'Z' timezone

    const backendData: BookSessionRequest = {
      counsellor_id: sessionData.counsellor_id,
      start_time: isoString,
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
  },

  async getCounsellorPrograms() {
    const response = await apiClient.get('/counsellor/programs/all');
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
      const response = await apiClient.get('/users/subscriptions/all');
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
      // Validate planId before sending
      if (!planId || planId.trim() === '') {
        throw new Error('Plan ID is required');
      }

      // Backend expects plan_id (lowercase with underscore) in the request body
      const requestBody = { plan_id: planId };

      const response = await apiClient.post('/users/subscriptions/subscribe', requestBody);
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
      const response = await apiClient.post('/users/subscriptions/cancel');
      return response.data;
    } catch (error) {
      console.warn('Cancel subscription API not available, using mock response. Error:', error);
      localStorage.removeItem('currentSubscription');
      return { success: true, message: 'Subscription cancelled successfully' };
    }
  },

  async getCurrentSubscription() {
    try {
      const response = await apiClient.get('/users/subscriptions/current');
      if (!response.data) {
        return { subscription: null };
      }
      return response.data;
    } catch (error: any) {
      // Handle 404 as a valid case (no subscription) - don't treat as error
      if (error?.response?.status === 404) {
        return { subscription: null };
      }

      // For other errors, try localStorage fallback
      console.warn('Current subscription API error, checking local storage. Error:', error);
      const subStr = localStorage.getItem('currentSubscription');
      if (subStr) {
        try {
          return { subscription: JSON.parse(subStr) };
        } catch (parseError) {
          console.warn('Failed to parse subscription from localStorage');
        }
      }

      // Return null subscription for any other case
      return { subscription: null };
    }
  }
};

export const AdminService = {
  async login(email: string, password: string) {
    try {
      const response = await apiClient.post('/admin/login', { email, password });
      if (response.data.status && response.data.token) {
        // Clear any old tokens first to avoid conflicts
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('token');
        
        // Store admin token (this is the admin token with account_type: "admin")
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('admin_id', response.data.admin_id);
        
        // Store token expiration
        if (response.data.expires_in) {
          const expiresAt = Date.now() + (response.data.expires_in * 1000);
          localStorage.setItem('token_expires_at', expiresAt.toString());
        }
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in admin:', error);
      throw error;
    }
  },

  async inviteAdmin(adminData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    country_code?: string;
    phone_number?: string;
    is_super_admin?: boolean;
  }) {
    try {
      const response = await apiClient.post('/admin/invite', adminData);
      return response.data;
    } catch (error) {
      console.error('Error inviting admin:', error);
      throw error;
    }
  },

  async getAllAdmins() {
    try {
      const response = await apiClient.get('/admin/admins');
      return response.data;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  }
};

export const ForumService = {
  // Public endpoints
  async getPublishedForums(category?: string) {
    try {
      const url = category 
        ? `/forums?category=${category}`
        : '/forums';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      // If endpoint doesn't exist (404), return empty response instead of throwing
      if (error.response?.status === 404) {
        return {
          status: true,
          data: null,
          count: 0
        };
      }
      console.error('Error fetching published forums:', error);
      throw error;
    }
  },

  async getPublishedForumById(id: string) {
    try {
      const response = await apiClient.get(`/forums/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching published forum:', error);
      throw error;
    }
  },

  // Admin endpoints
  async getAllForums(status?: string) {
    try {
      const url = status 
        ? `/admin/forums?status=${status}`
        : '/admin/forums';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching all forums:', error);
      throw error;
    }
  },

  async getForumById(id: string) {
    try {
      const response = await apiClient.get(`/admin/forums/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching forum:', error);
      throw error;
    }
  },

  async createForum(forumData: Partial<Forum>) {
    try {
      // Convert date to ISO 8601 format if needed
      const data = { ...forumData };
      if (data.date && !data.date.includes('T')) {
        // If date is just a date string, convert to ISO datetime
        const dateTime = data.time 
          ? `${data.date}T${data.time}:00`
          : `${data.date}T00:00:00`;
        const dateObj = new Date(dateTime);
        data.date = dateObj.toISOString();
      }
      
      const response = await apiClient.post('/admin/forums', data);
      return response.data;
    } catch (error) {
      console.error('Error creating forum:', error);
      throw error;
    }
  },

  async updateForum(id: string, forumData: Partial<Forum>) {
    try {
      // Convert date to ISO 8601 format if needed
      const data = { ...forumData };
      if (data.date && !data.date.includes('T')) {
        const dateTime = data.time 
          ? `${data.date}T${data.time}:00`
          : `${data.date}T00:00:00`;
        const dateObj = new Date(dateTime);
        data.date = dateObj.toISOString();
      }
      
      const response = await apiClient.put(`/admin/forums/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating forum:', error);
      throw error;
    }
  },

  async publishForum(id: string) {
    try {
      const response = await apiClient.post(`/admin/forums/${id}/publish`);
      return response.data;
    } catch (error) {
      console.error('Error publishing forum:', error);
      throw error;
    }
  },

  async unpublishForum(id: string) {
    try {
      const response = await apiClient.post(`/admin/forums/${id}/unpublish`);
      return response.data;
    } catch (error) {
      console.error('Error unpublishing forum:', error);
      throw error;
    }
  },

  async uploadVideo(id: string, videoFile: File) {
    try {
      const formData = new FormData();
      formData.append('file', videoFile);

      const response = await apiClient.post(`/admin/forums/${id}/video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },

  async deleteForum(id: string) {
    try {
      const response = await apiClient.delete(`/admin/forums/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting forum:', error);
      throw error;
    }
  }
};

export const ProgramService = {
  // User endpoints
  async getUserPrograms() {
    try {
      const response = await apiClient.get('/users/programs/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching user programs:', error);
      throw error;
    }
  },

  async getUserProgram(programId: string) {
    try {
      const response = await apiClient.get(`/users/programs/${programId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user program:', error);
      throw error;
    }
  },

  async getUserProgramsByType(type: string) {
    try {
      const response = await apiClient.get(`/users/programs/by-type?type=${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching programs by type:', error);
      throw error;
    }
  },

  async getUserSubProgram(subProgramId: string) {
    try {
      const response = await apiClient.get(`/users/programs/subprograms/${subProgramId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sub-program:', error);
      throw error;
    }
  },

  // Counsellor endpoints
  async getCounsellorPrograms() {
    try {
      const response = await apiClient.get('/counsellor/programs/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching counsellor programs:', error);
      throw error;
    }
  },

  async getCounsellorProgram(programId: string) {
    try {
      const response = await apiClient.get(`/counsellor/programs/${programId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching counsellor program:', error);
      throw error;
    }
  },

  async createProgram(programData: CreateProgramRequest) {
    try {
      const response = await apiClient.post('/counsellor/programs', programData);
      return response.data;
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  },

  async updateProgram(programId: string, programData: UpdateProgramRequest) {
    try {
      const response = await apiClient.put(`/counsellor/programs/${programId}`, programData);
      return response.data;
    } catch (error) {
      console.error('Error updating program:', error);
      throw error;
    }
  },

  async deleteProgram(programId: string) {
    try {
      const response = await apiClient.delete(`/counsellor/programs/${programId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting program:', error);
      throw error;
    }
  },

  // Sub-program endpoints
  async createSubProgram(subProgramData: CreateSubProgramRequest) {
    try {
      const response = await apiClient.post('/counsellor/programs/subprograms', subProgramData);
      return response.data;
    } catch (error) {
      console.error('Error creating sub-program:', error);
      throw error;
    }
  },

  async getSubProgramsByProgramId(programId: string) {
    try {
      const response = await apiClient.get(`/counsellor/programs/${programId}/subprograms`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sub-programs:', error);
      throw error;
    }
  },

  async updateSubProgram(subProgramId: string, subProgramData: UpdateSubProgramRequest) {
    try {
      const response = await apiClient.put(`/counsellor/programs/subprograms/${subProgramId}`, subProgramData);
      return response.data;
    } catch (error) {
      console.error('Error updating sub-program:', error);
      throw error;
    }
  },

  async deleteSubProgram(subProgramId: string) {
    try {
      const response = await apiClient.delete(`/counsellor/programs/subprograms/${subProgramId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting sub-program:', error);
      throw error;
    }
  },

  // Legacy methods for backward compatibility
  async getPrograms() {
    const userType = localStorage.getItem('userType');
    if (userType === 'counsellor') {
      return this.getCounsellorPrograms();
    }
    return this.getUserPrograms();
  },

  async getProgram(id: string) {
    const userType = localStorage.getItem('userType');
    if (userType === 'counsellor') {
      return this.getCounsellorProgram(id);
    }
    return this.getUserProgram(id);
  },

  // Note: enrollInProgram is not yet implemented on backend
  async enrollInProgram(programId: number) {
    console.warn('enrollInProgram not yet implemented on backend');
    return { success: true, message: "Enrolled successfully", program_id: programId };
  }
};

export const ResourceService = {
  // Counsellor endpoints
  async getCounsellorResources(params?: { category?: string; search?: string }) {
    const response = await apiClient.get('/counsellor/resources/all', {
      params: params
    });
    return response.data;
  },

  async getCounsellorResource(resourceId: string) {
    const response = await apiClient.get(`/counsellor/resources/${resourceId}`);
    return response.data;
  },

  async createCounsellorResource(formData: FormData) {
    // Don't set Content-Type header - axios will set it automatically with boundary for FormData
    const response = await apiClient.post('/counsellor/resources', formData, {
      headers: {
        'Content-Type': undefined // Remove default Content-Type to let axios set multipart/form-data with boundary
      },
      transformRequest: [(data) => data] // Prevent axios from transforming FormData
    });
    return response.data;
  },

  async updateCounsellorResource(resourceId: string, formData: FormData) {
    // Don't set Content-Type header - axios will set it automatically with boundary for FormData
    const response = await apiClient.put(`/counsellor/resources/${resourceId}`, formData, {
      headers: {
        'Content-Type': undefined // Remove default Content-Type to let axios set multipart/form-data with boundary
      },
      transformRequest: [(data) => data] // Prevent axios from transforming FormData
    });
    return response.data;
  },

  async deleteCounsellorResource(resourceId: string) {
    const response = await apiClient.delete(`/counsellor/resources/${resourceId}`);
    return response.data;
  },

  async downloadCounsellorResource(resourceId: string) {
    // Try download endpoint first, fallback to resource endpoint if it doesn't exist
    try {
      const response = await apiClient.get(`/counsellor/resources/${resourceId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (err: any) {
      // If download endpoint doesn't exist (404), try the resource endpoint
      // The resource endpoint might return the file directly
      if (err?.response?.status === 404) {
        const response = await apiClient.get(`/counsellor/resources/${resourceId}`, {
          responseType: 'blob'
        });
        // If response.data is a Blob, return it; otherwise check response.data.data
        if (response.data instanceof Blob) {
          return response.data;
        }
        // If the response is wrapped, try to extract the blob
        if (response.data?.data instanceof Blob) {
          return response.data.data;
        }
        throw new Error('Resource file not found in response');
      }
      throw err;
    }
  },

  // User endpoints
  async getUserResources(params?: { category?: string; search?: string }) {
    const response = await apiClient.get('/users/resources/all', {
      params: params
    });
    return response.data;
  },

  async getUserResource(resourceId: string) {
    const response = await apiClient.get(`/users/resources/${resourceId}`);
    // Handle different response structures
    if (response.data) {
      return response.data;
    }
    return response;
  },

  async downloadUserResource(filename: string) {
    const response = await apiClient.get(`/users/resources/download/${filename}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Legacy methods for backward compatibility
  async getResources(params?: { category?: string; search?: string }) {
    const userType = localStorage.getItem('userType');
    if (userType === 'counsellor') {
      return this.getCounsellorResources(params);
    }
    return this.getUserResources(params);
  },

  async downloadResource(id: string) {
    // For users, we need to get the resource first to get the filename
    const userType = localStorage.getItem('userType');
    if (userType === 'counsellor') {
      return this.downloadCounsellorResource(id);
    } else {
      // Users use the download endpoint with filename
      const resourceResponse = await this.getUserResource(id);

      // Handle different response structures to extract filename
      let filename: string | undefined;

      // Extract resource data from response
      let resourceData: any = resourceResponse;
      if (resourceResponse?.data) {
        resourceData = resourceResponse.data;
      } else if (resourceResponse?.resource) {
        resourceData = resourceResponse.resource;
      }

      // Try different possible locations for filename
      if (resourceData) {
        // Priority 1: Direct filename field (most common)
        filename = resourceData.filename || resourceData.file_name || resourceData.file;

        // Priority 2: Extract from url field
        if (!filename && resourceData.url) {
          // Extract filename from URL (e.g., "/resources/filename.pdf" or "filename.pdf")
          const urlParts = resourceData.url.split('/');
          const lastPart = urlParts[urlParts.length - 1];
          // Remove query parameters if any
          if (lastPart && lastPart !== '') {
            filename = lastPart.split('?')[0];
          }
        }

        // Priority 3: Check if there's a file_path or storage_path
        if (!filename && resourceData.file_path) {
          const pathParts = resourceData.file_path.split('/');
          filename = pathParts[pathParts.length - 1];
        }

        if (!filename && resourceData.storage_path) {
          const pathParts = resourceData.storage_path.split('/');
          filename = pathParts[pathParts.length - 1];
        }
      }

      // If we still don't have a filename, log the resource structure for debugging
      if (!filename) {
        console.error('Could not extract filename from resource. Available fields:', {
          resourceResponse,
          resourceData,
          resourceDataKeys: resourceData ? Object.keys(resourceData) : [],
          id
        });
        throw new Error('Could not determine filename for resource download. Resource may not have a filename field.');
      }

      // Ensure filename doesn't contain the full path
      filename = filename.split('/').pop() || filename;

      return this.downloadUserResource(filename);
    }
  },

  async uploadResource(formData: FormData) {
    return this.createCounsellorResource(formData);
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
  topic?: string;
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
  user?: {
    id?: string;
    user_id?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    country_code?: string;
  };
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

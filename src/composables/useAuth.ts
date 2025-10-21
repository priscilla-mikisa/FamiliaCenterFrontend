import { ref } from 'vue';
import apiClient from '@/services/apiClient';
import { TokenManager, type UserData } from '@/services/tokenManager';

interface SignUpData {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone_number: string;
  country_code: string;
  userRole: 'patient' | 'counselor';
  account_type: string;
  specialization?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
  userType?: 'user' | 'counselor' | 'admin';
}

interface ApiResponse {
  data: {
    token?: string;
    user?: UserData;
    counsellor?: UserData;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

const toUserData = (data: unknown): UserData => {
  if (typeof data === 'object' && data !== null) {
    return data as UserData;
  }
  return {};
};

export const useAuth = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);
  const user = ref<UserData | null>(null);

  const signUp = async (userData: SignUpData) => {
    isLoading.value = true;
    error.value = null;
    success.value = null;

    try {
      let endpoint: string;
      const payload: {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        confirmPassword: string;
        phone_number: string;
        country_code: string;
        speciality?: string;
        bio?: string;
        salutation?: string;
        account_type?: string;
      } = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        phone_number: userData.phone_number,
        country_code: userData.country_code,
      };

      if (userData.userRole === 'counselor') {
        endpoint = '/counsellor/register';
        payload.speciality = userData.specialization || 'General Counseling';
        payload.bio = '';
        payload.salutation = '';
      } else {
        endpoint = '/users/register';
        payload.account_type = userData.account_type;
      }

      const response: ApiResponse = await apiClient.post(endpoint, payload);

      if (response.data.token) {
        const userType = userData.userRole === 'counselor' ? 'counsellor' : 'user';
        const userInfo = toUserData(response.data.user || response.data.counsellor);

        TokenManager.storeToken(response.data.token, userInfo, userType, true);
        user.value = userInfo;
        success.value = `${userType === 'counsellor' ? 'Counsellor' : 'User'} account created successfully!`;
      }

      return response.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message || 'Registration failed';
      } else {
        error.value = 'Registration failed';
      }
      throw new Error(error.value);
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true;
    error.value = null;

    try {
      const userType = credentials.userType || 'user';
      let endpoint: string;
      const payload = {
        email: credentials.username,
        password: credentials.password
      };

      if (userType === 'counselor') {
        endpoint = '/counsellor/auth/login';
      } else if (userType === 'admin') {
        error.value = 'Admin login requires phone number and OTP.';
        throw new Error(error.value);
      } else {
        endpoint = '/users/auth/login';
      }

      const response: ApiResponse = await apiClient.post(endpoint, payload);

      if (response.data.token) {
        const userInfo = toUserData(response.data.user || response.data.counsellor);
        const actualUserType = userType === 'counselor' ? 'counsellor' : 'user';

        TokenManager.storeToken(
          response.data.token,
          userInfo,
          actualUserType,
          credentials.rememberMe || false
        );

        user.value = userInfo;
        success.value = 'Login successful!';

        return {
          token: response.data.token,
          user: userInfo,
          userType: actualUserType
        };
      } else {
        throw new Error('No authentication token received');
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message || 'Login failed';
      } else {
        error.value = 'Login failed';
      }
      throw new Error(error.value);
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;
    try {
      await apiClient.post('/auth/logout').catch(() => {
        console.log('Logout API call failed, but continuing...');
      });
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      TokenManager.clearTokens();
      user.value = null;
      success.value = 'Logged out successfully!';
      isLoading.value = false;
    }
  };

  const getProfile = async () => {
    try {
      const userDataStr = localStorage.getItem('user');
      if (userDataStr) {
        const userData: UserData = JSON.parse(userDataStr);
        user.value = userData;
        return { data: userData };
      } else {
        throw new Error('No user profile found. Please login again.');
      }
    } catch (err) {
      console.error('Failed to get profile:', err);
      throw err;
    }
  };

  const updateProfile = async (userData: UserData) => {
    try {
      const currentUser: UserData = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      user.value = updatedUser;
      return { data: updatedUser };
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  };

  const isAuthenticated = (): boolean => {
    const authStatus = TokenManager.getAuthStatus();
    return authStatus.isAuthenticated;
  };

  const getUserType = (): string | null => {
    const authStatus = TokenManager.getAuthStatus();
    return authStatus.userType;
  };

  const getUserId = (): string | null => {
    const authStatus = TokenManager.getAuthStatus();
    return authStatus.userId;
  };

  const checkSessionStatus = () => {
    const authStatus = TokenManager.getAuthStatus();

    if (!authStatus.isAuthenticated && authStatus.wasRemembered) {
      return { sessionExpired: true, userType: authStatus.userType };
    }

    return { sessionExpired: false, userType: null };
  };

  const getTokenExpiryInfo = () => {
    const token = TokenManager.getValidToken();
    if (!token) return null;

    const tokenInfo = TokenManager.getTokenInfo(token);
    if (!tokenInfo) return null;

    const hoursUntilExpiry = tokenInfo.timeUntilExpiry / 3600;
    const minutesUntilExpiry = tokenInfo.timeUntilExpiry / 60;

    return {
      expiresAt: new Date(tokenInfo.expiresAt * 1000),
      hoursUntilExpiry,
      minutesUntilExpiry,
      isExpiringSoon: hoursUntilExpiry < 1, 
      timeUntilExpiry: tokenInfo.timeUntilExpiry
    };
  };

  const clearMessages = () => {
    error.value = null;
    success.value = null;
  };

  return {
    isLoading,
    error,
    success,
    user,
    signUp,
    login,
    logout,
    getProfile,
    updateProfile,
    isAuthenticated,
    getUserType,
    getUserId,
    checkSessionStatus,
    getTokenExpiryInfo,
    clearMessages
  };
};

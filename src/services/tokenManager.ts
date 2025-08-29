// src/services/tokenManager.ts - New file to handle token lifecycle
export interface TokenInfo {
  token: string;
  expiresAt: number;
  isExpired: boolean;
  timeUntilExpiry: number;
}

export class TokenManager {
  private static readonly TOKEN_KEYS = {
    AUTH_TOKEN: 'authToken',
    TOKEN: 'token',
    REMEMBER_ME: 'rememberMe',
    USER_TYPE: 'userType',
    USER_ID: 'userId',
    USER: 'user'
  };

  // Check if a JWT token is expired (with buffer)
  static isTokenExpired(token: string, bufferMinutes: number = 2): boolean {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const tokenData = JSON.parse(decodedPayload);
      const currentTime = Math.floor(Date.now() / 1000);
      const bufferSeconds = bufferMinutes * 60;

      return tokenData.exp <= (currentTime + bufferSeconds);
    } catch (error) {
      console.error('Error parsing token:', error);
      return true; // Assume expired if we can't parse it
    }
  }

  // Get token info including expiry status
  static getTokenInfo(token: string): TokenInfo | null {
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const tokenData = JSON.parse(decodedPayload);
      const currentTime = Math.floor(Date.now() / 1000);

      return {
        token,
        expiresAt: tokenData.exp,
        isExpired: tokenData.exp <= currentTime,
        timeUntilExpiry: tokenData.exp - currentTime
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      return null;
    }
  }

  // Get valid token from storage
  static getValidToken(): string | null {
    const tokenSources = [
      () => localStorage.getItem(this.TOKEN_KEYS.AUTH_TOKEN),
      () => localStorage.getItem(this.TOKEN_KEYS.TOKEN),
      () => sessionStorage.getItem(this.TOKEN_KEYS.AUTH_TOKEN),
      () => sessionStorage.getItem(this.TOKEN_KEYS.TOKEN)
    ];

    for (const getToken of tokenSources) {
      const token = getToken();
      if (token && !this.isTokenExpired(token)) {
        return token;
      }
    }

    return null;
  }

  // Store token properly based on remember me preference
  static storeToken(token: string, userData: any, userType: string, rememberMe: boolean = false) {
    console.log('Storing token with rememberMe:', rememberMe);

    // Clear any existing tokens first
    this.clearTokens();

    // Store based on remember me preference
    if (rememberMe) {
      localStorage.setItem(this.TOKEN_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(this.TOKEN_KEYS.REMEMBER_ME, 'true');
    } else {
      sessionStorage.setItem(this.TOKEN_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(this.TOKEN_KEYS.REMEMBER_ME, 'false');
    }

    // Always store user data in localStorage for persistence
    localStorage.setItem(this.TOKEN_KEYS.USER_TYPE, userType);
    localStorage.setItem(this.TOKEN_KEYS.USER_ID, userData?.id || '');
    localStorage.setItem(this.TOKEN_KEYS.USER, JSON.stringify(userData));

    // Log token expiry time for debugging
    const tokenInfo = this.getTokenInfo(token);
    if (tokenInfo) {
      const expiryDate = new Date(tokenInfo.expiresAt * 1000);
      console.log('Token will expire at:', expiryDate.toISOString());
      console.log('Time until expiry (hours):', tokenInfo.timeUntilExpiry / 3600);
    }
  }

  // Clear all authentication tokens and data
  static clearTokens() {
    Object.values(this.TOKEN_KEYS).forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  // Check if user previously chose "remember me"
  static wasRememberMeSelected(): boolean {
    return localStorage.getItem(this.TOKEN_KEYS.REMEMBER_ME) === 'true';
  }

  // Get user authentication status
  static getAuthStatus() {
    const token = this.getValidToken();
    const userType = localStorage.getItem(this.TOKEN_KEYS.USER_TYPE);
    const userId = localStorage.getItem(this.TOKEN_KEYS.USER_ID);
    const wasRemembered = this.wasRememberMeSelected();

    return {
      isAuthenticated: !!token,
      userType,
      userId,
      wasRemembered,
      tokenInfo: token ? this.getTokenInfo(token) : null
    };
  }

  // Handle expired tokens gracefully
  static handleExpiredToken() {
    console.warn('Token expired, clearing auth data');

    const wasRemembered = this.wasRememberMeSelected();
    const userType = localStorage.getItem(this.TOKEN_KEYS.USER_TYPE);

    // Clear expired tokens
    this.clearTokens();

    // If user had "remember me" selected, redirect to login with a message
    if (wasRemembered) {
      console.log('User had remember me selected, will show session expired message');

      // Store a flag to show "session expired" message
      sessionStorage.setItem('sessionExpired', 'true');
      sessionStorage.setItem('previousUserType', userType || '');
    }

    // Redirect to login
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  // Check if we should show session expired message
  static shouldShowSessionExpiredMessage(): { show: boolean; userType: string } {
    const sessionExpired = sessionStorage.getItem('sessionExpired') === 'true';
    const previousUserType = sessionStorage.getItem('previousUserType') || '';

    if (sessionExpired) {
      // Clear the flags
      sessionStorage.removeItem('sessionExpired');
      sessionStorage.removeItem('previousUserType');
    }

    return {
      show: sessionExpired,
      userType: previousUserType
    };
  }
}

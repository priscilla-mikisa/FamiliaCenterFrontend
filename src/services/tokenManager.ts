export interface TokenInfo {
  token: string;
  expiresAt: number;
  isExpired: boolean;
  timeUntilExpiry: number;
}

export interface UserData {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  country_code?: string;
  speciality?: string;
  bio?: string;
  profile_picture?: string;
  salutation?: string;
}

export interface AuthStatus {
  isAuthenticated: boolean;
  userType: string | null;
  userId: string | null;
  wasRemembered: boolean;
  tokenInfo: TokenInfo | null;
}

export interface SessionExpiredInfo {
  show: boolean;
  userType: string;
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
      return true;
    }
  }

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

  static storeToken(token: string, userData: UserData, userType: string, rememberMe: boolean = false) {
    console.log('Storing token with rememberMe:', rememberMe);

    this.clearTokens();

    if (rememberMe) {
      localStorage.setItem(this.TOKEN_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(this.TOKEN_KEYS.REMEMBER_ME, 'true');
    } else {
      sessionStorage.setItem(this.TOKEN_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(this.TOKEN_KEYS.REMEMBER_ME, 'false');
    }

    localStorage.setItem(this.TOKEN_KEYS.USER_TYPE, userType);
    localStorage.setItem(this.TOKEN_KEYS.USER_ID, userData?.id || '');
    localStorage.setItem(this.TOKEN_KEYS.USER, JSON.stringify(userData));

    const tokenInfo = this.getTokenInfo(token);
    if (tokenInfo) {
      const expiryDate = new Date(tokenInfo.expiresAt * 1000);
      console.log('Token will expire at:', expiryDate.toISOString());
      console.log('Time until expiry (hours):', tokenInfo.timeUntilExpiry / 3600);
    }
  }

  static clearTokens() {
    Object.values(this.TOKEN_KEYS).forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  static wasRememberMeSelected(): boolean {
    return localStorage.getItem(this.TOKEN_KEYS.REMEMBER_ME) === 'true';
  }

  static getAuthStatus(): AuthStatus {
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

  static handleExpiredToken() {
    console.warn('Token expired, clearing auth data');

    const wasRemembered = this.wasRememberMeSelected();
    const userType = localStorage.getItem(this.TOKEN_KEYS.USER_TYPE);

    this.clearTokens();

    if (wasRemembered) {
      console.log('User had remember me selected, will show session expired message');

      sessionStorage.setItem('sessionExpired', 'true');
      sessionStorage.setItem('previousUserType', userType || '');
    }

    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  static shouldShowSessionExpiredMessage(): SessionExpiredInfo {
    const sessionExpired = sessionStorage.getItem('sessionExpired') === 'true';
    const previousUserType = sessionStorage.getItem('previousUserType') || '';

    if (sessionExpired) {
      sessionStorage.removeItem('sessionExpired');
      sessionStorage.removeItem('previousUserType');
    }

    return {
      show: sessionExpired,
      userType: previousUserType
    };
  }

  static getTokenExpiryInfo(): {
    expiresAt: Date;
    hoursUntilExpiry: number;
    minutesUntilExpiry: number;
    isExpiringSoon: boolean;
    timeUntilExpiry: number;
  } | null {
    const token = this.getValidToken();
    if (!token) return null;

    const tokenInfo = this.getTokenInfo(token);
    if (!tokenInfo) return null;

    const hoursUntilExpiry = tokenInfo.timeUntilExpiry / 3600;
    const minutesUntilExpiry = tokenInfo.timeUntilExpiry / 60;
    const isExpiringSoon = hoursUntilExpiry < 1; 

    return {
      expiresAt: new Date(tokenInfo.expiresAt * 1000),
      hoursUntilExpiry,
      minutesUntilExpiry,
      isExpiringSoon,
      timeUntilExpiry: tokenInfo.timeUntilExpiry
    };
  }
}

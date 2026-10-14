import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserSummary, LoginRequest, RegisterRequest } from '../types/auth';
import { authApi } from '../api/authApi';

interface AuthContextType {
  user: UserSummary | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<UserSummary>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSummary | null>(() => {
    const savedUser = localStorage.getItem('fitcorp_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate session on mount
  useEffect(() => {
    const token = localStorage.getItem('fitcorp_access_token');
    if (token) {
      authApi
        .getMe()
        .then((res) => {
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('fitcorp_user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          // Token might have failed or expired; clear if refresh fails
          const refreshToken = localStorage.getItem('fitcorp_refresh_token');
          if (!refreshToken) {
            setUser(null);
            localStorage.removeItem('fitcorp_access_token');
            localStorage.removeItem('fitcorp_refresh_token');
            localStorage.removeItem('fitcorp_user');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      const authData = response.data;
      localStorage.setItem('fitcorp_access_token', authData.accessToken);
      localStorage.setItem('fitcorp_refresh_token', authData.refreshToken);
      localStorage.setItem('fitcorp_user', JSON.stringify(authData.user));
      setUser(authData.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(credentials);
      const authData = response.data;
      localStorage.setItem('fitcorp_access_token', authData.accessToken);
      localStorage.setItem('fitcorp_refresh_token', authData.refreshToken);
      localStorage.setItem('fitcorp_user', JSON.stringify(authData.user));
      setUser(authData.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('fitcorp_refresh_token');
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('fitcorp_access_token');
      localStorage.removeItem('fitcorp_refresh_token');
      localStorage.removeItem('fitcorp_user');
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((updatedData: Partial<UserSummary>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('fitcorp_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isAdmin = Boolean(user?.roles?.includes('ROLE_ADMIN'));

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, AuthResponse } from '../types';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  unreadCount: number;
  login: (credentials: { email: string; password: string }) => Promise<AuthResponse>;
  register: (data: { name: string; email: string; password: string; phone?: string; college?: string }) => Promise<AuthResponse>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  refreshUnreadCount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const refreshUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch {
      // Ignore count fetch failures gracefully
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      refreshUnreadCount();
      const interval = setInterval(refreshUnreadCount, 30000); // Poll unread count every 30s
      return () => clearInterval(interval);
    }
    setUnreadCount(0);
    return undefined;
  }, [token, refreshUnreadCount]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const saveAuthSession = (authData: AuthResponse) => {
    const userData: User = {
      id: authData.id,
      name: authData.name,
      email: authData.email,
      role: authData.role,
      college: authData.college,
      profileImage: authData.profileImage,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authData.token);
    setUser(userData);
  };

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      saveAuthSession(response);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; college?: string }) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      saveAuthSession(response);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setUnreadCount(0);
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        unreadCount,
        login,
        register,
        logout,
        updateUser,
        refreshUnreadCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

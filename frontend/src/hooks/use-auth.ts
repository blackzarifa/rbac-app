'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';

export function useAuth() {
  const { setLoading, login, logout, isAuthenticated, user, token } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      if (token && !user) {
        setLoading(true);
        try {
          const userProfile = await authService.getProfile();
          login(userProfile, token);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          logout();
        } finally {
          setLoading(false);
        }
      }
    };

    initAuth();
  }, [token, user, setLoading, login, logout]);

  return {
    isAuthenticated,
    user,
    logout,
  };
}

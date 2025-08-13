import { useState, useEffect } from 'react';
import { User } from '@/types/task';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (): Promise<boolean> => {
    setLoading(true);
    try {
      // Mock authentication - in a real app this would connect to Firebase Auth
      const mockUser: User = {
        id: '1',
        email: 'user@example.com',
        name: 'Demo User',
      };
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
  };

  return {
    user,
    loading,
    signIn,
    signOut,
  };
}
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  CustomerUser, 
  getStoredCustomer, 
  fetchActiveCustomer, 
  loginCustomer, 
  registerCustomer, 
  logoutCustomer,
  updateStoredCustomer
} from '@/lib/auth';

interface AuthContextType {
  user: CustomerUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (patch: Partial<CustomerUser>) => CustomerUser | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize from local storage first for instant UI response
    const cached = getStoredCustomer();
    if (cached) {
      setUser(cached);
    }

    // Refresh from backend
    fetchActiveCustomer()
      .then((active) => {
        if (active) {
          setUser(active);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await loginCustomer(email, password);
    if (res.success && res.user) {
      setUser(res.user);
    }
    setIsLoading(false);
    return res;
  };

  const handleRegister = async (input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    setIsLoading(true);
    const res = await registerCustomer(input);
    if (res.success && res.user) {
      setUser(res.user);
    }
    setIsLoading(false);
    return res;
  };

  const handleUpdateProfile = (patch: Partial<CustomerUser>) => {
    const updated = updateStoredCustomer(patch);
    if (updated) {
      setUser(updated);
    }
    return updated;
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await logoutCustomer();
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        updateProfile: handleUpdateProfile,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

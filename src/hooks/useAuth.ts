'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import type { AuthUser } from '@/lib/auth';
import { getCurrentUser, signIn, signUp, signOut } from '@/lib/auth';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser | null>;
  signUp: (email: string, password: string, userData?: any) => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
        console.log('Initial session user:', user);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          const user = await getCurrentUser();
          setUser(user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    console.log('handleSignIn called with:', email);
    try {
      const result = await signIn(email, password);
      console.log('signIn result:', result);
      
      // For mock authentication, the result already contains the user
      if (result && result.user) {
        const user = result.user as AuthUser;
        console.log('Using user from signIn result:', user);
        setUser(user);
        return user;
      }
      
      // For real Supabase, get the user from the database
      const user = await getCurrentUser();
      console.log('getCurrentUser after signIn:', user);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Error in handleSignIn:', error);
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, userData?: any) => {
    console.log('handleSignUp called with:', email, userData);
    try {
      const result = await signUp(email, password, userData);
      console.log('signUp result:', result);
      
      // For mock authentication, the result already contains the user
      if (result && result.user) {
        const user = result.user as AuthUser;
        console.log('Using user from signUp result:', user);
        setUser(user);
        return user;
      }
      
      // For real Supabase, get the user from the database
      const user = await getCurrentUser();
      console.log('getCurrentUser after signUp:', user);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Error in handleSignUp:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  const contextValue = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return React.createElement(AuthContext.Provider, { value: contextValue }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

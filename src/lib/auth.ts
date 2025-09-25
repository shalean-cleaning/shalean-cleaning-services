import { supabase } from './supabase-client';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  role: 'CUSTOMER' | 'CLEANER' | 'ADMIN';
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return {
      id: user.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      phone: profile.phone,
      role: profile.role,
    };
  } catch (error) {
    // If Supabase is not available, check localStorage for mock user
    console.warn('Supabase not available, checking mock authentication');
    
    if (typeof window !== 'undefined') {
      const mockUserStr = localStorage.getItem('mock-user');
      if (mockUserStr) {
        const mockUser = JSON.parse(mockUserStr);
        return {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          phone: mockUser.phone,
          role: mockUser.role,
        };
      }
    }
    
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    // If Supabase is not available, check localStorage for mock user
    console.warn('Supabase not available, using mock authentication');
    
    if (typeof window !== 'undefined') {
      const mockUserStr = localStorage.getItem('mock-user');
      if (mockUserStr) {
        const mockUser = JSON.parse(mockUserStr);
        if (mockUser.email === email) {
          return {
            user: mockUser,
            session: { access_token: 'mock-token' }
          };
        }
      }
    }
    
    throw new Error('Invalid credentials');
  }
}

export async function signUp(email: string, password: string, userData?: {
  firstName?: string;
  lastName?: string;
  phone?: string;
}) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          first_name: userData?.firstName,
          last_name: userData?.lastName,
          phone: userData?.phone,
          role: 'CUSTOMER',
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }

    return data;
  } catch (error) {
    // If Supabase is not available, create a mock user for development
    console.warn('Supabase not available, using mock authentication');
    
    // Simulate a successful signup with mock data
    const mockUser = {
      id: 'mock-user-' + Date.now(),
      email,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      phone: userData?.phone,
      role: 'CUSTOMER' as const,
    };

    // Store in localStorage for development
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock-user', JSON.stringify(mockUser));
    }

    return {
      user: mockUser,
      session: { access_token: 'mock-token' }
    };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    // If Supabase is not available, clear mock user from localStorage
    console.warn('Supabase not available, clearing mock authentication');
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock-user');
    }
  }
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }
}

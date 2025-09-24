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
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signUp(email: string, password: string, userData?: {
  firstName?: string;
  lastName?: string;
  phone?: string;
}) {
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
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
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

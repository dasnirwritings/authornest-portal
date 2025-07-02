import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

// Define the shape of the user profile object for TypeScript
interface UserProfile {
    id: string;
    instance_id: string;
    full_name: string;
    role: string;
    email: string;
    bio: string;
    genre: string;
    theme_preference: string;
}

// Define the shape of the context value
interface UserContextType {
    userProfile: UserProfile | null;
    loading: boolean;
    fetchUserProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data) {
        setUserProfile(data);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUserProfile();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          fetchUserProfile();
        } else if (event === 'SIGNED_OUT') {
          setUserProfile(null);
        }
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const value = { userProfile, loading, fetchUserProfile };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

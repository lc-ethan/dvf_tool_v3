import React from 'react';
import { signIn, signOut, getCurrentUser, changePassword, type Profile } from '../utils/supabase';

interface AuthProps {
  children: React.ReactNode;
}

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProps) {
  const [user, setUser] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const user = await getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    user,
    loading,
    signIn: async (email: string, password: string) => {
      await signIn(email, password);
      await checkUser();
    },
    signOut: async () => {
      await signOut();
      setUser(null);
    },
    changePassword: async (newPassword: string) => {
      await changePassword(newPassword);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
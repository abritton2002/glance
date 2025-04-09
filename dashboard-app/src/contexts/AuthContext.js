import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; // Use REACT_APP_ prefix
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY; // Use REACT_APP_ prefix
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an existing session
    const session = supabase.auth.session();
    setUser(session?.user ?? null);
    setLoading(false);

    // Listen for changes to the auth state
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup subscription on unmount
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) {
      console.error('Login error:', error);
      return false;
    }
    return true;
  };

  const register = async (email, password) => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Registration error:', error);
      return false;
    }
    return true;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 
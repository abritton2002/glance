import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // For now, simulate a successful login
      // In production, this would make an API call
      const token = 'dummy-token';
      localStorage.setItem('token', token);
      setUser({ token });
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // For now, simulate a successful registration
      // In production, this would make an API call
      const token = 'dummy-token';
      localStorage.setItem('token', token);
      setUser({ token });
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
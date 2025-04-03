import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const base64Url = storedToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const { userId } = JSON.parse(jsonPayload);
        setUser({
          id: userId,
          userId,
          email: '',
          name: 'User',
        });
        setToken(storedToken);
      } catch (err) {
        console.error('Error initializing auth state:', err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  useEffect(() => {
    // Check for token in URL (after Google OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const errorFromUrl = urlParams.get('error');
    
    console.log('URL Params:', { tokenFromUrl, errorFromUrl });
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    console.log('Current search:', window.location.search);
    
    if (errorFromUrl) {
      console.error('Error from URL:', errorFromUrl);
      setError(errorFromUrl);
      return;
    }
    
    if (tokenFromUrl) {
      console.log('Token received from URL, attempting login...');
      login(tokenFromUrl);
      // Remove token from URL and redirect to home
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const login = (newToken: string) => {
    try {
      console.log('Processing login with token:', newToken);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      // Decode token to get user info
      const base64Url = newToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      console.log('Decoded token payload:', jsonPayload);
      const { userId } = JSON.parse(jsonPayload);
      const userData = {
        id: userId,
        userId,
        email: '',
        name: 'User',
      };
      setUser(userData);
      setError(null);
      console.log('Login successful, user set:', userData);
    } catch (err) {
      console.error('Error during login:', err);
      setError('Failed to process login token');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}; 
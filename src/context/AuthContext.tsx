import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create a dummy user object that mimics Firebase User
const createDummyUser = (email: string) => {
  return {
    uid: 'dummy-uid-123456',
    email: email,
    displayName: email.split('@')[0],
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'dummy-token',
    getIdTokenResult: async () => ({ 
      token: 'dummy-token',
      authTime: new Date().toISOString(),
      issuedAtTime: new Date().toISOString(),
      expirationTime: new Date(Date.now() + 3600000).toISOString(),
      signInProvider: 'password',
      signInSecondFactor: null,
      claims: {}
    }),
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
    photoURL: null,
    providerId: 'password',
  } as User;
};

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth state check with dummy user
    const storedUser = localStorage.getItem('dummyUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('dummyUser');
      }
    }
    setLoading(false);
  }, []);

  const signup = async (email: string, password: string) => {
    // Create a dummy user instead of using Firebase
    const dummyUser = createDummyUser(email);
    
    // Store in localStorage to persist across refreshes
    localStorage.setItem('dummyUser', JSON.stringify(dummyUser));
    
    // Update state
    setUser(dummyUser);
  };

  const login = async (email: string, password: string) => {
    // Create a dummy user instead of using Firebase
    const dummyUser = createDummyUser(email);
    
    // Store in localStorage to persist across refreshes
    localStorage.setItem('dummyUser', JSON.stringify(dummyUser));
    
    // Update state
    setUser(dummyUser);
  };

  const logout = async () => {
    // Clear the stored user
    localStorage.removeItem('dummyUser');
    
    // Update state
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    // Just pretend we sent a reset email
    console.log(`Password reset email sent to ${email}`);
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
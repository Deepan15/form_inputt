'use client';

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
  signup: (email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create a dummy user object that mimics Firebase User
const createDummyUser = (email: string) => {
  // Create a deterministic uid based on email to avoid hydration mismatches
  // This is for demo purposes only - in a real app, use a proper UUID
  const emailHash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const uid = `user-${emailHash}-${email.replace(/[^a-z0-9]/gi, '')}`;
  
  return {
    uid,
    email: email,
    displayName: email.split('@')[0],
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => {
      // Create a token that the mock Firebase Admin can understand
      return JSON.stringify({ uid, email });
    },
    getIdTokenResult: async () => ({ 
      token: JSON.stringify({ uid, email }),
      authTime: new Date().toISOString(),
      issuedAtTime: new Date().toISOString(),
      expirationTime: new Date(Date.now() + 3600000).toISOString(),
      signInProvider: 'password',
      signInSecondFactor: null,
      claims: {}
    }),
    reload: async () => {},
    toJSON: () => ({ uid, email, displayName: email.split('@')[0] }),
    phoneNumber: null,
    photoURL: null,
    providerId: 'password',
  } as User;
};

// Create a dummy user for the default context
const dummyContextUser = createDummyUser('default@example.com');

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  signup: async () => dummyContextUser,
  login: async () => dummyContextUser,
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
        const parsedUser = JSON.parse(storedUser);
        // Recreate the user object with methods
        const dummyUser = createDummyUser(parsedUser.email);
        console.log('Restored user from localStorage:', dummyUser.email);
        setUser(dummyUser);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('dummyUser');
      }
    }
    setLoading(false);
  }, []);

  const signup = async (email: string, password: string): Promise<User> => {
    // Create a dummy user instead of using Firebase
    const dummyUser = createDummyUser(email);
    
    // Store in localStorage to persist across refreshes
    localStorage.setItem('dummyUser', JSON.stringify({
      uid: dummyUser.uid,
      email: dummyUser.email,
    }));
    console.log('User signed up:', email);
    
    // Update state
    setUser(dummyUser);
    
    // Return the user object for immediate use
    return dummyUser;
  };

  const login = async (email: string, password: string): Promise<User> => {
    // Create a dummy user instead of using Firebase
    const dummyUser = createDummyUser(email);
    
    // Store in localStorage to persist across refreshes
    localStorage.setItem('dummyUser', JSON.stringify({
      uid: dummyUser.uid,
      email: dummyUser.email,
    }));
    console.log('User logged in:', email);
    
    // Update state
    setUser(dummyUser);
    
    // Return the user object for immediate use
    return dummyUser;
  };

  const logout = async () => {
    // Clear the stored user
    localStorage.removeItem('dummyUser');
    console.log('User logged out');
    
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
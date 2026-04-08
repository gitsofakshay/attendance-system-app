import React, { createContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { AuthUser } from "../types";
import { supabase } from "../utils/supabase";

interface AuthContextType {
  user: AuthUser | null;
  isUnapproved: boolean;
  isLoading: boolean;
  error: string | null;
  signUp: (
    email: string,
    password: string,
    name: string,
    role: "teacher" | "student"
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isUnapproved: false,
  isLoading: true,
  error: null,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isUnapproved, setIsUnapproved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const currentUser = await authService.getCurrentUser();
        
        if (currentUser === 'unapproved') {
          setIsUnapproved(true);
          setUser(null);
        } else {
          setUser(currentUser);
          setIsUnapproved(false);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setError("Failed to initialize authentication");
        setUser(null);
        setIsUnapproved(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, _session) => {
        // If user just signed out, we already handled it in signOut method
        if (event === 'SIGNED_OUT') {
          return;
        }
        
        const currentUser = await authService.getCurrentUser();
        
        if (currentUser === 'unapproved') {
          setIsUnapproved(true);
          setUser(null);
        } else {
          setUser(currentUser);
          setIsUnapproved(false);
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: "teacher" | "student"
  ) => {
    try {
      console.log('[AuthContext.signUp] Starting signup');
      setError(null);
      setIsLoading(true);
      
      console.log('[AuthContext.signUp] Calling authService.signUp');
      const newUser = await authService.signUp(email, password, name, role);
      
      console.log('[AuthContext.signUp] authService.signUp completed, result:', newUser);
      
      // After signup, user is created with approved: false
      // So they should be treated as unapproved
      setUser(null);
      setIsUnapproved(true);
      console.log('[AuthContext.signUp] State updated, user is unapproved');
    } catch (err: any) {
      console.error('[AuthContext.signUp] Error caught:', err);
      const errorMessage = err.message || "Sign up failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
      console.log('[AuthContext.signUp] isLoading set to false');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true); 
      console.log('[AuthContext] signIn called with email:', email);
      const authenticatedUser = await authService.signIn(email, password);
      console.log('[AuthContext] signIn successful, user:', authenticatedUser);
      
      if (authenticatedUser) {
        setUser(authenticatedUser);
        setIsUnapproved(false);
      } else {
        // If signIn returns null, it means profile fetch failed (user unapproved)
        setUser(null);
        setIsUnapproved(true);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Sign in failed";
      console.error('[AuthContext] signIn error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('inside signout function called');
      setError(null);
      setIsLoading(true);
      await authService.signOut();
      setUser(null);
      setIsUnapproved(false);
      console.log('signout completed');
    } catch (err: any) {
      const errorMessage = err.message || "Sign out failed";
      console.error('[AuthContext] signOut error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isUnapproved,
        isLoading,
        error,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
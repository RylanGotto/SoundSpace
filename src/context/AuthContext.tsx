import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import {
  signOut as authSignOut,
  getCurrentUser,
} from "../services/authService";
import {
  isTokenValid,
  clearTokens,
  redirectToSpotifyAuth,
} from "../services/spotify/spotifyAuth";
import { useHistory } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  // Spotify auth properties
  spotifyToken: string | null;
  isSpotifyConnected: () => boolean;
  connectSpotify: () => Promise<void>;
  disconnectSpotify: (history: any, redirectPath?: string) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await authSignOut();
      // State will be updated by the auth listener
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
    }
  };

  const connectSpotify = () => {
    redirectToSpotifyAuth();
  };

  const isSpotifyConnected = () => isTokenValid();

  const disconnectSpotify = (history, redirectPath = "/") => {
    clearTokens();
    history.push(redirectPath);
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signOut,
    refreshUser,
    isSpotifyConnected,
    connectSpotify,
    disconnectSpotify,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

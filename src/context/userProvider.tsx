"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createClient } from "@/src/lib/supabase/client";
import { User } from "@supabase/supabase-js";

import { initializeApp } from "../lib/auth/initializeApp";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  setProfile: Dispatch<SetStateAction<any | null>>;
  setUser: Dispatch<SetStateAction<User | null>>;
  isVerified: boolean;
  setIsVerified: Dispatch<SetStateAction<boolean>>;
  loadingApp: boolean;
  setLoadingApp: Dispatch<SetStateAction<boolean>>;
  headerHeight: number;
  setHeaderHeight: Dispatch<SetStateAction<number>>;
}

// create a context for authentication
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const supabaseClient = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loadingApp, setLoadingApp] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(73);
  const profileRef = useRef(profile);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    const checkIsVerified = () => {
      if (!profile) return false;

      const isPersonalVerified =
        profile?.is_verified && profile?.type === "Perso";

      const isProVerified =
        profile?.type === "Pro" &&
        profile?.pro_infos_verified === "verified" &&
        profile?.company?.kbis_verified === "verified" &&
        profile?.company?.rib_verified === "verified" &&
        profile?.is_verified;

      return isPersonalVerified || isProVerified;
    };
    setIsVerified(checkIsVerified());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, profile?.is_verified]);

  const fetchProfile = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabaseClient
          .from("profiles")
          .select("*, company:pro_infos(*, address:incorporation_address(*))")
          .eq("id", userId)
          .single();

        if (error) {
          throw error;
        }

        const { data: permissions, error: permissionsError } =
          await supabaseClient.from("role_permissions").select("permission");

        if (permissionsError) {
          console.error("Error fetching permissions:", permissionsError);
          return { ...data, permissions: [] };
        }

        return { ...data, permissions };
      } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
    },
    [supabaseClient]
  );

  const getUser = useCallback(async () => {
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser();
    if (error) {
      return null;
    }
    return user;
  }, [supabaseClient]);

  const initializeUser = useCallback(async () => {
    try {
      const currentUser = await getUser();
      if (currentUser) {
        setUser(currentUser);
        const userProfile = await fetchProfile(currentUser.id);
        setProfile(userProfile);
      }
    } catch (error) {
      console.error("Error initializing user:", error);
    } finally {
      setLoading(false);
    }
  }, [getUser, fetchProfile]);

  useEffect(() => {
    initializeUser();

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (profileRef?.current?.id === session?.user?.id) return;

        setUser(session?.user ?? null);

        setTimeout(async () => {
          if (session?.user) {
            const userProfile = await fetchProfile(session.user.id);
            setLoadingApp(true);
            setProfile(userProfile);
          } else {
            setProfile(null);
          }

          setLoading(false);
        }, 0);
      }
    );

    // cleanup the useEffect hook
    return () => {
      listener?.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializeUser, supabaseClient.auth]);

  useEffect(() => {
    if (profile?.id) {
      setLoadingApp(true);
      initializeApp()
        .catch((error) => console.error("Error initializing app:", error))
        .finally(() => setLoadingApp(false));
    } else {
      setLoadingApp(false);
    }
  }, [profile?.id]);

  const value = {
    user,
    profile,
    setProfile,
    setUser,
    isVerified,
    setIsVerified,
    loadingApp,
    setLoadingApp,
    headerHeight,
    setHeaderHeight,
  };

  // use a provider to pass down the value
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// export the useAuth hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

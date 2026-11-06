import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import api, { TOKEN_KEY } from "../services/api";
import { PAGES, type PageKey } from "../config/permissions";

export type Portal = "admin" | "employee";

export interface StaffUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: Portal;
  designation: string | null;
  permissions: string[];
}

interface AuthContextType {
  user: StaffUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (identifier: string, password: string, portal: Portal) => Promise<void>;
  logout: () => void;
  can: (page: PageKey | "people") => boolean;
  firstAllowedPath: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(() => !!localStorage.getItem(TOKEN_KEY));

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  // Restore the session (also refreshes permissions changed by an admin).
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;

    api
      .get("/auth/staff-me")
      .then((res) => setUser(res.data.data))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  // The API client dispatches this when the server rejects the token.
  useEffect(() => {
    window.addEventListener("auth:expired", logout);
    return () => window.removeEventListener("auth:expired", logout);
  }, [logout]);

  const login = useCallback(
    async (identifier: string, password: string, portal: Portal) => {
      const res = await api.post("/auth/staff-login", { identifier, password, portal });

      localStorage.setItem(TOKEN_KEY, res.data.token);
      setUser(res.data.data);
    },
    []
  );

  const value = useMemo<AuthContextType>(() => {
    const isAdmin = user?.role === "admin";

    const can = (page: PageKey | "people") => {
      if (!user) return false;
      if (isAdmin) return true;
      if (page === "people") return false;
      return user.permissions.includes(page);
    };

    return {
      user,
      loading,
      isAdmin,
      login,
      logout,
      can,
      firstAllowedPath: () => PAGES.find((page) => can(page.key))?.path ?? null,
    };
  }, [user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

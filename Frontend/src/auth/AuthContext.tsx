import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearSession,
  getStoredUsername,
  getToken,
  setSession,
} from "../api/client";
import { authApi } from "../api/endpoints";

interface AuthContextValue {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshHello: () => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getToken());
  const [username, setUsername] = useState<string | null>(() => getStoredUsername());

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      username,
      isAuthenticated: Boolean(token),
      async login(nextUsername, password) {
        const response = await authApi.login({
          username: nextUsername,
          password,
        });
        setSession(response.accessToken, nextUsername);
        setToken(response.accessToken);
        setUsername(nextUsername);
      },
      logout() {
        clearSession();
        setToken(null);
        setUsername(null);
      },
      refreshHello() {
        return authApi.hello();
      },
    }),
    [token, username],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}

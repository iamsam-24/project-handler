import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearSession,
  decodeJwt,
  getStoredUsername,
  getToken,
  getTokenAuthorities,
  setSession,
  type DecodedToken,
} from "../api/client";
import { authApi } from "../api/endpoints";

interface AuthContextValue {
  token: string | null;
  username: string | null;
  authorities: string[];
  isAdmin: boolean;
  isAuthenticated: boolean;
  decodedToken: DecodedToken | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshHello: () => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getToken());
  const [username, setUsername] = useState<string | null>(() => getStoredUsername());
  const [authorities, setAuthorities] = useState<string[]>(() =>
    getTokenAuthorities(getToken()),
  );
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(() =>
    decodeJwt(getToken()),
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      username,
      authorities,
      isAdmin: authorities.includes("ROLE_ADMIN"),
      isAuthenticated: Boolean(token),
      decodedToken,
      async login(nextUsername, password) {
        const response = await authApi.login({
          username: nextUsername,
          password,
        });
        setSession(response.accessToken, nextUsername);
        setToken(response.accessToken);
        setUsername(nextUsername);
        setAuthorities(getTokenAuthorities(response.accessToken));
        setDecodedToken(decodeJwt(response.accessToken));
      },
      logout() {
        clearSession();
        setToken(null);
        setUsername(null);
        setAuthorities([]);
        setDecodedToken(null);
      },
      refreshHello() {
        return authApi.hello();
      },
    }),
    [authorities, decodedToken, token, username],
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

const TOKEN_KEY = "project2.accessToken";
const USERNAME_KEY = "project2.username";
const USER_ID_KEY = "project2.userId";

export interface DecodedToken {
  sub?: string;
  authorities?: string[];
  iss?: string;
  exp?: number;
  iat?: number;
}

export class ApiError extends Error {
  status: number;
  body: string;

  constructor(status: number, body: string) {
    super(body || `Request failed (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function decodeJwt(token: string | null): DecodedToken | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const decoded = atob(padded);
    return JSON.parse(decoded) as DecodedToken;
  } catch {
    return null;
  }
}

export function getTokenAuthorities(token: string | null): string[] {
  const payload = decodeJwt(token);
  if (!payload || !Array.isArray(payload.authorities)) return [];
  return payload.authorities.filter((auth): auth is string => typeof auth === "string");
}

export function getStoredUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function getStoredUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

export function setStoredUserId(userId: string) {
  localStorage.setItem(USER_ID_KEY, userId.trim());
}

export function setSession(token: string, username: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getToken();
    if (!token) {
      throw new ApiError(401, "Not signed in. Please log in first.");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new ApiError(response.status, text || response.statusText);
  }

  if (!text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

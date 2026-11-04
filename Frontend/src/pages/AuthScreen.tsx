import { useState, type FormEvent } from "react";

import { authApi } from "../api/endpoints";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";

type Mode = "login" | "register";

export function AuthScreen() {
  const { login } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);

    try {
      if (mode === "register") {
        const result = await authApi.register({ username, email, password });
        setInfo(result.message || "Account created. You can sign in now.");
        setMode("login");
      } else {
        await login(username, password);
      }
    } catch (err) {
      const message =
        err instanceof ApiError
          ? friendlyAuthError(err)
          : "Something went wrong. Try again.";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-screen__glow" aria-hidden="true" />
      <div className="auth-card">
        <p className="eyebrow">Project2</p>
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="auth-card__sub">
          {mode === "login"
            ? "Sign in to open your workspace."
            : "Register to organise projects, tasks, and team chat."}
        </p>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            className={mode === "login" ? "is-active" : ""}
            aria-selected={mode === "login"}
            onClick={() => {
              setMode("login");
              setError(null);
              setInfo(null);
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            className={mode === "register" ? "is-active" : ""}
            aria-selected={mode === "register"}
            onClick={() => {
              setMode("register");
              setError(null);
              setInfo(null);
            }}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            <span>Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          {mode === "register" ? (
            <label>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>
          ) : null}

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />
          </label>

          {error ? <p className="auth-msg auth-msg--error">{error}</p> : null}
          {info ? <p className="auth-msg auth-msg--ok">{info}</p> : null}

          <button className="btn btn--primary auth-submit" type="submit" disabled={busy}>
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

function friendlyAuthError(err: ApiError): string {
  if (err.status === 401 || err.status === 403) {
    return "Wrong username or password.";
  }
  if (err.status >= 500) {
    return "Server issue. If this is a new setup, ask an admin to add the USER_ROLE first.";
  }
  if (err.body.toLowerCase().includes("role") || err.body.toLowerCase().includes("optional")) {
    return "Registration needs a starter role in the database. Ask an admin to seed USER_ROLE.";
  }
  return "Could not complete that request.";
}

import { useState, useEffect, type FormEvent } from "react";
import { authApi } from "../api/endpoints";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { getSavedUsers, saveUser, type StoredUser } from "../lib/workspaceStore";

type Mode = "login" | "register";

export function AuthScreen() {
  const { login } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [savedUsers, setSavedUsers] = useState<StoredUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<StoredUser | null>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const list = getSavedUsers();
    setSavedUsers(list);
    if (list.length > 0) {
      handleSelectAccount(list[0]);
    }
  }, []);

  function handleSelectAccount(u: StoredUser) {
    setSelectedUser(u);
    setUsername(u.username);
    setError(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "register") {
        const result = await authApi.register({
          username: username.trim(),
          email: email.trim(),
          password,
        });

        const newUser: StoredUser = {
          username: username.trim(),
          email: email.trim(),
          role: "ROLE_USER",
        };
        const updated = saveUser(newUser);
        setSavedUsers(updated);
        handleSelectAccount(newUser);

        setSuccess(result.message || "Account created! Select your account below and log in.");
        setMode("login");
      } else {
        await login(username.trim(), password);
        saveUser({ username: username.trim() });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401 || err.status === 403) {
          setError("Incorrect password or credentials.");
        } else if (err.body) {
          try {
            const parsed = JSON.parse(err.body);
            setError(parsed.message || err.body);
          } catch {
            setError(err.body);
          }
        } else {
          setError(`Sign in failed (${err.status})`);
        }
      } else {
        setError("Unable to connect to server. Please ensure backend is running.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="jira-auth-page">
      <div className="jira-auth-box">
        {/* Atlassian Logo */}
        <div className="jira-auth-logo">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <path
              d="M15.938 1.5C8.016 1.5 1.594 7.922 1.594 15.844c0 7.922 6.422 14.344 14.344 14.344 7.922 0 14.344-6.422 14.344-14.344C30.282 7.922 23.86 1.5 15.938 1.5z"
              fill="#0052CC"
            />
            <path
              d="M16.275 7.125h-5.063c-.414 0-.75.336-.75.75v10.125c0 .414.336.75.75.75h5.063c3.218 0 5.813-2.595 5.813-5.813s-2.595-5.812-5.813-5.812z"
              fill="#2684FF"
            />
            <path
              d="M16.275 13.5h-2.25c-.414 0-.75.336-.75.75v7.875c0 .414.336.75.75.75h2.25c2.595 0 4.688-2.093 4.688-4.688S18.87 13.5 16.275 13.5z"
              fill="#FFFFFF"
            />
          </svg>
          <span className="jira-brand-text">Jira Software</span>
        </div>

        <h1 className="jira-auth-heading">
          {mode === "login" ? "Choose an account to continue" : "Create new Jira account"}
        </h1>
        <p className="jira-auth-subheading">
          {mode === "login"
            ? "Pick from available users or enter credentials"
            : "Register your user to join projects and manage tasks"}
        </p>

        {/* User Account Chooser */}
        {mode === "login" && (
          <div className="jira-user-chooser-section">
            <span className="jira-section-title">Select User Account</span>
            <div className="jira-user-chooser-grid">
              {savedUsers.map((u) => {
                const isSelected = selectedUser?.username.toLowerCase() === u.username.toLowerCase();
                return (
                  <button
                    key={u.username}
                    type="button"
                    className={`jira-user-account-chip ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelectAccount(u)}
                  >
                    <div className="jira-avatar-sm">
                      {u.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="jira-user-chip-text">
                      <span className="jira-chip-username">{u.username}</span>
                      <small className="jira-chip-role">
                        {u.role === "ROLE_ADMIN" || u.username.toLowerCase() === "admin"
                          ? "Admin"
                          : "Member"}
                      </small>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="jira-auth-tabs">
          <button
            type="button"
            className={`jira-auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => {
              setMode("login");
              setError(null);
              setSuccess(null);
            }}
          >
            Log in
          </button>
          <button
            type="button"
            className={`jira-auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => {
              setMode("register");
              setError(null);
              setSuccess(null);
              setUsername("");
              setPassword("");
            }}
          >
            Register new user
          </button>
        </div>

        {error && <div className="jira-alert jira-alert-danger">{error}</div>}
        {success && <div className="jira-alert jira-alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="jira-form">
          <div className="jira-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setSelectedUser(null);
              }}
              placeholder="Username"
              required
            />
          </div>

          {mode === "register" && (
            <div className="jira-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
          )}

          <div className="jira-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              autoFocus={Boolean(selectedUser)}
            />
          </div>

          <button type="submit" className="jira-btn jira-btn-primary jira-btn-full" disabled={busy}>
            {busy
              ? "Authenticating..."
              : mode === "login"
              ? `Continue as ${username || "User"}`
              : "Register Account"}
          </button>
        </form>

        <div className="jira-auth-footer">
          <span>Enterprise Atlassian Access · Project2</span>
        </div>
      </div>
    </div>
  );
}

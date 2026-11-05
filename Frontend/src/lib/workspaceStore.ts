const WORKSPACE_KEY = "project2.workspace";
const USERS_KEY = "project2.savedUsers";

export interface StoredUser {
  username: string;
  email?: string;
  role?: string;
}

export interface WorkspaceMemory {
  orgId: string;
  orgName: string;
  projectId: string;
  projectName: string;
  userId: string;
  selectedUsername: string;
}

const defaultUsers: StoredUser[] = [
  { username: "admin", email: "admin@example.com", role: "ROLE_ADMIN" },
  { username: "user", email: "user@example.com", role: "ROLE_USER" },
];

const emptyWorkspace: WorkspaceMemory = {
  orgId: "",
  orgName: "",
  projectId: "",
  projectName: "",
  userId: "",
  selectedUsername: "admin",
};

export function getSavedUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultUsers;
  } catch {
    return defaultUsers;
  }
}

export function saveUser(user: StoredUser): StoredUser[] {
  const current = getSavedUsers();
  const existingIndex = current.findIndex((u) => u.username.toLowerCase() === user.username.toLowerCase());
  let updated: StoredUser[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = { ...updated[existingIndex], ...user };
  } else {
    updated = [user, ...current];
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  return updated;
}

export function removeSavedUser(username: string): StoredUser[] {
  const current = getSavedUsers();
  const updated = current.filter((u) => u.username.toLowerCase() !== username.toLowerCase());
  localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  return updated;
}

export function readWorkspace(): WorkspaceMemory {
  try {
    const raw = localStorage.getItem(WORKSPACE_KEY);
    if (!raw) return { ...emptyWorkspace };
    return { ...emptyWorkspace, ...JSON.parse(raw) };
  } catch {
    return { ...emptyWorkspace };
  }
}

export function writeWorkspace(patch: Partial<WorkspaceMemory>): WorkspaceMemory {
  const next = { ...readWorkspace(), ...patch };
  localStorage.setItem(WORKSPACE_KEY, JSON.stringify(next));
  return next;
}

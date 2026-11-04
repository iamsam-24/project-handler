const KEY = "project2.workspace";

export interface WorkspaceMemory {
  orgId: string;
  orgName: string;
  projectId: string;
  projectName: string;
  userId: string;
}

const empty: WorkspaceMemory = {
  orgId: "",
  orgName: "",
  projectId: "",
  projectName: "",
  userId: "",
};

export function readWorkspace(): WorkspaceMemory {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...empty };
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return { ...empty };
  }
}

export function writeWorkspace(patch: Partial<WorkspaceMemory>) {
  const next = { ...readWorkspace(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

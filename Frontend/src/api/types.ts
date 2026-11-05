export type TasksStatus = "IN_PROGRESS" | "TODO" | "DONE" | "FAILED";
export type TaskPriority = "VERYHIGH" | "HIGH" | "MEDIUM" | "LOW";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface RegisterResponse {
  username: string;
  message: string;
}

export interface RolePayload {
  nameRole: string;
}

export interface OrganisationPayload {
  name: string;
  slug: string;
}

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  createdAt?: string | null;
}

export interface ProjectPayload {
  name: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  organisation?: Organisation | null;
  tasks?: Task[];
}

export interface TaskPayload {
  title: string;
  status: TasksStatus;
  priority: TaskPriority;
}

export interface Task {
  id: number;
  title: string;
  status: TasksStatus;
  priority: TaskPriority;
  project?: { id: string; name?: string } | null;
}

export interface MembershipRequest {
  userId: string;
  orgId: string;
}

export interface Membership {
  id: number;
  user?: { id: string; username?: string; email?: string } | null;
  organisation?: Organisation | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

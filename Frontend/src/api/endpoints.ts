import { apiRequest } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  Membership,
  MembershipRequest,
  Organisation,
  OrganisationPayload,
  Project,
  ProjectPayload,
  RegisterRequest,
  RegisterResponse,
  RolePayload,
  Task,
  TaskPayload,
} from "./types";

export const authApi = {
  register: (body: RegisterRequest) =>
    apiRequest<RegisterResponse>("/api/users/register", {
      method: "POST",
      body: JSON.stringify(body),
    }, false),

  login: (body: LoginRequest) =>
    apiRequest<LoginResponse>("/api/users/login", {
      method: "POST",
      body: JSON.stringify(body),
    }, false),

  hello: () => apiRequest<string>("/api/users/hello"),
};

export const roleApi = {
  create: (body: RolePayload) =>
    apiRequest<string>("/api/roles", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export const organisationApi = {
  create: (body: OrganisationPayload) =>
    apiRequest<string>("/api/organisation", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  get: (id: string) => apiRequest<Organisation>(`/api/organisation/${id}`),

  remove: (id: string) =>
    apiRequest<string>(`/api/organisation/${id}`, { method: "DELETE" }),
};

export const projectApi = {
  create: (orgId: string, body: ProjectPayload) =>
    apiRequest<string>(`/api/project/${orgId}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  get: (id: string) => apiRequest<Project>(`/api/project/${id}`),

  remove: (id: string) =>
    apiRequest<string>(`/api/project/${id}`, { method: "DELETE" }),
};

export const taskApi = {
  create: (projectId: string, body: TaskPayload) =>
    apiRequest<string>(`/api/task/${projectId}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  get: (id: number | string) => apiRequest<Task>(`/api/task/${id}`),

  update: (id: number | string, body: TaskPayload) =>
    apiRequest<string>(`/api/task/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  remove: (id: number | string) =>
    apiRequest<string>(`/api/task/${id}`, { method: "DELETE" }),
};

export const membershipApi = {
  create: (body: MembershipRequest) =>
    apiRequest<string>("/api/membership", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  get: (id: number | string) =>
    apiRequest<Membership>(`/api/membership/${id}`),

  remove: (id: number | string) =>
    apiRequest<string>(`/api/membership/${id}`, { method: "DELETE" }),
};

export function chatSocketUrl(projectId: string): string {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/chat?projectId=${encodeURIComponent(projectId)}`;
}

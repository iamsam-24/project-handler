import { apiRequest, getToken } from "./client";
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
    apiRequest<RegisterResponse>(
      "/api/users/register",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      false,
    ),

  login: (body: LoginRequest) =>
    apiRequest<LoginResponse>(
      "/api/users/login",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      false,
    ),

  hello: () => apiRequest<string>("/api/users/hello"),
};

export const userApi = {
  remove: (id: string) =>
    apiRequest<void>(`/api/users/${encodeURIComponent(id)}`, { method: "DELETE" }),
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

  get: (id: string) =>
    apiRequest<Organisation>(`/api/organisation/${encodeURIComponent(id)}`),

  list: () => apiRequest<Organisation[]>("/api/organisation/getAll"),

  remove: (id: string) =>
    apiRequest<string>(`/api/organisation/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};

export const projectApi = {
  create: (orgId: string, body: ProjectPayload) =>
    apiRequest<string>(`/api/project/${encodeURIComponent(orgId)}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  get: (id: string) =>
    apiRequest<Project>(`/api/project/${encodeURIComponent(id)}`),

  list: () => apiRequest<Project[]>("/api/project/getAll"),

  listByOrganisation: (organisationId: string) =>
    apiRequest<Project[]>(
      `/api/project/organisation/${encodeURIComponent(organisationId)}`,
    ),

  remove: (id: string) =>
    apiRequest<string>(`/api/project/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};

export const taskApi = {
  create: (projectId: string, body: TaskPayload) =>
    apiRequest<string>(`/api/task/${encodeURIComponent(projectId)}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  get: (id: number | string) =>
    apiRequest<Task>(`/api/task/${encodeURIComponent(id)}`),

  list: () => apiRequest<Task[]>("/api/task/getAll"),

  listByProject: (projectId: string) =>
    apiRequest<Task[]>(`/api/task/project/${encodeURIComponent(projectId)}`),

  update: (id: number | string, body: TaskPayload) =>
    apiRequest<string>(`/api/task/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  remove: (id: number | string) =>
    apiRequest<string>(`/api/task/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};

export const membershipApi = {
  create: (body: MembershipRequest) =>
    apiRequest<string>("/api/membership", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  get: (id: number | string) =>
    apiRequest<Membership>(`/api/membership/${encodeURIComponent(id)}`),

  remove: (id: number | string) =>
    apiRequest<string>(`/api/membership/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};

export function chatSocketUrl(projectId: string): string {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const token = getToken();
  const tokenParam = token ? `&token=${encodeURIComponent(token)}` : "";
  return `${protocol}//${window.location.host}/chat?projectId=${encodeURIComponent(projectId)}${tokenParam}`;
}

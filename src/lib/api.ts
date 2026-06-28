import { Allocation, Project, Team, Faculty, AllocationWithDetails } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Token management
let authToken: string | null = null;

export function setToken(token: string) {
  authToken = token;
  localStorage.setItem('auth_token', token);
}

export function getToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem('auth_token');
  }
  return authToken;
}

export function clearToken() {
  authToken = null;
  localStorage.removeItem('auth_token');
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
      window.location.href = '/login';
    }
    throw new ApiError(data.message || 'Request failed', response.status);
  }

  return data as T;
}

export async function authenticateTeam(teamId: string, password: string): Promise<Team & { token: string } | null> {
  try {
    const result = await request<Team & { token: string }>('/auth/team/login', {
      method: 'POST',
      body: JSON.stringify({ team_id: teamId, password }),
    });
    if (result.token) {
      setToken(result.token);
    }
    return result;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

export async function authenticateFaculty(facultyId: string, password: string): Promise<Faculty & { token: string } | null> {
  try {
    const result = await request<Faculty & { token: string }>('/auth/faculty/login', {
      method: 'POST',
      body: JSON.stringify({ faculty_id: facultyId, password }),
    });
    if (result.token) {
      setToken(result.token);
    }
    return result;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

export async function getProjects(): Promise<Project[]> {
  return request<Project[]>('/projects');
}

export async function getAvailableProjects(): Promise<Project[]> {
  return request<Project[]>('/projects/available');
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  try {
    return await request<Project>(`/projects/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return undefined;
    throw err;
  }
}

export async function createProject(
  project: Omit<Project, 'id' | 'created_at' | 'updated_at'>
): Promise<Project> {
  return request<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  });
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  try {
    return await request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await request<void>(`/projects/${id}`, { method: 'DELETE' });
    return true;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
}

export async function getTeams(): Promise<Team[]> {
  return request<Team[]>('/teams');
}

export async function getTeamById(id: string): Promise<Team | null> {
  try {
    return await request<Team>(`/teams/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function updateTeam(id: string, updates: Partial<Team>): Promise<Team | null> {
  try {
    return await request<Team>(`/teams/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function getAllocations(status?: Allocation['status']): Promise<Allocation[]> {
  const query = status ? `?status=${status}` : '';
  return request<Allocation[]>(`/allocations${query}`);
}

export async function getAllocationDetails(
  status: Allocation['status'] = 'allocated'
): Promise<AllocationWithDetails[]> {
  return request<AllocationWithDetails[]>(`/allocations/details?status=${status}`);
}

export async function createAllocation(
  allocation: Omit<Allocation, 'id' | 'allocation_date'>
): Promise<Allocation> {
  return request<Allocation>('/allocations', {
    method: 'POST',
    body: JSON.stringify(allocation),
  });
}

export async function hasActiveAllocationForProject(projectId: string): Promise<boolean> {
  const ids = await getAllocatedProjectIds();
  return ids.has(projectId);
}

export async function getAllocatedProjectIds(): Promise<Set<string>> {
  const ids = await request<string[]>('/projects/allocated-ids');
  return new Set(ids);
}

export { ApiError };

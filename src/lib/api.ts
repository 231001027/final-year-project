import { Allocation, Faculty, Project, Team, AllocationWithDetails } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message || 'Request failed', response.status);
  }

  return data as T;
}

export async function authenticateFaculty(
  facultyId: string,
  password: string
): Promise<Faculty | null> {
  try {
    return await request<Faculty>('/auth/faculty/login', {
      method: 'POST',
      body: JSON.stringify({ faculty_id: facultyId, password }),
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

export async function authenticateTeam(teamId: string, password: string): Promise<Team | null> {
  try {
    return await request<Team>('/auth/team/login', {
      method: 'POST',
      body: JSON.stringify({ team_id: teamId, password }),
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

export async function getProjects(): Promise<Project[]> {
  return request<Project[]>('/projects');
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

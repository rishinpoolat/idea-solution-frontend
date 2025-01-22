import { Project } from '@/types/api';

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ProjectsResponse {
  projects: Project[];
}

export interface ProjectResponse {
  project: Project;
}

export type { Project };
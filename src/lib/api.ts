export interface Project {
  id: number;
  title: string;
  description: string;
  difficulty?: string;
  estimatedHours?: number;
  techStack?: string[];
  learningOutcomes?: string[];
  implementationSteps?: string[];
  solutions: string;
  isAiGenerated?: boolean;
  url?: string;
  created_at?: string;
}

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

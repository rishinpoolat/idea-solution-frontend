export interface Project {
  id: string;  // Changed to string for UUID
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

export interface RecommendationRequest {
  prompt: string;
}
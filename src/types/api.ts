export interface Project {
  id: number;
  title: string;
  description: string;
  difficulty?: string;
  estimatedHours?: number;
  techStack?: string[];
  learningOutcomes?: string[];
  implementationSteps?: string[];
  isAiGenerated?: boolean;
}

export interface RecommendationRequest {
  prompt: string;
}
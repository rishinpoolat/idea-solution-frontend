export interface Project {
  id: number;
  title: string;
  description: string;
  difficulty?: string;
  estimatedHours?: number;
  techStack?: string[];
  learningOutcomes?: string[];
  implementationSteps?: string[];
  solutions?: string;  // Added this field
  isAiGenerated?: boolean;
  url?: string;  // Added this in case it's used
  created_at?: string;  // Added this for timestamps
}

export interface RecommendationRequest {
  prompt: string;
}
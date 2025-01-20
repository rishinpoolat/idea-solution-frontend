export interface Project {
  id: number;
  title: string;
  url: string;
  description: string;
  solutions: string;
  created_at: string;
  updated_at: string;
}

export interface RecommendationRequest {
  prompt: string;
}
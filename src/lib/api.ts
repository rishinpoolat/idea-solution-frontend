import { supabase } from './db';

export interface Project {
  id: number;
  title: string;
  url: string;
  description?: string;
  technologies?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_hours?: number;
  reasoning_score?: number;
  created_at?: string;
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('project_materialized_view')  // Updated to use the correct table
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }

  return data || [];
}

export async function getProjectById(id: number): Promise<Project | null> {
  const { data, error } = await supabase
    .from('project_materialized_view')  // Updated to use the correct table
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    throw error;
  }

  return data;
}
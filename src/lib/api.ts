import { supabase } from './supabase';

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
    .from('projects')
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
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    throw error;
  }

  return data;
}

export async function createProjectPrompt(prompt: string) {
  const { data, error } = await supabase
    .from('project_prompts')
    .insert([{ prompt }])
    .select()
    .single();

  if (error) {
    console.error('Error creating project prompt:', error);
    throw error;
  }

  return data;
}
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import type { RecommendationRequest } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as RecommendationRequest;
    
    if (!body.prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const searchTerm = body.prompt.toLowerCase().trim();

    // Query using text search on the materialized view
    const { data: projects, error } = await supabase
      .from('project_materialized_view')
      .select('*')
      .textSearch('search_vector', searchTerm, {
        type: 'plain' // Use plain to match individual words
      })
      .limit(6);

    if (error) {
      console.error('Search error:', error);
      throw error;
    }

    // If no results with text search, try fallback with ILIKE
    if (!projects || projects.length === 0) {
      const { data: fallbackProjects, error: fallbackError } = await supabase
        .from('project_materialized_view')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,solutions.ilike.%${searchTerm}%`)
        .limit(6);

      if (fallbackError) throw fallbackError;
      return NextResponse.json({ projects: fallbackProjects || [] });
    }

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error in project recommendation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { generateAIProjects } from '@/lib/gemini';
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

    // Format search term for text search - replace spaces with &
    const searchTerm = body.prompt.toLowerCase().trim();
    const formattedSearchTerm = searchTerm
      .split(' ')
      .filter(term => term.length > 0)
      .join(' & ');

    // Get both AI suggestions and database recommendations
    const [aiResponse, dbResults] = await Promise.all([
      generateAIProjects(body.prompt),
      (async () => {
        try {
          // Try text search first
          const { data: projects, error } = await supabase
            .from('project_materialized_view')
            .select('*')
            .textSearch('search_vector', formattedSearchTerm)
            .limit(3);

          if (error) {
            console.error('Text search error:', error);
            // On text search error, fall back to ILIKE
            const { data: fallbackProjects, error: fallbackError } = await supabase
              .from('project_materialized_view')
              .select('*')
              .or(
                searchTerm.split(' ').map(term => 
                  `title.ilike.%${term}%,description.ilike.%${term}%,solutions.ilike.%${term}%`
                ).join(',')
              )
              .limit(3);

            if (fallbackError) throw fallbackError;
            return fallbackProjects || [];
          }

          // If no results from text search, try ILIKE
          if (!projects || projects.length === 0) {
            const { data: fallbackProjects, error: fallbackError } = await supabase
              .from('project_materialized_view')
              .select('*')
              .or(
                searchTerm.split(' ').map(term => 
                  `title.ilike.%${term}%,description.ilike.%${term}%,solutions.ilike.%${term}%`
                ).join(',')
              )
              .limit(3);

            if (fallbackError) throw fallbackError;
            return fallbackProjects || [];
          }

          return projects;
        } catch (error) {
          console.error('Database search error:', error);
          // If all fails, try a simple ILIKE on each word
          const { data: simpleProjects, error: simpleError } = await supabase
            .from('project_materialized_view')
            .select('*')
            .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
            .limit(3);

          if (simpleError) throw simpleError;
          return simpleProjects || [];
        }
      })()
    ]);

    // Return both AI suggestions and database recommendations
    return NextResponse.json({
      intro: aiResponse.intro,
      aiSuggestions: aiResponse.projects,
      recommendations: dbResults
    });

  } catch (error) {
    console.error('Error in project recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to get project suggestions' },
      { status: 500 }
    );
  }
}
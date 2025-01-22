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

    // Extract meaningful keywords and create search terms
    const searchTerms = body.prompt
      .toLowerCase()
      .split(/[\s,.|&]+/) // Split on multiple delimiters
      .filter(term => {
        // Filter out common words and short terms
        const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'is', 'are', 'with']);
        return term.length > 2 && !commonWords.has(term);
      })
      .map(term => {
        // Clean up terms and handle common variations
        term = term.replace(/[^\w\s]/g, '');
        // Add common variations (e.g., 'python' should match 'python3')
        const variations = new Map([
          ['javascript', ['js', 'node', 'nodejs']],
          ['python', ['python3', 'py']],
          ['typescript', ['ts']],
          ['react', ['reactjs', 'react.js']],
          // Add more variations as needed
        ]);
        
        if (variations.has(term)) {
          return `(${[term, ...variations.get(term)!].join(' | ')})`;
        }
        return term;
      })
      .join(' & ');

    // First try exact matches
    let { data: projects, error } = await supabase
      .from('project_materialized_view')
      .select('*')
      .textSearch('search_vector', searchTerms, {
        type: 'websearch',
        config: 'english'
      })
      .limit(6)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // If no exact matches, try fuzzy search
    if (!projects || projects.length === 0) {
      const terms = searchTerms.split(' & ').map(term => term.replace(/[()]/g, ''));
      const fuzzyQuery = terms.map(term => `%${term}%`).join(' | ');
      
      const { data: fuzzyProjects, error: fuzzyError } = await supabase
        .from('project_materialized_view')
        .select('*')
        .or(
          terms.map(term => `title.ilike.%${term}%,description.ilike.%${term}%`)
          .join(',')
        )
        .limit(6)
        .order('created_at', { ascending: false });

      if (fuzzyError) throw fuzzyError;
      projects = fuzzyProjects;
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
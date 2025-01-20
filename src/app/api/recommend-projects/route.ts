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

    // Clean up search terms and create a more flexible search pattern
    const searchTerms = body.prompt
      .toLowerCase()
      .split(' ')
      .filter(term => term.length > 2)
      .map(term => term.replace(/[^\w\s]/g, ''))
      .join(' & ');

    const { data: projects, error } = await supabase
      .from('project_materialized_view')
      .select('*')
      .textSearch('search_vector', searchTerms, {
        type: 'websearch',
        config: 'english'
      })
      .limit(6)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error in project recommendation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
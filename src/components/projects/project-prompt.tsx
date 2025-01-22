'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Loader2 } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Project } from '@/types/api';

export function ProjectPrompt() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/recommend-projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      setRecommendations(data.projects);

      if (data.projects.length === 0) {
        setError('No matching projects found. Try adjusting your description.');
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setError('Failed to get project recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Describe your interests, skills, and the type of project you're looking for..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px]"
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="flex items-center gap-2"
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Get Recommendations
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4">
          {error}
        </Alert>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Recommended Projects</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((project) => (
              <Card key={project.id} className="p-4">
                <h4 className="font-medium">{project.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.difficulty && (
                  <div className="mt-2 text-sm text-gray-500">
                    Difficulty: {project.difficulty}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
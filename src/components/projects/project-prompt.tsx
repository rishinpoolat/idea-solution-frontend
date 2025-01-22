'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Project } from '@/types/api';
import { ProjectCard } from './project-card';
import { ProjectDetails } from './project-details';

interface ProjectResponse {
  intro: string;
  aiSuggestions: Project[];
  recommendations: Project[];
}

export function ProjectPrompt() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ProjectResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setResults(null);
      
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

      const data: ProjectResponse = await response.json();
      setResults(data);

      if (!data.aiSuggestions.length && !data.recommendations.length) {
        setError('No matching projects found. Try adjusting your search terms.');
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setError('Failed to get project recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="What kind of project are you looking for? (e.g., 'React web application' or 'Python data analysis project')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
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
              Get Suggestions
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && (
        <div className="space-y-8">
          {/* AI Suggestions */}
          {results.aiSuggestions.length > 0 && (
            <div className="space-y-6">
              <p className="text-lg text-gray-700">{results.intro}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.aiSuggestions.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => handleViewDetails(project)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Similar Projects from Database */}
          {results.recommendations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Similar projects you might like:</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.recommendations.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => handleViewDetails(project)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <ProjectDetails
        project={selectedProject}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}
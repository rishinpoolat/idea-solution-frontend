"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Modal } from '@/components/ui/modal';
import { Loader2, Search, ArrowRight } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  difficulty?: string;
  estimatedHours?: number;
  techStack?: string[];
  learningOutcomes?: string[];
  implementationSteps?: string[];
  solutions: string;
  isAiGenerated?: boolean;
  url?: string;
  created_at?: string;
}

const Recommender = () => {
  const [prompt, setPrompt] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const fetchAllProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      setError('Failed to load projects. Please refresh the page.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setIsSearching(false);
      fetchAllProjects();
      return;
    }

    setLoading(true);
    setError('');
    setIsSearching(true);
    
    try {
      const response = await fetch('/api/recommend-projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) throw new Error('Failed to get recommendations');
      
      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      setError('Failed to fetch project recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (project: Project) => {
    setSelected(project);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Search for projects (e.g., 'React web application')"
                className="pl-10 h-12 text-lg rounded-lg"
              />
              <Search className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="h-12 px-6 text-base"
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
                {loading ? 'Searching...' : 'Search Projects'}
              </Button>
              {isSearching && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setPrompt('');
                    setIsSearching(false);
                    fetchAllProjects();
                  }}
                  className="h-12"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-lg">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className="flex flex-col hover:shadow-lg transition-all duration-300 group rounded-xl overflow-hidden border-gray-100"
          >
            <CardHeader className="bg-gray-50 group-hover:bg-gray-100 transition-colors">
              <CardTitle className="text-xl">
                {project.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-6">
              <div className="space-y-6 flex-1">
                <div>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() => openModal(project)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <span>View More</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelected(null);
        }}
      >
        {selected && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">{selected.title}</h2>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">
                {selected.description}
              </p>
            </div>

            {/* Additional Project Details */}
            {selected.techStack && selected.techStack.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.techStack.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selected.learningOutcomes && selected.learningOutcomes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
                <ul className="list-disc list-inside space-y-1">
                  {selected.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="text-gray-600 text-sm">{outcome}</li>
                  ))}
                </ul>
              </div>
            )}

            {selected.implementationSteps && selected.implementationSteps.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Implementation Steps</h3>
                <ol className="list-decimal list-inside space-y-1">
                  {selected.implementationSteps.map((step, index) => (
                    <li key={index} className="text-gray-600 text-sm">{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Empty State */}
      {projects.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-xl border">
          <div className="mb-4">
            <Search className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No projects found</h3>
          <p className="text-gray-600">Try adjusting your search terms or browse all projects</p>
          {isSearching && (
            <Button 
              variant="outline" 
              onClick={() => {
                setPrompt('');
                setIsSearching(false);
                fetchAllProjects();
              }}
              className="mt-4"
            >
              View All Projects
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Recommender;
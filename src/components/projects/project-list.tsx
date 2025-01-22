'use client';

import { useState, useEffect } from 'react';
import { ProjectCard } from './project-card';
import { ProjectDetails } from './project-details';
import { Project } from '@/types/api';  // Move type to types folder
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const ITEMS_PER_PAGE = 15;

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [visibleProjects, setVisibleProjects] = useState<number>(ITEMS_PER_PAGE);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleViewDetails = (projectId: number) => {
    const project = projects.find(p => p.id === projectId) || null;
    setSelectedProject(project);
    setDetailsOpen(true);
  };

  const handleLoadMore = () => {
    setVisibleProjects(prev => prev + ITEMS_PER_PAGE);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  const hasMoreProjects = visibleProjects < projects.length;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.slice(0, visibleProjects).map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {hasMoreProjects && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            className="flex items-center gap-2"
          >
            View More Projects
            <ChevronDown className="w-4 h-4" />
          </Button>
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
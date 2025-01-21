'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Project } from '@/lib/api';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (projectId: number) => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  // Truncate description to first 100 characters
  const truncatedDescription = project.description 
    ? project.description.slice(0, 100) + (project.description.length > 100 ? '...' : '')
    : '';

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {project.title}
        </CardTitle>
        {truncatedDescription && (
          <CardDescription className="mt-2 text-muted-foreground">
            {truncatedDescription}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardFooter className="mt-auto pt-4">
        <Button 
          size="sm" 
          className="flex items-center gap-2 ml-auto"
          onClick={() => onViewDetails(project.id)}
        >
          View More
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
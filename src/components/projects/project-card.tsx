'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, ExternalLink, Star } from 'lucide-react';
import { Project } from '@/lib/api';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (projectId: number) => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{project.title}</CardTitle>
          {project.difficulty && (
            <Badge variant="outline" className="ml-2">
              {project.difficulty}
            </Badge>
          )}
        </div>
        {project.description && (
          <CardDescription>{project.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="flex-grow">
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {project.estimated_hours && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {project.estimated_hours}h
            </div>
          )}
          {project.reasoning_score && (
            <div className="flex items-center gap-1">
              <Brain className="w-4 h-4" />
              Score: {project.reasoning_score}%
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between mt-auto pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => window.open(project.url, '_blank')}
        >
          <ExternalLink className="w-4 h-4" />
          View Source
        </Button>
        <Button 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => onViewDetails(project.id)}
        >
          <Star className="w-4 h-4" />
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}
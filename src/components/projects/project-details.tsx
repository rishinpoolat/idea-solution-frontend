'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Clock, ExternalLink, Star } from 'lucide-react';
import { Project } from '@/lib/api';

interface ProjectDetailsProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetails({ project, open, onOpenChange }: ProjectDetailsProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{project.title}</DialogTitle>
            {project.difficulty && (
              <Badge variant="outline">{project.difficulty}</Badge>
            )}
          </div>
          {project.description && (
            <DialogDescription className="text-base mt-2">
              {project.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Stats */}
          <div className="flex items-center gap-6 text-sm">
            {project.estimated_hours && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{project.estimated_hours} hours</span>
              </div>
            )}
            {project.reasoning_score && (
              <div className="flex items-center gap-1">
                <Brain className="w-4 h-4" />
                <span>Reasoning Score: {project.reasoning_score}%</span>
              </div>
            )}
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => window.open(project.url, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              View Source
            </Button>
            <Button className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Start Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
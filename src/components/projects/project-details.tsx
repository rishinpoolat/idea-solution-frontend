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
import { Brain, Clock, Bookmark } from 'lucide-react';
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
            {project.difficulty && (
              <Badge variant="outline">{project.difficulty}</Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Project Description */}
          {project.description && (
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          )}

          {/* Project Stats */}
          <div className="flex flex-wrap gap-4 items-center text-sm">
            {project.estimated_hours && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{project.estimated_hours} hours estimated</span>
              </div>
            )}
            {project.reasoning_score && (
              <div className="flex items-center gap-1">
                <Brain className="w-4 h-4" />
                <span>AI Reasoning Score: {project.reasoning_score}%</span>
              </div>
            )}
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Project Solution */}
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold mb-2">Solution Approach</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-muted-foreground">
                Here's how you can approach this project:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Plan and outline the project requirements</li>
                <li>Set up the development environment</li>
                <li>Implement core functionality</li>
                <li>Add necessary features and improvements</li>
                <li>Test and refine the implementation</li>
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4">
            <Button className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Save Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
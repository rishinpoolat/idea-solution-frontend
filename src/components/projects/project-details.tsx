'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Project } from "@/lib/api";

interface ProjectDetailsProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetails({ project, open, onOpenChange }: ProjectDetailsProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!project) return null;

  // Truncate description if it's too long
  const MAX_LENGTH = 250;
  const isLongDescription = project.description && project.description.length > MAX_LENGTH;
  const displayDescription = showFullDescription ? project.description : 
    isLongDescription ? project.description.slice(0, MAX_LENGTH) + '...' : project.description;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {project.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Description Section */}
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p>
              {displayDescription}
              {isLongDescription && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="ml-2"
                >
                  {showFullDescription ? (
                    <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
                  ) : (
                    <>Show More <ChevronDown className="ml-1 h-4 w-4" /></>
                  )}
                </Button>
              )}
            </p>
          </div>

          {/* Tech Stack Section */}
          {project.techStack && project.techStack.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Difficulty and Time Estimate */}
          <div className="flex gap-6">
            {project.difficulty && (
              <div>
                <h3 className="font-medium mb-1">Difficulty</h3>
                <p>{project.difficulty}</p>
              </div>
            )}
            {project.estimatedHours && (
              <div>
                <h3 className="font-medium mb-1">Estimated Time</h3>
                <p>{project.estimatedHours} hours</p>
              </div>
            )}
          </div>

          {/* Learning Outcomes - Only for AI Generated Projects */}
          {project.learningOutcomes && project.learningOutcomes.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Learning Outcomes</h3>
              <ul className="list-disc list-inside space-y-1">
                {project.learningOutcomes.map((outcome, index) => (
                  <li key={index}>{outcome}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Implementation Steps - Only for AI Generated Projects */}
          {project.implementationSteps && project.implementationSteps.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Implementation Steps</h3>
              <ol className="list-decimal list-inside space-y-1">
                {project.implementationSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
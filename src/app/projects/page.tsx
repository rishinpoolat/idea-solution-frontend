'use client';

import { ProjectList } from '@/components/projects/project-list';
import { ProjectPrompt } from '@/components/projects/project-prompt';

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Project Explorer</h1>
      
      {/* Project Prompt Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Get Personalized Recommendations</h2>
        <ProjectPrompt />
      </section>

      {/* Project List Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Available Projects</h2>
        <ProjectList />
      </section>
    </div>
  );
}
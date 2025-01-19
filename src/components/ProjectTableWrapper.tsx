"use client";

import dynamic from 'next/dynamic';

const ProjectTable = dynamic(() => import('./ProjectTable'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center p-4">
      Loading...
    </div>
  ),
});

const ProjectTableWrapper = () => {
  return <ProjectTable />;
};

export default ProjectTableWrapper;
import dynamic from 'next/dynamic';

const ProjectTableClient = dynamic(() => import('./ProjectTableClient'), {
  ssr: false
});

const ProjectTable = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2 text-center text-gray-800">
          Project Recommendations
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Explore our curated list of innovative project ideas
        </p>
        
        <ProjectTableClient />
      </div>
    </div>
  );
};

export default ProjectTable;
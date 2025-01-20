import ProjectRecommender from '@/components/ProjectRecommender';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            AI Project Recommender
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get personalized project recommendations based on your interests and skills. Enter your project idea below.
          </p>
        </div>
        <ProjectRecommender />
      </div>
    </main>
  );
}
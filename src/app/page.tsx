import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Code, GitBranch, Lightbulb } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      title: 'Deep Reasoning Engine',
      description: 'Advanced AI system that thoroughly analyzes and questions project recommendations',
      icon: <Brain className="w-12 h-12 text-primary" />,
    },
    {
      title: 'Smart Project Recommendations',
      description: 'Get personalized project suggestions based on your skills and interests',
      icon: <Lightbulb className="w-12 h-12 text-primary" />,
    },
    {
      title: 'Multi-Path Solutions',
      description: 'Explore multiple implementation approaches with detailed pros and cons',
      icon: <GitBranch className="w-12 h-12 text-primary" />,
    },
    {
      title: 'Advanced Code Analysis',
      description: 'In-depth code analysis and quality recommendations',
      icon: <Code className="w-12 h-12 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            AI-Powered Developer Project
            <span className="text-primary"> Recommendation System</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover personalized project recommendations with deep reasoning capabilities
            to accelerate your development journey.
          </p>
          <Link href="/projects">
            <Button size="lg" className="text-lg px-8">
              Explore Projects
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
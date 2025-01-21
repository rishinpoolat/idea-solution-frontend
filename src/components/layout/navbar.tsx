import Link from 'next/link';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">AI Project Recommender</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="ghost">Projects</Button>
          </Link>
          <Link href="/projects">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
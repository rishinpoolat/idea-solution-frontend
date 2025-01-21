'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send } from 'lucide-react';

export function ProjectPrompt() {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement prompt submission
    console.log('Submitting prompt:', prompt);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Describe your interests, skills, and the type of project you're looking for..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px]"
        />
        <div className="flex justify-end">
          <Button type="submit" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Get Recommendations
          </Button>
        </div>
      </form>
    </Card>
  );
}
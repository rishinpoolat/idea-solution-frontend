export class ThoughtProcessManager {
  private thoughts: string[] = [];
  private uncertainties: Set<string> = new Set();
  private confidenceScore: number = 1.0;

  public addThought(thought: string): void {
    this.thoughts.push(thought);
  }

  public markUncertainty(area: string, impact: number = 0.1): void {
    this.uncertainties.add(area);
    this.confidenceScore = Math.max(0, this.confidenceScore - impact);
  }

  public getCurrentThoughts(): string[] {
    return [...this.thoughts];
  }

  public getUncertainties(): string[] {
    return Array.from(this.uncertainties);
  }

  public getConfidenceScore(): number {
    return this.confidenceScore;
  }

  public synthesizeConclusions(): string[] {
    const conclusions: string[] = [];
    
    // Analyze patterns in thoughts
    const keyTopics = this.extractKeyTopics();
    if (keyTopics.length > 0) {
      conclusions.push(`Main focus areas: ${keyTopics.join(', ')}`);
    }

    // Add uncertainty acknowledgment if present
    if (this.uncertainties.size > 0) {
      conclusions.push(`Areas needing clarification: ${Array.from(this.uncertainties).join(', ')}`);
    }

    // Add confidence-based conclusion
    if (this.confidenceScore > 0.8) {
      conclusions.push('High confidence in project matches and suggestions');
    } else if (this.confidenceScore > 0.5) {
      conclusions.push('Good confidence in recommendations, with some assumptions');
    } else {
      conclusions.push('Consider providing more specific requirements for better recommendations');
    }

    return conclusions;
  }

  private extractKeyTopics(): string[] {
    // Ignore common words and focus on technical terms
    const techTerms = new Set([
      'python', 'javascript', 'react', 'node', 'web', 'mobile',
      'frontend', 'backend', 'fullstack', 'database', 'api',
      'machine', 'learning', 'ai', 'automation', 'data',
      'game', 'app', 'application', 'cloud', 'security'
    ]);
    
    const words = this.thoughts.join(' ').toLowerCase().split(/\W+/);
    
    // Count technical term frequencies
    const termFreq = new Map<string, number>();
    words.forEach(word => {
      if (techTerms.has(word)) {
        termFreq.set(word, (termFreq.get(word) || 0) + 1);
      }
    });

    // Get top 3 most relevant technical terms
    return Array.from(termFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([term]) => term);
  }
}

// Input validation function
export function isValidInput(input: string): boolean {
  // Check for minimum length
  if (input.length < 3) return false;

  // Check if input contains known technical terms or meaningful words
  const technicalTerms = [
    'python', 'javascript', 'java', 'web', 'app', 'game', 'data',
    'ai', 'ml', 'api', 'backend', 'frontend', 'mobile', 'desktop',
    'database', 'cloud', 'security', 'network', 'system', 'automation',
    'beginner', 'intermediate', 'advanced', 'learn', 'build', 'create',
    'develop', 'application', 'software', 'program', 'code', 'project'
  ];

  // Convert input to lowercase and split into words
  const words = input.toLowerCase().split(/\W+/);
  
  // Check for presence of technical terms
  const hasValidTerm = words.some(word => 
    technicalTerms.includes(word) || 
    technicalTerms.some(term => word.includes(term))
  );

  // Check for reasonable word/character ratio (to detect random keyboard mashing)
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  const isReasonableWordLength = avgWordLength >= 2 && avgWordLength <= 15;

  // Check for excessive consonants (likely random input)
  const consonantRatio = input.toLowerCase().split('')
    .filter(char => 'bcdfghjklmnpqrstvwxz'.includes(char)).length / input.length;
  const hasReasonableConsonants = consonantRatio <= 0.7;

  return hasValidTerm && isReasonableWordLength && hasReasonableConsonants;
}
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

interface ProjectSuggestion {
  title: string;
  description: string;
  difficulty: string;
  estimatedHours: number;
  techStack: string[];
  learningOutcomes: string[];
  implementationSteps: string[];
}

export async function generateAIProjects(prompt: string): Promise<{ intro: string; projects: ProjectSuggestion[] }> {
  try {
    const geminiPrompt = `Act as a helpful project advisor. For this request: "${prompt}", suggest 3 practical project ideas.
First, write a single sentence introduction like "Here are some project ideas for you:" or "Based on your interest in [technology], I suggest:"

Then, list exactly 3 projects in this JSON format:
{
  "intro": "your introduction text here",
  "projects": [
    {
      "title": "Project Name",
      "description": "A brief but engaging description",
      "difficulty": "Beginner/Intermediate/Advanced",
      "estimatedHours": number between 10-100,
      "techStack": ["main tech", "library1", "tool1"],
      "learningOutcomes": ["outcome1", "outcome2", "outcome3"],
      "implementationSteps": ["step1", "step2", "step3", "step4"]
    }
  ]
}
Note: Respond ONLY with the JSON. Do not add any other text before or after.`;

    const result = await model.generateContent(geminiPrompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response text
    const cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    try {
      // First, try parsing the cleaned text directly
      const parsedResponse = JSON.parse(cleanedText);
      
      // Validate the structure
      if (!parsedResponse.intro || !Array.isArray(parsedResponse.projects)) {
        throw new Error('Invalid response structure');
      }

      // Map and validate each project
      const validatedProjects = parsedResponse.projects.map(project => ({
        id: `ai-${Math.random().toString(36).substr(2, 9)}`,
        title: project.title || 'Project Suggestion',
        description: project.description || 'No description provided',
        difficulty: project.difficulty || 'Intermediate',
        estimatedHours: Number(project.estimatedHours) || 40,
        techStack: Array.isArray(project.techStack) ? project.techStack : [],
        learningOutcomes: Array.isArray(project.learningOutcomes) ? project.learningOutcomes : [],
        implementationSteps: Array.isArray(project.implementationSteps) ? project.implementationSteps : []
      }));

      return {
        intro: parsedResponse.intro,
        projects: validatedProjects
      };

    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.log('Raw response:', text);
      
      // Return empty results with default intro
      return {
        intro: "Here are some project suggestions:",
        projects: []
      };
    }

  } catch (error) {
    console.error('Error generating AI projects:', error);
    return {
      intro: "Here are some project suggestions:",
      projects: []
    };
  }
}
import { buildSystemPrompt, userProfile, type UserProfile } from '../prompts/system';

interface ConversationEntry {
  timestamp: Date;
  query: string;
  response: string;
}

export class LLMService {
  private apiEndpoint: string;

  constructor(modelName: string = 'gemini-3.8-flash') {
    // Use environment variable for API endpoint, fallback to production URL
    this.apiEndpoint = process.env.RAFEY_SHELL_API_URL || 'https://rafey-shell.vercel.app/api/chat';
    // Model name can be passed but is handled server-side via environment variable
  }

  async query(userInput: string, conversationHistory: ConversationEntry[]): Promise<string> {
    const systemPrompt = buildSystemPrompt();
    const contextualPrompt = this.buildContextualPrompt(userInput, conversationHistory);
    const fullPrompt = `${systemPrompt}\n\n${contextualPrompt}`;

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: fullPrompt
        })
      });

      if (!response.ok) {
        const errorData: any = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json() as { response: string };
      return data.response || 'No response generated.';
      
    } catch (error: any) {
      if (error?.message?.includes('fetch')) {
        throw new Error('Unable to connect to AI service. Please check your internet connection.');
      }
      throw new Error(`API Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private buildContextualPrompt(userInput: string, history: ConversationEntry[]): string {
    let prompt = '';

    // Add recent conversation context
    if (history.length > 0) {
      prompt += 'RECENT CONVERSATION CONTEXT:\n';
      const recentHistory = history.slice(-3); // Last 3 exchanges for context
      recentHistory.forEach((entry, index) => {
        prompt += `${index + 1}. User: ${entry.query}\n`;
        prompt += `   Assistant: ${entry.response}\n\n`;
      });
      prompt += '\n';
    }

    // Add current working directory context
    prompt += `CURRENT CONTEXT:
- Working Directory: ${process.cwd()}
- Timestamp: ${new Date().toISOString()}

USER QUERY: ${userInput}`;

    return prompt;
  }

  getUserProfile(): UserProfile {
    return { ...userProfile };
  }
} 
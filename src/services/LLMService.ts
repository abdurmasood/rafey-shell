import Anthropic from '@anthropic-ai/sdk';
import { Config } from '../config/ConfigManager';

export class LLMService {
  private anthropic?: Anthropic;
  private config: Config;
  private model: string;

  constructor(config: Config, model: string = 'claude-3-7-sonnet-20250219') {
    this.config = config;
    this.model = model;
    
    if (config.anthropicApiKey) {
      this.anthropic = new Anthropic({
        apiKey: config.anthropicApiKey,
      });
    }
  }

  async query(userInput: string, conversationHistory: Config['conversationHistory']): Promise<string> {
    if (!this.anthropic) {
      throw new Error('No API key configured. Please run: rafey-shell config');
    }

    const systemPrompt = this.buildSystemPrompt();
    const contextualPrompt = this.buildContextualPrompt(userInput, conversationHistory);

    try {
      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: 4000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: contextualPrompt
          }
        ]
      });

      const textContent = response.content.find(content => content.type === 'text');
      return textContent?.text || 'No response generated.';
      
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
        throw new Error('Invalid API key. Please check your Anthropic API key.');
      }
      throw new Error(`API Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private buildSystemPrompt(): string {
    const { userProfile } = this.config;
    
    return `You are Rafey's personal AI assistant integrated into their shell terminal. You know everything about them and provide personalized, contextual responses.

USER PROFILE:
- Name: ${userProfile.name}
- Profession: ${userProfile.profession}
- Interests: ${userProfile.interests.join(', ')}
- Working Directory: ${userProfile.workingDirectory}
- Preferred Languages: ${userProfile.preferences.codeLanguages.join(', ')}
- Response Style: ${userProfile.preferences.responseStyle}

BEHAVIORAL GUIDELINES:
- Be ${userProfile.preferences.responseStyle} in your responses
- Reference their interests and profession when relevant
- Assume they are an expert in their field
- Provide code examples in their preferred languages when applicable
- Be casual and friendly, like talking to a colleague
- Reference previous conversations when relevant
- Focus on practical, actionable advice
- Don't repeat their questions back to them
- Be direct and get to the point quickly

RESPONSE FORMAT:
- Use markdown formatting when helpful
- Include code blocks for technical solutions
- Use emojis sparingly and appropriately
- Keep responses focused and scannable
- Prioritize clarity and usefulness

Remember: You're integrated into their terminal workflow, so responses should be optimized for terminal viewing and practical use.`;
  }

  private buildContextualPrompt(userInput: string, history: Config['conversationHistory']): string {
    let prompt = '';

    // Add recent conversation context
    if (history.length > 0) {
      prompt += 'RECENT CONVERSATION CONTEXT:\n';
      const recentHistory = history.slice(-3); // Last 3 exchanges for context
      recentHistory.forEach((entry, index) => {
        prompt += `${index + 1}. User: ${entry.query}\n`;
        prompt += `   Assistant: ${entry.response.substring(0, 200)}...\n\n`;
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
} 
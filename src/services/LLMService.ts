import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { Config } from '../config/ConfigManager';

export class LLMService {
  private genAI?: GoogleGenerativeAI;
  private model?: GenerativeModel;
  private config: Config;
  private modelName: string;

  constructor(config: Config, modelName: string = 'gemini-1.5-flash') {
    this.config = config;
    this.modelName = modelName;
    
    if (config.geminiApiKey) {
      this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
        }
      });
    }
  }

  async query(userInput: string, conversationHistory: Config['conversationHistory']): Promise<string> {
    if (!this.model) {
      throw new Error('No API key configured. Please run: rafey-shell config');
    }

    const systemPrompt = this.buildSystemPrompt();
    const contextualPrompt = this.buildContextualPrompt(userInput, conversationHistory);
    const fullPrompt = `${systemPrompt}\n\n${contextualPrompt}`;

    try {
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text() || 'No response generated.';
      
    } catch (error: any) {
      if (error?.status === 401 || error?.message?.includes('API_KEY_INVALID')) {
        throw new Error('Invalid API key. Please check your Gemini API key.');
      }
      throw new Error(`API Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private buildSystemPrompt(): string {
    const { userProfile } = this.config;
    
    return `You are Rafey's assistant and you know everything about him. You wait for questions from any user and provide responses on Rafey based on the information you have about him. If you don't know the answer, you say so.

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
import * as readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import { LLMService } from '../services/LLMService';
import { Config, ConfigManager } from '../config/ConfigManager';

export class RafeyShell {
  private rl: readline.Interface;
  private llmService: LLMService;
  private config: Config;
  private conversationHistory: Config['conversationHistory'] = [];

  constructor(config: Config, model: string = 'claude-3-7-sonnet-20250219') {
    this.config = config;
    this.conversationHistory = config.conversationHistory || [];
    this.llmService = new LLMService(config, model);
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.cyan('🧠 rafey-shell> ')
    });

    this.setupEventHandlers();
  }

  async start(): Promise<void> {
    console.log(chalk.blue('🚀 Rafey Shell v1.0.0'));
    console.log(chalk.gray(`Welcome back, ${this.config.userProfile.name}!`));
    console.log(chalk.gray('Type your questions and get AI-powered responses.'));
    console.log(chalk.gray('Commands: /help, /clear, /exit\n'));

    this.rl.prompt();
  }

  private setupEventHandlers(): void {
    this.rl.on('line', async (input: string) => {
      const trimmedInput = input.trim();
      
      if (!trimmedInput) {
        this.rl.prompt();
        return;
      }

      // Handle built-in commands
      if (trimmedInput.startsWith('/')) {
        await this.handleCommand(trimmedInput);
        this.rl.prompt();
        return;
      }

      // Process LLM query
      await this.processQuery(trimmedInput);
      this.rl.prompt();
    });

    this.rl.on('close', () => {
      console.log(chalk.yellow('\n👋 Goodbye!'));
      process.exit(0);
    });

    process.on('SIGINT', () => {
      this.rl.close();
    });
  }

  private async processQuery(query: string): Promise<void> {
    const spinner = ora('Thinking...').start();
    
    try {
      const response = await this.llmService.query(query, this.conversationHistory);
      spinner.stop();
      
      console.log(chalk.green('\n💡 Response:'));
      await this.typeWriter(response);
      console.log('');

      // Save to history
      const historyEntry = {
        timestamp: new Date(),
        query,
        response
      };
      
      this.conversationHistory.push(historyEntry);
      
      // Keep only last 50 conversations to manage memory
      if (this.conversationHistory.length > 50) {
        this.conversationHistory = this.conversationHistory.slice(-50);
      }
      
      // Save history asynchronously
      ConfigManager.saveHistory(this.conversationHistory).catch(console.error);
      
    } catch (error) {
      spinner.stop();
      console.error(chalk.red('\n❌ Error:'), error instanceof Error ? error.message : String(error));
      console.log('');
    }
  }

  private async typeWriter(text: string, delay: number = 150): Promise<void> {
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      process.stdout.write(words[i]);
      if (i < words.length - 1) {
        process.stdout.write(' ');
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  private async handleCommand(command: string): Promise<void> {
    const [cmd, ...args] = command.slice(1).split(' ');
    
    switch (cmd.toLowerCase()) {
      case 'help':
        this.showHelp();
        break;
        
      case 'clear':
        console.clear();
        console.log(chalk.blue('🧠 Rafey Shell - Console cleared'));
        break;
        
      case 'history':
        this.showHistory();
        break;
        
      case 'profile':
        this.showProfile();
        break;
        
      case 'exit':
      case 'quit':
        this.rl.close();
        break;
        
      default:
        console.log(chalk.red(`Unknown command: ${cmd}`));
        this.showHelp();
    }
  }

  private showHelp(): void {
    console.log(chalk.blue('\n📚 Available Commands:'));
    console.log(chalk.gray('  /help     - Show this help message'));
    console.log(chalk.gray('  /clear    - Clear the console'));
    console.log(chalk.gray('  /history  - Show recent conversation history'));
    console.log(chalk.gray('  /profile  - Show your profile information'));
    console.log(chalk.gray('  /exit     - Exit the shell'));
    console.log('');
  }

  private showHistory(): void {
    console.log(chalk.blue('\n📖 Recent History:'));
    
    if (this.conversationHistory.length === 0) {
      console.log(chalk.gray('No conversation history yet.'));
      console.log('');
      return;
    }

    const recentHistory = this.conversationHistory.slice(-5);
    recentHistory.forEach((entry, index) => {
      console.log(chalk.cyan(`${index + 1}. Q: ${entry.query}`));
      console.log(chalk.gray(`   A: ${entry.response.substring(0, 100)}...`));
      console.log('');
    });
  }

  private showProfile(): void {
    console.log(chalk.blue('\n👤 Your Profile:'));
    console.log(chalk.gray(`Name: ${this.config.userProfile.name}`));
    console.log(chalk.gray(`Profession: ${this.config.userProfile.profession}`));
    console.log(chalk.gray(`Interests: ${this.config.userProfile.interests.join(', ')}`));
    console.log(chalk.gray(`Languages: ${this.config.userProfile.preferences.codeLanguages.join(', ')}`));
    console.log(chalk.gray(`Response Style: ${this.config.userProfile.preferences.responseStyle}`));
    console.log('');
  }
} 
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import inquirer from 'inquirer';
import chalk from 'chalk';

export interface Config {
  geminiApiKey?: string;
  openaiApiKey?: string;
  userProfile: {
    name: string;
    profession: string;
    interests: string[];
    workingDirectory: string;
    preferences: {
      responseStyle: 'concise' | 'detailed' | 'technical';
      codeLanguages: string[];
    };
  };
  conversationHistory: Array<{
    timestamp: Date;
    query: string;
    response: string;
  }>;
}

export class ConfigManager {
  private static configPath = path.join(os.homedir(), '.rafey-shell', 'config.json');
  private static historyPath = path.join(os.homedir(), '.rafey-shell', 'history.json');

  static async load(): Promise<Config> {
    try {
      await this.ensureConfigDir();
      const configData = await fs.readFile(this.configPath, 'utf8');
      const config = JSON.parse(configData);
      
      // Load conversation history
      try {
        const historyData = await fs.readFile(this.historyPath, 'utf8');
        config.conversationHistory = JSON.parse(historyData);
      } catch {
        config.conversationHistory = [];
      }
      
      return config;
    } catch (error) {
      console.log(chalk.yellow('No configuration found. Please run setup first.'));
      throw new Error('Configuration not found. Run: rafey-shell config');
    }
  }

  static async setup(): Promise<void> {
    await this.ensureConfigDir();
    
    console.log(chalk.blue('🚀 Welcome to Rafey Shell Setup!\n'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your name?',
        default: 'Rafey'
      },
      {
        type: 'input',
        name: 'profession',
        message: 'What is your profession/role?',
        default: 'Software Developer'
      },
      {
        type: 'input',
        name: 'interests',
        message: 'What are your main interests? (comma-separated)',
        default: 'programming, ai, technology'
      },
      {
        type: 'list',
        name: 'responseStyle',
        message: 'Preferred response style:',
        choices: ['concise', 'detailed', 'technical'],
        default: 'technical'
      },
      {
        type: 'input',
        name: 'codeLanguages',
        message: 'Primary programming languages? (comma-separated)',
        default: 'typescript, python, javascript'
      },
      {
        type: 'password',
        name: 'geminiApiKey',
        message: 'Google Gemini API Key (optional):',
        mask: '*'
      }
    ]);

    const config: Config = {
      geminiApiKey: answers.geminiApiKey || undefined,
      userProfile: {
        name: answers.name,
        profession: answers.profession,
        interests: answers.interests.split(',').map((i: string) => i.trim()),
        workingDirectory: process.cwd(),
        preferences: {
          responseStyle: answers.responseStyle,
          codeLanguages: answers.codeLanguages.split(',').map((l: string) => l.trim())
        }
      },
      conversationHistory: []
    };

    await fs.writeFile(this.configPath, JSON.stringify(config, null, 2));
    console.log(chalk.green('✅ Configuration saved successfully!'));
  }

  static async saveHistory(history: Config['conversationHistory']): Promise<void> {
    await this.ensureConfigDir();
    await fs.writeFile(this.historyPath, JSON.stringify(history, null, 2));
  }

  private static async ensureConfigDir(): Promise<void> {
    const configDir = path.dirname(this.configPath);
    try {
      await fs.access(configDir);
    } catch {
      await fs.mkdir(configDir, { recursive: true });
    }
  }
} 
import { readFileSync } from 'fs';
import { join } from 'path';
import * as readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import { LLMService } from '../services/LLMService';

const MUTED = '#8e8e93';

interface ConversationEntry {
  timestamp: Date;
  query: string;
  response: string;
}

function muted(text: string): string {
  return chalk.hex(MUTED)(text);
}

function readVersion(): string {
  try {
    const pkgPath = join(__dirname, '..', '..', 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { version?: string };
    return pkg.version ?? '';
  } catch {
    return '';
  }
}

function answerWidth(): number {
  const columns = process.stdout.columns || 80;
  return Math.max(24, Math.min(68, columns - 2));
}

function wrapLine(line: string, width: number): string {
  const words = line.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';

  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if (!current) {
      current = word;
      continue;
    }

    if (current.length + 1 + word.length <= width) {
      current += ` ${word}`;
      continue;
    }

    lines.push(current);
    current = word;
  }

  if (current) lines.push(current);
  return lines.join('\n');
}

function wrapText(text: string, width: number): string {
  return text.split('\n').map((line) => wrapLine(line, width)).join('\n');
}

function formatAnswer(text: string): string {
  return wrapText(text.trim(), answerWidth())
    .split('\n')
    .map((line) => (line ? `  ${line}` : ''))
    .join('\n');
}

export class RafeyShell {
  private rl: readline.Interface;
  private llmService: LLMService;
  private conversationHistory: ConversationEntry[] = [];
  private version = readVersion();

  constructor(model: string = 'gemini-3.8-flash') {
    this.llmService = new LLMService(model);

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: muted('› '),
    });

    this.setupEventHandlers();
  }

  async start(): Promise<void> {
    this.printBanner();
    this.rl.prompt();
  }

  private printBanner(): void {
    const version = this.version ? `  ${muted(this.version)}` : '';
    console.log(`${chalk.bold('rafey')}${version}`);
    console.log();
  }

  private setupEventHandlers(): void {
    this.rl.on('line', async (input: string) => {
      const trimmedInput = input.trim();

      if (!trimmedInput) {
        this.rl.prompt();
        return;
      }

      if (trimmedInput.startsWith('/')) {
        await this.handleCommand(trimmedInput);
        this.rl.prompt();
        return;
      }

      await this.processQuery(trimmedInput);
      this.rl.prompt();
    });

    this.rl.on('close', () => {
      console.log(muted('\nbye'));
      process.exit(0);
    });

    process.on('SIGINT', () => {
      this.rl.close();
    });
  }

  private async processQuery(query: string): Promise<void> {
    const stdin = process.stdin;
    stdin.pause();
    stdin.setRawMode?.(false);

    const spinner = ora({
      text: muted('thinking'),
      color: 'gray',
      spinner: 'dots',
    }).start();

    try {
      const response = await this.llmService.query(query, this.conversationHistory);
      spinner.stop();
      console.log();
      await this.typeWriter(formatAnswer(response));
      console.log();
      console.log();

      this.conversationHistory.push({
        timestamp: new Date(),
        query,
        response,
      });

      if (this.conversationHistory.length > 50) {
        this.conversationHistory = this.conversationHistory.slice(-50);
      }
    } catch (error) {
      spinner.stop();
      const message = error instanceof Error ? error.message : String(error);
      console.log();
      console.log(muted(`  ${message}`));
      console.log();
    } finally {
      stdin.read();
      stdin.setRawMode?.(true);
      stdin.resume();
    }
  }

  private async typeWriter(text: string, delay: number = 50): Promise<void> {
    const parts = text.split(/(\s+)/);

    for (const part of parts) {
      if (!part) continue;
      process.stdout.write(part);
      if (part.trim().length > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  private async handleCommand(command: string): Promise<void> {
    const [cmd] = command.slice(1).split(' ');

    switch (cmd.toLowerCase()) {
      case 'help':
        this.showHelp();
        break;

      case 'clear':
        console.clear();
        this.printBanner();
        break;

      case 'history':
        this.showHistory();
        break;

      case 'exit':
      case 'quit':
        this.rl.close();
        break;

      default:
        console.log();
        console.log(muted(`  Unknown command: ${cmd}`));
        this.showHelp();
    }
  }

  private showHelp(): void {
    const commands: Array<[string, string]> = [
      ['/help', 'Show this help message'],
      ['/clear', 'Clear the console'],
      ['/history', 'Show recent conversation history'],
      ['/exit', 'Exit the shell'],
    ];

    console.log();
    console.log(muted('commands'));
    console.log();
    for (const [name, description] of commands) {
      console.log(`  ${name.padEnd(10)}${muted(description)}`);
    }
    console.log();
  }

  private showHistory(): void {
    console.log();
    console.log(muted('history'));
    console.log();

    if (this.conversationHistory.length === 0) {
      console.log(muted('  No conversation yet.'));
      console.log();
      return;
    }

    const width = answerWidth();
    this.conversationHistory.slice(-5).forEach((entry, index) => {
      const firstLine = entry.response.trim().split('\n')[0] ?? '';
      const preview = firstLine.length > width ? `${firstLine.slice(0, width - 1)}…` : firstLine;
      console.log(`  ${index + 1}  ${entry.query}`);
      console.log(muted(`     ${preview}`));
    });
    console.log();
  }
}

#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { Command } from 'commander';
import { RafeyShell } from './shell/RafeyShell';
import chalk from 'chalk';

const program = new Command();

program
  .name('rafey-shell')
  .description('AI-powered shell with personalized LLM assistance')
  .version('1.0.0');

program
  .command('start')
  .description('Start the interactive shell')
  .option('-m, --model <model>', 'LLM model to use', 'gemini-1.5-flash')
  .action(async (options) => {
    try {
      const shell = new RafeyShell(options.model);
      await shell.start();
    } catch (error) {
      console.error(chalk.red('Error starting shell:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Default to start command
if (process.argv.length === 2) {
  program.parse(['', '', 'start']);
} else {
  program.parse();
} 
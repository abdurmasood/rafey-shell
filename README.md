# 🧠 Rafey Shell

An AI-powered shell with personalized LLM assistance that knows everything about Rafey. Get contextual responses directly in your terminal.

## ✨ Features

- **Personalized AI Assistant**: Knows your preferences, profession, and interests
- **Conversation Memory**: Maintains context across sessions
- **Terminal-First**: Optimized for terminal viewing and workflow
- **Multiple LLM Support**: Google Gemini integration
- **Rich Context**: Includes working directory and conversation history
- **Built-in Commands**: Help, history, profile management

## 🚀 Installation

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn

### Install globally via npm

```bash
npm install -g rafey-shell
```

### Or install from source

```bash
git clone <repository-url>
cd rafey-shell
npm install
npm run build
npm link
```

## ⚙️ Setup

First, run the configuration setup:

```bash
rafey-shell config
```

This will prompt you to:
- Set your name and profession
- Define your interests
- Choose response style (concise/detailed/technical)
- Set preferred programming languages
- Add your Google Gemini API key

## 🎯 Usage

### Start the shell

```bash
rafey-shell
# or use the short alias
rs
```

### Commands

Once in the shell, you can:

- **Ask anything**: Just type your question and press Enter
- `/help` - Show available commands
- `/clear` - Clear the console
- `/history` - Show recent conversation history
- `/profile` - Display your profile information
- `/exit` - Exit the shell

### Examples

```
🧠 rafey-shell> How do I optimize a React component for performance?

💡 Response:
Since you work with TypeScript and React, here are the key optimization techniques:

1. **React.memo()** for preventing unnecessary re-renders
2. **useMemo()** for expensive calculations
3. **useCallback()** for stable function references
...
```

## 🔧 Configuration

Configuration is stored in `~/.rafey-shell/config.json`. You can manually edit this file or run `rafey-shell config` to reconfigure.

### API Keys

You need a Google Gemini API key to use the AI features. Get one from:
- [Google AI Studio](https://makersuite.google.com/app/apikey)

## 📁 Project Structure

```
src/
├── cli.ts                 # CLI entry point
├── shell/
│   └── RafeyShell.ts     # Main shell interface
├── services/
│   └── LLMService.ts     # LLM API integration
└── config/
    └── ConfigManager.ts   # Configuration management
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start built version
npm start
```

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines first.

---

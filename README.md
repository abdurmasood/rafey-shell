# 🧠 Rafey Shell

An AI-powered shell with personalized LLM assistance that knows everything about Rafey. Get contextual responses directly in your terminal.

## ✨ Features

- **Personalized AI Assistant**: Hardcoded with Rafey's preferences, profession, and interests
- **Conversation Memory**: Maintains context across sessions
- **Terminal-First**: Optimized for terminal viewing and workflow
- **Google Gemini Integration**: Powered by Google's Gemini AI
- **Rich Context**: Includes working directory and conversation history
- **Built-in Commands**: Help, history, profile management

## 🚀 Installation

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn
- Google Gemini API key

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

Set your Google Gemini API key as an environment variable:

```bash
export GEMINI_API_KEY="your-api-key-here"
```

Or add it to your shell profile (`.bashrc`, `.zshrc`, etc.):

```bash
echo 'export GEMINI_API_KEY="your-api-key-here"' >> ~/.zshrc
source ~/.zshrc
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

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
- `/profile` - Display Rafey's profile information
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

## 👤 User Profile

The shell comes pre-configured with Rafey's profile:
- **Name**: Rafey  
- **Profession**: Software Developer
- **Interests**: programming, ai, technology
- **Languages**: TypeScript, Python, JavaScript
- **Response Style**: Technical

This profile cannot be changed at runtime and is immutable.

## 📁 Project Structure

```
src/
├── cli.ts                 # CLI entry point
├── shell/
│   └── RafeyShell.ts     # Main shell interface
└── services/
    └── LLMService.ts     # LLM API integration with hardcoded profile
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Set API key
export GEMINI_API_KEY="your-api-key"

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

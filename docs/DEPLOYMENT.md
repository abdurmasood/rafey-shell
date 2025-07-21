# Deployment Guide for RafeyShell

This guide explains how to deploy the RafeyShell API to Vercel so users don't need to configure their own Gemini API key.

## Prerequisites

1. A [Vercel account](https://vercel.com)
2. A [Google AI Studio](https://makersuite.google.com/app/apikey) account with Gemini API access
3. [Vercel CLI](https://vercel.com/docs/cli) installed (optional, for command-line deployment)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. Fork or clone this repository to your GitHub account
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `GEMINI_API_KEY`: Your Gemini API key from Google AI Studio
   - `GEMINI_MODEL`: (Optional) Model name, defaults to `gemini-1.5-flash`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel
   ```

4. Set environment variables:
   ```bash
   vercel env add GEMINI_API_KEY
   vercel env add GEMINI_MODEL
   ```

5. Redeploy to apply environment variables:
   ```bash
   vercel --prod
   ```

## Post-Deployment

After deployment, Vercel will provide you with a URL like `https://your-project.vercel.app`.

The API endpoint will be available at:
```
https://your-project.vercel.app/api/chat
```

## Using Your Custom Deployment

If you deploy your own instance, users can configure rafey-shell to use your endpoint:

1. Create a `.env` file:
   ```bash
   RAFEY_SHELL_API_URL=https://your-project.vercel.app/api/chat
   ```

2. Or set it as an environment variable:
   ```bash
   export RAFEY_SHELL_API_URL=https://your-project.vercel.app/api/chat
   ```

## Security Notes

- Never expose your `GEMINI_API_KEY` in client-side code
- The API key should only be set as a Vercel environment variable
- Consider adding rate limiting or authentication for production use
- Monitor your API usage to avoid unexpected costs

## Default Deployment

By default, rafey-shell uses the official deployment at `https://rafey-shell.vercel.app/api/chat`. Users don't need to deploy their own instance unless they want to customize the backend or use their own API key.
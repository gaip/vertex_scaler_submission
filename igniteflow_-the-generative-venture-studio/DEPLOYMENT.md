# Deployment Guide

## Vercel Deployment Setup

This application requires a Google Gemini API key to function. Follow these steps to configure it:

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create or select a project
3. Generate an API key

### 2. Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key (e.g., `AIzaSy...`)
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**

### 3. Redeploy

After adding the environment variable, you need to trigger a new deployment:

1. Go to the **Deployments** tab
2. Click on the three dots next to the latest deployment
3. Select **Redeploy**

Alternatively, push a new commit to trigger automatic redeployment.

## Local Development Setup

1. Clone the repository
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Troubleshooting

### "Error generating strategy. Please check your API key."

This error occurs when:
1. The `GEMINI_API_KEY` environment variable is not set in Vercel
2. The API key is invalid or expired
3. The API key doesn't have the necessary permissions

**Solution**:
1. Verify the environment variable is set correctly in Vercel
2. Check that your API key is valid in Google AI Studio
3. Ensure the API key has access to Gemini models
4. Redeploy the application after making changes

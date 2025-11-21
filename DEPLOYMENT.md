# Cloudflare Pages Deployment Guide

This guide will help you deploy the Five Elements Writing Battle game to Cloudflare Pages.

## Prerequisites

1. A GitHub account with this repository
2. A Cloudflare account (free tier is sufficient)
3. A Google Cloud Vision API key

## Step-by-Step Deployment

### 1. Get Google Cloud Vision API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Cloud Vision API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Cloud Vision API"
   - Click "Enable"
4. Create an API key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key (you'll need it in step 3)
5. (Recommended) Restrict the API key:
   - Click on your API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your Cloudflare Pages domain (e.g., `*.pages.dev`)

### 2. Deploy to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to "Workers & Pages" in the left sidebar
3. Click "Create application" > "Pages" > "Connect to Git"
4. Connect your GitHub account if not already connected
5. Select this repository (`LittileGame`)
6. Configure the build settings:
   - **Project name**: Choose a name (e.g., `littile-game`)
   - **Production branch**: `main` (or your default branch)
   - **Framework preset**: None
   - **Build command**: Leave empty
   - **Build output directory**: `/`
7. Click "Save and Deploy"

### 3. Set Environment Variable

**Important**: Before your game will work, you must set the API key environment variable.

1. Go to your Cloudflare Pages project
2. Click on "Settings" tab
3. Select "Environment variables" from the left menu
4. Click "Add variable"
5. Set the following:
   - **Variable name**: `GOOGLE_CLOUD_VISION_API_KEY`
   - **Value**: Paste your Google Cloud Vision API key from step 1
   - **Environment**: Select "Production" (and "Preview" if you want it to work on preview deployments too)
6. Click "Save"

### 4. Redeploy

After setting the environment variable:

1. Go to the "Deployments" tab
2. Click "Retry deployment" on the latest deployment, or
3. Push a new commit to trigger a new deployment

### 5. Test Your Game

1. Open your Cloudflare Pages URL (e.g., `https://littile-game.pages.dev`)
2. Click on "五行寫字大戰" to start the game
3. Try writing a Chinese character to test the OCR functionality
4. If it works, congratulations! 🎉

## Troubleshooting

### "API key not configured" error

- Make sure you've set the `GOOGLE_CLOUD_VISION_API_KEY` environment variable in Cloudflare Pages settings
- Check that the environment variable is set for the correct environment (Production/Preview)
- Redeploy after setting the environment variable

### "API 錯誤" (API Error)

- Verify your Google Cloud Vision API key is correct
- Check that the Cloud Vision API is enabled in your Google Cloud project
- Ensure your API key is not restricted in a way that prevents the request

### "網路連線失敗" (Network connection failed)

- Check the browser console for detailed error messages
- Verify that the `/api/recognize` endpoint is accessible
- Check Cloudflare Pages Functions logs in the dashboard

## Local Development

To test locally with Cloudflare Pages Functions:

### Option 1: Using Nix (Recommended)

If you have [Nix](https://nixos.org/) installed:

1. **Enter the Nix development environment:**
   
   With Flakes:
   ```bash
   nix develop
   ```
   
   Or with traditional Nix:
   ```bash
   nix-shell
   ```
   
   Or with direnv (automatic):
   ```bash
   direnv allow
   ```

2. **Create a `.dev.vars` file** (copy from `.dev.vars.example`):
   ```
   GOOGLE_CLOUD_VISION_API_KEY=your-actual-api-key-here
   ```

3. **Run the local development server:**
   ```bash
   wrangler pages dev .
   ```

4. **Open `http://localhost:8788` in your browser**

### Option 2: Manual Setup

1. **Install Wrangler CLI:**
   ```bash
   npm install -g wrangler
   ```

2. **Create a `.dev.vars` file** in the project root (copy from `.dev.vars.example`):
   ```
   GOOGLE_CLOUD_VISION_API_KEY=your-actual-api-key-here
   ```

3. **Run the local development server:**
   ```bash
   wrangler pages dev .
   ```

4. **Open `http://localhost:8788` in your browser**

**Note**: Make sure `.dev.vars` is in `.gitignore` to avoid committing your API key!

## Architecture

```
┌─────────────┐          ┌──────────────────────┐          ┌─────────────────────┐
│   Browser   │          │  Cloudflare Pages    │          │  Google Cloud       │
│  (Client)   │◄────────►│  Function            │◄────────►│  Vision API         │
│             │          │  /api/recognize      │          │                     │
└─────────────┘          └──────────────────────┘          └─────────────────────┘
     │                            │                                  │
     │  Sends canvas image        │  API key from env var            │
     │  as base64                 │  (secure)                        │
     │                            │                                  │
     └───────────────────────────►│                                  │
                                  └─────────────────────────────────►│
                                                                     │
                                  ◄─────────────────────────────────┘
                                           Recognized text
```

## Security Features

✅ **API key never exposed to client**
- The API key is stored in Cloudflare's secure environment variables
- Client-side JavaScript never sees or handles the API key
- All API communication happens server-side

✅ **No secrets in source code**
- No need to edit HTML files with API keys
- Safe to commit all code to public repositories

✅ **CORS protection**
- Serverless function includes proper CORS headers
- Can be restricted to specific domains if needed

## Cost Considerations

- **Cloudflare Pages**: Free tier includes 500 builds per month and unlimited requests
- **Cloudflare Pages Functions**: Free tier includes 100,000 requests per day
- **Google Cloud Vision API**: First 1,000 requests per month are free, then pricing applies

For a small game like this, the free tiers should be more than sufficient!

## Support

If you encounter any issues:
1. Check the Cloudflare Pages deployment logs
2. Check the browser console for JavaScript errors
3. Verify your Google Cloud Vision API quota
4. Open an issue on GitHub with details about the problem

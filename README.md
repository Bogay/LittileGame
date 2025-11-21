# 五行寫字大戰 (Five Elements Writing Battle)

A Chinese character handwriting recognition game that uses Google Cloud Vision API for OCR.

## Features

- Write Chinese characters with your finger or mouse
- Battle against enemies using the Five Elements (五行) system
- Characters with more strokes deal more damage
- Strategic gameplay based on element advantages
- **Secure API key handling** with Cloudflare Pages Functions

## Quick Start

### For Development

See [NIX_SETUP.md](NIX_SETUP.md) for instructions on setting up a development environment with Nix, or continue reading for manual setup and deployment instructions.

## Deployment

### Deploying to Cloudflare Pages

This project is optimized for deployment on Cloudflare Pages with serverless functions to keep your API key secure.

#### Prerequisites

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Cloud Vision API**
   - In your project, navigate to "APIs & Services" > "Library"
   - Search for "Cloud Vision API"
   - Click "Enable"

3. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - (Recommended) Restrict the API key to your domain
   - Copy your API key

#### Deploy to Cloudflare Pages

1. **Connect Your Repository**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: `/`
   - Root directory: (leave empty)

3. **Set Environment Variable**
   - In your Cloudflare Pages project settings
   - Go to "Settings" > "Environment variables"
   - Add a new variable:
     - **Variable name**: `GOOGLE_CLOUD_VISION_API_KEY`
     - **Value**: Your Google Cloud Vision API key
   - Save the changes

4. **Deploy**
   - Click "Save and Deploy"
   - Your site will be available at `https://your-project.pages.dev`

#### Security Benefits

✅ **API key is never exposed to the client**
- The API key is stored securely in Cloudflare's environment variables
- Client-side code only sends the canvas image to the serverless function
- The serverless function handles all API communication with Google Cloud Vision

✅ **No API key in source code**
- Unlike the previous version, there's no need to edit HTML files with your API key
- All sensitive credentials are managed through environment variables

### Local Development

#### Option 1: Using Nix (Recommended)

If you have [Nix](https://nixos.org/) installed, you can use the provided Nix configuration for a reproducible development environment:

**With Nix Flakes (recommended):**
```bash
# Enter the development environment
nix develop

# Or use direnv for automatic environment loading
echo "use flake" > .envrc
direnv allow
```

**Without Flakes (traditional Nix):**
```bash
nix-shell
```

Once in the Nix environment:
1. Copy `.dev.vars.example` to `.dev.vars`
2. Add your Google Cloud Vision API key to `.dev.vars`:
   ```
   GOOGLE_CLOUD_VISION_API_KEY=your-actual-api-key-here
   ```
3. Run: `wrangler pages dev .`
4. Open `http://localhost:8788` in your browser

#### Option 2: Manual Setup

**Install Wrangler CLI:**
```bash
npm install -g wrangler
```

**Configure and run:**
1. Create a `.dev.vars` file in the project root:
   ```
   GOOGLE_CLOUD_VISION_API_KEY=your-actual-api-key-here
   ```
2. Run: `wrangler pages dev .`
3. Open `http://localhost:8788` in your browser
4. **Note**: Add `.dev.vars` to `.gitignore` to avoid committing it

#### Option 3: Direct edit (simple but not recommended for production)
- Open `writing_battle.html` in a text editor
- Find the `recognizeHandwriting()` function
- Modify it to call Google Cloud Vision API directly with your API key

### Security Note

⚠️ **Important**: When using Cloudflare Pages Functions, your API key is secure. However, you should still:
- Set up API key restrictions in Google Cloud Console (restrict to specific domains)
- Monitor your API usage regularly
- Use Cloudflare's built-in DDoS protection

## How to Play

1. Open `index.html` in a web browser
2. Click on "五行寫字大戰" to start the game
3. Write a Chinese character in the canvas within 5 seconds
4. The game will recognize your character and calculate damage based on:
   - Number of strokes (more strokes = more damage)
   - Element advantage (相剋 relationship)
5. Defeat all enemies to win!

## Game Mechanics

### Five Elements (五行) System

- ⚔️ Metal (金) > 🌲 Wood (木)
- 🌲 Wood (木) > ⛰️ Earth (土)
- ⛰️ Earth (土) > 💧 Water (水)
- 💧 Water (水) > 🔥 Fire (火)
- 🔥 Fire (火) > ⚔️ Metal (金)

When your character's element counters the enemy's element, you deal 2x damage!

## Technical Details

- **Frontend**: Pure HTML5, CSS3, and JavaScript
- **OCR**: Google Cloud Vision API (DOCUMENT_TEXT_DETECTION)
- **Canvas API**: For handwriting input
- **Chinese Character Library**: cnchar.js for stroke and radical analysis

## License

Educational use only.

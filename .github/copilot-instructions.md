# Copilot Instructions for LittileGame

> **Note**: "LittileGame" is the correct repository name (not a typo for "LittleGame")

## Project Overview
LittileGame (五行寫字大戰 - Five Elements Writing Battle) is a Chinese character handwriting recognition game that uses Google Cloud Vision API for OCR. Players write Chinese characters and battle enemies using a Five Elements (五行) system based on traditional Chinese philosophy.

## Technology Stack
- **Frontend**: Pure HTML5, CSS3, and vanilla JavaScript (no framework dependencies)
- **Backend**: Cloudflare Pages Functions (serverless)
- **OCR Engine**: Google Cloud Vision API (DOCUMENT_TEXT_DETECTION)
- **Canvas API**: For handwriting input capture
- **External Libraries**: 
  - cnchar.js - Chinese character library for stroke and radical analysis
  - cnchar-radical - Radical/部首 plugin for element classification
- **Deployment**: Cloudflare Pages
- **Development**: Wrangler CLI for local testing

## Project Structure
```
LittileGame/
├── index.html              # Landing page with game links
├── writing_battle.html     # Main game implementation (single-file app)
├── functions/
│   └── api/
│       └── recognize.js    # Cloudflare Pages Function for OCR proxy
├── README.md              # Setup and gameplay documentation
├── DEPLOYMENT.md          # Cloudflare Pages deployment guide
├── TESTING.md             # Testing guide for the deployment
├── wrangler.toml          # Wrangler CLI configuration for local dev
├── .dev.vars.example      # Example environment variables
├── .gitignore            # Excludes .dev.vars, .wrangler/, config.js
└── .github/
    └── workflows/
        └── jekyll-gh-pages.yml  # Legacy GitHub Pages deployment (deprecated)
```

## Code Architecture

### Frontend: Single-File Application
The game frontend is contained in `writing_battle.html` with three main sections:
1. **Styles** (`<style>` section): CSS with CSS custom properties for element colors
2. **HTML Structure**: Battle stage, input zone, canvas, and overlay UI
3. **Game Logic** (`<script>` section): ~450 lines of JavaScript

### Backend: Cloudflare Pages Function
The serverless backend is in `functions/api/recognize.js`:
- **Purpose**: Secure proxy between client and Google Cloud Vision API
- **Architecture**: 
  - Receives base64-encoded canvas images from client via POST /api/recognize
  - Retrieves API key from environment variable (`GOOGLE_CLOUD_VISION_API_KEY`)
  - Forwards requests to Google Cloud Vision API
  - Returns recognized text to client
- **Security**: API key never exposed to client-side code
- **CORS**: Handles OPTIONS preflight and includes proper CORS headers

### JavaScript Code Organization
The game logic in `writing_battle.html` is organized into distinct sections (marked with comments):
1. **Configuration**: Cloudflare Pages deployment notes (no API key in client code)
2. **Game Data**: 
   - `ELEMENTS` object: Five Elements system (metal/金, wood/木, earth/土, water/水, fire/火)
   - `RADICALS` object: Character radicals mapped to elements
   - `LEVELS` array: Enemy configurations
3. **Canvas Drawing**: Touch and mouse event handling
4. **OCR Recognition**: Calls `/api/recognize` serverless function (no direct API calls)
5. **Character Analysis**: Stroke counting and element classification
6. **Game State Management**: Turn system, HP, damage calculation
7. **UI Updates**: Status messages, animations, victory/defeat

## Development Guidelines

### Code Style Conventions
- **Language**: Mixed Chinese (UI text, comments) and English (variable names, functions)
- **Variable Naming**: camelCase for JavaScript (e.g., `playerHp`, `currentLevel`)
- **Constants**: UPPER_SNAKE_CASE for configuration objects (e.g., `ELEMENTS`, `RADICALS`)
- **Comments**: Use Chinese for game logic explanations, English for technical implementation details
- **No Semicolons**: Code follows no-semicolon JavaScript style in most places
- **Indentation**: 4 spaces for JavaScript, 4 spaces for HTML/CSS

### Element System Rules
The Five Elements (五行) counter system follows traditional Chinese philosophy:
- Metal (金/⚔️) > Wood (木/🌲)
- Wood (木/🌲) > Earth (土/⛰️)  
- Earth (土/⛰️) > Water (水/💧)
- Water (水/💧) > Fire (火/🔥)
- Fire (火/🔥) > Metal (金/⚔️)

When making changes to game mechanics:
- Countering element deals 2x damage
- Base damage = character stroke count
- Element classification uses character radicals (部首)

### API Integration
- **Architecture**: Client-server model with serverless function as secure proxy
- **Client Side** (`writing_battle.html`):
  - Calls `/api/recognize` endpoint with base64-encoded canvas image
  - No API key in client code
  - Request format: `{ image: base64String }`
  - Response format: `{ success: true, text: "字" }` or `{ error: "message" }`
- **Server Side** (`functions/api/recognize.js`):
  - Cloudflare Pages Function that proxies to Google Cloud Vision API
  - API key retrieved from `GOOGLE_CLOUD_VISION_API_KEY` environment variable
  - Handles DOCUMENT_TEXT_DETECTION requests
  - Language hints: `["zh-TW", "zh"]` for Traditional/Simplified Chinese
  - Returns first character from recognized text
- **Security**: Zero secrets in source code; API key stored in Cloudflare environment

### Security Considerations
✅ **Secure Architecture** (as of PR #2):
- API key stored in Cloudflare Pages environment variables
- Serverless function acts as secure proxy
- Client never has access to API key
- No secrets committed to source code
- CORS headers configured for proper cross-origin access

**Best Practices**:
- Always store API key in Cloudflare environment variables, never in code
- Set API key restrictions in Google Cloud Console (domain/IP restrictions)
- Monitor API usage regularly through Google Cloud Console
- Use Cloudflare's built-in DDoS protection
- Keep `.dev.vars` in `.gitignore` for local development

**Historical Note**:
- Prior to PR #2, this was an educational project with client-side API key exposure
- The codebase was refactored to use Cloudflare Pages Functions for production security

## Setup Instructions

### For Production Deployment (Cloudflare Pages)
1. **Get Google Cloud Vision API Key**:
   - Create a Google Cloud Project at https://console.cloud.google.com/
   - Enable Cloud Vision API
   - Create an API Key in "APIs & Services" > "Credentials"
   - (Recommended) Restrict API key to your Cloudflare Pages domain

2. **Deploy to Cloudflare Pages**:
   - Connect your GitHub repository to Cloudflare Pages
   - Configure build settings:
     - Framework preset: None
     - Build command: (leave empty)
     - Build output directory: `/`
   - Set environment variable `GOOGLE_CLOUD_VISION_API_KEY` with your API key
   - Deploy

3. **Verify Deployment**:
   - Visit your Cloudflare Pages URL
   - Test character recognition functionality
   - Check browser console for any errors

See `DEPLOYMENT.md` for detailed step-by-step instructions.

### For Local Development
1. **Clone the repository**
2. **Install Wrangler CLI**: `npm install -g wrangler`
3. **Configure API key**:
   - Copy `.dev.vars.example` to `.dev.vars`
   - Add your API key: `GOOGLE_CLOUD_VISION_API_KEY=your-key-here`
4. **Run local server**: `wrangler pages dev .`
5. **Open browser**: Navigate to `http://localhost:8788`

**Note**: `.dev.vars` is in `.gitignore` and should never be committed.

### Legacy Local Testing (Not Recommended)
For testing without Cloudflare Functions (frontend only):
- Open `index.html` directly in browser
- OCR functionality will not work without the backend API

## Testing Strategy
This project uses manual testing with comprehensive test documentation.

### Testing Approach
1. **Manual Testing Required**: Always test in browser after changes
2. **Test Canvas Drawing**: Verify mouse and touch events work
3. **Test OCR Integration**: Draw characters and verify recognition through `/api/recognize`
4. **Test Game Mechanics**: Verify damage calculation and element advantages
5. **Test on Mobile**: Touch events are critical for mobile gameplay
6. **Cross-browser Testing**: Test on Chrome, Firefox, Safari if possible

### Testing Resources
- `TESTING.md`: Comprehensive testing guide for Cloudflare Pages deployment
- Includes testing checklists for client-side and server-side components
- Documents expected behaviors and error cases
- Provides troubleshooting steps

### No Automated Tests
- No test framework installed (Jest, Mocha, etc.)
- No CI/CD test pipeline
- Relies on manual verification and Cloudflare's built-in validation

## Common Modification Scenarios

### Adding New Enemies
Edit the `LEVELS` constant array in the "Game Data" section:
```javascript
{ attr: 'element_name', name: '敵人名稱', hp: 100, icon: '🎭' }
```

### Adjusting Game Balance
- Damage multiplier: Search for `dmg *= 2` (counter advantage)
- Timer duration: Search for `let timeLeft = 5` (5 seconds default)
- Base HP values: Modify `LEVELS` array or `playerHp` initialization

### Modifying Element Classification
Update the `RADICALS` object in the "Game Data" section to change which character radicals map to which elements.

### UI Styling Changes
All styles are in the `<style>` section within the HTML file:
- CSS custom properties in `:root` define element colors
- Modify `.fighter`, `.input-zone`, or other classes for layout changes

### Modifying the Serverless Function
When updating `functions/api/recognize.js`:
- **Function Format**: Use Cloudflare Pages Functions format (`export async function onRequestPost(context)`)
- **Environment Variables**: Access via `context.env.VARIABLE_NAME`
- **CORS**: Always include `Access-Control-Allow-Origin: *` in response headers
- **Error Handling**: Return proper HTTP status codes and JSON error messages
- **OPTIONS Handler**: Include `onRequestOptions` export for CORS preflight
- **Testing**: Test locally with `wrangler pages dev .` before deploying

### Adding New Serverless Endpoints
To add new API endpoints:
1. Create new file in `functions/api/[endpoint-name].js`
2. Export `onRequestPost`, `onRequestGet`, etc. as needed
3. Access at `/api/[endpoint-name]`
4. Follow same patterns for error handling and CORS

## Deployment
The project deploys to Cloudflare Pages with serverless functions:
- **Platform**: Cloudflare Pages (not GitHub Pages)
- **Trigger**: Automatic deployment on push to `main` branch (or manual via dashboard)
- **Build**: No build step required (static HTML/CSS/JS + serverless function)
- **Functions**: Automatically deploys `functions/api/recognize.js` as serverless endpoint
- **Environment**: API key configured in Cloudflare Pages environment variables
- **URL Pattern**: Typically `https://[project-name].pages.dev`

### Deployment Workflow
1. Push code to GitHub `main` branch
2. Cloudflare Pages automatically detects changes
3. Deploys static files (HTML, CSS, JS)
4. Deploys Pages Function from `functions/` directory
5. Function accessible at `/api/recognize`

See `DEPLOYMENT.md` for complete setup instructions.

## Important Notes for AI Assistants
1. **Preserve Chinese Content**: Do not translate or modify Chinese UI text without explicit request
2. **Single-File Frontend**: Keep game logic in `writing_battle.html` - do not split into multiple files
3. **Serverless Backend**: The `/api/recognize` function in `functions/api/recognize.js` is separate
4. **No Framework Dependencies**: Frontend is intentionally vanilla JS (no React, Vue, etc.)
5. **API Key Security**: Never add API keys to client-side code; always use environment variables
6. **Mobile-First**: Touch events are as important as mouse events
7. **Character Encoding**: Ensure UTF-8 encoding is maintained for Chinese characters
8. **cnchar.js Dependency**: This library is loaded from CDN and provides `cnchar.stroke()` function
9. **Cloudflare Pages Functions**: Use Cloudflare's format (`onRequestPost`, `onRequestOptions`)
10. **CORS Headers**: Always include CORS headers in serverless function responses

## Additional Resources
- `README.md`: Detailed setup and gameplay instructions (updated for Cloudflare Pages)
- `DEPLOYMENT.md`: Complete Cloudflare Pages deployment guide
- `TESTING.md`: Testing checklist and troubleshooting guide
- Google Cloud Vision API Docs: https://cloud.google.com/vision/docs/ocr
- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Cloudflare Functions Docs: https://developers.cloudflare.com/pages/functions/
- cnchar.js Docs: https://github.com/theajack/cnchar
- Five Elements Theory: https://en.wikipedia.org/wiki/Wu_Xing

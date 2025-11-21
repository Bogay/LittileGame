# Copilot Instructions for LittileGame

> **Note**: "LittileGame" is the correct repository name (not a typo for "LittleGame")

## Project Overview
LittileGame (五行寫字大戰 - Five Elements Writing Battle) is a Chinese character handwriting recognition game that uses Google Cloud Vision API for OCR. Players write Chinese characters and battle enemies using a Five Elements (五行) system based on traditional Chinese philosophy.

## Technology Stack
- **Frontend**: Pure HTML5, CSS3, and vanilla JavaScript (no framework dependencies)
- **OCR Engine**: Google Cloud Vision API (DOCUMENT_TEXT_DETECTION)
- **Canvas API**: For handwriting input capture
- **External Libraries**: 
  - cnchar.js - Chinese character library for stroke and radical analysis
  - cnchar-radical - Radical/部首 plugin for element classification
- **Deployment**: GitHub Pages with Jekyll

## Project Structure
```
LittileGame/
├── index.html              # Landing page with game links
├── writing_battle.html     # Main game implementation (single-file app)
├── README.md              # Setup and gameplay documentation
├── .gitignore            # Excludes config.js (API keys)
└── .github/
    └── workflows/
        └── jekyll-gh-pages.yml  # GitHub Pages deployment
```

## Code Architecture

### Single-File Application
The entire game is contained in `writing_battle.html` with three main sections:
1. **Styles** (`<style>` section): CSS with CSS custom properties for element colors
2. **HTML Structure**: Battle stage, input zone, canvas, and overlay UI
3. **Game Logic** (`<script>` section): ~450 lines of JavaScript

### JavaScript Code Organization
The game logic in `writing_battle.html` is organized into distinct sections (marked with comments):
1. **Configuration**: API key setup and security notes
2. **Game Data**: 
   - `ELEMENTS` object: Five Elements system (metal/金, wood/木, earth/土, water/水, fire/火)
   - `RADICALS` object: Character radicals mapped to elements
   - `LEVELS` array: Enemy configurations
3. **Canvas Drawing**: Touch and mouse event handling
4. **OCR Recognition**: Google Cloud Vision API integration (`recognizeHandwriting()` function)
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
- **Google Cloud Vision API** is used for handwriting recognition
- API key must be set in the `recognizeHandwriting()` function: `const apiKey = 'YOUR_API_KEY';`
- API request format: base64-encoded PNG image with DOCUMENT_TEXT_DETECTION
- Language hints: `["zh-TW", "zh"]` for Traditional/Simplified Chinese

### Security Considerations
⚠️ **Critical**: This is an educational project with client-side API key exposure
- API keys in `writing_battle.html` are visible in page source
- Users should configure API key restrictions in Google Cloud Console
- Production deployments should use a backend proxy to protect API keys
- `config.js` (if used) is already in `.gitignore`

When modifying API code:
- Always include security warnings in comments
- Suggest API key restrictions (domain/IP restrictions)
- Recommend backend proxy for production use

## Setup Instructions

### For Development
1. Clone the repository
2. No build process required - open `index.html` directly in browser
3. For full functionality, configure Google Cloud Vision API key in `writing_battle.html`

### Google Cloud Vision API Setup
1. Create a Google Cloud Project at https://console.cloud.google.com/
2. Enable Cloud Vision API
3. Create an API Key in "APIs & Services" > "Credentials"
4. Replace `'YOUR_API_KEY'` in `writing_battle.html` line ~296
5. (Recommended) Restrict API key to your domain in Google Cloud Console

### Local Testing
- Open `index.html` in a modern browser (Chrome, Firefox, Safari, Edge)
- No server required for basic testing
- For API testing, ensure API key is configured

## Testing Strategy
This project has no automated test suite. When making changes:
1. **Manual Testing Required**: Always test in browser after changes
2. **Test Canvas Drawing**: Verify mouse and touch events work
3. **Test OCR Integration**: Draw characters and verify recognition
4. **Test Game Mechanics**: Verify damage calculation and element advantages
5. **Test on Mobile**: Touch events are critical for mobile gameplay
6. **Cross-browser Testing**: Test on Chrome, Firefox, Safari if possible

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
Update the `RADICALS` object (lines ~206-212) to change which character radicals map to which elements.

### UI Styling Changes
All styles are in the `<style>` section within the HTML file:
- CSS custom properties in `:root` define element colors
- Modify `.fighter`, `.input-zone`, or other classes for layout changes

## Deployment
The project auto-deploys to GitHub Pages via Jekyll workflow:
- Triggers on push to `main` branch
- No build step required (static HTML/CSS/JS)
- Deployed URL: Set in repository settings under Pages

## Important Notes for AI Assistants
1. **Preserve Chinese Content**: Do not translate or modify Chinese UI text without explicit request
2. **Single-File Constraint**: Keep game logic in `writing_battle.html` - do not split into multiple files
3. **No Framework Dependencies**: This is intentionally a vanilla JS project
4. **API Key Security**: Always emphasize security warnings when modifying API code
5. **Mobile-First**: Touch events are as important as mouse events
6. **Character Encoding**: Ensure UTF-8 encoding is maintained for Chinese characters
7. **cnchar.js Dependency**: This library is loaded from CDN and provides `cnchar.stroke()` function

## Additional Resources
- README.md: Detailed setup and gameplay instructions
- Google Cloud Vision API Docs: https://cloud.google.com/vision/docs/ocr
- cnchar.js Docs: https://github.com/theajack/cnchar
- Five Elements Theory: https://en.wikipedia.org/wiki/Wu_Xing

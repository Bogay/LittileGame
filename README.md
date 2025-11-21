# 五行寫字大戰 (Five Elements Writing Battle)

A Chinese character handwriting recognition game that uses Google Cloud Vision API for OCR.

## Features

- Write Chinese characters with your finger or mouse
- Battle against enemies using the Five Elements (五行) system
- Characters with more strokes deal more damage
- Strategic gameplay based on element advantages

## Setup

### Google Cloud Vision API Configuration

This game requires a Google Cloud Vision API key to function. Follow these steps:

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
   - Copy your API key

4. **Configure the Game**
   
   **Option 1: Direct edit (simple but less secure)**
   - Open `writing_battle.html` in a text editor
   - Find the line: `const apiKey = 'YOUR_API_KEY';`
   - Replace `'YOUR_API_KEY'` with your actual API key
   
   **Option 2: Configuration file (recommended)**
   - Create a file named `config.js` in the same directory
   - Add the following content:
     ```javascript
     const API_KEY = 'your-actual-api-key-here';
     ```
   - In `writing_battle.html`, replace the line `const apiKey = 'YOUR_API_KEY';` with:
     ```javascript
     const apiKey = typeof API_KEY !== 'undefined' ? API_KEY : 'YOUR_API_KEY';
     ```
   - Add `<script src="config.js"></script>` before the main script tag
   - The `config.js` file is already in `.gitignore` and won't be committed to git

### Security Note

⚠️ **Important**: The API key in the HTML file is visible to anyone who views the page source. For production use, consider:
- Setting up API key restrictions in Google Cloud Console (restrict to specific domains)
- Using a backend proxy server to keep the API key secure
- Implementing proper authentication and authorization

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

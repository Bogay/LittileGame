# Testing Guide for Cloudflare Pages Deployment

This document provides testing instructions to verify the refactored code works correctly.

## Local Testing (without Cloudflare)

Since we don't have a local Cloudflare Pages environment running, here's what you can verify:

### 1. File Structure
✅ Verify these files exist:
- `functions/api/recognize.js` - Serverless function
- `wrangler.toml` - Wrangler configuration
- `.dev.vars.example` - Example environment variables
- `DEPLOYMENT.md` - Deployment guide

### 2. Code Quality Checks

✅ JavaScript syntax is valid:
```bash
node --check functions/api/recognize.js
```

✅ No security vulnerabilities found (CodeQL scan passed)

### 3. Client-Side Changes

The `writing_battle.html` file now:
- ✅ Calls `/api/recognize` instead of Google Cloud Vision API directly
- ✅ Sends image as base64 in JSON body
- ✅ Handles error responses appropriately
- ✅ No API key in client-side code

### 4. Server-Side Function

The `functions/api/recognize.js` file:
- ✅ Uses Cloudflare Pages Functions format (`onRequestPost`, `onRequestOptions`)
- ✅ Retrieves API key from environment variable
- ✅ Returns proper error messages when API key is not configured
- ✅ Includes CORS headers for cross-origin requests
- ✅ Handles OPTIONS requests for CORS preflight
- ✅ Has proper null checking for API response

## Testing on Cloudflare Pages

After deployment to Cloudflare Pages:

### 1. Verify Environment Variable
- Go to Cloudflare Pages project settings
- Check that `GOOGLE_CLOUD_VISION_API_KEY` is set

### 2. Test the Game
1. Open your deployed site (e.g., `https://your-project.pages.dev`)
2. Click on "五行寫字大戰"
3. Click "開始挑戰"
4. Try writing a Chinese character
5. Verify that:
   - The character is recognized
   - No API key errors appear
   - Game continues normally

### 3. Check Browser Console
- Open browser developer tools (F12)
- Check console for messages:
  - Should see: "Sending request to serverless function..."
  - Should NOT see: API key in any log messages
  - Check Network tab: Request to `/api/recognize` should succeed

### 4. Verify Security
- ✅ View page source - no API key visible
- ✅ Check Network tab - API key not sent to client
- ✅ Verify `/api/recognize` endpoint responds correctly

## Expected Behavior

### Success Case:
1. User writes character
2. Client sends base64 image to `/api/recognize`
3. Server calls Google Cloud Vision API
4. Server returns recognized text
5. Game continues with the character

### Error Cases:

**API Key Not Set:**
- Error message: "API key not configured"
- HTTP Status: 500
- Client shows: "❌ API 錯誤"

**No Image Data:**
- Error message: "No image data provided"
- HTTP Status: 400

**Vision API Error:**
- Error message: "Vision API error" with details
- HTTP Status: 500

**Network Error:**
- Client shows: "❌ 網路連線失敗"

## Troubleshooting

If testing fails:
1. Check Cloudflare Pages Function logs
2. Verify API key is set correctly
3. Verify Google Cloud Vision API is enabled
4. Check API key restrictions in Google Cloud Console
5. Verify CORS headers are working

## Manual Test Checklist

- [ ] Files created correctly
- [ ] JavaScript syntax valid
- [ ] No security vulnerabilities
- [ ] Client code updated correctly
- [ ] Server function handles all error cases
- [ ] CORS headers present
- [ ] Deployment guide is clear
- [ ] Environment variable documented
- [ ] .gitignore updated
- [ ] wrangler.toml configuration valid

## Success Criteria

✅ API key never exposed to client
✅ Game works exactly as before
✅ All error cases handled gracefully
✅ Documentation is clear and complete
✅ No security vulnerabilities introduced
✅ Code is maintainable and well-documented

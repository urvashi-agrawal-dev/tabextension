# AI Quote Tab - Simple Version

A lightweight Chrome extension that shows relevant quotes based on your AI conversations.

## Features

✅ **Simple & Fast** - Vanilla JavaScript, no frameworks
✅ **70+ Real Quotes** - Curated from famous thinkers and tech leaders
✅ **Smart Matching** - Keyword-based or AI-powered analysis
✅ **No Repeats** - Tracks shown quotes to ensure variety
✅ **Privacy First** - All processing happens locally
✅ **Beautiful UI** - Clean, modern glassmorphic design

## Installation

### 1. Get New API Keys (IMPORTANT!)

⚠️ **Your previous keys were exposed and must be revoked!**

Get new keys from:
- **OpenRouter**: https://openrouter.ai/keys (Recommended - cheaper)
- **OpenAI**: https://platform.openai.com/api-keys

### 2. Load Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `extension-simple` folder
5. Done! Open a new tab to see it work

### 3. Configure (Optional)

1. Click the extension icon in toolbar
2. Select API provider (or leave as "None" for simple matching)
3. Enter your NEW API key
4. Click "Save Settings"
5. Click "Test Connection" to verify

## How It Works

### Without AI (Default)
- Uses simple keyword matching
- Analyzes conversations for topics like: coding, learning, stress, motivation, etc.
- Matches quotes based on detected keywords
- Fast and free!

### With AI (Optional)
- Uses OpenRouter or OpenAI API
- Advanced context understanding
- Better topic detection
- More relevant quote matching
- Costs ~$0.001 per analysis

## Usage

1. **Visit AI Chat Platforms**
   - ChatGPT (chat.openai.com)
   - Claude (claude.ai)
   - Gemini (gemini.google.com)

2. **Have Conversations**
   - The extension automatically reads your chats
   - Analyzes topics and mood
   - Stores context locally

3. **Open New Tab**
   - See a relevant quote based on your recent conversations
   - Click "New Quote" for another one
   - Quotes never repeat (until you've seen all 70+)

## File Structure

```
extension-simple/
├── manifest.json       # Extension configuration
├── content.js          # Extracts conversations from AI platforms
├── background.js       # Processes conversations and analyzes context
├── newtab.html         # New tab page UI
├── newtab.js           # New tab logic and quote display
├── popup.html          # Settings popup UI
├── popup.js            # Settings logic
├── quotes.js           # 70+ curated quotes database
└── README.md           # This file
```

## Privacy & Security

- ✅ All conversation data stays in your browser
- ✅ API keys stored locally (never sent anywhere except to chosen API)
- ✅ No tracking or analytics
- ✅ No external servers (except optional AI API)
- ✅ Open source - you can review all code

## Troubleshooting

### No quotes showing?
- Make sure you've visited ChatGPT, Claude, or Gemini
- Check that the extension has permission to access those sites
- Try refreshing the page

### API not working?
- Verify your API key is correct
- Check you have credits/quota remaining
- Test connection in settings popup
- Try switching providers

### Quotes repeating?
- Click "Reset Shown Quotes" in settings
- This will clear the history

## Customization

Want to add your own quotes? Edit `quotes.js`:

```javascript
{
  text: "Your quote here",
  author: "Author Name",
  tags: ["topic1", "topic2"]
}
```

## Comparison: Simple vs Complex Version

| Feature | Simple Version | Complex Version |
|---------|---------------|-----------------|
| Size | ~10 files | 50+ files |
| Setup | Load & go | npm install, build |
| Quotes | 70 real | 20,000 generated |
| Framework | Vanilla JS | React + TypeScript |
| Build Time | Instant | ~30 seconds |
| Learning Curve | Easy | Advanced |
| Customization | Very easy | Requires React knowledge |

## License

MIT - Free to use and modify

## Credits

Inspired by Paras Chopra's idea of contextual quotes based on AI conversations.

---

Made with ❤️ for simplicity

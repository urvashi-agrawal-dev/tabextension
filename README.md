# Contextual AI Quotes Chrome Extension

An intelligent Chrome extension that reads your AI conversations and displays relevant, personalized quotes on every new tab.

## Features

### 🧠 Intelligent Context Analysis
- Automatically reads conversations from ChatGPT, Claude, and Gemini
- Advanced sentiment analysis and topic classification
- Emotion detection and problem identification
- Mood and urgency assessment

### 💬 Smart Quote Engine
- 10,000+ curated quotes from various categories
- Non-repeating quote system
- Context-aware quote matching
- Categories: tech, philosophy, psychology, stoicism, creativity, entrepreneurship

### 🎨 Beautiful UI/UX
- Glassmorphic design with animated backgrounds
- Multiple theme options (Cyberpunk, Aurora, Sunset)
- Smooth animations and transitions
- Responsive and accessible design

### 🎯 Personalized Recommendations
- Context-based recommendations for:
  - Movies
  - Books
  - Research papers
  - Developer tools
  - GitHub repositories

### 🔒 Privacy-First
- All processing happens locally
- No external API calls
- No data collection or tracking
- Your conversations stay private

## Installation

### Development Mode

1. Clone the repository:
```bash
git clone https://github.com/urvashi-agrawal-dev/tabextension.git
cd tabextension/extension
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension/dist` folder

### Production Build

```bash
npm run build
```

The built extension will be in the `extension/dist` folder.

## Project Structure

```
extension/
├── src/
│   ├── background/       # Background service worker
│   ├── content/          # Content scripts for AI platforms
│   ├── newtab/          # New tab page
│   ├── popup/           # Extension popup
│   ├── options/         # Settings page
│   ├── services/        # Core services
│   │   ├── contextEngine.ts      # Context analysis
│   │   ├── quoteEngine.ts        # Quote matching
│   │   ├── recommenderEngine.ts  # Recommendations
│   │   └── storage.ts            # Data persistence
│   └── data/            # Quote and recommendation data
├── public/              # Static assets
└── manifest.json        # Extension manifest
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **CRXJS** - Chrome extension development
- **Lucide React** - Icons

## How It Works

1. **Content Scripts** inject into ChatGPT, Claude, and Gemini pages
2. **Background Service** processes conversations and analyzes context
3. **Context Engine** extracts topics, sentiment, emotions, and problems
4. **Quote Engine** matches relevant quotes based on context
5. **New Tab Page** displays personalized quotes with beautiful UI
6. **Recommender Engine** suggests relevant content based on your interests

## Features in Detail

### Context Analysis
- Topic extraction (programming, philosophy, psychology, etc.)
- Sentiment analysis (positive, negative, neutral, mixed)
- Emotion detection (curious, frustrated, excited, etc.)
- Problem classification (debugging, learning, decision-making, etc.)
- Complexity assessment (simple, moderate, complex)
- Urgency detection (low, medium, high)

### Quote Matching
- Semantic matching based on topics
- Mood-aware quote selection
- Problem-specific quotes
- Relevance scoring
- Non-repeating algorithm

### Recommendations
- Context-aware suggestions
- Multiple categories (books, movies, tools, papers, repos)
- Relevance explanations
- Direct links to resources

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Chrome browser

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

Inspired by Paras Chopra's idea of contextual quotes based on AI conversations.

## Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for developers who love meaningful quotes

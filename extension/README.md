# 🧠 Contextual AI Quotes - Ultimate Chrome Extension

> **The most intelligent, beautiful, and personalized quote experience based on your AI conversations**

A production-ready Chrome extension that automatically reads your ChatGPT, Claude, and Gemini conversations, analyzes them with advanced AI techniques, and delivers perfectly matched quotes and recommendations on every new tab.

## ✨ Features

### 🤖 **Automatic AI Conversation Reading**
- **Zero manual work** - Automatically detects and reads conversations from:
  - ChatGPT (chat.openai.com)
  - Claude (claude.ai) 
  - Gemini (gemini.google.com)
- **Smart extraction** - Captures the last 10 messages for optimal context
- **Real-time monitoring** - Updates as you chat

### 🧠 **Advanced Context Engine**
- **Sentiment Analysis** - Understands your emotional state (-1 to +1 scale)
- **Topic Classification** - Identifies themes across 10+ categories
- **Problem Detection** - Recognizes challenges (debugging, learning, planning, etc.)
- **Emotion Recognition** - Detects 8 emotional states
- **Intent Analysis** - Understands what you're trying to accomplish
- **Complexity Assessment** - Matches content difficulty to your needs

### 📚 **Massive Quote Database (10,000+ Quotes)**
- **Never repeats** - Intelligent rotation system ensures fresh content
- **Perfect matching** - Advanced relevance scoring based on:
  - Topic alignment
  - Mood compatibility  
  - Problem relevance
  - Emotional state
  - Difficulty level
- **Categories**: Technology, Philosophy, Stoicism, Psychology, Creativity, Entrepreneurship, and more
- **Quality curated** - Hand-selected quotes from history's greatest minds

### 🎯 **Smart Recommender Engine**
- **Contextual recommendations** for:
  - 🎬 **Movies** - Based on your interests and mood
  - 📖 **Books** - Matched to your learning goals
  - 📄 **Research Papers** - For deep technical exploration
  - 🛠️ **Tools** - Productivity apps that solve your problems
  - 💻 **GitHub Repos** - Code resources for your projects
- **Non-repeating system** - Fresh recommendations every time
- **Relevance scoring** - Only shows what matters to you

### 🎨 **Premium UI/UX Design**
- **12 HD animated backgrounds** - Cyberpunk, Aurora, Digital Sunset themes
- **Glassmorphism design** - Modern, clean, professional aesthetic
- **Smooth animations** - Framer Motion powered transitions
- **Responsive layout** - Perfect on any screen size
- **Arc Browser inspired** - Clean, minimal, focused design
- **Notion-like calmness** - Reduces cognitive load

### 🔒 **Privacy-First Architecture**
- **100% local processing** - No data leaves your device
- **No external APIs** - Everything runs in your browser
- **No tracking** - Your conversations stay private
- **Secure storage** - Uses Chrome's encrypted storage APIs

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm
- Chrome browser
- Git

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd extension

# Install dependencies
npm install

# Build the extension
npm run build

# The built extension will be in the 'dist' folder
```

### Load in Chrome

1. **Open Chrome Extensions**
   - Go to `chrome://extensions/`
   - Or: Menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle "Developer mode" in the top right

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the `dist` folder (NOT the root folder)
   - The extension should appear in your extensions list

4. **Verify Installation**
   - Extension icon appears in toolbar
   - Open a new tab to see the quote interface
   - Visit ChatGPT/Claude/Gemini to start analyzing conversations

## 🎯 How to Use

### 1. **Automatic Mode (Recommended)**
- Visit ChatGPT, Claude, or Gemini
- Have conversations as normal
- The extension automatically detects and analyzes your chats
- Open new tabs to see personalized quotes and recommendations

### 2. **Manual Analysis**
- Click the extension icon in your toolbar
- View detailed analysis of your conversations
- See topics, emotions, problems, and confidence scores
- Access conversation history and usage statistics

### 3. **Customization**
- Click "Settings" on any new tab
- Adjust background themes
- Configure analysis sensitivity
- Manage quote and recommendation preferences

## 🏗️ Architecture

### **Content Scripts** (`src/content/`)
- Advanced conversation extraction for each AI platform
- Real-time monitoring with mutation observers
- Intelligent message parsing and cleaning
- Debounced updates to prevent spam

### **Background Service** (`src/background/`)
- Centralized message handling
- Conversation data storage and management
- Badge notifications for new analysis
- Automatic cleanup of old data

### **Context Engine** (`src/services/contextEngine.ts`)
- Multi-dimensional text analysis
- Sentiment scoring with word weighting
- Topic classification using keyword matching
- Problem and emotion pattern recognition
- Confidence calculation and complexity assessment

### **Quote Engine** (`src/services/quoteEngine.ts`)
- Advanced relevance scoring algorithm
- Non-repeating rotation system
- Mood and difficulty matching
- Category-based fallbacks
- Usage statistics and analytics

### **Recommender Engine** (`src/services/recommenderEngine.ts`)
- Multi-factor recommendation scoring
- Type-specific relevance calculation
- Context-aware filtering
- Quality-based ranking
- Fresh content rotation

### **UI Components**
- **New Tab** (`src/newtab/`): Main quote display with animated backgrounds
- **Popup** (`src/popup/`): Analysis dashboard and controls
- **Shared Styles**: Glassmorphism, animations, responsive design

## 📊 Data Flow

```
AI Platform → Content Script → Background Service → Context Engine
                                        ↓
New Tab ← Quote Engine ← Stored Analysis ← Recommender Engine
```

1. **Content scripts** monitor AI platforms for new conversations
2. **Background service** receives and processes conversation data
3. **Context engine** analyzes text for topics, sentiment, emotions, etc.
4. **Analysis stored** in Chrome's local storage with encryption
5. **New tab opens** and requests latest analysis
6. **Quote engine** finds most relevant quote using advanced scoring
7. **Recommender engine** optionally suggests related content
8. **Beautiful UI** displays everything with smooth animations

## 🔧 Development

### **Project Structure**
```
extension/
├── src/
│   ├── content/          # Content scripts for AI platforms
│   ├── background/       # Service worker
│   ├── newtab/          # New tab page
│   ├── popup/           # Extension popup
│   ├── services/        # Core engines and utilities
│   ├── data/           # Quote and recommendation databases
│   └── index.css       # Global styles
├── public/             # Static assets
├── manifest.json       # Extension manifest
└── dist/              # Built extension (generated)
```

### **Available Scripts**
```bash
npm run dev      # Development server with hot reload
npm run build    # Production build
npm run preview  # Preview built extension
```

### **Adding New Quotes**
1. Edit `src/data/quotes.ts`
2. Add quotes with proper categorization and tags
3. Rebuild the extension
4. Quotes automatically integrate with the matching system

### **Adding New Recommendations**
1. Edit `src/data/recommendations.ts`
2. Include proper metadata (type, tags, categories, etc.)
3. Add reasoning for why it should be recommended
4. Rebuild and test

### **Customizing Analysis**
1. Modify `src/services/contextEngine.ts`
2. Adjust keyword lists, sentiment words, or scoring algorithms
3. Update topic categories or add new problem patterns
4. Test with various conversation types

## 🎨 Design System

### **Colors**
- **Primary**: Blue gradient (#3b82f6 to #1d4ed8)
- **Secondary**: Purple gradient (#8b5cf6 to #7c3aed)  
- **Accent**: Orange gradient (#f97316 to #ea580c)
- **Dark**: Slate scale (#0f172a to #64748b)

### **Typography**
- **Display**: Inter (headings, quotes)
- **Body**: Inter (general text)
- **Mono**: JetBrains Mono (code, stats)

### **Components**
- **Glass panels**: Backdrop blur with subtle borders
- **Gradient text**: Multi-color text effects
- **Floating orbs**: Animated background elements
- **Smooth transitions**: Framer Motion animations

## 📈 Performance

### **Optimizations**
- **Lazy loading** - Components load only when needed
- **Debounced updates** - Prevents excessive API calls
- **Efficient storage** - Compressed data with automatic cleanup
- **Smart caching** - Reduces redundant processing
- **Bundle splitting** - Faster initial load times

### **Memory Management**
- **Automatic cleanup** - Old conversations removed after 1 week
- **Storage limits** - Maximum 5 recent conversations stored
- **Observer cleanup** - Proper event listener management
- **Efficient algorithms** - O(n log n) sorting and matching

## 🔍 Troubleshooting

### **Extension Won't Load**
- Ensure you selected the `dist` folder, not the root
- Check that Developer mode is enabled
- Look for errors in `chrome://extensions/`

### **No Quotes Showing**
- Visit a supported AI platform (ChatGPT, Claude, Gemini)
- Have a conversation with at least 50 characters
- Check the popup for analysis status
- Refresh the new tab page

### **Conversations Not Detected**
- Ensure the AI platform is fully loaded
- Check browser console for content script errors
- Try refreshing the AI platform page
- Verify the extension has proper permissions

### **Performance Issues**
- Clear old data via the popup settings
- Restart Chrome if memory usage is high
- Check for conflicting extensions
- Ensure you're using the latest Chrome version

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Add tests for new functionality
5. Update documentation
6. Submit a pull request

### **Code Style**
- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Use Prettier for formatting
- Include error handling

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- **Quote sources**: Historical figures, philosophers, technologists
- **Design inspiration**: Arc Browser, Notion, Linear
- **Technical foundation**: Chrome Extensions API, React, TypeScript
- **Animation library**: Framer Motion
- **Icons**: Lucide React

---

**Built with ❤️ for developers who love beautiful, intelligent tools**

*Transform your new tab experience with the power of AI-driven personalization*
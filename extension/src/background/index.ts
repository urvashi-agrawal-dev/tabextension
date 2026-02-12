// Background service worker
import { analyzeConversation } from "../data/analyzer";
import { quotes, type Quote } from "../data/quotes";

interface StoredConversation {
  text: string;
  platform: string;
  timestamp: string;
  analysis: {
    topics: string[];
    mood: string[];
    intention: string;
    confidence: number;
  };
}

interface UserPreferences {
  enabled: boolean; // Whether to use preferences
  selectedTopics: string[]; // User-selected topics/categories
}

interface StorageData {
  conversations: StoredConversation[];
  currentContext: {
    topics: string[];
    mood: string[];
    intention: string;
  };
  lastUpdated: string;
  shownQuotes: string[]; // Track shown quote texts to avoid repeats
  preferences: UserPreferences; // User preferences
  lastTopic: string; // Last shown topic to ensure rotation
}

const STORAGE_KEY = "contextflow_data";
const MAX_CONVERSATIONS = 10;
const MAX_SHOWN_QUOTES = 1000; // Keep track of last 1000 shown quotes

// Available quote categories
export const AVAILABLE_TOPICS = [
  'tech', 'coding', 'motivation', 'life', 'learning', 'success', 
  'creativity', 'business', 'happiness', 'courage', 'time', 
  'change', 'friendship', 'dreams', 'perseverance', 'growth', 
  'anime', 'wisdom', 'love', 'philosophy'
];

// Initialize background service
console.log("[ContextFlow] Background service worker started");

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request?.type === 'CHAT_HISTORY') {
    // Save raw chat messages and analyze them
    (async () => {
      try {
        await chrome.storage.local.set({ chatHistory: request.data });

        // Build a single text blob for analysis
        const combined = (request.data || []).map((m: any) => m.text || '').join(' ');

        await handleConversationUpdate({
          conversation: combined,
          platform: request.platform || 'chatgpt',
          url: request.url,
          timestamp: request.timestamp || new Date().toISOString()
        });

        sendResponse({ success: true });
      } catch (e) {
        console.error('[ContextFlow] CHAT_HISTORY handler error', e);
        sendResponse({ success: false });
      }
    })();
    return true; // keep channel open for async sendResponse
  }

  if (request.action === "updateConversation") {
    handleConversationUpdate(request);
    sendResponse({ success: true });
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getContext") {
    getStoredContext((context) => {
      sendResponse(context);
    });
    return true; // Keep the message channel open
  }
  
  if (request.action === "getQuote") {
    getRelevantQuote(request.context || null, (quote) => {
      sendResponse(quote);
    });
    return true;
  }
  
  if (request.action === "resetQuotes") {
    (async () => {
      const storage = await chrome.storage.local.get(STORAGE_KEY);
      const storageData: StorageData = storage[STORAGE_KEY] || getDefaultStorageData();
      storageData.shownQuotes = [];
      storageData.lastTopic = "";
      await chrome.storage.local.set({ [STORAGE_KEY]: storageData });
      sendResponse({ success: true });
    })();
    return true;
  }
  
  if (request.action === "getPreferences") {
    getStoredContext((storageData) => {
      sendResponse(storageData.preferences || { enabled: false, selectedTopics: [] });
    });
    return true;
  }
  
  if (request.action === "savePreferences") {
    getStoredContext((storageData) => {
      try {
        const prefs = request.preferences ?? { enabled: false, selectedTopics: [] };
        storageData.preferences = prefs;
        chrome.storage.local.set({ [STORAGE_KEY]: storageData }, () => {
          if (chrome.runtime.lastError) {
            console.error("[ContextFlow] savePreferences storage error", chrome.runtime.lastError);
            sendResponse({ success: false });
          } else {
            sendResponse({ success: true });
          }
        });
      } catch (err) {
        console.error("[ContextFlow] savePreferences error", err);
        sendResponse({ success: false });
      }
    });
    return true; // Keep channel open for async response
  }
});

function getDefaultStorageData(): StorageData {
  return {
    conversations: [],
    currentContext: {
      topics: ["general"],
      mood: ["neutral"],
      intention: "general"
    },
    lastUpdated: "",
    shownQuotes: [],
    preferences: {
      enabled: false,
      selectedTopics: []
    },
    lastTopic: ""
  };
}

async function handleConversationUpdate(data: any) {
  try {
    const analysis = analyzeConversation(data.conversation);
    
    const newConversation: StoredConversation = {
      text: data.conversation.substring(0, 500), // Store first 500 chars
      platform: data.platform,
      timestamp: data.timestamp || new Date().toISOString(),
      analysis
    };
    
    // Get existing data
    const storage = await chrome.storage.local.get(STORAGE_KEY);
    const storageData: StorageData = storage[STORAGE_KEY] || getDefaultStorageData();
    
    // Add new conversation
    storageData.conversations.unshift(newConversation);
    
    // Keep only recent conversations
    if (storageData.conversations.length > MAX_CONVERSATIONS) {
      storageData.conversations = storageData.conversations.slice(0, MAX_CONVERSATIONS);
    }
    
    // Update current context (weighted average of recent conversations)
    updateCurrentContext(storageData);
    
    // Save to storage
    await chrome.storage.local.set({ [STORAGE_KEY]: storageData });
    
    console.log("[ContextFlow] Conversation analyzed:", analysis);
  } catch (error) {
    console.error("[ContextFlow] Error handling conversation:", error);
  }
}

function updateCurrentContext(storageData: StorageData) {
  const recentConversations = storageData.conversations.slice(0, 5);
  
  const topicsCount: Record<string, number> = {};
  const moodCount: Record<string, number> = {};
  let intentions: string[] = [];
  
  recentConversations.forEach((conv) => {
    conv.analysis.topics.forEach((t) => {
      topicsCount[t] = (topicsCount[t] || 0) + 1;
    });
    conv.analysis.mood.forEach((m) => {
      moodCount[m] = (moodCount[m] || 0) + 1;
    });
    intentions.push(conv.analysis.intention);
  });
  
  // Get top topics and moods
  const topTopics = Object.entries(topicsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((e) => e[0]);
  
  const topMoods = Object.entries(moodCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map((e) => e[0]);
  
  // Get most common intention
  const intentionCount: Record<string, number> = {};
  intentions.forEach((i) => {
    intentionCount[i] = (intentionCount[i] || 0) + 1;
  });
  const topIntention = Object.entries(intentionCount)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "general";
  
  storageData.currentContext = {
    topics: topTopics.length > 0 ? topTopics : ["general"],
    mood: topMoods.length > 0 ? topMoods : ["neutral"],
    intention: topIntention
  };
  
  storageData.lastUpdated = new Date().toISOString();
}

function getStoredContext(callback: (context: StorageData) => void) {
  chrome.storage.local.get(STORAGE_KEY, (storage) => {
    const storageData: StorageData = storage[STORAGE_KEY] || getDefaultStorageData();
    callback(storageData);
  });
}

function getRelevantQuote(context: any, callback: (quote: Quote | null) => void) {
  getStoredContext(async (storageData) => {
    const preferences = storageData.preferences || { enabled: false, selectedTopics: [] };
    const lastTopic = storageData.lastTopic || "";
    
    // Get shown quotes list
    const shownQuotes = storageData.shownQuotes || [];
    
    // Filter out already shown quotes
    let availableQuotes = quotes.filter(quote => !shownQuotes.includes(quote.text));
    
    // If all quotes have been shown, reset the list (but keep last 100)
    if (availableQuotes.length === 0) {
      const recentShown = shownQuotes.slice(-100);
      availableQuotes = quotes.filter(quote => !recentShown.includes(quote.text));
      if (availableQuotes.length === 0) {
        availableQuotes = quotes;
      }
    }
    
    let quotesToChooseFrom = availableQuotes;
    
    // Apply user preferences if enabled
    if (preferences.enabled && preferences.selectedTopics.length > 0) {
      quotesToChooseFrom = availableQuotes.filter(quote => 
        quote.category.some(cat => preferences.selectedTopics.includes(cat))
      );
      
      // If no quotes match preferences, fall back to all available
      if (quotesToChooseFrom.length === 0) {
        quotesToChooseFrom = availableQuotes;
      }
    }
    
    // Ensure topic rotation - avoid showing same topic consecutively
    let quotesByTopic: Record<string, Quote[]> = {};
    quotesToChooseFrom.forEach(quote => {
      quote.category.forEach(cat => {
        if (!quotesByTopic[cat]) quotesByTopic[cat] = [];
        quotesByTopic[cat].push(quote);
      });
    });
    
    // Remove last shown topic from options if possible
    if (lastTopic && Object.keys(quotesByTopic).length > 1) {
      const otherTopics = Object.keys(quotesByTopic).filter(t => t !== lastTopic);
      if (otherTopics.length > 0) {
        const randomTopic = otherTopics[Math.floor(Math.random() * otherTopics.length)];
        quotesToChooseFrom = quotesByTopic[randomTopic];
      }
    }
    
    let selectedQuote: Quote;
    
    // If no context provided, return a random quote from available ones
    if (!context) {
      selectedQuote = quotesToChooseFrom[Math.floor(Math.random() * quotesToChooseFrom.length)];
    } else {
      const currentContext = context || storageData.currentContext;
      
      // Filter quotes that match current context
      const matchingQuotes = quotesToChooseFrom.filter((quote) => {
        // Check topic match
        const topicMatch = currentContext.topics && currentContext.topics.some((topic: string) =>
          quote.category.includes(topic)
        );
        
        // Check mood match
        const moodMatch = quote.mood && currentContext.mood && quote.mood.some((m: string) =>
          currentContext.mood.includes(m)
        );
        
        return topicMatch || moodMatch;
      });
      
      // If no perfect match, use any quote from available ones
      selectedQuote = matchingQuotes.length > 0 
        ? matchingQuotes[Math.floor(Math.random() * matchingQuotes.length)]
        : quotesToChooseFrom[Math.floor(Math.random() * quotesToChooseFrom.length)];
    }
    
    // Track the topic of this quote (use first category)
    const quoteTopic = selectedQuote.category[0] || "general";
    
    // Add to shown quotes list
    const updatedShownQuotes = [...shownQuotes, selectedQuote.text];
    if (updatedShownQuotes.length > MAX_SHOWN_QUOTES) {
      updatedShownQuotes.shift(); // Remove oldest
    }
    
    // Update storage
    const updatedStorage = await chrome.storage.local.get(STORAGE_KEY);
    const updatedStorageData: StorageData = updatedStorage[STORAGE_KEY] || getDefaultStorageData();
    updatedStorageData.shownQuotes = updatedShownQuotes;
    updatedStorageData.lastTopic = quoteTopic;
    await chrome.storage.local.set({ [STORAGE_KEY]: updatedStorageData });
    
    callback(selectedQuote);
  });
}

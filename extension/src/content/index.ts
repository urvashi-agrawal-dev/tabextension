// Content script to extract conversations from ChatGPT (2026 UI), Claude, and Gemini

interface ConversationMessage {
  role?: string;
  text: string;
}

function getChatGPTMessages(): ConversationMessage[] {
  const messages: ConversationMessage[] = [];

  // Try multiple selectors for ChatGPT (they change their UI frequently)
  const selectors = [
    '[data-message-author-role]', // New UI
    '[data-message-id]', // Alternative selector
    '.group.w-full', // Message groups
    'div[class*="group"]:has([class*="text"])', // Generic group with text
    '.prose', // Prose content
  ];

  for (const selector of selectors) {
    const nodes = document.querySelectorAll(selector);
    if (nodes.length > 0) {
      nodes.forEach(node => {
        const role = node.getAttribute('data-message-author-role') || 
                    (node.querySelector('[class*="user"]') ? 'user' : undefined) ||
                    (node.querySelector('[class*="assistant"]') ? 'assistant' : undefined);
        const text = (node.textContent || '').trim();
        if (text.length > 50) { // Only include substantial messages
          messages.push({ role, text });
        }
      });
      if (messages.length > 0) break; // Use first selector that works
    }
  }

  // Fallback: try to get any text content from main chat area
  if (messages.length === 0) {
    const chatArea = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
    const textNodes = chatArea.querySelectorAll('p, div[class*="text"], span[class*="text"]');
    textNodes.forEach(node => {
      const text = (node.textContent || '').trim();
      if (text.length > 50 && !messages.some(m => m.text === text)) {
        messages.push({ text });
      }
    });
  }

  return messages;
}

function extractClaudeMessages(): ConversationMessage[] {
  const messages: ConversationMessage[] = [];
  
  // Try multiple selectors for Claude
  const selectors = [
    '[data-test-render-count]',
    '[class*="Message"]',
    '[class*="message"]',
    '.prose',
    'div[class*="content"]',
  ];

  for (const selector of selectors) {
    const nodes = document.querySelectorAll(selector);
    if (nodes.length > 0) {
      nodes.forEach(n => {
        const text = (n.textContent || '').trim();
        if (text.length > 50 && !messages.some(m => m.text === text)) {
          messages.push({ text });
        }
      });
      if (messages.length > 0) break;
    }
  }

  return messages;
}

function extractGeminiMessages(): ConversationMessage[] {
  const messages: ConversationMessage[] = [];
  
  // Try multiple selectors for Gemini
  const selectors = [
    '.message-content',
    '[data-message]',
    '[class*="message"]',
    '[class*="Message"]',
    '.response-text',
    'div[class*="content"]',
  ];

  for (const selector of selectors) {
    const nodes = document.querySelectorAll(selector);
    if (nodes.length > 0) {
      nodes.forEach(n => {
        const text = (n.textContent || '').trim();
        if (text.length > 50 && !messages.some(m => m.text === text)) {
          messages.push({ text });
        }
      });
      if (messages.length > 0) break;
    }
  }

  return messages;
}

function detectPlatform(): 'chatgpt' | 'claude' | 'gemini' | null {
  const url = window.location.href.toLowerCase();
  if (url.includes('chat.openai.com') || url.includes('chatgpt.com')) return 'chatgpt';
  if (url.includes('claude.ai')) return 'claude';
  if (url.includes('gemini.google.com')) return 'gemini';
  return null;
}

function extractMessagesByPlatform(): ConversationMessage[] {
  const platform = detectPlatform();
  if (platform === 'chatgpt') return getChatGPTMessages();
  if (platform === 'claude') return extractClaudeMessages();
  if (platform === 'gemini') return extractGeminiMessages();
  return [];
}

// Respond to direct requests from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request?.action === 'getConversation') {
    const messages = extractMessagesByPlatform();
    sendResponse({ success: true, messages, platform: detectPlatform(), url: window.location.href });
  }
});

// Periodically send chat history to background
let lastMessageCount = 0;
setInterval(() => {
  const platform = detectPlatform();
  if (!platform) return;

  const messages = extractMessagesByPlatform();
  
  // Only send if we have messages and count changed
  if (messages.length > 0 && messages.length !== lastMessageCount) {
    lastMessageCount = messages.length;
    try {
      console.log(`[ContextFlow] Detected ${messages.length} messages on ${platform}`);
      chrome.runtime.sendMessage({
        type: 'CHAT_HISTORY',
        data: messages,
        platform,
        url: window.location.href,
        timestamp: new Date().toISOString()
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('[ContextFlow] Error sending message:', chrome.runtime.lastError);
        } else if (response?.success) {
          console.log('[ContextFlow] Messages sent successfully');
        }
      });
    } catch (e) {
      console.error('[ContextFlow] Error in setInterval:', e);
    }
  }
}, 2000); // Check every 2 seconds

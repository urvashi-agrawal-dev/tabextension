// Content script - extracts conversations from AI chat platforms

function detectPlatform() {
  const url = window.location.href;
  if (url.includes('chat.openai.com')) return 'chatgpt';
  if (url.includes('claude.ai')) return 'claude';
  if (url.includes('gemini.google.com')) return 'gemini';
  return null;
}

function extractMessages() {
  const platform = detectPlatform();
  const messages = [];
  
  if (platform === 'chatgpt') {
    // ChatGPT selectors
    const messageElements = document.querySelectorAll('[data-message-author-role], .group.w-full, [class*="message"]');
    messageElements.forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length > 30) {
        messages.push(text);
      }
    });
  } else if (platform === 'claude') {
    // Claude selectors
    const messageElements = document.querySelectorAll('[class*="Message"], [class*="message"], .prose');
    messageElements.forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length > 30) {
        messages.push(text);
      }
    });
  } else if (platform === 'gemini') {
    // Gemini selectors
    const messageElements = document.querySelectorAll('[class*="message"], [class*="response"]');
    messageElements.forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length > 30) {
        messages.push(text);
      }
    });
  }
  
  // Remove duplicates
  return [...new Set(messages)];
}

// Send messages to background every 5 seconds
let lastMessageCount = 0;
setInterval(() => {
  const platform = detectPlatform();
  if (!platform) return;
  
  const messages = extractMessages();
  
  if (messages.length > 0 && messages.length !== lastMessageCount) {
    lastMessageCount = messages.length;
    
    chrome.runtime.sendMessage({
      type: 'CONVERSATION_UPDATE',
      platform,
      messages,
      timestamp: Date.now()
    }).catch(err => console.log('Message send failed:', err));
  }
}, 5000);

console.log('AI Quote Tab: Content script loaded on', detectPlatform());

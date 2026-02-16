import { quotes } from './quotes.js';

// Track shown quotes to avoid repeats
let shownQuotes = [];

async function loadQuote() {
  const contentEl = document.getElementById('content');
  
  try {
    // Get last analysis from storage
    const { lastAnalysis, lastConversation } = await chrome.storage.local.get(['lastAnalysis', 'lastConversation']);
    
    // Get shown quotes from storage
    const { shownQuoteIds } = await chrome.storage.local.get('shownQuoteIds');
    shownQuotes = shownQuoteIds || [];
    
    // Find relevant quote
    const quote = findRelevantQuote(lastAnalysis);
    
    if (!quote) {
      contentEl.innerHTML = `
        <div class="quote-card">
          <div class="quote-text">Welcome! Visit ChatGPT, Claude, or Gemini to get personalized quotes.</div>
        </div>
        <div class="buttons">
          <button onclick="location.reload()">🔄 Refresh</button>
          <button onclick="openSettings()">⚙️ Settings</button>
        </div>
      `;
      return;
    }
    
    // Mark quote as shown
    shownQuotes.push(quote.text);
    if (shownQuotes.length > 100) {
      shownQuotes = shownQuotes.slice(-100); // Keep last 100
    }
    await chrome.storage.local.set({ shownQuoteIds: shownQuotes });
    
    // Display quote
    const hasContext = lastAnalysis && lastAnalysis.topics && lastAnalysis.topics.length > 0;
    
    contentEl.innerHTML = `
      <div class="quote-card">
        <div class="quote-text">"${quote.text}"</div>
        <div class="quote-author">— ${quote.author}</div>
      </div>
      
      ${hasContext ? `
        <div class="context-info">
          ${lastAnalysis.topics.map(topic => `<div class="tag">📌 ${topic}</div>`).join('')}
          ${lastAnalysis.mood ? `<div class="tag">🎭 ${lastAnalysis.mood}</div>` : ''}
        </div>
      ` : ''}
      
      <div class="buttons">
        <button onclick="location.reload()">✨ New Quote</button>
        <button onclick="openSettings()">⚙️ Settings</button>
      </div>
      
      ${!hasContext ? `
        <div class="no-context">
          💡 Visit ChatGPT, Claude, or Gemini to get context-aware quotes
        </div>
      ` : ''}
    `;
    
  } catch (error) {
    console.error('Error loading quote:', error);
    contentEl.innerHTML = `
      <div class="quote-card">
        <div class="quote-text">Something went wrong. Please refresh.</div>
      </div>
      <div class="buttons">
        <button onclick="location.reload()">🔄 Refresh</button>
      </div>
    `;
  }
}

function findRelevantQuote(analysis) {
  // Filter out already shown quotes
  let availableQuotes = quotes.filter(q => !shownQuotes.includes(q.text));
  
  // If all quotes shown, reset
  if (availableQuotes.length === 0) {
    shownQuotes = [];
    availableQuotes = quotes;
  }
  
  // If no analysis, return random quote
  if (!analysis || !analysis.topics || analysis.topics.length === 0) {
    return availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
  }
  
  // Find quotes matching topics
  const matchingQuotes = availableQuotes.filter(quote => {
    return quote.tags.some(tag => 
      analysis.topics.some(topic => 
        tag.toLowerCase().includes(topic.toLowerCase()) || 
        topic.toLowerCase().includes(tag.toLowerCase())
      )
    );
  });
  
  // Return matching quote or random if no match
  if (matchingQuotes.length > 0) {
    return matchingQuotes[Math.floor(Math.random() * matchingQuotes.length)];
  }
  
  return availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
}

// Make function global for button onclick
window.openSettings = function() {
  chrome.runtime.openOptionsPage?.() || window.open('popup.html', '_blank');
};

// Load quote on page load
loadQuote();

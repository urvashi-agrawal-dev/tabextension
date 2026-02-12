// New tab page script

document.addEventListener("DOMContentLoaded", () => {
  loadQuoteOfDay();
  
  // New Quote button (event delegation)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.id === 'newQuoteBtn' || target.closest('#newQuoteBtn')) {
      e.preventDefault();
      loadQuoteOfDay();
    }
  });
});

function loadQuoteOfDay() {
  const contentEl = document.getElementById("content");
  if (!contentEl) return;

  // Show loading state
  contentEl.innerHTML = `
    <div class="loading">Loading your quote...</div>
  `;

  chrome.runtime.sendMessage(
    { action: "getContext" },
    (storageData: any) => {
      // Always show a quote, even if no conversations detected
      const hasConversations = storageData && storageData.conversations && storageData.conversations.length > 0;
      
      // Get a relevant quote (or random if no context)
      chrome.runtime.sendMessage(
        { action: "getQuote", context: hasConversations ? storageData.currentContext : null },
        (quote: any) => {
          if (quote) {
            // Get quote topic/category
            const quoteTopic = quote.category && quote.category.length > 0 ? quote.category[0] : 'general';
            const topicEmojis: Record<string, string> = {
              'tech': '💻', 'coding': '⚙️', 'motivation': '🚀', 'life': '🌱', 'learning': '📚',
              'success': '🏆', 'creativity': '🎨', 'business': '💼', 'happiness': '😊', 'courage': '💪',
              'time': '⏰', 'change': '🔄', 'friendship': '👥', 'dreams': '✨', 'perseverance': '🔥',
              'growth': '📈', 'anime': '🎌', 'wisdom': '🧠', 'love': '❤️', 'philosophy': '🤔'
            };
            const topicEmoji = topicEmojis[quoteTopic] || '💬';
            
            if (hasConversations) {
              // Show quote with context info
              contentEl.innerHTML = `
                <div class="quote-card">
                  <div class="quote-text">"${quote.text}"</div>
                  <div class="quote-author">— ${quote.author}</div>
                </div>

                <div class="context-info">
                  <div class="info-badge">${topicEmoji} ${quoteTopic.charAt(0).toUpperCase() + quoteTopic.slice(1)}</div>
                  <div class="info-badge">📌 ${storageData.currentContext.topics.join(", ") || "General"}</div>
                  <div class="info-badge">🎭 ${storageData.currentContext.mood.join(", ") || "Neutral"}</div>
                </div>

                <div class="button-group">
                  <button id="newQuoteBtn">✨ New Quote</button>
                </div>
              `;
            } else {
              // Show quote without context
              contentEl.innerHTML = `
                <div class="quote-card">
                  <div class="quote-text">"${quote.text}"</div>
                  <div class="quote-author">— ${quote.author}</div>
                </div>

                <div class="context-info">
                  <div class="info-badge">${topicEmoji} ${quoteTopic.charAt(0).toUpperCase() + quoteTopic.slice(1)}</div>
                </div>

                <div class="button-group">
                  <button id="newQuoteBtn">✨ New Quote</button>
                </div>
              `;
            }
          } else {
            // Fallback if quote loading fails
            contentEl.innerHTML = `
              <div class="no-data">
                <p>👋 Welcome to ContextFlow!</p>
                <p>Loading your quote...</p>
                <div class="button-group" style="margin-top: 30px;">
                  <button id="newQuoteBtn">🔄 Refresh</button>
                </div>
              </div>
            `;
          }
        }
      );
    }
  );
}


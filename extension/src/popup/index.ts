// Popup script

document.addEventListener("DOMContentLoaded", () => {
  loadContext();
  setupEventListeners();
});

function loadContext() {
  chrome.runtime.sendMessage(
    { action: "getContext" },
    (storageData: any) => {
      if (storageData) {
        // Update topics
        const topicsEl = document.getElementById("topics");
        if (topicsEl) {
          topicsEl.innerHTML = storageData.currentContext.topics
            .map((t: string) => `<span class="badge">${t}</span>`)
            .join("");
        }

        // Update mood
        const moodEl = document.getElementById("mood");
        if (moodEl) {
          moodEl.innerHTML = storageData.currentContext.mood
            .map((m: string) => `<span class="badge">${m}</span>`)
            .join("");
        }

        // Update intention
        const intentionEl = document.getElementById("intention");
        if (intentionEl) {
          intentionEl.innerHTML = `<span class="badge">${storageData.currentContext.intention}</span>`;
        }

        // Display conversations
        displayConversations(storageData.conversations);
      }
    }
  );
}

function displayConversations(conversations: any[]) {
  const container = document.getElementById("conversations");
  if (!container) return;

  if (conversations.length === 0) {
    container.innerHTML = '<div class="status">No conversations analyzed yet</div>';
    return;
  }

  container.innerHTML = conversations
    .slice(0, 5)
    .map(
      (conv: any) => `
    <div class="conversation-item">
        <div class="platform-badge">${conv.platform.toUpperCase()}</div>
        <div style="margin-top: 5px; opacity: 0.8;">
            ${conv.text.substring(0, 80)}...
        </div>
        <div style="margin-top: 5px; font-size: 11px; opacity: 0.6;">
            ${new Date(conv.timestamp).toLocaleString()}
        </div>
    </div>
  `
    )
    .join("");
}

function setupEventListeners() {
  // Refresh button
  const refreshBtn = document.getElementById("refreshBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (tabs: any[]) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(
              tabs[0].id!,
              { action: "getConversation" },
              (response: any) => {
                if (response && response.success) {
                  const statusEl = document.getElementById("status");
                  if (statusEl) {
                    statusEl.textContent =
                      "✅ Conversation extracted from " + response.platform;
                  }
                  loadContext();
                }
              }
            );
          }
        }
      );
    });
  }

  // Quote button
  const quoteBtn = document.getElementById("quoteBtn");
  if (quoteBtn) {
    quoteBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage(
        { action: "getQuote" },
        (quote: any) => {
          if (quote) {
            alert(`\n"${quote.text}"\n\n— ${quote.author}`);
          }
        }
      );
    });
  }
}

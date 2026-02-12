// Available topics (keep in sync with background)
const AVAILABLE_TOPICS = [
  { id: 'tech', label: '💻 Tech' },
  { id: 'coding', label: '⚙️ Coding' },
  { id: 'motivation', label: '🚀 Motivation' },
  { id: 'life', label: '🌱 Life' },
  { id: 'learning', label: '📚 Learning' },
  { id: 'success', label: '🏆 Success' },
  { id: 'creativity', label: '🎨 Creativity' },
  { id: 'business', label: '💼 Business' },
  { id: 'happiness', label: '😊 Happiness' },
  { id: 'courage', label: '💪 Courage' },
  { id: 'time', label: '⏰ Time' },
  { id: 'change', label: '🔄 Change' },
  { id: 'friendship', label: '👥 Friendship' },
  { id: 'dreams', label: '✨ Dreams' },
  { id: 'perseverance', label: '🔥 Perseverance' },
  { id: 'growth', label: '📈 Growth' },
  { id: 'anime', label: '🎌 Anime' },
  { id: 'wisdom', label: '🧠 Wisdom' },
  { id: 'love', label: '❤️ Love' },
  { id: 'philosophy', label: '🤔 Philosophy' }
];

const STORAGE_KEY = 'contextflow_data';

interface UserPreferences {
  enabled: boolean;
  selectedTopics: string[];
}

interface StorageData {
  conversations: any[];
  currentContext: {
    topics: string[];
    mood: string[];
    intention: string;
  };
  lastUpdated: string;
  shownQuotes: string[];
  preferences?: UserPreferences;
  lastTopic?: string;
}

function getDefaultStorageData(): StorageData {
  return {
    conversations: [],
    currentContext: {
      topics: ['general'],
      mood: ['neutral'],
      intention: 'general',
    },
    lastUpdated: '',
    shownQuotes: [],
    preferences: {
      enabled: false,
      selectedTopics: [],
    },
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('context');
  if (!container) return;

  // Read everything directly from storage (no messaging)
  chrome.storage.local.get(STORAGE_KEY, (storage) => {
    const storageData: StorageData =
      (storage[STORAGE_KEY] as StorageData) || getDefaultStorageData();

    const prefs: UserPreferences =
      storageData.preferences || { enabled: false, selectedTopics: [] };

    const detectedTopics = storageData.currentContext?.topics || ['general'];
    const mood = storageData.currentContext?.mood || ['neutral'];
    const intention = storageData.currentContext?.intention || 'general';
    const conversationsCount = Array.isArray(storageData.conversations) ? storageData.conversations.length : 0;
    const shownQuotesCount = Array.isArray(storageData.shownQuotes) ? storageData.shownQuotes.length : 0;
    const selectedTopicsBadges =
      prefs.enabled && prefs.selectedTopics.length > 0
        ? prefs.selectedTopics
            .map(
              (id: string) =>
                `<span class="badge">${AVAILABLE_TOPICS.find((t) => t.id === id)?.label || id}</span>`
            )
            .join(' ')
        : '<span class="badge">All topics</span>';

    container.innerHTML = `
        <div class="section">
          <h2>🎯 Quote Preferences</h2>
          <div class="preferences-toggle">
            <label class="toggle-switch">
              <input type="checkbox" id="preferencesEnabled" ${prefs.enabled ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
            <div>
              <strong>Enable Topic Preferences</strong>
              <div class="info-text">Choose which topics you want to see quotes from. Leave unchecked to see quotes from all topics.</div>
            </div>
          </div>
          
          <div id="topicsContainer" style="display: ${prefs.enabled ? 'block' : 'none'};">
            <h3>Select Your Favorite Topics:</h3>
            <div class="topics-grid">
              ${AVAILABLE_TOPICS.map(topic => `
                <div class="topic-checkbox ${prefs.selectedTopics.includes(topic.id) ? 'checked' : ''}" data-topic="${topic.id}">
                  <input type="checkbox" id="topic-${topic.id}" ${prefs.selectedTopics.includes(topic.id) ? 'checked' : ''}>
                  <label for="topic-${topic.id}">${topic.label}</label>
                </div>
              `).join('')}
            </div>
            <div class="info-text" style="margin-top: 15px;">
              💡 <strong>Tip:</strong> Quotes will rotate through different topics to keep things interesting!
            </div>
          </div>
          
          <button id="saveBtn" class="save-button">💾 Save Preferences</button>
        </div>
        
        <div class="section">
          <h2>📊 Your Preferences & Context</h2>
          <div style="margin-top: 15px;">
            <div><strong>Your selected topics:</strong> ${selectedTopicsBadges}</div>
            <div class="info-text" style="margin-top: 12px;">
              Quotes on your new tab use the topics above when "Enable Topic Preferences" is on.
            </div>
            <div style="margin-top: 16px;"><strong>Detected from AI (ChatGPT/Claude/Gemini):</strong></div>
            <div style="margin-top: 8px;"><strong>Topics:</strong> ${detectedTopics.map((t: string) => `<span class="badge">${t}</span>`).join('')}</div>
            <div style="margin-top: 8px;"><strong>Mood:</strong> ${mood.map((m: string) => `<span class="badge">${m}</span>`).join('')}</div>
            <div style="margin-top: 8px;"><strong>Intention:</strong> <span class="badge">${intention}</span></div>
          </div>
        </div>
        
        <div class="section">
          <h2>📈 Statistics</h2>
          <div class="stats">
            <div class="stat-item">
              <div class="stat-value">${conversationsCount}</div>
              <div class="stat-label">📊 Conversations Analyzed</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${shownQuotesCount}</div>
              <div class="stat-label">💬 Quotes Shown</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${prefs.enabled ? prefs.selectedTopics.length : 'All'}</div>
              <div class="stat-label">🎯 Selected Topics</div>
            </div>
          </div>
          <div class="info-text" style="margin-top: 12px;">
            "Quotes Shown" increases each time you open a new tab or click New Quote. "Conversations Analyzed" updates when you use ChatGPT, Claude, or Gemini.
          </div>
        </div>
        
        <div class="section">
          <h2>⚙️ Actions</h2>
          <button id="resetBtn" class="save-button" style="background: #ff6b6b;">
            🔄 Reset Quote History
          </button>
          <div class="info-text" style="margin-top: 10px;">
            This will clear your quote history so you can see quotes again that were previously shown.
          </div>
        </div>
      `;

    // Toggle preferences visibility
    const toggleSwitch = document.getElementById(
      'preferencesEnabled'
    ) as HTMLInputElement | null;
    const topicsContainer = document.getElementById('topicsContainer');

    if (toggleSwitch && topicsContainer) {
      topicsContainer.style.display = toggleSwitch.checked ? 'block' : 'none';
      toggleSwitch.addEventListener('change', () => {
        topicsContainer.style.display = toggleSwitch.checked ? 'block' : 'none';
      });
    }

    // Handle topic checkbox clicks
    document.querySelectorAll('.topic-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('click', (e) => {
        const input = checkbox.querySelector(
          'input[type="checkbox"]'
        ) as HTMLInputElement;
        if (e.target !== input) {
          input.checked = !input.checked;
        }
        checkbox.classList.toggle('checked', input.checked);
      });
    });

    // Save button handler - re-read storage then only update preferences
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const enabled =
          (document.getElementById('preferencesEnabled') as HTMLInputElement)
            ?.checked || false;
        const selectedTopics: string[] = [];

        document
          .querySelectorAll(
            '.topic-checkbox input[type="checkbox"]:checked'
          )
          .forEach((checkbox: any) => {
            const topicId = checkbox.id.replace('topic-', '');
            selectedTopics.push(topicId);
          });

        // Re-read current storage so we don't overwrite shownQuotes / statistics
        chrome.storage.local.get(STORAGE_KEY, (storage) => {
          const current: StorageData =
            (storage[STORAGE_KEY] as StorageData) || getDefaultStorageData();
          const updated: StorageData = {
            ...current,
            preferences: { enabled, selectedTopics },
          };

          chrome.storage.local.set({ [STORAGE_KEY]: updated }, () => {
            if (chrome.runtime.lastError) {
              alert('❌ Failed to save: ' + chrome.runtime.lastError.message);
            } else {
              alert(
                '✅ Preferences saved! Your quotes will now match your preferences.'
              );
              location.reload();
            }
          });
        });
      });
    }

    // Reset button handler - re-read storage then clear shownQuotes
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (
          confirm(
            'Are you sure you want to reset your quote history? This will allow previously shown quotes to appear again.'
          )
        ) {
          chrome.storage.local.get(STORAGE_KEY, (storage) => {
            const current: StorageData =
              (storage[STORAGE_KEY] as StorageData) || getDefaultStorageData();
            const updated: StorageData = {
              ...current,
              shownQuotes: [],
              lastTopic: '',
            };
            chrome.storage.local.set({ [STORAGE_KEY]: updated }, () => {
              if (chrome.runtime.lastError) {
                alert('❌ Failed to reset: ' + chrome.runtime.lastError.message);
              } else {
                alert('✅ Quote history reset! New quotes will appear.');
                location.reload();
              }
            });
          });
        }
      });
    }
  });
});

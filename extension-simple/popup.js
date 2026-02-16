// Popup settings script

// Load current settings
async function loadSettings() {
  const { apiKey, apiProvider, shownQuoteIds, lastAnalysis } = await chrome.storage.local.get([
    'apiKey',
    'apiProvider',
    'shownQuoteIds',
    'lastAnalysis'
  ]);

  document.getElementById('apiProvider').value = apiProvider || '';
  document.getElementById('apiKey').value = apiKey || '';
  document.getElementById('quoteCount').textContent = (shownQuoteIds || []).length;
  document.getElementById('contextStatus').textContent = lastAnalysis ? '✅' : '❌';
}

// Save settings
document.getElementById('saveBtn').addEventListener('click', async () => {
  const apiProvider = document.getElementById('apiProvider').value;
  const apiKey = document.getElementById('apiKey').value;

  await chrome.storage.local.set({ apiProvider, apiKey });

  const statusEl = document.getElementById('saveStatus');
  statusEl.innerHTML = '<div class="success">✅ Settings saved!</div>';
  setTimeout(() => {
    statusEl.innerHTML = '';
  }, 2000);
});

// Reset shown quotes
document.getElementById('resetBtn').addEventListener('click', async () => {
  await chrome.storage.local.set({ shownQuoteIds: [] });
  document.getElementById('quoteCount').textContent = '0';
  alert('✅ Quote history reset! You\'ll see all quotes again.');
});

// Test API connection
document.getElementById('testBtn').addEventListener('click', async () => {
  const apiProvider = document.getElementById('apiProvider').value;
  const apiKey = document.getElementById('apiKey').value;

  if (!apiProvider || !apiKey) {
    alert('❌ Please select a provider and enter an API key first.');
    return;
  }

  const btn = document.getElementById('testBtn');
  btn.textContent = 'Testing...';
  btn.disabled = true;

  try {
    let response;
    
    if (apiProvider === 'openrouter') {
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': chrome.runtime.getURL(''),
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Say "test successful" if you can read this.' }],
          max_tokens: 10
        })
      });
    } else if (apiProvider === 'openai') {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Say "test successful" if you can read this.' }],
          max_tokens: 10
        })
      });
    }

    if (response.ok) {
      alert('✅ Connection successful! AI analysis is working.');
    } else {
      const error = await response.json();
      alert(`❌ Connection failed: ${error.error?.message || 'Unknown error'}`);
    }
  } catch (error) {
    alert(`❌ Connection failed: ${error.message}`);
  } finally {
    btn.textContent = 'Test Connection';
    btn.disabled = false;
  }
});

// Load settings on popup open
loadSettings();

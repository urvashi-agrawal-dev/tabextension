// Background service worker

// Listen for conversation updates from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CONVERSATION_UPDATE') {
    handleConversationUpdate(message);
  }
});

async function handleConversationUpdate(data) {
  try {
    // Get the last 10 messages (most recent context)
    const recentMessages = data.messages.slice(-10).join(' ');
    
    // Store conversation
    await chrome.storage.local.set({
      lastConversation: {
        text: recentMessages,
        platform: data.platform,
        timestamp: data.timestamp
      }
    });
    
    // Analyze with AI (if API key is set)
    const { apiKey, apiProvider } = await chrome.storage.local.get(['apiKey', 'apiProvider']);
    
    if (apiKey && apiProvider) {
      const analysis = await analyzeWithAI(recentMessages, apiKey, apiProvider);
      await chrome.storage.local.set({ lastAnalysis: analysis });
    } else {
      // Fallback to simple keyword analysis
      const analysis = simpleAnalysis(recentMessages);
      await chrome.storage.local.set({ lastAnalysis: analysis });
    }
    
    console.log('Conversation updated:', data.platform);
  } catch (error) {
    console.error('Error handling conversation:', error);
  }
}

// Simple keyword-based analysis (fallback)
function simpleAnalysis(text) {
  const lowerText = text.toLowerCase();
  const topics = [];
  const mood = 'neutral';
  
  // Detect topics
  if (lowerText.match(/code|bug|error|debug|programming|function|api/)) topics.push('coding');
  if (lowerText.match(/learn|study|understand|explain|how to|tutorial/)) topics.push('learning');
  if (lowerText.match(/stress|anxiety|worry|difficult|hard|struggle/)) topics.push('stress');
  if (lowerText.match(/motivat|inspir|goal|success|achieve/)) topics.push('motivation');
  if (lowerText.match(/ai|machine learning|neural|model|training/)) topics.push('ai');
  if (lowerText.match(/design|creative|art|beautiful|aesthetic/)) topics.push('creativity');
  if (lowerText.match(/business|startup|company|market|customer/)) topics.push('business');
  if (lowerText.match(/time|deadline|schedule|urgent|quick/)) topics.push('time');
  if (lowerText.match(/team|collaborate|together|group|meeting/)) topics.push('collaboration');
  if (lowerText.match(/focus|concentrate|distract|attention/)) topics.push('focus');
  
  return {
    topics: topics.length > 0 ? topics : ['general'],
    mood,
    summary: text.substring(0, 200) + '...'
  };
}

// AI-powered analysis using OpenRouter or OpenAI
async function analyzeWithAI(text, apiKey, provider) {
  try {
    const prompt = `Analyze this conversation and extract:
1. Main topics (choose from: coding, learning, stress, motivation, ai, creativity, business, time, collaboration, focus, debugging, problem-solving, innovation, philosophy, wisdom, challenges, teamwork, change, courage, happiness)
2. Overall mood (positive, neutral, negative, confused, excited, stressed)
3. Brief summary (1 sentence)

Conversation: "${text.substring(0, 1000)}"

Respond in JSON format:
{
  "topics": ["topic1", "topic2"],
  "mood": "mood",
  "summary": "brief summary"
}`;

    let response;
    
    if (provider === 'openrouter') {
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': chrome.runtime.getURL(''),
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3
        })
      });
    } else if (provider === 'openai') {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3
        })
      });
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON response
    const analysis = JSON.parse(content);
    return analysis;
    
  } catch (error) {
    console.error('AI analysis failed, using fallback:', error);
    return simpleAnalysis(text);
  }
}

console.log('AI Quote Tab: Background service worker started');

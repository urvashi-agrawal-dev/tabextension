export interface ConversationAnalysis {
  topics: string[];
  mood: string[];
  intention: string;
  confidence: number;
}

const topicKeywords = {
  tech: ["code", "bug", "error", "debug", "api", "database", "server", "frontend", "backend", "javascript", "python", "react", "node", "algorithm", "function", "class", "variable", "deploy"],
  coding: ["coding", "programming", "developer", "software", "script", "compile", "runtime", "syntax", "variable", "function"],
  anime: ["anime", "manga", "character", "episode", "series", "protagonist", "villain", "fight", "power", "ability", "season"],
  learning: ["learn", "study", "tutorial", "course", "understand", "explain", "how to", "guide", "documentation", "resource"],
  business: ["business", "startup", "company", "entrepreneur", "market", "sales", "customer", "profit", "investment", "strategy", "plan"],
  motivation: ["motivat", "inspi", "dream", "goal", "ambition", "success", "achieve", "overcome"],
  stress: ["stress", "anxiety", "worry", "overwhelm", "confused", "lost", "stuck", "difficult", "challenge"],
  life: ["life", "personal", "relationship", "family", "friend", "work-life", "balance"]
};

const moodKeywords = {
  excited: ["excited", "awesome", "great", "amazing", "love it", "perfect", "brilliant", "excellent", "wow", "cool"],
  tired: ["tired", "exhausted", "fatigue", "drain", "burnt out", "overwhelm", "stressed out"],
  confused: ["confused", "unclear", "don't understand", "how to", "help", "stuck", "lost", "error", "broken"],
  focused: ["focus", "concentrate", "working on", "progress", "getting done", "productive"],
  stressed: ["stress", "anxiety", "worry", "panic", "afraid", "scared", "nervous"],
  motivated: ["motivat", "inspi", "determined", "driven", "passion", "committed"]
};

const intentionKeywords = {
  learning: ["explain", "how to", "tutorial", "learn", "understand", "teach me", "what is"],
  debugging: ["bug", "error", "doesn't work", "broken", "fix", "debug", "not working"],
  planning: ["plan", "organize", "strategy", "structure", "design", "architecture"],
  advice: ["advice", "should i", "recommend", "opinion", "suggest", "thoughts on"],
  building: ["build", "create", "develop", "make", "implement", "project"],
  exploring: ["explore", "think about", "consider", "discuss", "what if"]
};

export function analyzeConversation(text: string): ConversationAnalysis {
  const lowerText = text.toLowerCase();
  
  // Detect topics
  const topics: string[] = [];
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    const count = keywords.filter(k => lowerText.includes(k)).length;
    if (count > 0) {
      topics.push(topic);
    }
  }
  
  // Detect mood
  const mood: string[] = [];
  for (const [m, keywords] of Object.entries(moodKeywords)) {
    const count = keywords.filter(k => lowerText.includes(k)).length;
    if (count > 0) {
      mood.push(m);
    }
  }
  
  // Detect intention
  let intention = "general";
  for (const [intent, keywords] of Object.entries(intentionKeywords)) {
    if (keywords.some(k => lowerText.includes(k))) {
      intention = intent;
      break;
    }
  }
  
  // Calculate confidence (0-1)
  const confidence = Math.min(1, (topics.length + mood.length) / 4);
  
  return {
    topics: topics.length > 0 ? topics : ["general"],
    mood: mood.length > 0 ? mood : ["neutral"],
    intention,
    confidence
  };
}

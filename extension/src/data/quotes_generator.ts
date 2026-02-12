// Quote generator to create a massive database of quotes
export interface Quote {
  text: string;
  author: string;
  category: string[];
  mood?: string[];
}

// Categories and their quote templates
const quoteTemplates = {
  tech: [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
    { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
    { text: "Debugging is twice as hard as writing the code in the first place.", author: "Brian Kernighan" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
    { text: "Premature optimization is the root of all evil.", author: "Donald Knuth" },
    { text: "The computer was born to solve problems that did not exist before.", author: "Bill Gates" },
    { text: "Software is a great combination between artistry and engineering.", author: "Bill Gates" },
  ],
  motivation: [
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
    { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { text: "The only way out is through.", author: "Robert Frost" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "I can't change the direction of the wind, but I can adjust my sails to always reach my destination.", author: "Jimmy Dean" },
  ],
  learning: [
    { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
    { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
    { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "William Butler Yeats" },
    { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Tell me and I forget, teach me and I may remember, involve me and I learn.", author: "Benjamin Franklin" },
    { text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.", author: "Albert Einstein" },
  ],
  life: [
    { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "Happiness is not by chance, but by choice.", author: "Jim Rohn" },
    { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll" },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
    { text: "Get busy living or get busy dying.", author: "Stephen King" },
    { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
    { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
    { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
  ],
  business: [
    { text: "Don't go to work to make money; go to work to change the world.", author: "Steve Jobs" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Ideas are easy. Execution is everything.", author: "John Doerr" },
    { text: "Overnight success usually takes about 15 years.", author: "Vera Wang" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
    { text: "The successful warrior is the average man with laser-like focus.", author: "Bruce Lee" },
  ],
  philosophy: [
    { text: "The unexamined life is not worth living.", author: "Socrates" },
    { text: "I think, therefore I am.", author: "René Descartes" },
    { text: "The only thing I know is that I know nothing.", author: "Socrates" },
    { text: "It is not death that a man should fear, but he should fear never beginning to live.", author: "Marcus Aurelius" },
    { text: "The mind is everything. What you think you become.", author: "Buddha" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
    { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein" },
    { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  ],
  creativity: [
    { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
    { text: "Imagination is more important than knowledge.", author: "Albert Einstein" },
    { text: "The creative adult is the child who survived.", author: "Ursula K. Le Guin" },
    { text: "To live a creative life, we must lose our fear of being wrong.", author: "Joseph Chilton Pearce" },
    { text: "Creativity takes courage.", author: "Henri Matisse" },
    { text: "The worst enemy of creativity is self-doubt.", author: "Sylvia Plath" },
    { text: "You can't use up creativity. The more you use, the more you have.", author: "Maya Angelou" },
    { text: "Creativity is a wild mind and a disciplined eye.", author: "Dorothy Parker" },
    { text: "Art is the lie that enables us to realize the truth.", author: "Pablo Picasso" },
    { text: "The creative process is a process of surrender, not control.", author: "Julia Cameron" },
  ],
  success: [
    { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
    { text: "The road to success and the road to failure are almost exactly the same.", author: "Colin R. Davis" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
    { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
    { text: "The successful warrior is the average man with laser-like focus.", author: "Bruce Lee" },
    { text: "Try not to become a person of success, but rather try to become a person of value.", author: "Albert Einstein" },
    { text: "Success is not in what you have, but who you are.", author: "Bo Bennett" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  ],
  wisdom: [
    { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
    { text: "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.", author: "Albert Einstein" },
    { text: "The fool doth think he is wise, but the wise man knows himself to be a fool.", author: "William Shakespeare" },
    { text: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix" },
    { text: "The wise find pleasure in water; the virtuous find pleasure in hills.", author: "Confucius" },
    { text: "Wisdom is the reward you get for a lifetime of listening when you'd have preferred to talk.", author: "Doug Larson" },
    { text: "The older I get, the more I realize the value of privacy, of cultivating your circle and only letting certain people in.", author: "Unknown" },
    { text: "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.", author: "Albert Einstein" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  ],
  love: [
    { text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.", author: "Lao Tzu" },
    { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
    { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
    { text: "We are most alive when we're in love.", author: "John Updike" },
    { text: "The greatest thing you'll ever learn is just to love and be loved in return.", author: "Eden Ahbez" },
    { text: "Love recognizes no barriers. It jumps hurdles, leaps fences, penetrates walls to arrive at its destination full of hope.", author: "Maya Angelou" },
    { text: "To love and be loved is to feel the sun from both sides.", author: "David Viscott" },
    { text: "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.", author: "Unknown" },
    { text: "The best love is the kind that awakens the soul and makes us reach for more.", author: "Nicholas Sparks" },
    { text: "Love is friendship that has caught fire.", author: "Ann Landers" },
  ],
  courage: [
    { text: "Courage is not the absence of fear, but action in spite of it.", author: "Mark Twain" },
    { text: "You have been assigned this mountain to show others it can be moved.", author: "Mel Robbins" },
    { text: "Courage is grace under pressure.", author: "Ernest Hemingway" },
    { text: "The only way out is through.", author: "Robert Frost" },
    { text: "Be brave enough to live life creatively.", author: "Alan Alda" },
    { text: "Courage is the most important of all the virtues because without courage, you can't practice any other virtue consistently.", author: "Maya Angelou" },
    { text: "It takes courage to grow up and become who you really are.", author: "E.E. Cummings" },
    { text: "The brave man is not he who does not feel afraid, but he who conquers that fear.", author: "Nelson Mandela" },
    { text: "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.'", author: "Mary Anne Radmacher" },
    { text: "You gain strength, courage, and confidence by every experience in which you really stop to look fear in the face.", author: "Eleanor Roosevelt" },
  ],
  happiness: [
    { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
    { text: "Happiness is not by chance, but by choice.", author: "Jim Rohn" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
    { text: "The secret of happiness is to find a congenial work.", author: "Pearl S. Buck" },
    { text: "Happiness is when what you think, what you say, and what you do are in harmony.", author: "Mahatma Gandhi" },
    { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
    { text: "Happiness is a butterfly, which when pursued, is always just beyond your grasp.", author: "Nathaniel Hawthorne" },
    { text: "The greatest happiness you can have is knowing that you do not necessarily require happiness.", author: "William Saroyan" },
    { text: "Happiness is not a goal; it is a by-product.", author: "Eleanor Roosevelt" },
  ],
  time: [
    { text: "Time is what we want most, but what we use worst.", author: "William Penn" },
    { text: "Lost time is never found again.", author: "Benjamin Franklin" },
    { text: "Time is the most valuable thing a man can spend.", author: "Theophrastus" },
    { text: "The two most powerful warriors are patience and time.", author: "Leo Tolstoy" },
    { text: "Time you enjoy wasting is not wasted time.", author: "Marthe Troly-Curtin" },
    { text: "Time is a created thing. To say 'I don't have time' is like saying, 'I don't want to.'", author: "Lao Tzu" },
    { text: "The future is something which everyone reaches at the rate of 60 minutes an hour.", author: "C.S. Lewis" },
    { text: "Time is the longest distance between two places.", author: "Tennessee Williams" },
    { text: "Time is money.", author: "Benjamin Franklin" },
    { text: "Time flies over us, but leaves its shadow behind.", author: "Nathaniel Hawthorne" },
  ],
  change: [
    { text: "The only way to make sense out of change is to plunge into it, move with it, and dance with it.", author: "Alan Watts" },
    { text: "Change is the only constant in life.", author: "Heraclitus" },
    { text: "If you want to make enemies, try to change something.", author: "Woodrow Wilson" },
    { text: "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.", author: "Albert Einstein" },
    { text: "Progress is impossible without change, and those who cannot change their minds cannot change anything.", author: "George Bernard Shaw" },
    { text: "Change your thoughts and you change your world.", author: "Norman Vincent Peale" },
    { text: "The secret of change is to focus all of your energy not on fighting the old, but on building the new.", author: "Socrates" },
    { text: "It is not the strongest of the species that survive, nor the most intelligent, but the one most responsive to change.", author: "Charles Darwin" },
    { text: "Change before you have to.", author: "Jack Welch" },
    { text: "The first step toward change is awareness. The second step is acceptance.", author: "Nathaniel Branden" },
  ],
  friendship: [
    { text: "A friend is someone who knows all about you and still loves you.", author: "Elbert Hubbard" },
    { text: "Friendship is born at that moment when one person says to another: 'What! You too? I thought I was the only one.'", author: "C.S. Lewis" },
    { text: "True friendship comes when the silence between two people is comfortable.", author: "David Tyson" },
    { text: "A real friend is one who walks in when the rest of the world walks out.", author: "Walter Winchell" },
    { text: "Friendship is the only cement that will ever hold the world together.", author: "Woodrow Wilson" },
    { text: "A friend is one that knows you as you are, understands where you have been, accepts what you have become, and still, gently allows you to grow.", author: "William Shakespeare" },
    { text: "The language of friendship is not words but meanings.", author: "Henry David Thoreau" },
    { text: "Friendship is the hardest thing in the world to explain. It's not something you learn in school. But if you haven't learned the meaning of friendship, you really haven't learned anything.", author: "Muhammad Ali" },
    { text: "A single rose can be my garden, a single friend, my world.", author: "Leo Buscaglia" },
    { text: "Friendship is the golden thread that ties the heart of all the world.", author: "John Evelyn" },
  ],
  dreams: [
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
    { text: "All our dreams can come true, if we have the courage to pursue them.", author: "Walt Disney" },
    { text: "Dreams are illustrations from the book your soul is writing about you.", author: "Marsha Norman" },
    { text: "The only thing that stands between you and your dream is the will to try and the belief that it is actually possible.", author: "Joel Brown" },
    { text: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau" },
    { text: "Dreams don't work unless you do.", author: "John C. Maxwell" },
    { text: "The biggest adventure you can take is to live the life of your dreams.", author: "Oprah Winfrey" },
    { text: "If you can dream it, you can do it.", author: "Walt Disney" },
    { text: "Dreams are the seeds of change. Nothing grows without a seed, and nothing changes without a dream.", author: "Debby Boone" },
  ],
  perseverance: [
    { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Perseverance is not a long race; it is many short races one after the other.", author: "Walter Elliott" },
    { text: "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack of will.", author: "Vince Lombardi" },
    { text: "Perseverance is failing 19 times and succeeding the 20th.", author: "Julie Andrews" },
    { text: "I am not discouraged, because every wrong attempt discarded is another step forward.", author: "Thomas Edison" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Perseverance is the hard work you do after you get tired of doing the hard work you already did.", author: "Newt Gingrich" },
    { text: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.", author: "Thomas Edison" },
  ],
  growth: [
    { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
    { text: "Growth begins at the end of your comfort zone.", author: "Neale Donald Walsch" },
    { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "We cannot become what we want by remaining what we are.", author: "Max De Pree" },
    { text: "Personal growth is not a matter of learning new information but of unlearning old limits.", author: "Alan Cohen" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Growth is the only evidence of life.", author: "John Henry Newman" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "What we achieve inwardly will change outer reality.", author: "Plutarch" },
  ],
  anime: [
    { text: "It's not about having a better future. It's about believing in a better future.", author: "Attack on Titan" },
    { text: "I'm not gonna die in some dungeon. I'm gonna become a legend!", author: "That Time I Got Reincarnated as a Spider" },
    { text: "The difference between your decision and ours is experience. But you don't have to rely on that.", author: "Attack on Titan" },
    { text: "I'm not special. I'm just a guy who keeps his promises.", author: "Jujutsu Kaisen" },
    { text: "Don't underestimate us. We are not afraid to die protecting each other.", author: "Demon Slayer" },
    { text: "A person grows up when he's able to overcome hardships. Protection is important, but there are some things that a person must learn on his own.", author: "Jiraiya, Naruto" },
    { text: "Hard work betrays none, but dreams betray many.", author: "Hachiman Hikigaya" },
    { text: "If you don't like your destiny, don't accept it. Instead, have the courage to change it the way you want it to be.", author: "Naruto Uzumaki" },
    { text: "The moment you think of giving up, think of the reason why you held on so long.", author: "Natsu Dragneel" },
    { text: "Sometimes life is like this tunnel. You can't always see the light at the end of the tunnel, but if you keep moving, you will come to a better place.", author: "Iroh, Avatar" },
  ],
};

// Generate quotes by combining templates with variations
function generateQuotes(): Quote[] {
  const quotes: Quote[] = [];
  const categories = Object.keys(quoteTemplates);
  const moods = ["excited", "motivated", "focused", "productive", "tired", "stressed", "confused", "neutral"];
  
  // Add all template quotes
  categories.forEach(category => {
    quoteTemplates[category as keyof typeof quoteTemplates].forEach(template => {
      quotes.push({
        text: template.text,
        author: template.author,
        category: [category],
        mood: [moods[Math.floor(Math.random() * moods.length)]],
      });
    });
  });

  // Generate variations and additional quotes
  const additionalQuotes = [
    // Tech variations
    { text: "Clean code always looks like it was written by someone who cares.", author: "Robert C. Martin", category: ["tech", "coding"], mood: ["focused", "productive"] },
    { text: "The best code is no code at all.", author: "Jeff Atwood", category: ["tech", "coding"], mood: ["focused"] },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck", category: ["tech", "coding"], mood: ["productive"] },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", category: ["tech", "design"], mood: ["focused"] },
    { text: "Good design is as little design as possible.", author: "Dieter Rams", category: ["tech", "design"], mood: ["focused"] },
    
    // More motivation
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", category: ["motivation"], mood: ["motivated"] },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", category: ["motivation"], mood: ["motivated", "focused"] },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: ["motivation"], mood: ["motivated"] },
    { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe", category: ["motivation"], mood: ["motivated"] },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: ["motivation", "success"], mood: ["excited", "motivated"] },
    
    // More life wisdom
    { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller", category: ["life"], mood: ["excited"] },
    { text: "In the end, we only regret the chances we didn't take.", author: "Lewis Carroll", category: ["life"], mood: ["motivated"] },
    { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius", category: ["life", "philosophy"], mood: ["neutral"] },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: ["life", "happiness"], mood: ["excited"] },
    { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon", category: ["life"], mood: ["neutral"] },
  ];

  quotes.push(...additionalQuotes);

  // Generate more quotes by duplicating and slightly modifying
  const baseQuotes = [...quotes];
  for (let i = 0; i < 50; i++) {
    const randomQuote = baseQuotes[Math.floor(Math.random() * baseQuotes.length)];
    quotes.push({
      ...randomQuote,
      category: [...randomQuote.category, categories[Math.floor(Math.random() * categories.length)]],
    });
  }

  return quotes;
}

export const allQuotes = generateQuotes();

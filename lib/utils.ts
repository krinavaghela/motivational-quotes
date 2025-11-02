import { getStorageData, setStorageData } from './storage';

export interface Quote {
  _id: string;
  content: string;
  author: string;
  tags?: string[];
}

// Quote API sources with variety
const QUOTE_APIS = [
  // Quotable.io - wide variety of categories
  {
    name: 'quotable',
    url: (tags: string[]) => `https://api.quotable.io/random?tags=${tags.join('|')}`,
    transform: (data: any): Quote => ({
      _id: data._id || `quotable-${Date.now()}`,
      content: data.content,
      author: data.author,
      tags: data.tags || [],
    }),
    tags: [
      ['motivational', 'inspirational', 'success'],
      ['wisdom', 'life', 'famous-quotes'],
      ['leadership', 'business', 'entrepreneurship'],
      ['sports', 'competition', 'determination'],
      ['philosophy', 'spirituality', 'mindfulness'],
      ['science', 'technology', 'innovation'],
      ['art', 'creativity', 'imagination'],
      ['education', 'learning', 'knowledge'],
    ],
  },
  // Type.fit API - free public quotes API
  {
    name: 'typefit',
    url: () => 'https://type.fit/api/quotes',
    transform: (data: any[], index: number): Quote => {
      const quote = data[index] || data[Math.floor(Math.random() * data.length)];
      return {
        _id: `typefit-${quote?.author || 'Unknown'}-${Date.now()}-${index}`,
        content: quote?.text || '',
        author: quote?.author?.replace(', type.fit', '') || 'Unknown',
        tags: [],
      };
    },
    tags: [],
    isArray: true,
  },
  // ZenQuotes API
  {
    name: 'zenquotes',
    url: () => 'https://zenquotes.io/api/random',
    transform: (data: any[]): Quote => ({
      _id: `zenquotes-${Date.now()}`,
      content: data[0]?.q || '',
      author: data[0]?.a || 'Unknown',
      tags: [],
    }),
    tags: [],
  },
];

// Track recent quotes to avoid repetition
let recentQuoteIds: string[] = [];
const MAX_RECENT_QUOTES = 50;

// Cache for Type.fit API (all quotes)
let typefitQuotesCache: any[] | null = null;

const addToRecent = (quoteId: string) => {
  recentQuoteIds.push(quoteId);
  if (recentQuoteIds.length > MAX_RECENT_QUOTES) {
    recentQuoteIds = recentQuoteIds.slice(-MAX_RECENT_QUOTES);
  }
};

const isRecent = (quoteId: string): boolean => {
  return recentQuoteIds.includes(quoteId);
};

// Fetch quote from a specific API source
const fetchFromSource = async (source: typeof QUOTE_APIS[0], attempt: number = 0): Promise<Quote | null> => {
  try {
    let response: Response;
    let data: any;

    if (source.name === 'typefit') {
      // Type.fit returns all quotes at once - cache them
      if (!typefitQuotesCache) {
        response = await fetch(source.url());
        typefitQuotesCache = await response.json();
      }
      const allQuotes = typefitQuotesCache;
      const randomIndex = Math.floor(Math.random() * allQuotes.length);
      data = source.transform(allQuotes, randomIndex);
      return data;
    } else if (source.name === 'zenquotes') {
      response = await fetch(source.url());
      const jsonData = await response.json();
      data = source.transform(jsonData);
      return data;
    } else {
      // Quotable.io - randomly select tags for variety
      const tagSet = source.tags[Math.floor(Math.random() * source.tags.length)];
      const url = source.url(tagSet);
      response = await fetch(url);
      data = await response.json();
      return source.transform(data);
    }
  } catch (error) {
    console.error(`Error fetching from ${source.name}:`, error);
    return null;
  }
};

// Main function to get a quote with variety
export const getQuoteOfTheDay = async (preferNew: boolean = false): Promise<Quote> => {
  // Try multiple sources in random order for maximum variety
  const shuffledApis = [...QUOTE_APIS].sort(() => Math.random() - 0.5);
  
  let attempts = 0;
  const maxAttempts = shuffledApis.length * 3; // Try each source multiple times

  while (attempts < maxAttempts) {
    const sourceIndex = attempts % shuffledApis.length;
    const source = shuffledApis[sourceIndex];
    
    const quote = await fetchFromSource(source, attempts);
    
    if (quote && quote.content && quote.author) {
      // If we want a new quote and this is recent, try again
      if (preferNew && isRecent(quote._id) && attempts < maxAttempts - 1) {
        attempts++;
        continue;
      }
      
      // Add to recent and return
      addToRecent(quote._id);
      return quote;
    }
    
    attempts++;
  }

  // Fallback quotes from diverse personalities if all APIs fail
  const fallbackQuotes: Quote[] = [
    { _id: 'fallback-1', content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { _id: 'fallback-2', content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { _id: 'fallback-3', content: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
    { _id: 'fallback-4', content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { _id: 'fallback-5', content: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { _id: 'fallback-6', content: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { _id: 'fallback-7', content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { _id: 'fallback-8', content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { _id: 'fallback-9', content: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { _id: 'fallback-10', content: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
    { _id: 'fallback-11', content: "You learn more from failure than from success.", author: "Unknown" },
    { _id: 'fallback-12', content: "If you are working on something exciting that you really care about, you don't have to be pushed. The vision pulls you.", author: "Steve Jobs" },
    { _id: 'fallback-13', content: "People who are crazy enough to think they can change the world, are the ones who do.", author: "Rob Siltanen" },
    { _id: 'fallback-14', content: "We may encounter many defeats but we must not be defeated.", author: "Maya Angelou" },
    { _id: 'fallback-15', content: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
    { _id: 'fallback-16', content: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau" },
    { _id: 'fallback-17', content: "The two most important days in your life are the day you are born and the day you find out why.", author: "Mark Twain" },
    { _id: 'fallback-18', content: "Your limitation—it's only your imagination.", author: "Unknown" },
    { _id: 'fallback-19', content: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { _id: 'fallback-20', content: "Great things never come from comfort zones.", author: "Unknown" },
    { _id: 'fallback-21', content: "Dream it. Wish it. Do it.", author: "Unknown" },
    { _id: 'fallback-22', content: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
    { _id: 'fallback-23', content: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
    { _id: 'fallback-24', content: "Dream bigger. Do bigger.", author: "Unknown" },
    { _id: 'fallback-25', content: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
    { _id: 'fallback-26', content: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
    { _id: 'fallback-27', content: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
    { _id: 'fallback-28', content: "Little things make big things happen.", author: "John Wooden" },
    { _id: 'fallback-29', content: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
    { _id: 'fallback-30', content: "Don't wait for opportunity. Create it.", author: "Unknown" },
  ];

  // Return a random fallback quote
  const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  addToRecent(randomFallback._id);
  return randomFallback;
};

export const saveToFavorites = (quote: Quote): void => {
  if (typeof window === 'undefined') return;
  
  const storage = getStorageData();
  const exists = storage.favorites.some((q) => q._id === quote._id);
  
  if (!exists) {
    const updated = [...storage.favorites, quote];
    setStorageData({ favorites: updated });
  }
};

export const getFavorites = (): Quote[] => {
  if (typeof window === 'undefined') return [];
  const storage = getStorageData();
  return storage.favorites;
};

export const removeFromFavorites = (quoteId: string): void => {
  if (typeof window === 'undefined') return;
  
  const storage = getStorageData();
  const updated = storage.favorites.filter((q) => q._id !== quoteId);
  setStorageData({ favorites: updated });
};

export const isFavorite = (quoteId: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  const storage = getStorageData();
  return storage.favorites.some((q) => q._id === quoteId);
};

export const getStoredQuoteOfTheDay = (): Quote | null => {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('quoteOfTheDay');
  const storedDate = localStorage.getItem('quoteOfTheDayDate');
  
  if (stored && storedDate) {
    const today = new Date().toDateString();
    if (storedDate === today) {
      return JSON.parse(stored);
    }
  }
  
  return null;
};

export const storeQuoteOfTheDay = (quote: Quote): void => {
  if (typeof window === 'undefined') return;
  
  const today = new Date().toDateString();
  localStorage.setItem('quoteOfTheDay', JSON.stringify(quote));
  localStorage.setItem('quoteOfTheDayDate', today);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};



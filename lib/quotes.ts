import { Quote } from './utils';

export interface CategoryQuote {
  id: string;
  quote: string;
  author: string;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const fetchQuotesByCategory = async (category: string): Promise<Quote[]> => {
  try {
    const response = await fetch(`${basePath}/data/quotesByCategory.json`);
    const data = await response.json();
    
    const categoryQuotes = data[category] || [];
    
    return categoryQuotes.map((q: CategoryQuote) => ({
      _id: q.id,
      content: q.quote,
      author: q.author,
      tags: [category],
    }));
  } catch (error) {
    console.error('Error fetching category quotes:', error);
    return [];
  }
};

export const getRandomQuote = (quotes: Quote[]): Quote | null => {
  if (quotes.length === 0) return null;
  return quotes[Math.floor(Math.random() * quotes.length)];
};



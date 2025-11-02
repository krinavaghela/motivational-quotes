export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  gradient: string[];
  color: string;
}

export const categories: Category[] = [
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐾',
    description: 'What we can learn from animals',
    gradient: ['#FF6B6B', '#FF8E8E'],
    color: '#FF6B6B',
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    emoji: '💭',
    description: 'Wisdom from great thinkers',
    gradient: ['#4ECDC4', '#6EDDD6'],
    color: '#4ECDC4',
  },
  {
    id: 'psychology',
    name: 'Psychology',
    emoji: '🧠',
    description: 'Understanding the human mind',
    gradient: ['#95E1D3', '#AAE9DD'],
    color: '#95E1D3',
  },
  {
    id: 'nature',
    name: 'Nature',
    emoji: '🌿',
    description: 'Lessons from the natural world',
    gradient: ['#A8E6CF', '#B8F0D3'],
    color: '#A8E6CF',
  },
  {
    id: 'spirituality',
    name: 'Spirituality',
    emoji: '🧘',
    description: 'Inner peace and enlightenment',
    gradient: ['#FFD93D', '#FFE66D'],
    color: '#FFD93D',
  },
  {
    id: 'sports',
    name: 'Sports',
    emoji: '⚽',
    description: 'Victory, determination, and teamwork',
    gradient: ['#F38181', '#F89A9A'],
    color: '#F38181',
  },
  {
    id: 'art',
    name: 'Art',
    emoji: '🎨',
    description: 'Creativity and expression',
    gradient: ['#AA96DA', '#C5AFE9'],
    color: '#AA96DA',
  },
  {
    id: 'technology',
    name: 'Technology',
    emoji: '🚀',
    description: 'Innovation and the future',
    gradient: ['#6C5CE7', '#8075E8'],
    color: '#6C5CE7',
  },
  {
    id: 'ai',
    name: 'AI',
    emoji: '💡',
    description: 'Innovation and creativity',
    gradient: ['#FF9A56', '#FFAD56'],
    color: '#FF9A56',
  },
  {
    id: 'love',
    name: 'Love',
    emoji: '❤️',
    description: 'Heartfelt wisdom and connection',
    gradient: ['#FF6B9D', '#FF8FB3'],
    color: '#FF6B9D',
  },
  {
    id: 'success',
    name: 'Success',
    emoji: '💼',
    description: 'Achievement and ambition',
    gradient: ['#A8CABA', '#C4D9D0'],
    color: '#A8CABA',
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    emoji: '💪',
    description: 'Strength, wellness, and vitality',
    gradient: ['#F093FB', '#F5576C'],
    color: '#F093FB',
  },
  {
    id: 'travel',
    name: 'Travel & Adventure',
    emoji: '🌍',
    description: 'Exploration and discovery',
    gradient: ['#4FACFE', '#00F2FE'],
    color: '#4FACFE',
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find((cat) => cat.id === id);
};


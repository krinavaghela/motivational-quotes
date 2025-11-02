// Local storage utilities with type safety

export interface StorageData {
  favorites: Array<{ _id: string; content: string; author: string; tags?: string[] }>;
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  accentColor: string;
  notificationsEnabled: boolean;
  notificationTime: string; // HH:mm format
  lastQuoteDate: string; // YYYY-MM-DD format
  lastQuote: { _id: string; content: string; author: string; tags?: string[] } | null;
}

const STORAGE_KEY = 'dailyMotivationApp';

export const getStorageData = (): StorageData => {
  if (typeof window === 'undefined') {
    return getDefaultStorageData();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...getDefaultStorageData(), ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }

  return getDefaultStorageData();
};

export const setStorageData = (data: Partial<StorageData>): void => {
  if (typeof window === 'undefined') return;

  try {
    const current = getStorageData();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

export const getDefaultStorageData = (): StorageData => ({
  favorites: [],
  theme: 'light',
  fontSize: 'medium',
  accentColor: '#6C5CE7',
  notificationsEnabled: false,
  notificationTime: '09:00',
  lastQuoteDate: '',
  lastQuote: null,
});

export const clearStorage = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};


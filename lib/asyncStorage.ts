// Custom AsyncStorage implementation that safely handles SSR
// This prevents "window is not defined" errors during server-side rendering

// Define the AsyncStorage interface to match what Supabase expects
interface StorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

// Create a safe storage implementation
const createSafeStorage = (): StorageAdapter => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Memory fallback for server-side rendering
  const memoryStorage = new Map<string, string>();

  return {
    getItem: async (key: string): Promise<string | null> => {
      if (!isBrowser) {
        return memoryStorage.get(key) || null;
      }
      
      try {
        // Use localStorage in browser environment
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        return null;
      }
    },
    
    setItem: async (key: string, value: string): Promise<void> => {
      if (!isBrowser) {
        memoryStorage.set(key, value);
        return;
      }
      
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Error setting localStorage:', error);
      }
    },
    
    removeItem: async (key: string): Promise<void> => {
      if (!isBrowser) {
        memoryStorage.delete(key);
        return;
      }
      
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    }
  };
};

// Export the storage adapter
export const safeAsyncStorage = createSafeStorage();

// Export a function to determine if we're in a browser environment
export const isBrowser = typeof window !== 'undefined';

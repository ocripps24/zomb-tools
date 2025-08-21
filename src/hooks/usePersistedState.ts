import { useState, useEffect } from 'react';

export interface UsePersistedStateOptions<T> {
  /** The localStorage key to use for persistence */
  storageKey: string;
  /** Default value to use when no data exists */
  defaultValue: T;
  /** Callback when data changes */
  onChange?: (data: T) => void;
  /** Enable console logging for debugging */
  debug?: boolean;
}

export interface UsePersistedStateReturn<T> {
  /** Current data state */
  data: T;
  /** Function to update the data */
  setData: (data: T | ((prev: T) => T)) => void;
  /** Function to reset data to default and clear localStorage */
  reset: () => void;
}

/**
 * Custom hook for managing state with localStorage persistence.
 * 
 * This hook consolidates all the localStorage patterns used throughout the app:
 * - Automatic persistence to localStorage
 * - Loading from localStorage on mount
 * - Error handling for JSON parsing
 * - Parent onChange callbacks
 * 
 * @param options Configuration options for the hook
 * @returns Object with data, setData, and reset function
 */
export function usePersistedState<T>({
  storageKey,
  defaultValue,
  onChange,
  debug = false
}: UsePersistedStateOptions<T>): UsePersistedStateReturn<T> {
  const [data, setDataState] = useState<T>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(`Failed to parse ${storageKey} data:`, e);
        return defaultValue;
      }
    }
    return defaultValue;
  });

  const log = (message: string, ...args: any[]) => {
    if (debug) console.log(`[usePersistedState:${storageKey}] ${message}`, ...args);
  };

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      log('Saved to localStorage:', data);
    } catch (e) {
      console.error(`Failed to save ${storageKey} to localStorage:`, e);
    }
    
    if (onChange) {
      onChange(data);
    }
  }, [data, storageKey]); // Removed onChange from dependencies to prevent infinite loop

  // Check for external localStorage clearing (like from MapContainer reset)
  useEffect(() => {
    const checkForExternalReset = () => {
      const stored = localStorage.getItem(storageKey);
      // If localStorage is empty but our state isn't at default, reset
      if (!stored && JSON.stringify(data) !== JSON.stringify(defaultValue)) {
        console.log(`[usePersistedState] Detected external reset for ${storageKey}, resetting to default`);
        setDataState(defaultValue);
      }
    };

    // Check immediately and set up interval to check periodically
    checkForExternalReset();
    const interval = setInterval(checkForExternalReset, 100);
    return () => clearInterval(interval);
  }, [storageKey, data, defaultValue]);

  const setData = (newData: T | ((prev: T) => T)) => {
    if (typeof newData === 'function') {
      setDataState(prev => {
        const result = (newData as (prev: T) => T)(prev);
        log('Data updated via function:', result);
        return result;
      });
    } else {
      log('Data updated:', newData);
      setDataState(newData);
    }
  };

  const reset = () => {
    console.log(`[usePersistedState] Resetting ${storageKey} to default and clearing localStorage`);
    log('Resetting data to default and clearing localStorage');
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error(`Failed to remove ${storageKey} from localStorage:`, e);
    }
    setDataState(defaultValue);
  };

  return { data, setData, reset };
}
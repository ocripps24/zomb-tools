import { useState, useEffect, useRef } from 'react';

export interface UsePersistedStateOptions<T> {
  /** The localStorage key to use for persistence */
  storageKey: string;
  /** Default value to use when no data exists */
  defaultValue: T;
  /** Data from parent component (used for reset detection) */
  parentData?: T | null;
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
  /** Whether the hook is currently initializing */
  isInitializing: boolean;
}

/**
 * Custom hook for managing state with localStorage persistence and parent reset detection.
 * 
 * This hook consolidates all the localStorage patterns used throughout the app:
 * - Automatic persistence to localStorage
 * - Loading from localStorage on mount
 * - Reset detection when parent data becomes empty
 * - Error handling for JSON parsing
 * - Parent onChange callbacks
 * 
 * @param options Configuration options for the hook
 * @returns Object with data, setData, reset function, and initialization status
 */
export function usePersistedState<T>({
  storageKey,
  defaultValue,
  parentData,
  onChange,
  debug = false
}: UsePersistedStateOptions<T>): UsePersistedStateReturn<T> {
  const [data, setDataState] = useState<T>(defaultValue);
  const isInitializing = useRef(true);

  const log = (message: string, ...args: any[]) => {
    if (debug) {
      console.log(`[usePersistedState:${storageKey}] ${message}`, ...args);
    }
  };

  // Load from localStorage on mount or when parent data changes (reset detection)
  useEffect(() => {
    // Check if parent data is empty (indicating a reset)
    const isParentDataEmpty = !parentData || 
      (typeof parentData === 'object' && Object.keys(parentData).length === 0) ||
      (Array.isArray(parentData) && parentData.length === 0);

    if (isParentDataEmpty) {
      log('Parent data is empty, loading from localStorage or using default');
      
      // Parent has been reset, check localStorage or use default data
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          log('Loaded data from localStorage:', parsedData);
          setDataState(parsedData);
        } catch (e) {
          console.error(`Failed to parse ${storageKey} data:`, e);
          log('Parse error, using default value:', defaultValue);
          setDataState(defaultValue);
        }
      } else {
        log('No localStorage data found, using default value:', defaultValue);
        setDataState(defaultValue);
      }
    } else if (parentData) {
      // Parent has valid data, use it
      log('Using parent data:', parentData);
      setDataState(parentData);
    }

    isInitializing.current = true;
  }, [storageKey, defaultValue, parentData]);

  // Save to localStorage and notify parent when data changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      log('Saved to localStorage:', data);
    } catch (e) {
      console.error(`Failed to save ${storageKey} to localStorage:`, e);
    }

    // Only call onChange after initial load is complete
    if (!isInitializing.current && onChange) {
      log('Calling onChange callback');
      onChange(data);
    } else {
      isInitializing.current = false;
    }
  }, [data, storageKey, onChange]);

  // Wrapper for setData to handle function updates
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

  // Reset function that clears localStorage and resets to default
  const reset = () => {
    log('Resetting data to default and clearing localStorage');
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error(`Failed to remove ${storageKey} from localStorage:`, e);
    }
    setDataState(defaultValue);
  };

  return {
    data,
    setData,
    reset,
    isInitializing: isInitializing.current
  };
}
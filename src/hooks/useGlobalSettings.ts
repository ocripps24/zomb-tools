import { usePersistedState } from './usePersistedState';

export interface GlobalSettings {
  uiSize: 'standard' | 'compact';
  // Future global settings can be added here
  // theme: 'light' | 'dark' | 'auto';
  // animations: boolean;
}

const DEFAULT_SETTINGS: GlobalSettings = {
  uiSize: 'standard'
};

/**
 * Global settings hook for app-wide preferences like UI size, theme, etc.
 * Uses localStorage persistence via usePersistedState to maintain consistency
 * with the project's existing state management patterns.
 */
export function useGlobalSettings() {
  const { data: settings, setData: setSettings, reset } = usePersistedState({
    storageKey: 'zomb-tools-global-settings',
    defaultValue: DEFAULT_SETTINGS,
    debug: false
  });

  const updateSetting = <K extends keyof GlobalSettings>(
    key: K, 
    value: GlobalSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const isCompact = settings.uiSize === 'compact';

  return {
    settings,
    setSettings,
    updateSetting,
    reset,
    // Computed values for convenience
    isCompact,
    // CSS class helper
    getCompactClass: () => isCompact ? 'compact' : ''
  };
}
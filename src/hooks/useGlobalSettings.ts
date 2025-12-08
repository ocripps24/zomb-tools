import { useCallback } from 'react';
import { usePersistedState } from './usePersistedState';

/**
 * Section-specific settings storage
 * Structure: sections[mapId][sectionId] = { settingKey: value }
 */
export type SectionSettings = Record<string, Record<string, Record<string, string>>>;

export interface GlobalSettings {
  uiSize: 'standard' | 'compact';
  // Section-specific settings (e.g., input types, display preferences)
  sections: SectionSettings;
  // Future global settings can be added here
  // theme: 'light' | 'dark' | 'auto';
  // animations: boolean;
}

const DEFAULT_SETTINGS: GlobalSettings = {
  uiSize: 'standard',
  sections: {}
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

  /**
   * Update a section-specific setting
   */
  const updateSectionSetting = useCallback((
    mapId: string,
    sectionId: string,
    settingKey: string,
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      sections: {
        ...(prev.sections || {}),
        [mapId]: {
          ...(prev.sections?.[mapId] || {}),
          [sectionId]: {
            ...(prev.sections?.[mapId]?.[sectionId] || {}),
            [settingKey]: value
          }
        }
      }
    }));
  }, [setSettings]);

  /**
   * Get a section-specific setting value
   */
  const getSectionSetting = useCallback((
    mapId: string,
    sectionId: string,
    settingKey: string,
    defaultValue: string = ''
  ): string => {
    return settings.sections?.[mapId]?.[sectionId]?.[settingKey] ?? defaultValue;
  }, [settings.sections]);

  /**
   * Get all settings for a specific section
   */
  const getSectionSettings = useCallback((
    mapId: string,
    sectionId: string
  ): Record<string, string> => {
    return settings.sections?.[mapId]?.[sectionId] || {};
  }, [settings.sections]);

  const isCompact = settings.uiSize === 'compact';

  return {
    settings,
    setSettings,
    updateSetting,
    updateSectionSetting,
    getSectionSetting,
    getSectionSettings,
    reset,
    // Computed values for convenience
    isCompact,
    // CSS class helper
    getCompactClass: () => isCompact ? 'compact' : ''
  };
}
import React from 'react';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';

export interface SettingOption {
  value: string;
  label: string;
}

export interface Setting {
  id: string;
  label: string;
  value: string;
  options: SettingOption[];
  note?: string;
  onChange: (value: string) => void;
}

export interface SettingsConfig {
  show: boolean;
  title?: string;
  description?: string;
  settings: Setting[];
}

export interface SettingsSectionProps {
  config: SettingsConfig;
}

/**
 * Centralized settings section component used across all map sections.
 * Provides consistent styling and structure for section-specific preferences.
 * 
 * Features:
 * - Flexible setting definitions (dropdown-based)
 * - Consistent styling extracted from voyage.scss
 * - Support for setting notes/descriptions
 * - Responsive grid layout
 * - Perfect for speedrunner optimizations
 * - Reactive to global settings changes (no refresh needed)
 */
function SettingsSection({ config }: SettingsSectionProps) {
  // Subscribe to global settings for reactive updates
  const { settings: globalSettings } = useGlobalSettings();
  
  // Don't render if settings are disabled or no settings
  if (!config.show || !config.settings || config.settings.length === 0) {
    return null;
  }

  // Map of global setting IDs to their current values
  const globalSettingValues: Record<string, string> = {
    'ui-size': globalSettings.uiSize,
    // Add other global settings here as they're added
  };

  return (
    <div className="section-settings">
      <h4>{config.title || "Settings"}</h4>
      {config.description && (
        <p className="settings-description">
          {config.description}
        </p>
      )}
      
      <div className="settings-grid">
        {config.settings.map((setting) => {
          // Override value for global settings with current global value
          const currentValue = globalSettingValues[setting.id] || setting.value;
          
          return (
            <div key={setting.id} className="setting-group">
              <label htmlFor={setting.id}>{setting.label}:</label>
              <select
                id={setting.id}
                value={currentValue}
                onChange={(e) => setting.onChange(e.target.value)}
                className="setting-select"
              >
                {setting.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {setting.note && (
                <span className="setting-note">
                  {setting.note}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SettingsSection;
import React from 'react';

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
 */
function SettingsSection({ config }: SettingsSectionProps) {
  // Don't render if settings are disabled or no settings
  if (!config.show || !config.settings || config.settings.length === 0) {
    return null;
  }

  return (
    <div className="section-settings">
      <h4>{config.title || "Settings"}</h4>
      {config.description && (
        <p className="settings-description">
          {config.description}
        </p>
      )}
      
      <div className="settings-grid">
        {config.settings.map((setting) => (
          <div key={setting.id} className="setting-group">
            <label htmlFor={setting.id}>{setting.label}:</label>
            <select
              id={setting.id}
              value={setting.value}
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
        ))}
      </div>
    </div>
  );
}

export default SettingsSection;
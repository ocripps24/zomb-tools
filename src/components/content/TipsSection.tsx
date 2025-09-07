import React from 'react';

export interface TipItem {
  label: string;
  text: string;
}

export interface TipsConfig {
  show: boolean;
  items: TipItem[];
}

export interface TipsSectionProps {
  config: TipsConfig;
  title?: string;
}

/**
 * Centralized tips section component used across all map sections.
 * Provides consistent styling and structure for displaying tips and instructions.
 */
function TipsSection({ config, title = "Tips" }: TipsSectionProps) {
  // Don't render if tips are disabled or no items
  if (!config.show || !config.items || config.items.length === 0) {
    return null;
  }

  return (
    <div className="section-tips">
      <h3>{title}</h3>
      <ul>
        {config.items.map((tip, index) => (
          <li key={index}>
            <strong>{tip.label}:</strong> {tip.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TipsSection;
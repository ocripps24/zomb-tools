import React from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// Types for the generic number code section
export interface NumberCodeLocation {
  id: string;
  name: string;
  description: string;
  min: number;
  max: number;
  tertiaryText?: string;
}

export interface TipsConfig {
  show: boolean;
  items: Array<{
    label: string;
    text: string;
  }>;
}

export interface NumberCodeData {
  [locationId: string]: string | number;
}

export interface NumberCodeSectionProps extends BaseSectionProps<NumberCodeData> {
  title: string;
  description: string;
  locations: NumberCodeLocation[];
  storageKey: string;
  codeFormat?: "spaced" | "concatenated";
  resetButtonText?: string;
  finalCodeNote?: string;
  tipsConfig?: TipsConfig;
  className?: string;
}

/**
 * Generic component for collecting multiple numbers/codes from different locations.
 * Uses the modern BaseSection architecture with proper TypeScript support.
 * 
 * Used across maps like:
 * - Liberty Falls Bank Vault
 * - Shattered Veil Safe 
 * - Terminus Nathan Code
 * - And any other multi-number collection scenarios
 */
function NumberCodeSection({
  title,
  description,
  locations,
  storageKey,
  codeFormat = "spaced",
  resetButtonText,
  finalCodeNote,
  tipsConfig,
  className = "",
  ...props
}: NumberCodeSectionProps) {
  // Create default value based on locations
  const getDefaultValue = (): NumberCodeData => {
    const defaultData: NumberCodeData = {};
    locations.forEach((location) => {
      defaultData[location.id] = "";
    });
    return defaultData;
  };

  return (
    <BaseSection
      config={{
        storageKey,
        defaultValue: getDefaultValue(),
        title,
        description,
        resetButtonText: resetButtonText || `Reset ${title}`,
        tipsConfig: tipsConfig
      }}
      getProgress={(data: NumberCodeData) => {
        const completedCount = locations.filter(
          (location) => {
            const value = data[location.id];
            return value !== "" && value !== undefined && value !== null;
          }
        ).length;

        return {
          completed: completedCount,
          total: locations.length,
          isComplete: completedCount === locations.length
        };
      }}
      {...props}
    >
      {({ data, setData, progress }) => {
        // Handle input changes with validation
        const handleInputChange = (locationId: string, value: string) => {
          const location = locations.find((loc) => loc.id === locationId);
          if (!location) return;

          // Allow empty string or valid numbers within range
          if (
            value === "" ||
            (Number.isInteger(Number(value)) &&
              Number(value) >= location.min &&
              Number(value) <= location.max)
          ) {
            setData((prevData: NumberCodeData) => ({
              ...prevData,
              [locationId]: value,
            }));
          }
        };

        // Get the final code in the specified format
        const getFinalCode = () => {
          if (!progress.isComplete) return null;

          const values = locations.map((location) => data[location.id] || "");
          
          return codeFormat === "spaced" 
            ? values.join(" - ")
            : values.join("");
        };

        const finalCode = getFinalCode();

        return (
          <div className={`number-code-section ${className}`.trim()}>
            {/* Code Inputs */}
            <div className="code-inputs">
              {locations.map((location) => (
                <div key={location.id} className="code-input-group">
                  <div className="input-label">
                    <h3>{location.name}</h3>
                    {location.description && (
                      <p className="input-description">{location.description}</p>
                    )}
                    {location.tertiaryText && (
                      <p className="input-tertiary">{location.tertiaryText}</p>
                    )}
                  </div>

                  <div className="input-container">
                    <input
                      type="number"
                      min={location.min}
                      max={location.max}
                      value={data[location.id] || ""}
                      onChange={(e) => handleInputChange(location.id, e.target.value)}
                      placeholder={`${location.min}-${location.max}`}
                      className="code-input"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Summary */}
            <div className="code-summary">
              <div className="completion-status">
                <h3>Progress</h3>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                  />
                </div>
                <span className="progress-text">
                  {progress.completed} of {progress.total} numbers collected
                </span>
              </div>

              {/* Final Code Display */}
              {finalCode && (
                <div className="final-code">
                  <h3>{title}</h3>
                  <div className="code-display">
                    <span className="code-number">{finalCode}</span>
                  </div>
                  {finalCodeNote && (
                    <p className="code-note">{finalCodeNote}</p>
                  )}
                </div>
              )}
            </div>

          </div>
        );
      }}
    </BaseSection>
  );
}

export default NumberCodeSection;
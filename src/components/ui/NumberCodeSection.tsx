import { useState } from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import ResultsDisplay from "./ResultsDisplay";
import MovementSlider from "./MovementSlider";
import type { TipsConfig } from "./TipsSection";
import { createUiSizeSetting } from "@/utils/settingsHelpers";

// Types for the generic number code section
export interface NumberCodeLocation {
  id: string;
  name: string;
  description: string;
  min: number;
  max: number;
  tertiaryText?: string;
  order?: number;  // Optional order for final code (defaults to array order if not specified)
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
  allowDisplayOrderToggle?: boolean; // Enable display order toggle in settings
  displayOrderLabel?: string; // Label for the display order setting
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
  allowDisplayOrderToggle = false,
  displayOrderLabel = "Display Order",
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

  // Load initial settings from localStorage
  const getInitialSettings = () => {
    try {
      const saved = localStorage.getItem(`${storageKey}-settings`);
      if (saved) {
        const settings = JSON.parse(saved);
        return {
          inputMethod: settings.inputMethod || "text",
          displayOrder: settings.displayOrder || "entry",
        };
      }
    } catch (e) {
      console.error("Failed to parse number code settings:", e);
    }
    return { inputMethod: "text", displayOrder: "entry" };
  };

  const initialSettings = getInitialSettings();
  const [inputMethod, setInputMethod] = useState(initialSettings.inputMethod);
  const [displayOrder, setDisplayOrder] = useState(initialSettings.displayOrder);
  const uiSizeSetting = createUiSizeSetting();

  // Save settings to localStorage when they change
  const saveSettings = (method: string, order: string) => {
    const settings = { inputMethod: method, displayOrder: order };
    localStorage.setItem(`${storageKey}-settings`, JSON.stringify(settings));
  };

  return (
    <BaseSection
      config={{
        storageKey,
        defaultValue: getDefaultValue(),
        title,
        description,
        resetButtonText: resetButtonText || `Reset ${title}`,
        tipsConfig: tipsConfig,
        settingsConfig: {
          show: true,
          title: "Input Preferences",
          description: "Customize how you input numbers.",
          settings: [
            {
              id: "input-method",
              label: "Input Method",
              value: inputMethod,
              options: [
                { value: "text", label: "Text Input (number fields)" },
                { value: "slider", label: "Sliders (range controls)" },
              ],
              note: "How you input the numbers",
              onChange: (value) => {
                setInputMethod(value);
                saveSettings(value, displayOrder);
              },
            },
            ...(allowDisplayOrderToggle
              ? [
                  {
                    id: "display-order",
                    label: displayOrderLabel,
                    value: displayOrder,
                    options: [
                      { value: "entry", label: "Entry Order (final code order)" },
                      { value: "collection", label: "Collection Order (speedrun order)" },
                    ],
                    note: "Order in which to display the input fields",
                    onChange: (value: string) => {
                      setDisplayOrder(value);
                      saveSettings(inputMethod, value);
                    },
                  },
                ]
              : []),
            uiSizeSetting,
          ],
        },
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

        // Handle slider changes
        const handleSliderChange = (locationId: string, value: number) => {
          setData((prevData: NumberCodeData) => ({
            ...prevData,
            [locationId]: value.toString(),
          }));
        };

        // Get the final code in the specified format
        // If locations have an 'order' property, sort by it for the final code
        const getFinalCode = () => {
          if (!progress.isComplete) return null;

          // Sort locations by order property if it exists, otherwise use array order
          const sortedLocations = [...locations].sort((a, b) => {
            const orderA = a.order ?? locations.indexOf(a);
            const orderB = b.order ?? locations.indexOf(b);
            return orderA - orderB;
          });

          const values = sortedLocations.map((location) => data[location.id] || "");

          return codeFormat === "spaced"
            ? values.join(" - ")
            : values.join("");
        };

        const finalCode = getFinalCode();

        // Sort locations based on display order preference
        const displayLocations = displayOrder === "entry"
          ? [...locations].sort((a, b) => {
              const orderA = a.order ?? locations.indexOf(a);
              const orderB = b.order ?? locations.indexOf(b);
              return orderA - orderB;
            })
          : locations; // Collection order = array order

        return (
          <div className={`number-code-section ${className}`.trim()}>
            {/* Code Inputs */}
            <div className="code-inputs">
              {displayLocations.map((location) => (
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
                    {inputMethod === "text" ? (
                      <input
                        type="number"
                        min={location.min}
                        max={location.max}
                        value={data[location.id] || ""}
                        onChange={(e) => handleInputChange(location.id, e.target.value)}
                        placeholder={`${location.min}-${location.max}`}
                        className="code-input"
                      />
                    ) : (
                      <MovementSlider
                        locationId={location.id}
                        label={location.name}
                        movement={Number(data[location.id]) || location.min}
                        limits={{
                          min: location.min,
                          max: location.max,
                        }}
                        displayFormat="time"
                        movementToTime={(value: number) => value.toString()}
                        onChange={(_: string, value: number) =>
                          handleSliderChange(location.id, value)
                        }
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Summary */}
            <ResultsDisplay
              variant="single-code"
              title={title}
              finalCode={finalCode || ""}
              codeFormat="standard"
              codeNote={finalCodeNote}
              progressMode="replace"
              progress={progress}
              colorScheme="success"
            />

          </div>
        );
      }}
    </BaseSection>
  );
}

export default NumberCodeSection;
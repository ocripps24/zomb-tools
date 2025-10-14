import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import ResultsDisplay from "./ResultsDisplay";
import type { TipsConfig } from "./TipsSection";

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
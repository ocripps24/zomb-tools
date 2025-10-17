import React from "react";
import CircularProgress from "./CircularProgress";

// Types for the ResultsDisplay component
export type ResultsDisplayVariant = "single-code" | "grid" | "sequence";
export type ProgressMode = "replace" | "badge" | "none";

export interface ResultItem {
  id: string;
  value: string | number;
  label?: string;
  image?: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  metadata?: {
    [key: string]: string | number;
  };
  status?: "complete" | "incomplete" | "pending";
}

export interface SequenceItem {
  id: string;
  order: number;
  value?: string | number; // Optional - can be omitted when image is primary
  image?: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  imageColor?: string; // Optional color for SVG (applied via CSS color property)
  metadata?: Record<string, string>;
  status?: "complete" | "incomplete" | "pending";
}

export interface ProgressConfig {
  completed: number;
  total: number;
}

export interface ResultsDisplayProps {
  variant: ResultsDisplayVariant;

  // Single code variant
  finalCode?: string;
  codeNote?: string;
  codeFormat?: "standard" | "large";

  // Grid variant
  results?: ResultItem[];
  gridColumns?: number;
  showIncomplete?: boolean;
  totalExpected?: number; // For showing pending slots

  // Sequence variant
  sequenceItems?: SequenceItem[];

  // Progress
  progress?: ProgressConfig;
  progressMode?: ProgressMode; // "replace" | "badge" | "none"

  // Common props
  title?: string;
  description?: string;
  note?: React.ReactNode; // Optional note displayed below results (supports JSX)
  className?: string;
  colorScheme?: "success" | "accent" | "primary";
}

/**
 * Reusable component for displaying calculation results, codes, and sequences.
 *
 * Supports three main variants:
 * - single-code: Display a single final code (e.g., vault codes, safe codes)
 * - grid: Display multiple results in a grid layout (e.g., beam calculations)
 * - sequence: Display ordered sequence of items (e.g., Classified codes)
 *
 * Progress modes:
 * - replace: Show large circular progress in place of results until 100% complete
 * - badge: Show small circular progress badge in top-right corner
 * - none: No circular progress (legacy mode)
 *
 * Used across multiple maps to ensure consistent result display patterns.
 */
function ResultsDisplay({
  variant,
  finalCode,
  codeNote,
  codeFormat = "standard",
  results = [],
  gridColumns = 3,
  showIncomplete = false,
  totalExpected,
  sequenceItems = [],
  progress,
  progressMode = "none",
  title,
  description,
  note,
  className = "",
  colorScheme = "success",
}: ResultsDisplayProps) {
  const isComplete = progress ? progress.completed >= progress.total : true;
  const percentage = progress ? (progress.completed / progress.total) * 100 : 100;
  // Render single code variant
  const renderSingleCode = () => {
    // Replace mode: Show circular progress until complete
    if (progressMode === "replace" && !isComplete) {
      return (
        <div className={`results-single-code-container results-single-code-container--${colorScheme} results-single-code-container--loading`}>
          {title && <h3>{title}</h3>}
          <div className="code-display">
            <CircularProgress
              percentage={percentage}
              variant="large"
              colorScheme={colorScheme}
              showPercentage={true}
            />
          </div>
          {codeNote && <p className="code-note">{codeNote}</p>}
        </div>
      );
    }

    if (!finalCode) return null;

    return (
      <div className={`results-single-code-container results-single-code-container--${colorScheme}`}>
        {title && <h3>{title}</h3>}

        {/* Badge mode: Show small progress in corner */}
        {progressMode === "badge" && !isComplete && (
          <div className="progress-badge">
            <CircularProgress
              percentage={percentage}
              variant="badge"
              colorScheme={colorScheme}
              showPercentage={true}
            />
          </div>
        )}

        <div className="code-display">
          <span className={`code-number code-number--${codeFormat}`}>
            {finalCode}
          </span>
        </div>
        {codeNote && <p className="code-note">{codeNote}</p>}
      </div>
    );
  };

  // Render grid variant
  const renderGrid = () => {
    // Replace mode: Show circular progress until complete
    if (progressMode === "replace" && !isComplete) {
      return (
        <div className={`results-grid-container results-grid-container--${colorScheme} results-grid-container--loading`}>
          {title && <h3>{title}</h3>}
          {description && <p className="results-description">{description}</p>}
          <div className="results-grid-placeholder">
            <CircularProgress
              percentage={percentage}
              variant="large"
              colorScheme={colorScheme}
              showPercentage={true}
            />
          </div>
        </div>
      );
    }

    if (results.length === 0 && !showIncomplete) return null;

    const displayResults = [...results];

    // Add incomplete/pending slots if configured
    if (showIncomplete && totalExpected && results.length < totalExpected) {
      const pendingCount = totalExpected - results.length;
      for (let i = 0; i < pendingCount; i++) {
        displayResults.push({
          id: `pending-${i}`,
          value: "----",
          label: "Pending",
          status: "pending",
        });
      }
    }

    return (
      <div className={`results-grid-container results-grid-container--${colorScheme}`}>
        {title && <h3>{title}</h3>}
        {description && <p className="results-description">{description}</p>}

        {/* Badge mode: Show small progress in corner */}
        {progressMode === "badge" && !isComplete && (
          <div className="progress-badge">
            <CircularProgress
              percentage={percentage}
              variant="badge"
              colorScheme={colorScheme}
              showPercentage={true}
            />
          </div>
        )}

        <div
          className="results-grid"
          style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
        >
          {displayResults.map((result) => (
            <div
              key={result.id}
              className={`result-item result-item--${result.status || "complete"} result-item--${colorScheme} ${result.image ? "result-item--with-image" : ""}`}
            >
              {result.image && (
                <div className="result-image">
                  {typeof result.image === "string" ? (
                    <img src={result.image} alt={result.label || `Result ${result.value}`} />
                  ) : (
                    (() => {
                      const SvgComponent = result.image;
                      return <SvgComponent className="result-image-svg" />;
                    })()
                  )}
                </div>
              )}
              <div className="result-number">{result.value}</div>
              {result.label && <div className="result-label">{result.label}</div>}
              {result.metadata && Object.keys(result.metadata).length > 0 && (
                <div className="result-metadata">
                  {Object.entries(result.metadata).map(([key, value]) => (
                    <span key={key} className="metadata-item">
                      {value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Optional note */}
        {note && <div className="results-note">{note}</div>}
      </div>
    );
  };

  // Render sequence variant
  const renderSequence = () => {
    if (sequenceItems.length === 0 && !showIncomplete) return null;

    const displaySequence = [...sequenceItems];

    // Add pending slots if configured
    if (showIncomplete && totalExpected && sequenceItems.length < totalExpected) {
      const pendingCount = totalExpected - sequenceItems.length;
      for (let i = 0; i < pendingCount; i++) {
        displaySequence.push({
          id: `pending-${i}`,
          order: sequenceItems.length + i + 1,
          value: "----",
          metadata: { label: "Pending" },
          status: "pending",
        });
      }
    }

    return (
      <div className={`results-sequence-container results-sequence-container--${colorScheme}`}>
        {title && <h3>{title}</h3>}
        {description && <p className="results-description">{description}</p>}

        {/* Badge mode: Show small progress in corner */}
        {progressMode === "badge" && !isComplete && (
          <div className="progress-badge">
            <CircularProgress
              percentage={percentage}
              variant="badge"
              colorScheme={colorScheme}
              showPercentage={true}
            />
          </div>
        )}

        <div className="results-sequence">
          {displaySequence.map((item) => (
            <div
              key={item.id}
              className={`sequence-item sequence-item--${item.status || "complete"} sequence-item--${colorScheme} ${item.image ? "sequence-item--with-image" : ""}`}
            >
              <div className="sequence-number">{item.order}</div>
              <div className="sequence-details">
                {item.image && (
                  <div className="sequence-image" style={item.imageColor ? { color: item.imageColor } : undefined}>
                    {typeof item.image === "string" ? (
                      <img src={item.image} alt={`Sequence ${item.order}`} />
                    ) : (
                      (() => {
                        const SvgComponent = item.image;
                        return <SvgComponent className="sequence-image-svg" />;
                      })()
                    )}
                  </div>
                )}
                {item.value && <div className="sequence-value">{item.value}</div>}
                {item.metadata && Object.keys(item.metadata).length > 0 && (
                  <div className="sequence-metadata">
                    {Object.entries(item.metadata).map(([key, value]) => (
                      <span key={key} className="metadata-item">
                        {value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Optional note */}
        {note && <div className="results-note">{note}</div>}
      </div>
    );
  };

  return (
    <div className={`results-display results-display--${variant} ${className}`.trim()}>
      {variant === "single-code" && renderSingleCode()}
      {variant === "grid" && renderGrid()}
      {variant === "sequence" && renderSequence()}
    </div>
  );
}

export default ResultsDisplay;

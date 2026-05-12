export type CircularProgressVariant = "large" | "badge";

export interface CircularProgressProps {
  /** Progress percentage (0-100) */
  percentage: number;
  /** Visual variant */
  variant?: CircularProgressVariant;
  /** Show percentage text inside/next to circle */
  showPercentage?: boolean;
  /** Custom className */
  className?: string;
  /** Color scheme */
  colorScheme?: "success" | "accent" | "primary";
  /** Completed label text (replaces percentage when 100%) */
  completedText?: string;
}

/**
 * Circular progress indicator with stroke-based fill animation
 *
 * Variants:
 * - large (200px): Used as placeholder for results that need 100% completion
 * - badge (40px): Small indicator in corner for incremental progress
 */
function CircularProgress({
  percentage,
  variant = "large",
  showPercentage = true,
  className = "",
  colorScheme = "success",
  completedText,
}: CircularProgressProps) {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  const isComplete = clampedPercentage >= 100;

  // SVG circle parameters
  const sizes = {
    large: {
      size: 200,
      strokeWidth: 8,
      radius: 96, // (200 - 8) / 2
    },
    badge: {
      size: 40,
      strokeWidth: 3,
      radius: 18.5, // (40 - 3) / 2
    },
  };

  const { size, strokeWidth, radius } = sizes[variant];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  // Display text
  const displayText = isComplete && completedText
    ? completedText
    : `${Math.round(clampedPercentage)}%`;

  return (
    <div
      className={`circular-progress circular-progress--${variant} circular-progress--${colorScheme} ${className}`.trim()}
      role="progressbar"
      aria-valuenow={clampedPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="circular-progress-svg"
      >
        {/* Background circle (track) */}
        <circle
          className="circular-progress-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle (stroke) */}
        <circle
          className="circular-progress-stroke"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      {/* Percentage text */}
      {showPercentage && (
        <div className="circular-progress-text">
          {variant === "large" ? (
            <span className="percentage-value">{displayText}</span>
          ) : (
            <span className="percentage-badge">{displayText}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default CircularProgress;

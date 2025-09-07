import React, { ReactNode } from 'react';
import SectionHeader from './SectionHeader';
import TipsSection from '@/components/content/TipsSection';
import SettingsSection from '@/components/content/SettingsSection';
import type { TipsConfig } from '@/components/content/TipsSection';
import type { SettingsConfig } from '@/components/content/SettingsSection';
import { usePersistedState } from '@/hooks';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';

// Standard props interface that all sections should accept
export interface BaseSectionProps<T = any> {
  /** Data from parent map component (for reset detection) */
  data?: T;
  /** Callback when section data changes */
  onChange?: (data: T) => void;
  /** Navigation to next step */
  onNext?: () => void;
  /** Navigation to previous step */
  onPrevious?: () => void;
  /** Current step number (1-indexed) */
  currentStep?: number;
  /** Total number of steps */
  totalSteps?: number;
}

// Progress tracking interface
export interface SectionProgress {
  completed: number;
  total: number;
  isComplete: boolean;
}

// Configuration for BaseSection
export interface BaseSectionConfig<T = any> {
  /** Unique storage key for localStorage */
  storageKey: string;
  /** Default value for section data */
  defaultValue: T;
  /** Section title */
  title: string;
  /** Section description */
  description: string;
  /** Custom reset button text */
  resetButtonText?: string;
  /** Enable debug mode for localStorage operations */
  debug?: boolean;
  /** Tips configuration for displaying help/instructions */
  tipsConfig?: TipsConfig;
  /** Custom title for tips section */
  tipsTitle?: string;
  /** Settings configuration for section-specific preferences */
  settingsConfig?: SettingsConfig;
}

// Props for BaseSection component
export interface BaseSectionWrapperProps<T = any> extends BaseSectionProps<T> {
  /** Configuration for the section */
  config: BaseSectionConfig<T>;
  /** Function to calculate progress based on current data */
  getProgress: (data: T) => SectionProgress;
  /** Function to reset section-specific data */
  onSectionReset?: () => void;
  /** Content to render inside the section */
  children: (props: {
    data: T;
    setData: (data: T | ((prev: T) => T)) => void;
    reset: () => void;
    progress: SectionProgress;
  }) => ReactNode;
}

/**
 * Base wrapper component for all map sections.
 * 
 * This component provides:
 * - Standardized localStorage persistence via usePersistedState
 * - Common SectionHeader with progress tracking
 * - Reset functionality
 * - Consistent prop interface
 * - Progress calculation
 * 
 * Usage:
 * ```tsx
 * <BaseSection
 *   config={{
 *     storageKey: "terminus-beam-code-data",
 *     defaultValue: {},
 *     title: "Beam Code",
 *     description: "Find the 3 laptops with X, Y, Z stickers..."
 *   }}
 *   getProgress={(data) => ({ completed: Object.keys(data).length, total: 3, isComplete: Object.keys(data).length === 3 })}
 *   {...props}
 * >
 *   {({ data, setData, progress }) => (
 *     // Your section content here
 *   )}
 * </BaseSection>
 * ```
 */
export function BaseSection<T = any>({
  data: parentData,
  onChange,
  config,
  getProgress,
  onSectionReset,
  children,
  ...props
}: BaseSectionWrapperProps<T>) {
  // Get global settings for compact mode - subscribe to isCompact to trigger re-renders
  const { getCompactClass, isCompact } = useGlobalSettings();
  const { 
    data, 
    setData, 
    reset: resetStorage 
  } = usePersistedState<T>({
    storageKey: config.storageKey,
    defaultValue: config.defaultValue,
    onChange,
    debug: config.debug || false
  });

  // Calculate current progress
  const progress = getProgress(data);

  // Handle reset - combines storage reset with optional section-specific reset
  const handleReset = () => {
    resetStorage();
    if (onSectionReset) {
      onSectionReset();
    }
  };

  return (
    <div className={`base-section ${getCompactClass()}`.trim()}>
      <SectionHeader
        title={config.title}
        progress={progress}
        description={config.description}
        onReset={handleReset}
        resetButtonText={config.resetButtonText || `Reset ${config.title}`}
      />

      <div className="section-content">
        {children({ data, setData, reset: handleReset, progress })}
        
        {/* Render tips section if configured */}
        {config.tipsConfig && (
          <TipsSection
            config={config.tipsConfig}
            title={config.tipsTitle}
          />
        )}
        
        {/* Render settings section if configured */}
        {config.settingsConfig && (
          <SettingsSection config={config.settingsConfig} />
        )}
      </div>
    </div>
  );
}

/**
 * Higher-order component to create standardized section components.
 * 
 * This HOC eliminates boilerplate by providing a template for creating new sections.
 * 
 * Usage:
 * ```tsx
 * export const MySection = createSection<MyDataType>({
 *   storageKey: "my-section-data",
 *   defaultValue: {},
 *   title: "My Section",
 *   description: "Description of what this section does",
 *   getProgress: (data) => ({
 *     completed: calculateCompleted(data),
 *     total: calculateTotal(data), 
 *     isComplete: isDataComplete(data)
 *   }),
 *   renderContent: ({ data, setData, progress }) => (
 *     <div>Your section UI here</div>
 *   )
 * });
 * ```
 */
export function createSection<T = any>(options: {
  storageKey: string;
  defaultValue: T;
  title: string;
  description: string;
  resetButtonText?: string;
  debug?: boolean;
  getProgress: (data: T) => SectionProgress;
  onSectionReset?: () => void;
  renderContent: (props: {
    data: T;
    setData: (data: T | ((prev: T) => T)) => void;
    reset: () => void;
    progress: SectionProgress;
  }) => ReactNode;
}) {
  return function SectionComponent(props: BaseSectionProps<T>) {
    return (
      <BaseSection
        config={{
          storageKey: options.storageKey,
          defaultValue: options.defaultValue,
          title: options.title,
          description: options.description,
          resetButtonText: options.resetButtonText,
          debug: options.debug
        }}
        getProgress={options.getProgress}
        onSectionReset={options.onSectionReset}
        {...props}
      >
        {options.renderContent}
      </BaseSection>
    );
  };
}
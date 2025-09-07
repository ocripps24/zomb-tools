import React from 'react';
import MapNavigation from './MapNavigation';
import StepNavigation from './StepNavigation';
import StepNavigationButtons from './StepNavigationButtons';
import YouTubeGuideSection from '@/components/content/YouTubeGuideSection';
import { useMapState, MapStep } from '@/hooks';

export interface MapContainerProps {
  /** Array of steps for this map */
  steps: MapStep[];
  /** Base path for the map (e.g. "/bo6/terminus") */
  basePath: string;
  /** Storage prefix for localStorage keys (e.g. "terminus") */
  storagePrefix: string;
  /** Map display name */
  mapName: string;
  /** Path to navigate back to (e.g. "/bo6") */
  backTo: string;
  /** Additional CSS class for the map */
  className?: string;
  /** Optional YouTube guide embed URL */
  guideUrl?: string;
}

/**
 * Generic container component for all multi-step map pages.
 * 
 * This component eliminates 80-90% of the duplication across map components by providing:
 * - Step-based routing and navigation
 * - State management for all steps
 * - Reset functionality
 * - Consistent UI structure
 * 
 * Each map component now only needs to define their steps and pass them to this container.
 */
export function MapContainer({
  steps,
  basePath,
  storagePrefix,
  mapName,
  backTo,
  className = '',
  guideUrl
}: MapContainerProps) {
  const {
    activeStepIndex,
    goToStep,
    goToNext,
    goToPrevious,
    getStepData,
    handleStepDataChange,
    handleReset
  } = useMapState({ steps, basePath, storagePrefix });

  return (
    <div className={`map-page ${className}`}>
      <div className="map-info">
        <h1 className="map-title">{mapName}</h1>
      </div>

      <div className="map-header">
        <MapNavigation
          backTo={backTo}
          onReset={handleReset}
          guideUrl={guideUrl}
        />
      </div>

      {/* Step Tabs Navigation */}
      <StepNavigation
        steps={steps.map(step => ({ id: step.id, name: step.name }))}
        activeStep={activeStepIndex}
        onStepChange={(stepIndex: number) => goToStep(steps[stepIndex].path)}
      />

      <div className="map-content">
        {/* Render current step component directly based on activeStepIndex */}
        {steps[activeStepIndex] && (() => {
          const StepComponent = steps[activeStepIndex].component;
          return (
            <StepComponent
              data={getStepData(steps[activeStepIndex].id)}
              onChange={(data: any) => handleStepDataChange(steps[activeStepIndex].id, data)}
              onNext={goToNext}
              onPrevious={goToPrevious}
              currentStep={activeStepIndex + 1}
              totalSteps={steps.length}
            />
          );
        })()}

        <StepNavigationButtons
          currentStepIndex={activeStepIndex}
          totalSteps={steps.length}
          onNext={goToNext}
          onPrevious={goToPrevious}
          stepNames={steps.map(step => step.name)}
          onGoToStep={(stepIndex: number) => goToStep(steps[stepIndex].path)}
        />

        {/* YouTube Guide Section - Only show if guide URL is provided */}
        {guideUrl && (
          <YouTubeGuideSection 
            guideUrl={guideUrl} 
            mapName={mapName} 
          />
        )}
      </div>
    </div>
  );
}
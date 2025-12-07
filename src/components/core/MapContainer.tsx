import MapNav from "./MapNav";
import YouTubeGuideSection from "@/components/ui/YouTubeGuideSection";
import { useMapState, MapStep } from "@/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { SECTION_TRANSITION } from "@/utils/transitions";

interface Guide {
	url: string;
	type: "internal" | "external";
	channelName?: string;
}

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
	/** Optional YouTube guide configuration */
	guide?: Guide;
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
	className = "",
	guide,
}: MapContainerProps) {
	const {
		activeStepIndex,
		goToStep,
		goToNext,
		goToPrevious,
		getStepData,
		handleStepDataChange,
		handleReset,
	} = useMapState({ steps, basePath, storagePrefix });

	// Extract game name from backTo path
	const getGameName = (path: string) => {
		if (!path || typeof path !== "string") return "Maps";
		const pathParts = path.split("/");
		const gameId = pathParts[1];
		if (!gameId) return "Maps";
		return gameId.toUpperCase() + " Maps";
	};

	const isFirstStep = activeStepIndex === 0;
	const isLastStep = activeStepIndex === steps.length - 1;

	return (
		<div className={`map-page ${className}`}>
			<div className="map-content">
				{/* Render current step component with transitions */}
				<AnimatePresence mode="wait">
					{steps[activeStepIndex] && (
						<motion.div
							key={steps[activeStepIndex].id}
							{...SECTION_TRANSITION}
						>
							{(() => {
								const StepComponent = steps[activeStepIndex].component;
								return (
									<StepComponent
										data={getStepData(steps[activeStepIndex].id)}
										onChange={(data: any) =>
											handleStepDataChange(steps[activeStepIndex].id, data)
										}
										onNext={goToNext}
										onPrevious={goToPrevious}
										currentStep={activeStepIndex + 1}
										totalSteps={steps.length}
										guide={guide}
									/>
								);
							})()}
						</motion.div>
					)}
				</AnimatePresence>

				{/* YouTube Guide Section - Only show if guide is provided */}
				{guide && <YouTubeGuideSection guide={guide} mapName={mapName} />}
			</div>

			{/* Map Navigation */}
			<MapNav
				backTo={backTo}
				backLabel={getGameName(backTo)}
				onReset={handleReset}
				steps={steps.map((step) => ({ id: step.id, name: step.name }))}
				activeStep={activeStepIndex}
				onStepChange={(stepIndex: number) => goToStep(steps[stepIndex].path)}
				onNext={goToNext}
				onPrevious={goToPrevious}
				isFirstStep={isFirstStep}
				isLastStep={isLastStep}
			/>
		</div>
	);
}

import React from "react";
import { Link } from "react-router-dom";
import ChevronIcon from "@/assets/icons/chevron.svg";
import StepNavigation, { Step } from "./StepNavigation";

interface MapNavProps {
	// Navigation
	backTo: string;
	backLabel: string; // e.g., "BO6 Maps"
	onReset: () => void;

	// Step navigation
	steps: Step[];
	activeStep: number;
	onStepChange: (index: number) => void;
	onNext: () => void;
	onPrevious: () => void;
	isFirstStep: boolean;
	isLastStep: boolean;
}

const MapNav: React.FC<MapNavProps> = ({
	backTo,
	backLabel,
	onReset,
	steps,
	activeStep,
	onStepChange,
	onNext,
	onPrevious,
	isFirstStep,
	isLastStep,
}) => {
	const handleReset = () => {
		if (
			window.confirm(
				"Are you sure you want to reset all data? This cannot be undone."
			)
		) {
			onReset();
		}
	};

	return (
		<nav className="map-nav" aria-label="Map Navigation">
			{/* Back Button */}
			<Link to={backTo} className="map-nav__back">
				<span className="map-nav__back-icon">
					<ChevronIcon />
				</span>
				<span className="map-nav__back-text">{backLabel}</span>
			</Link>

			{/* Navigation Controls */}
			<div className="map-nav__controls">
				{/* Previous Button */}
				<button
					className="map-nav__chevron map-nav__chevron--prev"
					onClick={onPrevious}
					disabled={isFirstStep}
					aria-label="Previous step"
				>
					<ChevronIcon />
				</button>

				{/* Step Navigation - Desktop: Tabs, Mobile: Counter */}
				<div className="map-nav__steps">
					{/* Desktop: Full step tabs */}
					<div className="map-nav__steps-desktop">
						<StepNavigation
							steps={steps}
							activeStep={activeStep}
							onStepChange={onStepChange}
						/>
					</div>

					{/* Mobile: Simple counter */}
					<div className="map-nav__steps-mobile">
						<span className="map-nav__counter">
							{activeStep + 1} of {steps.length}
						</span>
					</div>
				</div>

				{/* Next Button */}
				<button
					className="map-nav__chevron map-nav__chevron--next"
					onClick={onNext}
					disabled={isLastStep}
					aria-label="Next step"
				>
					<ChevronIcon />
				</button>
			</div>

			{/* Reset Button */}
			<button
				onClick={handleReset}
				className="map-nav__reset"
				aria-label="Reset all data"
			>
				<span className="map-nav__reset-icon">🗑️</span>
				<span className="map-nav__reset-text">Reset All Data</span>
			</button>
		</nav>
	);
};

export default MapNav;

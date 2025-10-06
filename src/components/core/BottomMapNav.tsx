import React from "react";
import { Link } from "react-router-dom";
import ChevronIcon from "@/assets/icons/chevron.svg";
import StepNavigation, { Step } from "./StepNavigation";

interface BottomMapNavProps {
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

const BottomMapNav: React.FC<BottomMapNavProps> = ({
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
		<nav className="bottom-map-nav" aria-label="Map Navigation">
			{/* Back Button */}
			<Link to={backTo} className="bottom-map-nav__back">
				<span className="bottom-map-nav__back-icon">
					<ChevronIcon />
				</span>
				<span className="bottom-map-nav__back-text">{backLabel}</span>
			</Link>

			{/* Navigation Controls */}
			<div className="bottom-map-nav__controls">
				{/* Previous Button */}
				<button
					className="bottom-map-nav__chevron bottom-map-nav__chevron--prev"
					onClick={onPrevious}
					disabled={isFirstStep}
					aria-label="Previous step"
				>
					<ChevronIcon />
				</button>

				{/* Step Navigation - Desktop: Tabs, Mobile: Counter */}
				<div className="bottom-map-nav__steps">
					{/* Desktop: Full step tabs */}
					<div className="bottom-map-nav__steps-desktop">
						<StepNavigation
							steps={steps}
							activeStep={activeStep}
							onStepChange={onStepChange}
						/>
					</div>

					{/* Mobile: Simple counter */}
					<div className="bottom-map-nav__steps-mobile">
						<span className="bottom-map-nav__counter">
							{activeStep + 1} of {steps.length}
						</span>
					</div>
				</div>

				{/* Next Button */}
				<button
					className="bottom-map-nav__chevron bottom-map-nav__chevron--next"
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
				className="bottom-map-nav__reset"
				aria-label="Reset all data"
			>
				<span className="bottom-map-nav__reset-icon">🗑️</span>
				<span className="bottom-map-nav__reset-text">Reset All Data</span>
			</button>
		</nav>
	);
};

export default BottomMapNav;

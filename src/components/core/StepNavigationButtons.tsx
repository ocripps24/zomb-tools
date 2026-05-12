import React from "react";

interface StepNavigationButtonsProps {
	currentStepIndex: number;
	totalSteps: number;
	onPrevious: () => void;
	onNext: () => void;
	onGoToStep?: (stepIndex: number) => void;
	stepNames?: string[];
}

const StepNavigationButtons: React.FC<StepNavigationButtonsProps> = ({
	currentStepIndex,
	totalSteps,
	onPrevious,
	onNext,
	stepNames = [],
}) => {
	const isFirstStep = currentStepIndex === 0;
	const isLastStep = currentStepIndex === totalSteps - 1;
	const currentStepNumber = currentStepIndex + 1;

	return (
		<div className="step-navigation-buttons">
			<button
				className="btn btn-secondary step-navigation-buttons__btn step-navigation-buttons__btn--prev"
				onClick={onPrevious}
				disabled={isFirstStep}
				aria-label={`Go to previous step: ${
					stepNames[currentStepIndex - 1] || `Step ${currentStepNumber - 1}`
				}`}
			>
				Previous
			</button>

			<div className="step-navigation-buttons__counter">
				<span className="step-navigation-buttons__current">
					{currentStepNumber}
				</span>
				<span className="step-navigation-buttons__separator"> of </span>
				<span className="step-navigation-buttons__total">{totalSteps}</span>
			</div>

			<button
				className="btn btn-primary step-navigation-buttons__btn step-navigation-buttons__btn--next"
				onClick={onNext}
				disabled={isLastStep}
				aria-label={`Go to next step: ${
					stepNames[currentStepIndex + 1] || `Step ${currentStepNumber + 1}`
				}`}
			>
				Next
			</button>
		</div>
	);
};

export default StepNavigationButtons;

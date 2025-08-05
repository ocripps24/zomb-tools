import React from "react";

export interface Step {
	id: string;
	name: string;
}

interface StepNavigationProps {
	steps: Step[];
	activeStep: number;
	onStepChange: (index: number) => void;
	className?: string;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
	steps,
	activeStep,
	onStepChange,
	className = "",
}) => {
	return (
		<div className={`step-navigation${className ? " " + className : ""}`}>
			<div className="step-tabs">
				{steps.map((step, index) => (
					<button
						key={step.id}
						onClick={() => onStepChange(index)}
						className={`step-tab ${
							activeStep === index ? "step-tab--active" : ""
						}`}
						aria-current={activeStep === index ? "step" : undefined}
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") onStepChange(index);
						}}
					>
						<span className="step-number">{index + 1}</span>
						<span className="step-name">{step.name}</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default StepNavigation;

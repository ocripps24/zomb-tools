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
		<nav
			className={`step-navigation${className ? " " + className : ""}`}
			aria-label="Step Navigation"
		>
			{steps.map((step, idx) => (
				<button
					key={step.id}
					className={`step-navigation__tab${
						activeStep === idx ? " step-navigation__tab--active" : ""
					}`}
					aria-current={activeStep === idx ? "step" : undefined}
					tabIndex={0}
					onClick={() => onStepChange(idx)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") onStepChange(idx);
					}}
				>
					{step.name}
				</button>
			))}
		</nav>
	);
};

export default StepNavigation;

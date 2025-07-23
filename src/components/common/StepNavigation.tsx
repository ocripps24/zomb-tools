import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

export interface Step {
	id: string;
	name: string;
}

interface StepNavigationProps {
	steps: Step[];
	activeStep: number;
	onStepChange: (index: number) => void;
	sx?: object;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
	steps,
	activeStep,
	onStepChange,
	sx,
}) => {
	return (
		<Box sx={{ width: "100%", mb: 2, ...sx }}>
			<Tabs
				value={activeStep}
				onChange={(_, idx) => onStepChange(idx)}
				variant="scrollable"
				scrollButtons="auto"
				sx={{
					borderRadius: 3,
					p: 1,
					background: "rgba(24,26,27,0.18)",
					backdropFilter: "blur(18px)",
					minHeight: 48,
				}}
			>
				{steps.map((step, idx) => (
					<Tab
						key={step.id}
						label={step.name}
						sx={{
							fontWeight: 600,
							minWidth: 100,
							color: "inherit",
							opacity: activeStep === idx ? 1 : 0.7,
							background:
								activeStep === idx ? "rgba(0,224,255,0.12)" : "transparent",
							borderRadius: 2,
							mx: 0.5,
						}}
					/>
				))}
			</Tabs>
		</Box>
	);
};

export default StepNavigation;

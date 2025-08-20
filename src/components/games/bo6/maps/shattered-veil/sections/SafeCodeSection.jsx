import CodeCollectionSection from "../../../../../common/CodeCollectionSection";

// Define the three locations and their value ranges
const CODE_LOCATIONS = [
	{
		id: "left",
		name: "Left Wall",
		description: "Number on the left wall surrounding the lift",
		min: 0,
		max: 59,
	},
	{
		id: "back",
		name: "Back Wall", 
		description: "Number on the back wall surrounding the lift",
		min: 0,
		max: 59,
	},
	{
		id: "right",
		name: "Right Wall",
		description: "Number on the right wall surrounding the lift",
		min: 0,
		max: 59,
	},
];

const TIPS_CONFIG = {
	show: true,
	items: [
		{
			label: "Left Wall",
			text: "Look for the number on the left wall surrounding the lift area"
		},
		{
			label: "Back Wall",
			text: "Find the number on the back wall surrounding the lift area"
		},
		{
			label: "Right Wall",
			text: "Check the right wall surrounding the lift area"
		},
		{
			label: "Order",
			text: "Each number goes on its corresponding dial: Left number on left dial, Back number on middle dial, Right number on right dial"
		}
	]
};

function SafeCodeSection({
	data,
	onChange,
	onNext,
	onPrevious,
	currentStep,
	totalSteps,
}) {
	return (
		<CodeCollectionSection
			title="Safe Code"
			description="Collect three numbers from the walls around the lift to open the safe."
			locations={CODE_LOCATIONS}
			storageKey="shattered-veil-safe-data"
			data={data}
			onChange={onChange}
			codeFormat="spaced"
			className="safe-code-section"
			resetButtonText="Reset Safe Code"
			finalCodeNote="Enter these numbers into the safe's three dials: Left - Back - Right"
			tipsConfig={TIPS_CONFIG}
			onNext={onNext}
			onPrevious={onPrevious}
			currentStep={currentStep}
			totalSteps={totalSteps}
		/>
	);
}

export default SafeCodeSection;
import CodeCollectionSection from "../../../../../common/CodeCollectionSection";

// Define the three locations and their value ranges
const CODE_LOCATIONS = [
	{
		id: "clock",
		name: "Clock (Interrogation Room)",
		description: "Hour hand of clock in Quick-Revive room",
		min: 1,
		max: 9,
		tertiaryText: "Range: 1-9"
	},
	{
		id: "card",
		name: "Card (Mess)",
		description: "Playing card on board (Ace = 1)",
		min: 1,
		max: 9,
		tertiaryText: "Range: 1-9"
	},
	{
		id: "sign",
		name: "Sign (Engineering)",
		description: "Sign on the wall",
		min: 0,
		max: 9,
		tertiaryText: "Range: 0-9"
	},
];

const TIPS_CONFIG = {
	show: true,
	items: [
		{
			label: "Clock",
			text: "Look at the hour hand position in the Interrogation Room (where Quick-Revive is located)"
		},
		{
			label: "Card",
			text: "Find the playing card on the board in the Mess area (remember: Ace = 1)"
		},
		{
			label: "Sign",
			text: "Check the wall sign in the Engineering area"
		},
		{
			label: "Order",
			text: "The code is always entered as Clock-Card-Sign, regardless of the order you collect them"
		}
	]
};

function NathanCodeSection({
	data,
	onChange,
	onNext,
	onPrevious,
	currentStep,
	totalSteps,
}) {
	return (
		<CodeCollectionSection
			title="Nathan Code"
			description="Collect three numbers from around the map to form the Nathan Code."
			locations={CODE_LOCATIONS}
			storageKey="terminus-nathan-code-data"
			data={data}
			onChange={onChange}
			codeFormat="concatenated"
			className="nathan-code-section"
			resetButtonText="Reset Nathan Code"
			finalCodeNote="Enter this code when prompted during the main quest."
			tipsConfig={TIPS_CONFIG}
			onNext={onNext}
			onPrevious={onPrevious}
			currentStep={currentStep}
			totalSteps={totalSteps}
		/>
	);
}

export default NathanCodeSection;

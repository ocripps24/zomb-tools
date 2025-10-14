import { NumberCodeSection } from "@/components/ui";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import type { NumberCodeData } from "@/components/ui/NumberCodeSection";

// Define the three locations and their value ranges
const CODE_LOCATIONS = [
	{
		id: "sign",
		name: "Sign (Engineering)",
		description: "Days without injury",
		min: 0,
		max: 9,
		order: 3,
	},
	{
		id: "clock",
		name: "Clock (Interrogation Room)",
		description: "Hour hand of clock in Quick-Revive room",
		min: 1,
		max: 9,
		order: 1,
	},
	{
		id: "card",
		name: "Card (Mess)",
		description: "Playing card on board (Ace = 1)",
		min: 1,
		max: 9,
		order: 2,
	},
];

const TIPS_CONFIG = {
	show: true,
	items: [
		{
			label: "Clock",
			text: "Look at the hour hand position in the Interrogation Room (where Quick-Revive is located)",
		},
		{
			label: "Card",
			text: "Find the playing card on the board in the Mess area (remember: Ace = 1)",
		},
		{
			label: "Sign",
			text: "Check the wall sign in the Engineering area",
		},
		{
			label: "Order",
			text: "The code is always entered as Clock-Card-Sign, regardless of the order you collect them",
		},
	],
};

function NathanCodeSection(props: BaseSectionProps<NumberCodeData>) {
	return (
		<NumberCodeSection
			title="Nathan Code"
			description="Collect three numbers from around the map to form the Nathan Code. The fields are displayed in the speedrun collection order."
			locations={CODE_LOCATIONS}
			storageKey="terminus-nathan-code-data"
			codeFormat="concatenated"
			className="nathan-code-section"
			resetButtonText="Reset Nathan Code"
			finalCodeNote="Enter this code when prompted during the main quest."
			tipsConfig={TIPS_CONFIG}
			{...props}
		/>
	);
}

export default NathanCodeSection;

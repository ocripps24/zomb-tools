import { NumberCodeSection } from "@/components/ui";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import type { NumberCodeData } from "@/components/ui/NumberCodeSection";

// Define the three locations and their value ranges
const CODE_LOCATIONS = [
	{
		id: "garment-factory",
		name: "Garment Factory",
		description: "Inside the garment factory",
		min: 0,
		max: 59,
	},
	{
		id: "underground",
		name: "Underground",
		description: "Underground area next to the hotel",
		min: 0,
		max: 59,
	},
	{
		id: "store",
		name: "Grocery Store",
		description: "Inside the grocery store",
		min: 0,
		max: 59,
	},
];

const TIPS_CONFIG = {
	show: true,
	items: [
		{
			label: "Left Wall",
			text: "Look for the number on the left wall surrounding the lift area",
		},
		{
			label: "Back Wall",
			text: "Find the number on the back wall surrounding the lift area",
		},
		{
			label: "Right Wall",
			text: "Check the right wall surrounding the lift area",
		},
		{
			label: "Order",
			text: "Each number goes on its corresponding dial: Left number on left dial, Back number on middle dial, Right number on right dial",
		},
	],
};

function SafeCodeSection(props: BaseSectionProps<NumberCodeData>) {
	return (
		<NumberCodeSection
			title="Safe Code"
			description="Collect numbers using the blacklight from the three locations."
			locations={CODE_LOCATIONS}
			storageKey="mauer-der-toten-safe-data"
			codeFormat="spaced"
			className="safe-code-section"
			resetButtonText="Reset Safe Code"
			finalCodeNote="Enter these numbers into the safe's three dials: Garment Factory - Underground - Grocery Store"
			tipsConfig={TIPS_CONFIG}
			{...props}
		/>
	);
}

export default SafeCodeSection;

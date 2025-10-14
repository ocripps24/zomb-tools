import { NumberCodeSection } from "@/components/ui";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import type { NumberCodeData } from "@/components/ui/NumberCodeSection";

// Define the three locations and their value ranges
// Ordered by collection order (most likely path through the map)
// The 'order' property defines the dial position: 1 = left, 2 = middle, 3 = right
const CODE_LOCATIONS = [
	{
		id: "underground",
		name: "Underground",
		description: "Underground area next to the hotel",
		min: 0,
		max: 59,
		order: 2,  // Middle dial
	},
	{
		id: "store",
		name: "Grocery Store",
		description: "East Berlin Streets",
		min: 0,
		max: 59,
		order: 3,  // Right dial
	},
	{
		id: "garment-factory",
		name: "Garment Factory",
		description: "Upstairs next to the hotel",
		min: 0,
		max: 59,
		order: 1,  // Left dial
	},
];

const TIPS_CONFIG = {
	show: true,
	items: [
		{
			label: "Underground",
			nested: [
				{
					text: "Look right when facing the ladder",
				},
				{
					text: "Above the entrance opposite the ladder",
				},
				{
					text: "Above the broken wall in the corridor leading to the ladder",
				},
			],
		},
		{
			label: "Grocery Store",
			nested: [
				{
					text: "Wall immediately to the right as you enter",
				},
				{
					text: "Right hand side of the shelves closest to the entrance",
				},
				{
					text: "Wall in the corner opposite from the entrance",
				},
			],
		},
		{
			label: "Garment Factory",
			nested: [
				{
					text: "On the chalkboard in the corner to the left of the upgrade machine",
				},
				{
					text: "Above the door leading to the roof",
				},
				{
					text: "On the wall next to the small stairs",
				},
			],
		},
		{
			label: "Order",
			text: "Garment Factory - Underground - Grocery Store",
		},
	],
};

function SafeCodeSection(props: BaseSectionProps<NumberCodeData>) {
	return (
		<NumberCodeSection
			title="Safe Code"
			description="Collect numbers using the blacklight from the three locations. The fields are displayed in collection order"
			locations={CODE_LOCATIONS}
			storageKey="mauer-der-toten-safe-code-data"
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

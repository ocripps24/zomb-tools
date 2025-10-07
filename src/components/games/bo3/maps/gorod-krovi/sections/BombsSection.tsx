import { useCallback } from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { OrderedLocationSection } from "@/components/ui";

const BOMB_LOCATIONS = {
	Armoury: "",
	"Dept. Store": "",
	"Dragon Command": "",
	Infirmary: "",
	"Supply Depot": "",
	"Tank Factory": "",
};

const TIPS = [
	{
		label: "Trophy Info",
		text: "This step is represented by the Bomb trophy, second from left at the console. The screen will flash through sections of the map displaying the order",
	},
	{
		label: "Armoury",
		text: "Downstairs on the way to Supply Depot",
	},
	{
		label: "Supply Depot",
		text: "Ahead and to the left of the ground-level entrance",
	},
	{
		label: "Infirmary",
		text: "Next to the lower staircase leading to the bunker",
	},
	{
		label: "Tank Factory",
		text: "Top floor - left hand room from the stairs",
	},
	{
		label: "Dragon Command",
		text: "Left hand side of the Balcony",
	},
	{
		label: "Dept. Store",
		text: "Ground floor behind the stairs",
	},
];

// Data interface for this section
interface BombsData {
	bombs: string[];
}

function BombsSection(props: BaseSectionProps<BombsData>) {
	return (
		<BaseSection
			config={{
				storageKey: "gorod-krovi-bombs-data",
				defaultValue: { bombs: [] },
				title: "Bomb Sequence",
				description:
					"Record the sequence for disarming the bombs during the trophy challenge.",
				resetButtonText: "Reset Bombs",
				tipsConfig: {
					show: true,
					items: TIPS,
				},
			}}
			getProgress={(data: BombsData) => {
				const bombCount = data.bombs?.length || 0;
				return {
					completed: bombCount,
					total: 6,
					isComplete: bombCount === 6,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const handleLocationsChange = useCallback(
					(newLocations: string[]) => {
						setData((prev: BombsData) => ({
							...prev,
							bombs: newLocations,
						}));
					},
					[setData]
				);

				return (
					<OrderedLocationSection
						locations={data.bombs}
						locationLabels={BOMB_LOCATIONS}
						onLocationsChange={handleLocationsChange}
					/>
				);
			}}
		</BaseSection>
	);
}

export default BombsSection;

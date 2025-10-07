import { useCallback } from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { OrderedLocationSection } from "@/components/ui";

const PLANET_LOCATIONS = {
	Mercury: "Mailrooms",
	Venus: "Millionaire Suite",
	Moon: "Lower Grand Stairs",
	Mars: "Boiler Room",
	Jupiter: "Engine Room",
	Saturn: "Bridge",
	Uranus: "State Rooms",
	Neptune: "Aft Deck",
	Sun: "Forecastle/Spawn",
};

// Data interface for this section
interface PlanetData {
	planets: string[];
}

function PlanetSection(props: BaseSectionProps<PlanetData>) {
	return (
		<BaseSection
			config={{
				storageKey: "voyage-of-despair-planet-data",
				defaultValue: { planets: [] },
				title: "Planet Order",
				description: "Record the order of planets as they appear. Sun is automatically added as the final step.",
				resetButtonText: "Reset Planets"
			}}
			getProgress={(data: PlanetData) => {
				const planetCount = data.planets?.length || 0;
				return {
					completed: planetCount,
					total: 8,
					isComplete: planetCount === 8
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const handleLocationsChange = useCallback(
					(newLocations: string[]) => {
						setData((prev: PlanetData) => ({
							...prev,
							planets: newLocations
						}));
					},
					[setData]
				);

				return (
					<OrderedLocationSection
						locations={data.planets}
						locationLabels={PLANET_LOCATIONS}
						onLocationsChange={handleLocationsChange}
						finalFixedLocation="Sun"
					/>
				);
			}}
		</BaseSection>
	);
}

export default PlanetSection;

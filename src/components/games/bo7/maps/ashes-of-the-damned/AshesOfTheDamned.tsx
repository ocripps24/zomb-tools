import { MapContainer } from "@/components/core";
import type { MapStep } from "@/components/core/MapContainer";
import SerumSection from "./sections/SerumSection";
import RocketLaunchSection from "./sections/RocketLaunchSection";
import { MAP_STEPS } from "@/routes";

const STEPS: MapStep[] = [
	{
		id: "serum",
		name: "Serum",
		path: MAP_STEPS.bo7.ashesOfTheDamned.steps.serum,
		component: SerumSection,
	},
	{
		id: "rocket-launch",
		name: "Rocket Launch",
		path: MAP_STEPS.bo7.ashesOfTheDamned.steps.rocketLaunch,
		component: RocketLaunchSection,
	},
];

export default function AshesOfTheDamned() {
	return (
		<MapContainer
			mapId="ashes-of-the-damned"
			mapName="Ashes of the Damned"
			game="bo7"
			steps={STEPS}
		/>
	);
}

import { MapContainer } from "@/components/core";
import type { MapStep } from "@/hooks";
import { getBO7MapById } from "@/data/bo7/maps";
import GauntletSection from "./sections/GauntletSection";
import SerumSection from "./sections/SerumSection";
import RocketLaunchSection from "./sections/RocketLaunchSection";

const STEPS: MapStep[] = [
	{
		id: "gauntlet",
		name: "Gauntlet",
		path: "/bo7/ashes-of-the-damned/gauntlet",
		component: GauntletSection,
	},
	{
		id: "serum",
		name: "Serum",
		path: "/bo7/ashes-of-the-damned/serum",
		component: SerumSection,
	},
	{
		id: "rocket-launch",
		name: "Rocket Launch",
		path: "/bo7/ashes-of-the-damned/rocket-launch",
		component: RocketLaunchSection,
	},
];

export default function AshesOfTheDamned() {
	const mapData = getBO7MapById("ashes-of-the-damned");

	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo7/ashes-of-the-damned"
			storagePrefix="ashes-of-the-damned"
			mapName="Ashes of the Damned"
			backTo="/bo7"
			className="ashes-of-the-damned"
			guide={mapData?.guide}
		/>
	);
}

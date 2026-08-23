import { MapContainer } from "@/components/core";
import type { MapStep } from "@/hooks";
import { getBO7MapById } from "@/data/bo7/maps";
import DravakarsSanctuarySection from "./sections/DravakarsSanctuarySection";
import NexusForgeSection from "./sections/NexusForgeSection";
import HouseSymbolsSection from "./sections/HouseSymbolsSection";

const STEPS: MapStep[] = [
	{
		id: "dravakars-sanctuary",
		name: "Dravakar's Sanctuary",
		path: "/bo7/rex-infernus/dravakars-sanctuary",
		component: DravakarsSanctuarySection,
	},
	{
		id: "house-symbols",
		name: "House Symbols",
		path: "/bo7/rex-infernus/house-symbols",
		component: HouseSymbolsSection,
	},
	{
		id: "nexus-forge",
		name: "Nexus Forge",
		path: "/bo7/rex-infernus/nexus-forge",
		component: NexusForgeSection,
	},
];

export default function RexInfernus() {
	const mapData = getBO7MapById("rex-infernus");

	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo7/rex-infernus"
			storagePrefix="rex-infernus"
			mapName="Rex Infernus"
			backTo="/bo7"
			className="rex-infernus"
			guide={mapData?.guide}
		/>
	);
}

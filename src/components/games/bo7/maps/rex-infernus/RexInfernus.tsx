import { MapContainer } from "@/components/core";
import type { MapStep } from "@/hooks";
import { getBO7MapById } from "@/data/bo7/maps";
import WWForgeSection from "./sections/WWForgeSection";

const STEPS: MapStep[] = [
	{
		id: "ww-forge",
		name: "WW Forge",
		path: "/bo7/rex-infernus/ww-forge",
		component: WWForgeSection,
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

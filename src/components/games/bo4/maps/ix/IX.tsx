import { MapContainer } from "@/components/core";
import { type MapStep } from "@/hooks";
import { getBO4MapById } from "@/data/bo4/maps";
import RaSymbolsSection from "./sections/RaSymbolsSection";

const STEPS: MapStep[] = [
	{
		id: "ra-symbols",
		name: "Ra Symbols",
		path: "/bo4/ix/ra-symbols",
		component: RaSymbolsSection,
	},
];

export default function IX() {
	const mapData = getBO4MapById("ix");

	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo4/ix"
			storagePrefix="ix"
			mapName="IX"
			backTo="/bo4"
			className="ix"
			guide={mapData?.guide}
		/>
	);
}

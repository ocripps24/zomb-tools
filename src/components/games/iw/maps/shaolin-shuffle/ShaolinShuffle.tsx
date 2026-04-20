import { MapContainer } from "@/components/core";
import type { MapStep } from "@/hooks";
import { getIWMapById } from "@/data/iw/maps";
import MorseCodeSection from "./sections/MorseCodeSection";
import RooftopSymbolsSection from "./sections/RooftopSymbolsSection";

const STEPS: MapStep[] = [
	{
		id: "morse-code",
		name: "Morse Code",
		path: "/iw/shaolin-shuffle/morse-code",
		component: MorseCodeSection,
	},
	{
		id: "rooftop-symbols",
		name: "Rooftop Symbols",
		path: "/iw/shaolin-shuffle/rooftop-symbols",
		component: RooftopSymbolsSection,
	},
];

function ShaolinShuffle() {
	const mapData = getIWMapById("shaolin-shuffle");
	return (
		<MapContainer
			steps={STEPS}
			basePath="/iw/shaolin-shuffle"
			storagePrefix="shaolin-shuffle"
			mapName="Shaolin Shuffle"
			backTo="/iw"
			className="shaolin-shuffle"
			guide={mapData?.guide}
		/>
	);
}

export default ShaolinShuffle;

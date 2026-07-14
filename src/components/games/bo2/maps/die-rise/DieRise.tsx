import { MapContainer } from "@/components/core";
import type { MapStep } from "@/hooks";
import { getBO2MapById } from "@/data/bo2/maps";
import MahjongTilesSection from "./sections/MahjongTilesSection";

const STEPS: MapStep[] = [
	{
		id: "mahjong-tiles",
		name: "Mahjong Tiles",
		path: "/bo2/die-rise/mahjong-tiles",
		component: MahjongTilesSection,
	},
];

export default function DieRise() {
	const mapData = getBO2MapById("die-rise");

	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo2/die-rise"
			storagePrefix="die-rise"
			mapName="Die Rise"
			backTo="/bo2"
			className="die-rise"
			guide={mapData?.guide}
		/>
	);
}

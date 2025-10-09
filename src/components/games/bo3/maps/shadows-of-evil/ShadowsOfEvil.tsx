import { MapContainer } from "@/components/core";
import { getBO3MapById } from "@/data/bo3/maps";
import EggSymbols from "./sections/EggSymbols";

const STEPS = [
	{
		id: "egg-symbols",
		name: "Egg Symbols",
		path: "/bo3/shadows-of-evil/egg-symbols",
		component: EggSymbols,
	},
];

function ShadowsOfEvil() {
	const mapData = getBO3MapById("shadows-of-evil");

	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo3/shadows-of-evil"
			storagePrefix="shadows-of-evil"
			mapName="Shadows of Evil"
			backTo="/bo3"
			className="shadows-of-evil"
			guide={mapData?.guide}
		/>
	);
}

export default ShadowsOfEvil;

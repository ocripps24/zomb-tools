// MapContainer component for multi-step map navigation
import { MapContainer } from "@/components/core";
import { getBO3MapById } from "@/data/bo3/maps";
import ValvesSection from "./sections/ValvesSection";

const STEPS = [
	{
		id: "valves",
		name: "Valves",
		path: "/bo3/gorod-krovi/valves",
		component: ValvesSection,
	},
];

function GorodKrovi() {
	const mapData = getBO3MapById("gorod-krovi");

	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo3/gorod-krovi"
			storagePrefix="gorod-krovi"
			mapName="Gorod Krovi"
			backTo="/bo3"
			className="gorod-krovi"
			guide={mapData?.guide}
		/>
	);
}

export default GorodKrovi;
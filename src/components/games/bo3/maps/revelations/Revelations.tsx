// MapContainer component for multi-step map navigation
import { MapContainer } from "@/components/core";
import { getBO3MapById } from "@/data/bo3/maps";
import KronoriumSection from "./sections/KronoriumSection";

const STEPS = [
	{
		id: "kronorium",
		name: "Kronorium",
		path: "/bo3/revelations/kronorium",
		component: KronoriumSection,
	},
];

function Revelations() {
	const mapData = getBO3MapById("revelations");

	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo3/revelations"
			storagePrefix="revelations"
			mapName="Revelations"
			backTo="/bo3"
			className="revelations"
			guide={mapData?.guide}
		/>
	);
}

export default Revelations;

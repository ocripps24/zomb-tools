// MapContainer component for multi-step map navigation
import { MapContainer } from "@/components/core";
import { getBO3MapById } from "@/data/bo3/maps";
import SimonSaysSection from "./sections/SimonSaysSection";

const STEPS = [
	{
		id: "simon-says",
		name: "Simon Says",
		path: "/bo3/der-eisendrache/simon-says",
		component: SimonSaysSection,
	},
];

function DerEisendrache() {
	const mapData = getBO3MapById("der-eisendrache");

	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo3/der-eisendrache"
			storagePrefix="der-eisendrache"
			mapName="Der Eisendrache"
			backTo="/bo3"
			className="der-eisendrache"
			guide={mapData?.guide}
		/>
	);
}

export default DerEisendrache;

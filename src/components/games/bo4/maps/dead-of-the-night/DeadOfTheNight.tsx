import { MapContainer } from "@/components/core";
import { getBO4MapById } from "@/data/bo4/maps";
import AlastairFollySection from "./sections/AlastairFollySection";
import AtlasSection from "./sections/AtlasSection";
import ScratchesSection from "./sections/ScratchesSection";

const STEPS = [
	{
		id: "alastair-folly",
		name: "Alastair's Folly",
		path: "/bo4/dead-of-the-night/alastair-folly",
		component: AlastairFollySection,
	},
	{
		id: "atlas",
		name: "Atlas",
		path: "/bo4/dead-of-the-night/atlas",
		component: AtlasSection,
	},
	{
		id: "scratches",
		name: "Scratches",
		path: "/bo4/dead-of-the-night/scratches",
		component: ScratchesSection,
	},
];

function DeadOfTheNight() {
	const mapData = getBO4MapById("dead-of-the-night");
	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo4/dead-of-the-night"
			storagePrefix="dead-of-the-night"
			mapName="Dead of the Night"
			backTo="/bo4"
			className="dead-of-the-night"
			guide={mapData?.guide}
		/>
	);
}

export default DeadOfTheNight;

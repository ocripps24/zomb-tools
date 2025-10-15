import { MapContainer } from "@/components/core";
import { getBO4MapById } from "@/data/bo4/maps";
import AlastairFollySection from "./sections/AlastairFollySection";

const STEPS = [
	{
		id: "alastair-folly",
		name: "Alastair's Folly",
		path: "/bo4/dead-of-the-night/alastair-folly",
		component: AlastairFollySection,
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

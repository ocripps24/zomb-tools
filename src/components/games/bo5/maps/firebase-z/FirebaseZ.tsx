import { MapContainer } from "@/components/core";
import { getBO5MapById } from "@/data/bo5/maps";
import DartboardSection from "./sections/DartboardSection";

const STEPS = [
	{
		id: "dartboard",
		name: "Dartboard",
		path: "/bo5/firebase-z/dartboard",
		component: DartboardSection,
	},
];

function FirebaseZ() {
	const mapData = getBO5MapById("firebase-z");
	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo5/firebase-z"
			storagePrefix="firebase-z"
			mapName="Firebase Z"
			backTo="/bo5"
			className="firebase-z"
			guide={mapData?.guide}
		/>
	);
}

export default FirebaseZ;

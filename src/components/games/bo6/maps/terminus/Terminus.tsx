// MapContainer component for multi-step map navigation
import { MapContainer } from "@/components/core";
import { getBO6MapById } from "@/data/bo6/maps";
import NathanCodeSection from "./sections/NathanCodeSection";
import BeamCodeSection from "./sections/BeamCodeSection";

const STEPS = [
	{
		id: "nathan-code",
		name: "Nathan Code",
		path: "/bo6/terminus/nathan-code",
		component: NathanCodeSection,
	},
	{
		id: "beam-code",
		name: "Beam Code",
		path: "/bo6/terminus/beam-code",
		component: BeamCodeSection,
	},
];

function Terminus() {
	const mapData = getBO6MapById("terminus");

	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo6/terminus"
			storagePrefix="terminus"
			mapName="Terminus"
			backTo="/bo6"
			className="terminus"
			guide={mapData?.guide}
		/>
	);
}

export default Terminus;

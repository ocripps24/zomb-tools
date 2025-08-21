// MapContainer component for multi-step map navigation
import { MapContainer } from "@/components/core";
import RavenSwordSection from "./sections/RavenSwordSection";
import TrapsSection from "./sections/TrapsSection";

const STEPS = [
	{
		id: "raven-sword",
		name: "Raven Sword",
		path: "/bo6/citadelle-des-morts/raven-sword",
		component: RavenSwordSection,
	},
	{
		id: "traps",
		name: "Traps",
		path: "/bo6/citadelle-des-morts/traps",
		component: TrapsSection,
	},
];

function CitadelleDesMorts() {
	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo6/citadelle-des-morts"
			storagePrefix="citadelle-des-morts"
			mapName="Citadelle des Morts"
			backTo="/bo6"
			className="citadelle-des-morts"
		/>
	);
}

export default CitadelleDesMorts;
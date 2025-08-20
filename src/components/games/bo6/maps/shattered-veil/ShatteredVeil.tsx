// MapContainer component for multi-step map navigation
import { MapContainer } from "../../../../core/index.js";
import SafeCodeSection from "./sections/SafeCodeSection";
import ChalkboardCodeSection from "./sections/ChalkboardCodeSection";

const STEPS = [
	{
		id: "chalkboard-code", 
		name: "Chalkboard Code",
		path: "/bo6/shattered-veil/chalkboard-code",
		component: ChalkboardCodeSection,
	},
	{
		id: "safe-code",
		name: "Safe Code",
		path: "/bo6/shattered-veil/safe-code",
		component: SafeCodeSection,
	},
];

function ShatteredVeil() {
	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo6/shattered-veil"
			storagePrefix="shattered-veil"
			mapName="Shattered Veil"
			backTo="/bo6"
			className="shattered-veil"
		/>
	);
}

export default ShatteredVeil;
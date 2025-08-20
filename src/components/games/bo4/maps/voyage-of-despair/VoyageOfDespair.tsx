// MapContainer component for multi-step map navigation
import { MapContainer } from "../../../../core/index.js";
import ClockSection from "./sections/ClockSection";
import OutletSection from "./sections/OutletSection";
import PlanetSection from "./sections/PlanetSection";

const STEPS = [
	{
		id: "clocks",
		name: "Clocks",
		path: "/bo4/voyage-of-despair/clocks",
		component: ClockSection,
	},
	{
		id: "outlets",
		name: "Outlets",
		path: "/bo4/voyage-of-despair/outlets",
		component: OutletSection,
	},
	{
		id: "planets",
		name: "Planets",
		path: "/bo4/voyage-of-despair/planets",
		component: PlanetSection,
	},
];

function VoyageOfDespair() {
	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo4/voyage-of-despair"
			storagePrefix="voyage-of-despair"
			mapName="Voyage of Despair"
			backTo="/bo4"
			className="voyage-of-despair"
		/>
	);
}

export default VoyageOfDespair;
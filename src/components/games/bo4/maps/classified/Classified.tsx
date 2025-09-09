import { MapContainer } from "@/components/core";
import { type MapStep } from "@/hooks";
import { getBO4MapById } from "@/data/bo4/maps";

// Import sections
import CodesSection from "./sections/CodesSection";

// Define the steps for Classified Easter Egg
const STEPS: MapStep[] = [
	{
		id: "codes",
		name: "Project Skadi",
		path: "/bo4/classified/codes",
		component: CodesSection,
	},
];

function Classified() {
	const mapData = getBO4MapById("classified");
	
	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo4/classified"
			storagePrefix="classified"
			mapName="Classified"
			backTo="/bo4"
			className="classified"
			guideUrl={mapData?.guideUrl}
		/>
	);
}

export default Classified;
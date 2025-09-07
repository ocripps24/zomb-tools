// MapContainer component for multi-step map navigation
import { MapContainer } from "@/components/core";
import { getBO6MapById } from "@/data/bo6/maps";
import DocumentsCodeSection from "./sections/DocumentsCodeSection";
import DoorCodeSection from "./sections/DoorCodeSection";

const STEPS = [
	{
		id: "documents",
		name: "Documents Code",
		path: "/bo6/reckoning/documents-code",
		component: DocumentsCodeSection,
	},
	{
		id: "door",
		name: "Door Code",
		path: "/bo6/reckoning/door-code",
		component: DoorCodeSection,
	},
];

function Reckoning() {
	const mapData = getBO6MapById("reckoning");
	
	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo6/reckoning"
			storagePrefix="reckoning"
			mapName="Reckoning"
			backTo="/bo6"
			className="reckoning"
			guideUrl={mapData?.guideUrl}
		/>
	);
}

export default Reckoning;
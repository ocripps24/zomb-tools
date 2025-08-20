// MapContainer component for multi-step map navigation
import { MapContainer } from "../../../../core/index.js";
import DocumentsCodeSection from "./sections/DocumentsCodeSection";
import DoorCodeSection from "./sections/DoorCodeSection";

const STEPS = [
	{
		id: "documents-code",
		name: "Documents Code",
		path: "/bo6/reckoning/documents-code",
		component: DocumentsCodeSection,
	},
	{
		id: "door-code",
		name: "Door Code",
		path: "/bo6/reckoning/door-code",
		component: DoorCodeSection,
	},
];

function Reckoning() {
	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo6/reckoning"
			storagePrefix="reckoning"
			mapName="Reckoning"
			backTo="/bo6"
			className="reckoning"
		/>
	);
}

export default Reckoning;
import { MapContainer } from "@/components/core";
import type { MapStep } from "@/hooks";
import { getBO7MapById } from "@/data/bo7/maps";
import PianoNotesSection from "./sections/PianoNotesSection";

const STEPS: MapStep[] = [
	{
		id: "piano-notes",
		name: "Piano Notes",
		path: "/bo7/paradox-junction/piano-notes",
		component: PianoNotesSection,
	},
];

export default function ParadoxJunction() {
	const mapData = getBO7MapById("paradox-junction");

	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo7/paradox-junction"
			storagePrefix="paradox-junction"
			mapName="Paradox Junction"
			backTo="/bo7"
			className="paradox-junction"
			guide={mapData?.guide}
		/>
	);
}

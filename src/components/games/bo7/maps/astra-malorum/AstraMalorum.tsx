import { MapContainer } from "@/components/core";
import type { MapStep } from "@/hooks";
import { getBO7MapById } from "@/data/bo7/maps";
import PapCodeSection from "./sections/PapCodeSection";

const STEPS: MapStep[] = [
	{
		id: "oscar-code",
		name: "OSCAR Code",
		path: "/bo7/astra-malorum/oscar-code",
		component: PapCodeSection,
	},
];

export default function AstraMalorum() {
	const mapData = getBO7MapById("astra-malorum");

	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo7/astra-malorum"
			storagePrefix="astra-malorum"
			mapName="Astra Malorum"
			backTo="/bo7"
			className="astra-malorum"
			guide={mapData?.guide}
		/>
	);
}

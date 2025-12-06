import { MapContainer } from "@/components/core";
import type { MapStep } from "@/hooks";
import { getBO7MapById } from "@/data/bo7/maps";
import PapCodeSection from "./sections/PapCodeSection";
import BooksSection from "./sections/BooksSection";
import TeleporterSection from "./sections/TeleporterSection";
import OrganSection from "./sections/OrganSection";

const STEPS: MapStep[] = [
	{
		id: "oscar-code",
		name: "OSCAR Code",
		path: "/bo7/astra-malorum/oscar-code",
		component: PapCodeSection,
	},
	{
		id: "books",
		name: "Books",
		path: "/bo7/astra-malorum/books",
		component: BooksSection,
	},
	{
		id: "teleporter",
		name: "Teleporter",
		path: "/bo7/astra-malorum/teleporter",
		component: TeleporterSection,
	},
	{
		id: "organ",
		name: "Organ / Mars",
		path: "/bo7/astra-malorum/organ",
		component: OrganSection,
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

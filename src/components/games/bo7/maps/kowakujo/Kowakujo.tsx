import { MapContainer } from "@/components/core";
import type { MapStep } from "@/hooks";
import { getBO7MapById } from "@/data/bo7/maps";
import ScrollsSection from "./sections/ScrollsSection";
import MurderMysterySection from "./sections/MurderMysterySection";

const STEPS: MapStep[] = [
	{
		id: "scrolls",
		name: "Scrolls",
		path: "/bo7/kowakujo/scrolls",
		component: ScrollsSection,
	},
	{
		id: "murder-mystery",
		name: "Murder Mystery",
		path: "/bo7/kowakujo/murder-mystery",
		component: MurderMysterySection,
	},
];

export default function Kowakujo() {
	const mapData = getBO7MapById("kowakujo");

	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo7/kowakujo"
			storagePrefix="kowakujo"
			mapName="Kowakujo"
			backTo="/bo7"
			className="kowakujo"
			guide={mapData?.guide}
		/>
	);
}

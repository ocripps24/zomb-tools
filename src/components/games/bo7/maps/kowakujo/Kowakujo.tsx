import { MapContainer } from "@/components/core";
import type { MapStep } from "@/hooks";
import { getBO7MapById } from "@/data/bo7/maps";
import ScrollsSection from "./sections/ScrollsSection";

const STEPS: MapStep[] = [
	{
		id: "scrolls",
		name: "Scrolls",
		path: "/bo7/kowakujo/scrolls",
		component: ScrollsSection,
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

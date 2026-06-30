import { MapContainer } from "@/components/core";
import type { MapStep } from "@/hooks";
import { getBO7MapById } from "@/data/bo7/maps";
import MasksSection from "./sections/MasksSection";
import ScrollsSection from "./sections/ScrollsSection";
import MurderMysterySection from "./sections/MurderMysterySection";
import FlagsSection from "./sections/FlagsSection";

const STEPS: MapStep[] = [
	{
		id: "masks",
		name: "Masks",
		path: "/bo7/kowakujo/masks",
		component: MasksSection,
	},
	{
		id: "scrolls",
		name: "Scrolls",
		path: "/bo7/kowakujo/scrolls",
		component: ScrollsSection,
	},
	{
		id: "flags",
		name: "Flags",
		path: "/bo7/kowakujo/flags",
		component: FlagsSection,
	},
	{
		id: "murder-mystery",
		name: "Evidence Solver",
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

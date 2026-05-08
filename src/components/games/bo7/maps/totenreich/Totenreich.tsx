import { MapContainer } from "@/components/core";
import type { MapStep } from "@/hooks";
import { getBO7MapById } from "@/data/bo7/maps";
import AABulletSection from "./sections/AABulletSection";

const STEPS: MapStep[] = [
	{
		id: "aa-bullet",
		name: "AA Bullet",
		path: "/bo7/totenreich/aa-bullet",
		component: AABulletSection,
	},
];

export default function Totenreich() {
	const mapData = getBO7MapById("totenreich");

	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo7/totenreich"
			storagePrefix="totenreich"
			mapName="Totenreich"
			backTo="/bo7"
			className="totenreich"
			guide={mapData?.guide}
		/>
	);
}

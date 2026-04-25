import { MapContainer } from "@/components/core";
import type { MapStep } from "@/hooks";
import { getIWMapById } from "@/data/iw/maps";
import DisksSection from "./sections/DisksSection";

const STEPS: MapStep[] = [
	{
		id: "disks",
		name: "Disks",
		path: "/iw/beast-from-beyond/disks",
		component: DisksSection,
	},
];

function BeastFromBeyond() {
	const mapData = getIWMapById("beast-from-beyond");
	return (
		<MapContainer
			steps={STEPS}
			basePath="/iw/beast-from-beyond"
			storagePrefix="beast-from-beyond"
			mapName="Beast from Beyond"
			backTo="/iw"
			className="beast-from-beyond"
			guide={mapData?.guide}
		/>
	);
}

export default BeastFromBeyond;

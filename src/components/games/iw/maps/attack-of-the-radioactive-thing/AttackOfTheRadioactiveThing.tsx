import { MapContainer } from "@/components/core";
import type { MapStep } from "@/hooks";
import { getIWMapById } from "@/data/iw/maps";
import CodesSection from "./sections/CodesSection";
import DataSection from "./sections/DataSection";
import ChemistrySection from "./sections/ChemistrySection";

const STEPS: MapStep[] = [
	{
		id: "codes",
		name: "Codes",
		path: "/iw/attack-of-the-radioactive-thing/codes",
		component: CodesSection,
	},
	{
		id: "data",
		name: "Chemistry - Data",
		path: "/iw/attack-of-the-radioactive-thing/chemistry-data",
		component: DataSection,
	},
	{
		id: "crafting",
		name: "Chemistry - Crafting",
		path: "/iw/attack-of-the-radioactive-thing/chemistry-crafting",
		component: ChemistrySection,
	},
];

function AttackOfTheRadioactiveThing() {
	const mapData = getIWMapById("attack-of-the-radioactive-thing");
	return (
		<MapContainer
			steps={STEPS}
			basePath="/iw/attack-of-the-radioactive-thing"
			storagePrefix="radioactive-thing"
			mapName="Attack of the Radioactive Thing"
			backTo="/iw"
			className="attack-radioactive-thing"
			guide={mapData?.guide}
		/>
	);
}

export default AttackOfTheRadioactiveThing;

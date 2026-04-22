import { MapContainer } from "@/components/core";
import { getBO4MapById } from "@/data/bo4/maps";
import PowerHouseSection from "./sections/PowerHouseSection";
import MorseCodeSection from "./sections/MorseCodeSection";

const STEPS = [
	{
		id: "power-house",
		name: "Power House",
		path: "/bo4/blood-of-the-dead/power-house",
		component: PowerHouseSection,
	},
	{
		id: "morse-code",
		name: "Morse Code",
		path: "/bo4/blood-of-the-dead/morse-code",
		component: MorseCodeSection,
	},
];

function BloodOfTheDead() {
	const mapData = getBO4MapById("blood-of-the-dead");

	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo4/blood-of-the-dead"
			storagePrefix="blood-of-the-dead"
			mapName="Blood of the Dead"
			backTo="/bo4"
			className="blood-of-the-dead"
			guide={mapData?.guide}
		/>
	);
}

export default BloodOfTheDead;

// MapContainer component for Alpha Omega multi-step map navigation
import { MapContainer } from "@/components/core";
import { getBO5MapById } from "@/data/bo5/maps";
import SafeCodeSection from "./sections/SafeCodeSection";

const STEPS = [
	{
		id: "safe-code",
		name: "Safe Code",
		path: "/bo5/mauer-der-toten/safe-code",
		component: SafeCodeSection,
	},
];

function MauerDerToten() {
	const mapData = getBO5MapById("mauer-der-toten");
	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo5/mauer-der-toten"
			storagePrefix="mauer-der-toten"
			mapName="Mauer Der Toten"
			backTo="/bo5"
			className="mauer-der-toten"
			guide={mapData?.guide}
		/>
	);
}

export default MauerDerToten;

import { MapContainer } from "@/components/core";
import { getBO1MapById } from "@/data/bo1/maps";
import SamanthaSays from "./sections/SamanthaSays";

const STEPS = [
	{
		id: "samantha-says",
		name: "Samantha Says",
		path: "/bo1/moon/samantha-says",
		component: SamanthaSays,
	},
];

function Moon() {
	const mapData = getBO1MapById("moon");

	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo1/moon"
			storagePrefix="moon"
			mapName="Moon"
			backTo="/bo1"
			className="moon"
			guide={mapData?.guide}
		/>
	);
}

export default Moon;

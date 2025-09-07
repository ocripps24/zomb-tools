// MapContainer component for Alpha Omega multi-step map navigation
import { MapContainer } from "@/components/core";
import UnlockAdamSection from "./sections/UnlockAdamSection";
import ClocksSection from "./sections/ClocksSection";
import CoreValue3Section from "./sections/CoreValue3Section";
import CoreValue4Section from "./sections/CoreValue4Section";

const STEPS = [
	{
		id: "unlock-adam",
		name: "Unlock A.D.A.M",
		path: "/bo4/alpha-omega/unlock-adam",
		component: UnlockAdamSection,
	},
	{
		id: "clocks",
		name: "Clocks",
		path: "/bo4/alpha-omega/clocks",
		component: ClocksSection,
	},
	{
		id: "core-value-3",
		name: "Core Value 3",
		path: "/bo4/alpha-omega/core-value-3",
		component: CoreValue3Section,
	},
	{
		id: "core-value-4",
		name: "Core Value 4",
		path: "/bo4/alpha-omega/core-value-4",
		component: CoreValue4Section,
	},
];

function AlphaOmega() {
	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo4/alpha-omega"
			storagePrefix="alpha-omega"
			mapName="Alpha Omega"
			backTo="/bo4"
			className="alpha-omega"
		/>
	);
}

export default AlphaOmega;
// MapContainer component for multi-step map navigation
import { MapContainer } from "@/components/core";
import TotemsSection from "./sections/TotemsSection";
import ApothicanOfferingsSection from "./sections/ApothicanOfferingsSection";
import SealOfDualitySection from "./sections/SealOfDualitySection";
import OrbLocationsSection from "./sections/OrbLocationsSection";

const STEPS = [
	{
		id: "totems",
		name: "Totems",
		path: "/bo4/tag-der-toten/totems",
		component: TotemsSection,
	},
	{
		id: "apothican-offerings",
		name: "Apothican Offerings",
		path: "/bo4/tag-der-toten/apothican-offerings",
		component: ApothicanOfferingsSection,
	},
	{
		id: "seal-of-duality",
		name: "Seal of Duality",
		path: "/bo4/tag-der-toten/seal-of-duality",
		component: SealOfDualitySection,
	},
	{
		id: "orb-locations",
		name: "Orb Locations",
		path: "/bo4/tag-der-toten/orb-locations",
		component: OrbLocationsSection,
	},
];

function TagDerToten() {
	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo4/tag-der-toten"
			storagePrefix="tag-der-toten"
			mapName="Tag der Toten"
			backTo="/bo4"
			className="tag-der-toten"
		/>
	);
}

export default TagDerToten;
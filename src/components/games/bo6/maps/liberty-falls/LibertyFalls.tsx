// MapContainer component for multi-step map navigation
import { MapContainer } from "../../../../core/index.js";
import VaultCodeSection from "./sections/VaultCodeSection";

const STEPS = [
	{
		id: "vault-code",
		name: "Vault Code",
		path: "/bo6/liberty-falls/vault-code",
		component: VaultCodeSection,
	},
];

function LibertyFalls() {
	return (
		<MapContainer
			steps={STEPS}
			basePath="/bo6/liberty-falls"
			storagePrefix="liberty-falls"
			mapName="Liberty Falls"
			backTo="/bo6"
			className="liberty-falls"
		/>
	);
}

export default LibertyFalls;
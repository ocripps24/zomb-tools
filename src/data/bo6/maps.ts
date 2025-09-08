import { ROUTES } from "../../routes";

export interface BO6Map {
	id: string;
	name: string;
	status: string;
	route: string;
	component: (() => Promise<any>) | null;
	available: boolean;
	tools: string[];
	difficulty: "easy" | "medium" | "hard";
	guideUrl?: string;
}

export const BO6_MAPS: BO6Map[] = [
	{
		id: "terminus",
		name: "Terminus",
		status: "Available",
		route: ROUTES.games.bo6.maps.terminus,
		component: () =>
			import("../../components/games/bo6/maps/terminus/Terminus.tsx"),
		available: true,
		tools: ["Nathan code", "Code Calculator"],
		difficulty: "medium",
		guideUrl: "https://www.youtube.com/embed/gSB646HNfgs",
	},
	{
		id: "liberty-falls",
		name: "Liberty Falls",
		status: "Available",
		route: ROUTES.games.bo6.maps.libertyFalls,
		component: () =>
			import("../../components/games/bo6/maps/liberty-falls/LibertyFalls.tsx"),
		available: true,
		tools: ["Vault"],
		difficulty: "easy",
	},
	{
		id: "citadelle-des-morts",
		name: "Citadelle des Morts",
		status: "Available",
		route: ROUTES.games.bo6.maps.citadelleDesMorts,
		component: () =>
			import("../../components/games/bo6/maps/citadelle-des-morts/CitadelleDesMorts.tsx"),
		available: true,
		tools: ["Raven Sword", "Traps"],
		difficulty: "medium",
	},
	{
		id: "the-tomb",
		name: "The Tomb",
		status: "Coming later",
		route: ROUTES.games.bo6.maps.theTomb,
		component: null,
		available: false,
		tools: ["Upgrade symbols"],
		difficulty: "easy",
	},
	{
		id: "shattered-veil",
		name: "Shattered Veil",
		status: "Available",
		route: ROUTES.games.bo6.maps.shatteredVeil,
		component: () =>
			import(
				"../../components/games/bo6/maps/shattered-veil/ShatteredVeil.tsx"
			),
		available: true,
		tools: ["Chalkboard Code", "Safe Code"],
		difficulty: "easy",
		guideUrl: "https://www.youtube.com/embed/8hRISolznmE",
	},
	{
		id: "reckoning",
		name: "Reckoning",
		status: "Available",
		route: ROUTES.games.bo6.maps.reckoning,
		component: () =>
			import("../../components/games/bo6/maps/reckoning/Reckoning.tsx"),
		available: true,
		tools: ["Documents Code", "Door Code"],
		difficulty: "medium",
		guideUrl: "https://www.youtube.com/embed/ABA6bHB5q6s",
	},
];

export const getBO6MapById = (mapId: string): BO6Map | null => {
	return BO6_MAPS.find((map) => map.id === mapId) || null;
};

export const getAvailableBO6Maps = (): BO6Map[] => {
	return BO6_MAPS.filter((map) => map.available);
};
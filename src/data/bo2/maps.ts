import { ROUTES } from "../../routes";

export interface BO2Map {
	id: string;
	name: string;
	status: string;
	route: string;
	component: (() => Promise<any>) | null;
	available: boolean;
	tools: string[];
	difficulty: "easy" | "medium" | "hard";
	guide?: {
		url: string;
		type: "internal" | "external";
		channelName?: string; // Only for external guides
	};
}

export const BO2_MAPS: BO2Map[] = [
	{
		id: "die-rise",
		name: "Die Rise",
		status: "Available",
		route: ROUTES.games.bo2.maps.dieRise,
		component: () =>
			import("../../components/games/bo2/maps/die-rise/DieRise"),
		available: true,
		tools: ["Mahjong Tiles"],
		difficulty: "medium",
	},
];

export const getBO2MapById = (mapId: string): BO2Map | null => {
	return BO2_MAPS.find((map) => map.id === mapId) || null;
};

export const getAvailableBO2Maps = (): BO2Map[] => {
	return BO2_MAPS.filter((map) => map.available);
};

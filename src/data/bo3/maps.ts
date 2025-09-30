import { ROUTES } from "../../routes";

export interface BO3Map {
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

export const BO3_MAPS: BO3Map[] = [
	{
		id: "gorod-krovi",
		name: "Gorod Krovi",
		status: "Available",
		route: ROUTES.games.bo3.maps.gorodKrovi,
		component: () =>
			import("../../components/games/bo3/maps/gorod-krovi/GorodKrovi.tsx"),
		available: true,
		tools: ["Valves"],
		difficulty: "hard",
	},
];

export const getBO3MapById = (mapId: string): BO3Map | null => {
	return BO3_MAPS.find((map) => map.id === mapId) || null;
};

export const getAvailableBO3Maps = (): BO3Map[] => {
	return BO3_MAPS.filter((map) => map.available);
};
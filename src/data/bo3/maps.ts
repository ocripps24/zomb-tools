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
		id: "shadows-of-evil",
		name: "Shadows of Evil",
		status: "Available",
		route: ROUTES.games.bo3.maps.shadowsOfEvil,
		component: () =>
			import("../../components/games/bo3/maps/shadows-of-evil/ShadowsOfEvil.tsx"),
		available: true,
		tools: ["Egg Symbols"],
		difficulty: "medium",
		guide: {
			url: "https://www.youtube.com/embed/zz9m-MB725o",
			type: "external",
			channelName: "MrRoflWaffles",
		},
	},
	{
		id: "der-eisendrache",
		name: "Der Eisendrache",
		status: "Available",
		route: ROUTES.games.bo3.maps.derEisendrache,
		component: () =>
			import("../../components/games/bo3/maps/der-eisendrache/DerEisendrache.tsx"),
		available: true,
		tools: ["Simon Says"],
		difficulty: "hard",
		guide: {
			url: "https://www.youtube.com/embed/hHjeVQxbEJE?si=RYHPJLC_fm3vwLjf",
			type: "external",
			channelName: "Joltz",
		},
	},
	{
		id: "gorod-krovi",
		name: "Gorod Krovi",
		status: "Available",
		route: ROUTES.games.bo3.maps.gorodKrovi,
		component: () =>
			import("../../components/games/bo3/maps/gorod-krovi/GorodKrovi.tsx"),
		available: true,
		tools: ["Valves, Bombs"],
		difficulty: "hard",
		guide: {
			url: "https://www.youtube.com/embed/GdOJYibXUvw",
			type: "external",
			channelName: "Joltz",
		},
	},
];

export const getBO3MapById = (mapId: string): BO3Map | null => {
	return BO3_MAPS.find((map) => map.id === mapId) || null;
};

export const getAvailableBO3Maps = (): BO3Map[] => {
	return BO3_MAPS.filter((map) => map.available);
};

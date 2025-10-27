import { ROUTES } from "../../routes";

export interface BO1Map {
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

export const BO1_MAPS: BO1Map[] = [
	{
		id: "moon",
		name: "Moon",
		status: "Available",
		route: ROUTES.games.bo1.maps.moon,
		component: () => import("../../components/games/bo1/maps/moon/Moon.tsx"),
		available: true,
		tools: ["Samantha Says"],
		difficulty: "medium",
	},
];

export const getBO1MapById = (mapId: string): BO1Map | null => {
	return BO1_MAPS.find((map) => map.id === mapId) || null;
};

export const getAvailableBO1Maps = (): BO1Map[] => {
	return BO1_MAPS.filter((map) => map.available);
};

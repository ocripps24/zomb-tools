import { ROUTES } from "../../routes";

export interface BO7Map {
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

export const BO7_MAPS: BO7Map[] = [
	{
		id: "ashes-of-the-damned",
		name: "Ashes of the Damned",
		status: "Available",
		route: ROUTES.games.bo7.maps.ashesOfTheDamned,
		component: () =>
			import(
				"../../components/games/bo7/maps/ashes-of-the-damned/AshesOfTheDamned"
			),
		available: true,
		tools: ["Serum", "Rocket Launch"],
		difficulty: "medium",
	},
	{
		id: "astra-malorum",
		name: "Astra Malorum",
		status: "Available",
		route: ROUTES.games.bo7.maps.astraMalorum,
		component: () =>
			import(
				"../../components/games/bo7/maps/astra-malorum/AstraMalorum"
			),
		available: true,
		tools: ["OSCAR Code"],
		difficulty: "medium",
	},
];

export const getBO7MapById = (mapId: string): BO7Map | null => {
	return BO7_MAPS.find((map) => map.id === mapId) || null;
};

export const getAvailableBO7Maps = (): BO7Map[] => {
	return BO7_MAPS.filter((map) => map.available);
};

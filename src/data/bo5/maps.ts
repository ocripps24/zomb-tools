import { ROUTES } from "../../routes";

export interface BO5Map {
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

export const BO5_MAPS: BO5Map[] = [
	{
		id: "firebase-z",
		name: "Firebase Z",
		status: "Available",
		route: ROUTES.games.bo5.maps.firebaseZ,
		component: () =>
			import("../../components/games/bo5/maps/firebase-z/FirebaseZ.tsx"),
		available: true,
		tools: ["Dartboard Code"],
		difficulty: "easy",
	},
	{
		id: "mauer-der-toten",
		name: "Mauer der Toten",
		status: "Available",
		route: ROUTES.games.bo5.maps.mauerDerToten,
		component: () =>
			import(
				"../../components/games/bo5/maps/mauer-der-toten/MauerDerToten.tsx"
			),
		available: true,
		tools: ["Safe Codes"],
		difficulty: "medium",
	},
];

export const getBO5MapById = (mapId: string): BO5Map | null => {
	return BO5_MAPS.find((map) => map.id === mapId) || null;
};

export const getAvailableBO5Maps = (): BO5Map[] => {
	return BO5_MAPS.filter((map) => map.available);
};

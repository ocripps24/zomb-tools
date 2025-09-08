import { ROUTES } from "../../routes";

export interface BO4Map {
	id: string;
	name: string;
	status: string;
	route: string;
	component: (() => Promise<any>) | null;
	available: boolean;
	tools: string[];
	difficulty: "easy" | "medium" | "hard";
}

export const BO4_MAPS: BO4Map[] = [
	{
		id: "voyage-of-despair",
		name: "Voyage of Despair",
		status: "Available",
		route: ROUTES.games.bo4.maps.voyageOfDespair,
		component: () =>
			import(
				"../../components/games/bo4/maps/voyage-of-despair/VoyageOfDespair.tsx"
			),
		available: true,
		tools: ["clocks", "outlets", "planets"],
		difficulty: "medium",
	},
	{
		id: "blood-of-the-dead",
		name: "Blood of the Dead",
		status: "Coming soon",
		route: ROUTES.games.bo4.maps.bloodOfTheDead,
		component: null,
		available: false,
		tools: ["TBC"],
		difficulty: "hard",
	},
	{
		id: "ix",
		name: "IX",
		status: "Coming later",
		route: ROUTES.games.bo4.maps.ix,
		component: null,
		available: false,
		tools: ["TBC"],
		difficulty: "medium",
	},
	{
		id: "classified",
		name: "Classified",
		status: "Coming soon",
		route: ROUTES.games.bo4.maps.classified,
		component: null,
		available: false,
		tools: ["Codes"],
		difficulty: "easy",
	},
	{
		id: "dead-of-the-night",
		name: "Dead of the Night",
		status: "Under review",
		route: ROUTES.games.bo4.maps.deadOfTheNight,
		component: null,
		available: false,
		tools: ["TBC"],
		difficulty: "medium",
	},
	{
		id: "alpha-omega",
		name: "Alpha Omega",
		status: "Available",
		route: ROUTES.games.bo4.maps.alphaOmega,
		component: () =>
			import("../../components/games/bo4/maps/alpha-omega/AlphaOmega.tsx"),
		available: true,
		tools: ["Unlock A.D.A.M", "Clocks", "Core Value 3", "Core Value 4"],
		difficulty: "medium",
	},
	{
		id: "ancient-evil",
		name: "Ancient Evil",
		status: "Under review",
		route: ROUTES.games.bo4.maps.ancientEvil,
		component: null,
		available: false,
		tools: ["TBC"],
		difficulty: "medium",
	},
	{
		id: "tag-der-toten",
		name: "Tag der Toten",
		status: "Available",
		route: ROUTES.games.bo4.maps.tagDerToten,
		component: () =>
			import("../../components/games/bo4/maps/tag-der-toten/TagDerToten.tsx"),
		available: true,
		tools: ["Totems", "Apothican Offerings", "Seal of Duality", "Orb Locations"],
		difficulty: "hard",
	},
];

export const getBO4MapById = (mapId: string): BO4Map | null => {
	return BO4_MAPS.find((map) => map.id === mapId) || null;
};

export const getAvailableBO4Maps = (): BO4Map[] => {
	return BO4_MAPS.filter((map) => map.available);
};
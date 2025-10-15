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
	guide?: {
		url: string;
		type: "internal" | "external";
		channelName?: string; // Only for external guides
	};
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
		guide: {
			url: "https://www.youtube.com/embed/2uWcP083T0g",
			type: "external",
			channelName: "Joltz",
		},
	},
	{
		id: "ix",
		name: "IX",
		status: "Available",
		route: ROUTES.games.bo4.maps.ix,
		component: () => import("../../components/games/bo4/maps/ix/IX.tsx"),
		available: true,
		tools: ["Ra Symbols"],
		difficulty: "medium",
	},
	{
		id: "blood-of-the-dead",
		name: "Blood of the Dead",
		status: "Coming November",
		route: ROUTES.games.bo4.maps.bloodOfTheDead,
		component: null,
		available: false,
		tools: ["TBC"],
		difficulty: "hard",
	},
	{
		id: "classified",
		name: "Classified",
		status: "Available",
		route: ROUTES.games.bo4.maps.classified,
		component: () =>
			import("../../components/games/bo4/maps/classified/Classified.tsx"),
		available: true,
		tools: ["Project Skadi"],
		difficulty: "easy",
		guide: {
			url: "https://www.youtube.com/embed/LnNDzHcv4Yw",
			type: "external",
			channelName: "Glitch",
		},
	},
	{
		id: "dead-of-the-night",
		name: "Dead of the Night",
		status: "Available",
		route: ROUTES.games.bo4.maps.deadOfTheNight,
		component: () =>
			import(
				"../../components/games/bo4/maps/dead-of-the-night/DeadOfTheNight.tsx"
			),
		available: true,
		tools: ["Alastair's Folly"],
		difficulty: "medium",
	},
	{
		id: "ancient-evil",
		name: "Ancient Evil",
		status: "Not currently planned",
		route: ROUTES.games.bo4.maps.ancientEvil,
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
		guide: {
			url: "https://www.youtube.com/embed/6Uls6HaBoV8",
			type: "external",
			channelName: "Joltz",
		},
	},
	{
		id: "tag-der-toten",
		name: "Tag der Toten",
		status: "Available",
		route: ROUTES.games.bo4.maps.tagDerToten,
		component: () =>
			import("../../components/games/bo4/maps/tag-der-toten/TagDerToten.tsx"),
		available: true,
		tools: [
			"Totems",
			"Apothican Offerings",
			"Seal of Duality",
			"Orb Locations",
		],
		difficulty: "hard",
		guide: {
			url: "https://www.youtube.com/embed/eqyw5Pi5-4c",
			type: "external",
			channelName: "Joltz",
		},
	},
];

export const getBO4MapById = (mapId: string): BO4Map | null => {
	return BO4_MAPS.find((map) => map.id === mapId) || null;
};

export const getAvailableBO4Maps = (): BO4Map[] => {
	return BO4_MAPS.filter((map) => map.available);
};

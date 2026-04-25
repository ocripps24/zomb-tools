import { ROUTES } from "../../routes";
import ZombiesInSpacelandImage from "../../assets/maps/iw/zombies-in-spaceland-preview.jpg";
import RaveInTheRedwoodsImage from "../../assets/maps/iw/rave-in-the-redwoods-preview.jpg";
import ShaolinShuffleImage from "../../assets/maps/iw/shaolin-shuffle-preview.jpg";
import AttackOfTheRadioactiveThingImage from "../../assets/maps/iw/attack-of-the-radioactive-thing-preview.jpg";
import BeastFromBeyondImage from "../../assets/maps/iw/beast-from-beyond-preview.jpg";

export interface IWMap {
	id: string;
	name: string;
	status: string;
	route: string;
	component: (() => Promise<any>) | null;
	available: boolean;
	tools: string[];
	difficulty: "easy" | "medium" | "hard";
	beta?: boolean;
	image?: string;
	guide?: {
		url: string;
		type: "internal" | "external";
		channelName?: string;
	};
}

export const IW_MAPS: IWMap[] = [
	{
		id: "zombies-in-spaceland",
		name: "Zombies in Spaceland",
		status: "Under review",
		route: "",
		component: null,
		available: false,
		tools: [],
		difficulty: "medium",
		image: ZombiesInSpacelandImage,
	},
	{
		id: "rave-in-the-redwoods",
		name: "Rave in the Redwoods",
		status: "Under review",
		route: "",
		component: null,
		available: false,
		tools: [],
		difficulty: "medium",
		image: RaveInTheRedwoodsImage,
	},
	{
		id: "shaolin-shuffle",
		name: "Shaolin Shuffle",
		status: "Available",
		route: ROUTES.games.iw.maps.shaolinShuffle,
		component: () =>
			import("../../components/games/iw/maps/shaolin-shuffle/ShaolinShuffle.tsx"),
		available: true,
		tools: ["Morse Code", "Rooftop Symbols"],
		difficulty: "medium",
		image: ShaolinShuffleImage,
		guide: {
			url: "https://www.youtube.com/embed/tAbZsNbEFGA",
			type: "external",
			channelName: "NoodlesRuns",
		},
	},
	{
		id: "attack-of-the-radioactive-thing",
		name: "Attack of the Radioactive Thing",
		status: "Available",
		route: ROUTES.games.iw.maps.attackOfTheRadioactiveThing,
		component: () =>
			import("../../components/games/iw/maps/attack-of-the-radioactive-thing/AttackOfTheRadioactiveThing.tsx"),
		available: true,
		tools: ["Codes", "Chemistry - Data", "Chemistry - Crafting"],
		difficulty: "hard",
		beta: true,
		image: AttackOfTheRadioactiveThingImage,
		guide: {
			url: "https://www.youtube.com/embed/zemlG7hyw30",
			type: "external",
			channelName: "Joltz",
		},
	},
	{
		id: "beast-from-beyond",
		name: "Beast from Beyond",
		status: "Available",
		route: ROUTES.games.iw.maps.beastFromBeyond,
		component: () =>
			import("../../components/games/iw/maps/beast-from-beyond/BeastFromBeyond.tsx"),
		available: true,
		tools: ["Disks"],
		difficulty: "hard",
		image: BeastFromBeyondImage,
	},
];

export const getIWMapById = (mapId: string): IWMap | null => {
	return IW_MAPS.find((map) => map.id === mapId) || null;
};

export const getAvailableIWMaps = (): IWMap[] => {
	return IW_MAPS.filter((map) => map.available);
};

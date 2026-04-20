import { ROUTES } from "../../routes";
import ShaolinShuffleImage from "../../assets/maps/iw/shaolin-shuffle-preview.jpg";

export interface IWMap {
	id: string;
	name: string;
	status: string;
	route: string;
	component: (() => Promise<any>) | null;
	available: boolean;
	tools: string[];
	difficulty: "easy" | "medium" | "hard";
	image?: string;
	guide?: {
		url: string;
		type: "internal" | "external";
		channelName?: string;
	};
}

export const IW_MAPS: IWMap[] = [
	{
		id: "shaolin-shuffle",
		name: "Shaolin Shuffle",
		status: "Available",
		route: ROUTES.games.iw.maps.shaolinShuffle,
		component: () =>
			import(
				"../../components/games/iw/maps/shaolin-shuffle/ShaolinShuffle.tsx"
			),
		available: true,
		tools: ["Morse Code", "Rooftop Symbols"],
		difficulty: "medium",
		image: ShaolinShuffleImage,
	},
];

export const getIWMapById = (mapId: string): IWMap | null => {
	return IW_MAPS.find((map) => map.id === mapId) || null;
};

export const getAvailableIWMaps = (): IWMap[] => {
	return IW_MAPS.filter((map) => map.available);
};

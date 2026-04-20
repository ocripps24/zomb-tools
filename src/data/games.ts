import { ROUTES } from "../routes";

export interface Game {
	id: string;
	name: string;
	fullName: string;
	description: string;
	available: boolean;
	releaseYear: number;
	route: string | null;
}

export const GAMES: Record<string, Game> = {
	bo1: {
		id: "bo1",
		name: "Black Ops 1",
		fullName: "Call of Duty: Black Ops",
		description: "Zombies mode speedrun tools and guides",
		available: true,
		releaseYear: 2010,
		route: ROUTES.games.bo1.base,
	},
	bo3: {
		id: "bo3",
		name: "Black Ops 3",
		fullName: "Call of Duty: Black Ops 3",
		description: "Zombies mode speedrun tools and guides",
		available: true,
		releaseYear: 2015,
		route: ROUTES.games.bo3.base,
	},
	bo4: {
		id: "bo4",
		name: "Black Ops 4",
		fullName: "Call of Duty: Black Ops 4",
		description: "Zombies mode speedrun tools and guides",
		available: true,
		releaseYear: 2018,
		route: ROUTES.games.bo4.base,
	},
	bo5: {
		id: "bo5",
		name: "Cold War",
		fullName: "Call of Duty: Black Ops Cold War",
		description: "Zombies mode speedrun tools and guides",
		available: true,
		releaseYear: 2020,
		route: ROUTES.games.bo5.base,
	},
	bo6: {
		id: "bo6",
		name: "Black Ops 6",
		fullName: "Call of Duty: Black Ops 6",
		description: "Zombies mode speedrun tools and guides",
		available: true,
		releaseYear: 2024,
		route: ROUTES.games.bo6.base,
	},
	bo7: {
		id: "bo7",
		name: "Black Ops 7",
		fullName: "Call of Duty: Black Ops 7",
		description: "Coming 2025 - Zombies mode tools (Pre-release)",
		available: true,
		releaseYear: 2025,
		route: ROUTES.games.bo7.base,
	},
	iw: {
		id: "iw",
		name: "Infinite Warfare",
		fullName: "Call of Duty: Infinite Warfare",
		description: "Zombies mode speedrun tools and guides",
		available: true,
		releaseYear: 2016,
		route: ROUTES.games.iw.base,
	},
};

export const getGameById = (gameId: string): Game | null => {
	return GAMES[gameId] || null;
};

export const getAvailableGames = (): Game[] => {
	return Object.values(GAMES).filter((game) => game.available);
};

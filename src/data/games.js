import { ROUTES } from "../routes";

export const GAMES = {
	bo4: {
		id: "bo4",
		name: "Black Ops 4",
		fullName: "Call of Duty: Black Ops 4",
		description: "Zombies mode speedrun tools and guides",
		available: true,
		releaseYear: 2018,
		route: ROUTES.games.bo4.base,
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
};

export const getGameById = (gameId) => {
	return GAMES[gameId] || null;
};

export const getAvailableGames = () => {
	return Object.values(GAMES).filter((game) => game.available);
};

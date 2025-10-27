/**
 * Route utility functions for navigation and route management.
 * These functions provide a clean API for working with routes throughout the application.
 */

import { ROUTES, MAP_STEPS, ROUTE_METADATA } from "./config";

// Game and map type definitions
export type GameId = "bo1" | "bo3" | "bo4" | "bo5" | "bo6" | "bo7";
export type MapId = string;
export type StepId = string;

/**
 * Get the route for a specific game's map selection page
 */
export const getGameRoute = (gameId: GameId): string => {
	return ROUTES.games[gameId].base;
};

/**
 * Get the route for a specific map
 */
export const getMapRoute = (gameId: GameId, mapId: string): string => {
	const gameRoutes = ROUTES.games[gameId];
	if (!gameRoutes) {
		throw new Error(`Unknown game: ${gameId}`);
	}

	// Convert map ID to camelCase for route lookup
	const mapKey = mapIdToCamelCase(mapId);
	const mapRoute = (gameRoutes.maps as any)[mapKey];

	if (!mapRoute) {
		throw new Error(`Unknown map: ${mapId} for game: ${gameId}`);
	}

	return mapRoute;
};

/**
 * Get the route for a specific step within a map
 */
export const getStepRoute = (
	gameId: GameId,
	mapId: string,
	stepId: string
): string => {
	const gameSteps = MAP_STEPS[gameId as keyof typeof MAP_STEPS];
	if (!gameSteps) {
		throw new Error(`Unknown game: ${gameId}`);
	}

	const mapKey = mapIdToCamelCase(mapId);
	const mapSteps = (gameSteps as any)[mapKey];

	if (!mapSteps) {
		throw new Error(`Unknown map: ${mapId} for game: ${gameId}`);
	}

	const stepRoute = mapSteps.steps[stepId];
	if (!stepRoute) {
		throw new Error(`Unknown step: ${stepId} for map: ${mapId}`);
	}

	return stepRoute;
};

/**
 * Get the base route for a map (without step)
 */
export const getMapBaseRoute = (gameId: GameId, mapId: string): string => {
	const gameSteps = MAP_STEPS[gameId as keyof typeof MAP_STEPS];
	if (!gameSteps) {
		throw new Error(`Unknown game: ${gameId}`);
	}

	const mapKey = mapIdToCamelCase(mapId);
	const mapSteps = (gameSteps as any)[mapKey];

	if (!mapSteps) {
		throw new Error(`Unknown map: ${mapId} for game: ${gameId}`);
	}

	return mapSteps.base;
};

/**
 * Get route metadata (title, documentTitle) for a given path
 */
export const getRouteMetadata = (path: string) => {
	// Try exact match first
	if (ROUTE_METADATA[path as keyof typeof ROUTE_METADATA]) {
		return ROUTE_METADATA[path as keyof typeof ROUTE_METADATA];
	}

	// Try partial matches for paths with additional segments
	for (const [routePath, metadata] of Object.entries(ROUTE_METADATA)) {
		if (path.startsWith(routePath) && routePath !== "/") {
			return metadata;
		}
	}

	// Default fallback
	return {
		title: "COD Zombies Tools",
		documentTitle: "COD Zombies Tools - Easter Egg Tools",
	};
};

/**
 * Check if the current path matches a specific route
 */
export const isRouteActive = (
	currentPath: string,
	targetRoute: string
): boolean => {
	return currentPath.startsWith(targetRoute);
};

/**
 * Extract game ID from a route path
 */
export const getGameIdFromPath = (path: string): GameId | null => {
	if (path.startsWith("/bo1")) return "bo1";
	if (path.startsWith("/bo3")) return "bo3";
	if (path.startsWith("/bo4")) return "bo4";
	if (path.startsWith("/bo5")) return "bo5";
	if (path.startsWith("/bo6")) return "bo6";
	if (path.startsWith("/bo7")) return "bo7";
	return null;
};

/**
 * Extract map ID from a route path
 */
export const getMapIdFromPath = (path: string): string | null => {
	const segments = path.split("/").filter(Boolean);
	if (segments.length >= 2) {
		return segments[1]; // Second segment should be the map ID
	}
	return null;
};

/**
 * Extract step ID from a route path
 */
export const getStepIdFromPath = (path: string): string | null => {
	const segments = path.split("/").filter(Boolean);
	if (segments.length >= 3) {
		return segments[2]; // Third segment should be the step ID
	}
	return null;
};

/**
 * Convert kebab-case map ID to camelCase for route lookup
 */
function mapIdToCamelCase(mapId: string): string {
	return mapId.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Get all available routes for a specific game
 */
export const getGameRoutes = (gameId: GameId) => {
	return ROUTES.games[gameId];
};

/**
 * Validate if a route exists in our configuration
 */
export const isValidRoute = (path: string): boolean => {
	// Check if path matches any of our defined routes
	const allRoutes = [
		ROUTES.home,
		...Object.values(ROUTES.games.bo1.maps),
		...Object.values(ROUTES.games.bo3.maps),
		...Object.values(ROUTES.games.bo4.maps),
		...Object.values(ROUTES.games.bo5.maps),
		...Object.values(ROUTES.games.bo6.maps),
		...Object.values(ROUTES.games.bo7.maps),
		ROUTES.games.bo1.base,
		ROUTES.games.bo3.base,
		ROUTES.games.bo4.base,
		ROUTES.games.bo5.base,
		ROUTES.games.bo6.base,
		ROUTES.games.bo7.base,
	];

	return allRoutes.some((route: string) => path.startsWith(route));
};

/**
 * Get the navigation breadcrumb for a given path
 */
export const getBreadcrumb = (
	path: string
): Array<{ name: string; path: string }> => {
	const gameId = getGameIdFromPath(path);
	const mapId = getMapIdFromPath(path);
	const stepId = getStepIdFromPath(path);

	const breadcrumb: Array<{ name: string; path: string }> = [
		{ name: "Home", path: ROUTES.home },
	];

	if (gameId) {
		const gameNames: Record<GameId, string> = {
			bo1: "Black Ops 1",
			bo3: "Black Ops 3",
			bo4: "Black Ops 4",
			bo5: "Cold War",
			bo6: "Black Ops 6",
			bo7: "Black Ops 7",
		};
		const gameName = gameNames[gameId];
		breadcrumb.push({
			name: gameName,
			path: getGameRoute(gameId),
		});

		if (mapId) {
			const mapName = mapId
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");

			breadcrumb.push({
				name: mapName,
				path: getMapRoute(gameId, mapId),
			});

			if (stepId) {
				const stepName = stepId.charAt(0).toUpperCase() + stepId.slice(1);
				breadcrumb.push({
					name: stepName,
					path: getStepRoute(gameId, mapId, stepId),
				});
			}
		}
	}

	return breadcrumb;
};

import type { SectionRegistry, SectionRegistryEntry } from "@/types/dashboard";

// Import Astra Malorum sections
import PapCodeSection from "@/components/games/bo7/maps/astra-malorum/sections/PapCodeSection";
import BooksSection from "@/components/games/bo7/maps/astra-malorum/sections/BooksSection";
import TeleporterSection from "@/components/games/bo7/maps/astra-malorum/sections/TeleporterSection";
import OrganSection from "@/components/games/bo7/maps/astra-malorum/sections/OrganSection";

/**
 * Central registry of all available sections across all games and maps.
 * This allows the dashboard system to dynamically load and render sections.
 *
 * Structure: gameId -> mapId -> sectionId -> SectionRegistryEntry
 */
export const SECTION_REGISTRY: SectionRegistry = {
	bo7: {
		"astra-malorum": {
			"oscar-code": {
				id: "oscar-code",
				name: "OSCAR Code",
				component: PapCodeSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "astra-malorum",
				mapName: "Astra Malorum",
			},
			books: {
				id: "books",
				name: "Books",
				component: BooksSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "astra-malorum",
				mapName: "Astra Malorum",
			},
			teleporter: {
				id: "teleporter",
				name: "Teleporter",
				component: TeleporterSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "astra-malorum",
				mapName: "Astra Malorum",
			},
			organ: {
				id: "organ",
				name: "Organ / Mars",
				component: OrganSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "astra-malorum",
				mapName: "Astra Malorum",
			},
		},
		// TODO: Add other BO7 maps as they're created
	},
	// TODO: Add other games (bo6, bo5, bo4, bo3, bo1)
};

/**
 * Get a section entry by its full path
 */
export function getSectionByPath(
	gameId: string,
	mapId: string,
	sectionId: string
): SectionRegistryEntry | undefined {
	return SECTION_REGISTRY[gameId]?.[mapId]?.[sectionId];
}

/**
 * Get all sections across all games and maps as a flat array
 */
export function getAllSections(): SectionRegistryEntry[] {
	const sections: SectionRegistryEntry[] = [];

	for (const gameId in SECTION_REGISTRY) {
		for (const mapId in SECTION_REGISTRY[gameId]) {
			for (const sectionId in SECTION_REGISTRY[gameId][mapId]) {
				sections.push(SECTION_REGISTRY[gameId][mapId][sectionId]);
			}
		}
	}

	return sections;
}

/**
 * Get all sections for a specific game
 */
export function getSectionsByGame(gameId: string): SectionRegistryEntry[] {
	const sections: SectionRegistryEntry[] = [];

	if (SECTION_REGISTRY[gameId]) {
		for (const mapId in SECTION_REGISTRY[gameId]) {
			for (const sectionId in SECTION_REGISTRY[gameId][mapId]) {
				sections.push(SECTION_REGISTRY[gameId][mapId][sectionId]);
			}
		}
	}

	return sections;
}

/**
 * Get all sections for a specific map
 */
export function getSectionsByMap(
	gameId: string,
	mapId: string
): SectionRegistryEntry[] {
	const sections: SectionRegistryEntry[] = [];

	if (SECTION_REGISTRY[gameId]?.[mapId]) {
		for (const sectionId in SECTION_REGISTRY[gameId][mapId]) {
			sections.push(SECTION_REGISTRY[gameId][mapId][sectionId]);
		}
	}

	return sections;
}

/**
 * Get all unique games in the registry
 */
export function getAllGames(): Array<{ id: string; name: string }> {
	const games = new Set<string>();

	for (const gameId in SECTION_REGISTRY) {
		games.add(gameId);
	}

	// Get game name from first section in each game
	return Array.from(games).map((gameId) => {
		const firstSection = getSectionsByGame(gameId)[0];
		return {
			id: gameId,
			name: firstSection?.gameName || gameId,
		};
	});
}

/**
 * Get all unique maps for a specific game
 */
export function getMapsByGame(
	gameId: string
): Array<{ id: string; name: string }> {
	const maps = new Set<string>();

	if (SECTION_REGISTRY[gameId]) {
		for (const mapId in SECTION_REGISTRY[gameId]) {
			maps.add(mapId);
		}
	}

	// Get map name from first section in each map
	return Array.from(maps).map((mapId) => {
		const firstSection = getSectionsByMap(gameId, mapId)[0];
		return {
			id: mapId,
			name: firstSection?.mapName || mapId,
		};
	});
}

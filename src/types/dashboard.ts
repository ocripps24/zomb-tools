import { ComponentType } from "react";

/**
 * Represents a section within a dashboard
 */
export interface DashboardSection {
	gameId: string; // e.g., "bo7"
	mapId: string; // e.g., "astra-malorum"
	sectionId: string; // e.g., "books"
	sectionName: string; // e.g., "Books"
	mapName: string; // e.g., "Astra Malorum"
	gameName: string; // e.g., "Black Ops 7"
	order: number; // User-defined order (0-indexed)
}

/**
 * A dashboard configuration containing multiple sections
 */
export interface Dashboard {
	id: string; // Unique identifier (UUID)
	name: string; // User-defined name (e.g., "Super EE Run - Feb 2025")
	description?: string; // Optional description
	sections: DashboardSection[];
	createdAt: Date;
	updatedAt: Date;
	layout?: "stacked" | "grid"; // Future: different layouts (default: stacked)
}

/**
 * Entry in the section registry
 */
export interface SectionRegistryEntry {
	id: string; // Section ID (e.g., "books")
	name: string; // Display name (e.g., "Books")
	component: ComponentType<any>; // React component
	gameId: string; // Game ID (e.g., "bo7")
	gameName: string; // Game display name (e.g., "Black Ops 7")
	mapId: string; // Map ID (e.g., "astra-malorum")
	mapName: string; // Map display name (e.g., "Astra Malorum")
}

/**
 * Section registry structure: gameId -> mapId -> sectionId -> entry
 */
export type SectionRegistry = Record<
	string,
	Record<string, Record<string, SectionRegistryEntry>>
>;

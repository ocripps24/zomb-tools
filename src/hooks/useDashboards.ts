import { useState, useEffect, useCallback } from "react";
import type { Dashboard } from "@/types/dashboard";

const DASHBOARDS_KEY = "zomb-tools-dashboards";

/**
 * Generate a simple unique ID for dashboards
 */
function generateId(): string {
	return `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Custom hook for managing dashboards in localStorage
 */
export function useDashboards() {
	const [dashboards, setDashboards] = useState<Dashboard[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Load dashboards from localStorage on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem(DASHBOARDS_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				// Convert date strings back to Date objects
				const dashboardsWithDates = parsed.map((d: any) => ({
					...d,
					createdAt: new Date(d.createdAt),
					updatedAt: new Date(d.updatedAt),
				}));
				setDashboards(dashboardsWithDates);
			}
		} catch (error) {
			console.error("Failed to load dashboards from localStorage:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Save dashboards to localStorage
	const saveDashboards = useCallback((dashboards: Dashboard[]) => {
		try {
			localStorage.setItem(DASHBOARDS_KEY, JSON.stringify(dashboards));
			setDashboards(dashboards);
		} catch (error) {
			console.error("Failed to save dashboards to localStorage:", error);
			throw error;
		}
	}, []);

	/**
	 * Create a new dashboard
	 */
	const createDashboard = useCallback(
		(
			dashboard: Omit<Dashboard, "id" | "createdAt" | "updatedAt">
		): Dashboard => {
			const newDashboard: Dashboard = {
				...dashboard,
				id: generateId(),
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			saveDashboards([...dashboards, newDashboard]);
			return newDashboard;
		},
		[dashboards, saveDashboards]
	);

	/**
	 * Update an existing dashboard
	 */
	const updateDashboard = useCallback(
		(id: string, updates: Partial<Omit<Dashboard, "id" | "createdAt">>) => {
			const updated = dashboards.map((d) =>
				d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d
			);
			saveDashboards(updated);
		},
		[dashboards, saveDashboards]
	);

	/**
	 * Delete a dashboard
	 */
	const deleteDashboard = useCallback(
		(id: string) => {
			// Also delete dashboard-specific section data from localStorage
			const dashboard = dashboards.find((d) => d.id === id);
			if (dashboard) {
				// Remove all dashboard section data
				dashboard.sections.forEach((section) => {
					const storageKey = `dashboard-${id}-${section.mapId}-${section.sectionId}-data`;
					localStorage.removeItem(storageKey);
				});
			}

			saveDashboards(dashboards.filter((d) => d.id !== id));
		},
		[dashboards, saveDashboards]
	);

	/**
	 * Get a specific dashboard by ID
	 */
	const getDashboard = useCallback(
		(id: string): Dashboard | undefined => {
			return dashboards.find((d) => d.id === id);
		},
		[dashboards]
	);

	/**
	 * Duplicate an existing dashboard
	 */
	const duplicateDashboard = useCallback(
		(id: string): Dashboard | null => {
			const original = dashboards.find((d) => d.id === id);
			if (!original) return null;

			const duplicate: Dashboard = {
				...original,
				id: generateId(),
				name: `${original.name} (Copy)`,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			saveDashboards([...dashboards, duplicate]);
			return duplicate;
		},
		[dashboards, saveDashboards]
	);

	/**
	 * Export dashboard as JSON (for sharing/backup)
	 */
	const exportDashboard = useCallback(
		(id: string): string | null => {
			const dashboard = dashboards.find((d) => d.id === id);
			if (!dashboard) return null;

			// Create export object without internal IDs/dates
			const exportData = {
				name: dashboard.name,
				description: dashboard.description,
				sections: dashboard.sections,
				layout: dashboard.layout,
			};

			return JSON.stringify(exportData, null, 2);
		},
		[dashboards]
	);

	/**
	 * Import dashboard from JSON
	 */
	const importDashboard = useCallback(
		(jsonString: string): Dashboard | null => {
			try {
				const importData = JSON.parse(jsonString);

				// Validate required fields
				if (!importData.name || !Array.isArray(importData.sections)) {
					throw new Error("Invalid dashboard format");
				}

				return createDashboard({
					name: importData.name,
					description: importData.description,
					sections: importData.sections,
					layout: importData.layout,
				});
			} catch (error) {
				console.error("Failed to import dashboard:", error);
				return null;
			}
		},
		[createDashboard]
	);

	return {
		dashboards,
		isLoading,
		createDashboard,
		updateDashboard,
		deleteDashboard,
		getDashboard,
		duplicateDashboard,
		exportDashboard,
		importDashboard,
	};
}

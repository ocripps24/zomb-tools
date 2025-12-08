import { useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDashboards } from "@/hooks/useDashboards";
import { getSectionByPath } from "@/data/sectionRegistry";
import { ROUTES } from "@/routes/config";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";
import DashboardSettings from "./DashboardSettings";
import type { BaseSectionProps } from "@/components/core/BaseSection";

/**
 * Dashboard View Page
 * Displays all sections in a dashboard with isolated data storage
 */
export default function DashboardView() {
	const { id } = useParams<{ id: string }>();
	const { getDashboard } = useDashboards();
	const { settings, updateSetting } = useGlobalSettings();

	// Force compact mode for dashboard views (optimal for speedrunners)
	useEffect(() => {
		if (settings.uiSize !== "compact") {
			updateSetting("uiSize", "compact");
		}
	}, [settings.uiSize, updateSetting]);

	const dashboard = getDashboard(id!);

	// Sort sections by order
	const sortedSections = useMemo(() => {
		if (!dashboard) return [];
		return [...dashboard.sections].sort((a, b) => a.order - b.order);
	}, [dashboard]);

	if (!dashboard) {
		return (
			<div className="dashboard-view">
				<div className="dashboard-view__not-found">
					<h1>Dashboard Not Found</h1>
					<p>The dashboard you're looking for doesn't exist or has been deleted.</p>
					<Link to={ROUTES.dashboard.base} className="btn btn-primary">
						Back to Dashboards
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="dashboard-view">
			<header className="dashboard-view__header">
				<div className="dashboard-view__header-content">
					<div className="dashboard-view__title-group">
						<h1>{dashboard.name}</h1>
						{dashboard.description && <p>{dashboard.description}</p>}
					</div>

					<div className="dashboard-view__actions">
						<Link
							to={ROUTES.dashboard.base}
							className="btn btn-secondary btn-sm"
						>
							← All Dashboards
						</Link>
						<Link
							to={ROUTES.dashboard.edit(dashboard.id)}
							className="btn btn-secondary btn-sm"
						>
							Edit
						</Link>
					</div>
				</div>
			</header>

			{sortedSections.length === 0 ? (
				<div className="dashboard-view__empty">
					<h2>No Sections</h2>
					<p>This dashboard doesn't have any sections yet.</p>
					<Link
						to={ROUTES.dashboard.edit(dashboard.id)}
						className="btn btn-primary"
					>
						Add Sections
					</Link>
				</div>
			) : (
				<div className="dashboard-view__sections">
					{sortedSections.map((section, index) => {
						const registryEntry = getSectionByPath(
							section.gameId,
							section.mapId,
							section.sectionId
						);

						if (!registryEntry) {
							return (
								<div
									key={`${section.gameId}-${section.mapId}-${section.sectionId}`}
									className="dashboard-section dashboard-section--missing"
								>
									<div className="dashboard-section__context">
										<span className="section-order">{index + 1}</span>
										<span className="game-name">{section.gameName}</span>
										<span className="separator">›</span>
										<span className="map-name">{section.mapName}</span>
									</div>
									<div className="dashboard-section__missing-content">
										<h3>Section Not Available</h3>
										<p>
											The section "{section.sectionName}" is no longer available.
											It may have been removed or renamed.
										</p>
									</div>
								</div>
							);
						}

						const SectionComponent = registryEntry.component;

						// Create isolated storage key for this dashboard section
						const storageKey = `dashboard-${dashboard.id}-${section.mapId}-${section.sectionId}-data`;

						// Props for the section component
						const sectionProps: BaseSectionProps & { storageKey?: string } = {
							storageKey,
							// No navigation props since this is a dashboard view
							currentStep: index + 1,
							totalSteps: sortedSections.length,
						};

						return (
							<div
								key={`${section.gameId}-${section.mapId}-${section.sectionId}`}
								className="dashboard-section"
							>
								<div className="dashboard-section__context">
									<span className="section-order">{index + 1}</span>
									<span className="game-name">{section.gameName}</span>
									<span className="separator">›</span>
									<span className="map-name">{section.mapName}</span>
								</div>

								<div className="dashboard-section__content">
									<SectionComponent {...sectionProps} />
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Floating settings widget */}
			<DashboardSettings />
		</div>
	);
}

import { Link } from "react-router-dom";
import { useDashboards } from "@/hooks/useDashboards";
import { ROUTES } from "@/routes/config";

/**
 * Dashboard List Page
 * Shows all saved dashboards and allows creation of new ones
 */
export default function DashboardList() {
	const { dashboards, isLoading, deleteDashboard } = useDashboards();

	const handleDelete = (id: string, name: string) => {
		if (
			window.confirm(
				`Are you sure you want to delete "${name}"? This will also delete all associated section data.`
			)
		) {
			deleteDashboard(id);
		}
	};

	if (isLoading) {
		return (
			<div className="dashboard-list">
				<div className="loading">Loading dashboards...</div>
			</div>
		);
	}

	return (
		<div className="dashboard-list">
			<header className="dashboard-list__header">
				<h1>Dashboards</h1>
				<p>
					Create custom multi-section views for speedruns and Super Easter Egg
					runs
				</p>
				<Link to={ROUTES.dashboard.new} className="btn btn-primary">
					+ Create New Dashboard
				</Link>
			</header>

			{dashboards.length === 0 ? (
				<div className="dashboard-list__empty">
					<h2>No Dashboards Yet</h2>
					<p>
						Create your first dashboard to combine sections from multiple maps
						into a single view.
					</p>
					<Link to={ROUTES.dashboard.new} className="btn btn-primary">
						Get Started
					</Link>
				</div>
			) : (
				<div className="dashboard-list__grid">
					{dashboards.map((dashboard) => (
						<div key={dashboard.id} className="dashboard-card">
							<div className="dashboard-card__header">
								<h3>
									<Link to={ROUTES.dashboard.view(dashboard.id)}>
										{dashboard.name}
									</Link>
								</h3>
								{dashboard.description && (
									<p className="dashboard-card__description">
										{dashboard.description}
									</p>
								)}
							</div>

							<div className="dashboard-card__meta">
								<span className="section-count">
									{dashboard.sections.length}{" "}
									{dashboard.sections.length === 1 ? "section" : "sections"}
								</span>
								<span className="updated">
									Updated {new Date(dashboard.updatedAt).toLocaleDateString()}
								</span>
							</div>

							<div className="dashboard-card__sections">
								{dashboard.sections.slice(0, 3).map((section) => (
									<span key={`${section.mapId}-${section.sectionId}`} className="section-tag">
										{section.sectionName}
									</span>
								))}
								{dashboard.sections.length > 3 && (
									<span className="section-tag section-tag--more">
										+{dashboard.sections.length - 3} more
									</span>
								)}
							</div>

							<div className="dashboard-card__actions">
								<Link
									to={ROUTES.dashboard.view(dashboard.id)}
									className="btn btn-secondary btn-sm"
								>
									View
								</Link>
								<Link
									to={ROUTES.dashboard.edit(dashboard.id)}
									className="btn btn-secondary btn-sm"
								>
									Edit
								</Link>
								<button
									onClick={() => handleDelete(dashboard.id, dashboard.name)}
									className="btn btn-danger btn-sm"
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { useDashboards } from "@/hooks/useDashboards";
import { ROUTES } from "@/routes/config";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ShareDialog from "@/components/ui/ShareDialog";
import GlassHero from "@/components/ui/GlassHero";
import beamsImage from "@/assets/images/beams-bkg-v2.png";
import type { Dashboard } from "@/types/dashboard";

/**
 * Dashboard List Page
 * Shows all saved dashboards and allows creation of new ones
 */
export default function DashboardList() {
	const { dashboards, isLoading, deleteDashboard } = useDashboards();
	const [deleteConfirm, setDeleteConfirm] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [shareDashboard, setShareDashboard] = useState<Dashboard | null>(null);

	const handleDeleteClick = (id: string, name: string) => {
		setDeleteConfirm({ id, name });
	};

	const handleDeleteConfirm = () => {
		if (deleteConfirm) {
			deleteDashboard(deleteConfirm.id);
			setDeleteConfirm(null);
		}
	};

	const handleDeleteCancel = () => {
		setDeleteConfirm(null);
	};

	if (isLoading) {
		return (
			<div className="dashboard-list">
				<div className="loading">Loading layouts...</div>
			</div>
		);
	}

	return (
		<>
			{/* Full-viewport background image with fluted glass effect */}
			<GlassHero
				imageSrc={beamsImage}
				glassIntensity={50}
				glassSegments={60}
				glassMode="mouse"
				glassMotion={0.75}
				fixed={true}
			/>

			<div className="dashboard-list">
				<header className="dashboard-list__header">
					<h1>Layout Builder</h1>
					<p>
						Create custom multi-section views for speedruns and Super Easter Egg
						runs
					</p>
					<Link to={ROUTES.dashboard.new} className="btn btn-primary">
						+ Create New Layout
					</Link>
				</header>

				{dashboards.length === 0 ? (
					<div className="dashboard-list__empty">
						<h2>No Layouts Yet</h2>
						<p>
							Create your first layout to combine sections from multiple maps
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
										<span
											key={`${section.mapId}-${section.sectionId}`}
											className="section-tag"
										>
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
										Open
									</Link>
									<button
										type="button"
										onClick={() => setShareDashboard(dashboard)}
										className="btn btn-secondary btn-sm"
									>
										Share
									</button>
									<Link
										to={ROUTES.dashboard.edit(dashboard.id)}
										className="btn btn-secondary btn-sm"
									>
										Edit
									</Link>
									<button
										type="button"
										onClick={() =>
											handleDeleteClick(dashboard.id, dashboard.name)
										}
										className="btn btn-danger btn-sm"
									>
										Delete
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Delete Confirmation Dialog */}
				<ConfirmDialog
					isOpen={deleteConfirm !== null}
					title="Delete Layout"
					message={
						deleteConfirm
							? `Are you sure you want to delete "${deleteConfirm.name}"? This will also delete all associated section data. This action cannot be undone.`
							: ""
					}
					confirmText="Delete"
					cancelText="Cancel"
					variant="danger"
					onConfirm={handleDeleteConfirm}
					onCancel={handleDeleteCancel}
				/>

				{/* Share Dialog */}
				<ShareDialog
					isOpen={shareDashboard !== null}
					dashboard={shareDashboard}
					onClose={() => setShareDashboard(null)}
				/>
			</div>
		</>
	);
}

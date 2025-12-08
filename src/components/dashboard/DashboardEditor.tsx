import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDashboards } from "@/hooks/useDashboards";
import { ROUTES } from "@/routes/config";
import SectionSelector from "./SectionSelector";
import SelectedSectionsList from "./SelectedSectionsList";
import GlassHero from "@/components/ui/GlassHero";
import beamsImage from "@/assets/images/beams-bkg-v2.png";
import type { DashboardSection } from "@/types/dashboard";

/**
 * Dashboard Editor Page
 * Edit an existing dashboard's name, description, and sections
 */
export default function DashboardEditor() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { getDashboard, updateDashboard, dashboards, isLoading: dashboardsLoading } = useDashboards();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [selectedSections, setSelectedSections] = useState<DashboardSection[]>(
		[]
	);
	const [errors, setErrors] = useState<{ name?: string; sections?: string }>(
		{}
	);
	const [isLoading, setIsLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);

	// Load dashboard data
	useEffect(() => {
		// Wait for dashboards to finish loading from localStorage
		if (dashboardsLoading) {
			return;
		}

		if (!id) {
			setNotFound(true);
			setIsLoading(false);
			return;
		}

		const dashboard = getDashboard(id);
		if (!dashboard) {
			console.error(`Dashboard not found. ID: "${id}", Available dashboards:`, dashboards);
			setNotFound(true);
			setIsLoading(false);
			return;
		}

		setName(dashboard.name);
		setDescription(dashboard.description || "");
		setSelectedSections(dashboard.sections);
		setIsLoading(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, dashboardsLoading]);

	/**
	 * Add a section to the dashboard
	 */
	const handleAddSection = (section: {
		gameId: string;
		mapId: string;
		sectionId: string;
		sectionName: string;
		mapName: string;
		gameName: string;
	}) => {
		// Check if section already added
		const exists = selectedSections.some(
			(s) =>
				s.gameId === section.gameId &&
				s.mapId === section.mapId &&
				s.sectionId === section.sectionId
		);

		if (exists) {
			setErrors({ sections: "This section is already added" });
			setTimeout(() => setErrors({}), 3000);
			return;
		}

		const newSection: DashboardSection = {
			...section,
			order: selectedSections.length,
		};

		setSelectedSections([...selectedSections, newSection]);
		setErrors({});
	};

	/**
	 * Remove a section from the dashboard
	 */
	const handleRemoveSection = (index: number) => {
		const updated = selectedSections.filter((_, i) => i !== index);
		// Update order numbers
		const reordered = updated.map((section, i) => ({
			...section,
			order: i,
		}));
		setSelectedSections(reordered);
	};

	/**
	 * Reorder sections (from drag-and-drop)
	 */
	const handleReorder = (newOrder: DashboardSection[]) => {
		const reordered = newOrder.map((section, i) => ({
			...section,
			order: i,
		}));
		setSelectedSections(reordered);
	};

	/**
	 * Validate and save changes
	 */
	const handleSave = () => {
		if (!id) return;

		const newErrors: { name?: string; sections?: string } = {};

		if (!name.trim()) {
			newErrors.name = "Dashboard name is required";
		}

		if (selectedSections.length === 0) {
			newErrors.sections = "Please add at least one section";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		updateDashboard(id, {
			name: name.trim(),
			description: description.trim() || undefined,
			sections: selectedSections,
		});

		navigate(ROUTES.dashboard.view(id));
	};

	/**
	 * Cancel editing and return to view
	 */
	const handleCancel = () => {
		if (!id) {
			navigate(ROUTES.dashboard.base);
			return;
		}
		navigate(ROUTES.dashboard.view(id));
	};

	// Loading state
	if (isLoading) {
		return (
			<>
				<GlassHero
					imageSrc={beamsImage}
					glassIntensity={50}
					glassSegments={60}
					glassMode="mouse"
					glassMotion={0.75}
					fixed={true}
				/>
				<div className="dashboard-editor">
					<div className="dashboard-editor__loading">
						<p>Loading dashboard...</p>
					</div>
				</div>
			</>
		);
	}

	// Not found state
	if (notFound) {
		return (
			<>
				<GlassHero
					imageSrc={beamsImage}
					glassIntensity={50}
					glassSegments={60}
					glassMode="mouse"
					glassMotion={0.75}
					fixed={true}
				/>
				<div className="dashboard-editor">
					<div className="dashboard-editor__not-found">
						<h1>Dashboard Not Found</h1>
						<p>The dashboard you're trying to edit doesn't exist.</p>
						<button
							className="btn btn-primary"
							onClick={() => navigate(ROUTES.dashboard.base)}
						>
							Back to Dashboards
						</button>
					</div>
				</div>
			</>
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

			<div className="dashboard-editor">
				<header className="dashboard-editor__header">
					<h1>Edit Dashboard</h1>
					<p>Modify your dashboard's name, description, and sections</p>
				</header>

			<div className="dashboard-editor__form">
				<div className="dashboard-editor__details">
					<div className="form-group">
						<label htmlFor="dashboard-name">Dashboard Name *</label>
						<input
							id="dashboard-name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g., Astra Malorum Speed Run"
							className={errors.name ? "error" : ""}
						/>
						{errors.name && <span className="error-text">{errors.name}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="dashboard-description">
							Description (optional)
						</label>
						<textarea
							id="dashboard-description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Describe what this dashboard is for..."
							rows={3}
						/>
					</div>
				</div>

				<div className="dashboard-editor__content">
					<div className="dashboard-editor__selector">
						<h2>Available Sections</h2>
						<SectionSelector
							onSelectSection={handleAddSection}
							selectedSections={selectedSections}
						/>
					</div>

					<div className="dashboard-editor__selected">
						<div className="selected-header">
							<h2>Selected Sections</h2>
							<span className="section-count">
								{selectedSections.length}{" "}
								{selectedSections.length === 1 ? "section" : "sections"}
							</span>
						</div>
						{errors.sections && (
							<p className="error-text">{errors.sections}</p>
						)}
						<SelectedSectionsList
							sections={selectedSections}
							onRemove={handleRemoveSection}
							onReorder={handleReorder}
						/>
					</div>
				</div>

				<div className="dashboard-editor__actions">
					<button className="btn btn-secondary" onClick={handleCancel}>
						Cancel
					</button>
					<button className="btn btn-primary" onClick={handleSave}>
						Save Changes
					</button>
				</div>
			</div>
		</div>
		</>
	);
}

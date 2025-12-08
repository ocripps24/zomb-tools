import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboards } from "@/hooks/useDashboards";
import { ROUTES } from "@/routes/config";
import SectionSelector from "./SectionSelector";
import SelectedSectionsList from "./SelectedSectionsList";
import GlassHero from "@/components/ui/GlassHero";
import beamsImage from "@/assets/images/beams-bkg-v2.png";
import type { DashboardSection } from "@/types/dashboard";

/**
 * Dashboard Builder Page
 * Create a new dashboard by selecting and ordering sections
 */
export default function DashboardBuilder() {
	const navigate = useNavigate();
	const { createDashboard } = useDashboards();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [selectedSections, setSelectedSections] = useState<DashboardSection[]>(
		[]
	);
	const [errors, setErrors] = useState<{ name?: string; sections?: string }>(
		{}
	);

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
	 * Validate and save dashboard
	 */
	const handleSave = () => {
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

		const dashboard = createDashboard({
			name: name.trim(),
			description: description.trim() || undefined,
			sections: selectedSections,
			layout: "stacked",
		});

		navigate(ROUTES.dashboard.view(dashboard.id));
	};

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

			<div className="dashboard-builder">
				<header className="dashboard-builder__header">
					<h1>Create Layout</h1>
					<p>
						Select sections from any map to create a custom multi-section view
					</p>
				</header>

				<div className="dashboard-builder__form">
					<div className="dashboard-builder__details">
						<div className="form-group">
							<label htmlFor="dashboard-name">Layout Name *</label>
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

					<div className="dashboard-builder__content">
						<div className="dashboard-builder__selector">
							<h2>Available Sections</h2>
							<SectionSelector
								onSelectSection={handleAddSection}
								selectedSections={selectedSections}
							/>
						</div>

						<div className="dashboard-builder__selected">
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

					<div className="dashboard-builder__actions">
						<button
							className="btn btn-secondary"
							onClick={() => navigate(ROUTES.dashboard.base)}
						>
							Cancel
						</button>
						<button className="btn btn-primary" onClick={handleSave}>
							Create Layout
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

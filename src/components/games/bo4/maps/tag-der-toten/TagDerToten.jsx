import { useState, useCallback, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import MapNavigation from "../../../../common/MapNavigation";
import TotemsSection from "./sections/TotemsSection";
import ApothicanOfferingsSection from "./sections/ApothicanOfferingsSection";
import SealOfDualitySection from "./sections/SealOfDualitySection";
import OrbLocationsSection from "./sections/OrbLocationsSection";

const STEPS = [
	{
		id: "totems",
		name: "Totems",
		path: "/bo4/tag-der-toten/totems",
		component: TotemsSection,
	},
	{
		id: "apothican-offerings",
		name: "Apothican Offerings",
		path: "/bo4/tag-der-toten/apothican-offerings",
		component: ApothicanOfferingsSection,
	},
	{
		id: "seal-of-duality",
		name: "Seal of Duality",
		path: "/bo4/tag-der-toten/seal-of-duality",
		component: SealOfDualitySection,
	},
	{
		id: "orb-locations",
		name: "Orb Locations",
		path: "/bo4/tag-der-toten/orb-locations",
		component: OrbLocationsSection,
	},
];

function TagDerToten() {
	// State management for each section
	const [totemsData, setTotemsData] = useState({});
	const [apothicanData, setApothicanData] = useState({});
	const [sealData, setSealData] = useState({});
	const [orbData, setOrbData] = useState({});

	const navigate = useNavigate();
	const location = useLocation();

	// Default to totems step if no specific step
	const currentPath = location.pathname;
	const currentStepIndex = STEPS.findIndex((step) => step.path === currentPath);

	// Handle active step logic - consider settings page context
	const getActiveStepIndex = () => {
		// If we're on settings page, try to determine which step to highlight
		if (currentPath === "/bo4/tag-der-toten/settings") {
			// Check if we have navigation state indicating where we came from
			if (location.state?.returnTo) {
				const returnStepIndex = STEPS.findIndex(
					(step) => step.path === location.state.returnTo
				);
				if (returnStepIndex >= 0) {
					return returnStepIndex;
				}
			}
			// Fallback: try to determine from the last non-settings page in session storage
			const lastStep = sessionStorage.getItem("bo4-tag-der-toten-last-step");
			if (lastStep) {
				const lastStepIndex = STEPS.findIndex((step) => step.path === lastStep);
				if (lastStepIndex >= 0) {
					return lastStepIndex;
				}
			}
			// Final fallback if on settings - return 0 (totems)
			return 0;
		} else {
			// Store the current step if it's not settings and we found a valid step
			if (currentStepIndex >= 0) {
				sessionStorage.setItem("bo4-tag-der-toten-last-step", currentPath);
				return currentStepIndex;
			}
			// If we're at the base tag der toten path, default to totems
			if (currentPath === "/bo4/tag-der-toten") {
				return 0;
			}
		}

		// Default logic: if step found, use it; otherwise default to totems (index 0)
		return 0;
	};

	const activeStepIndex = getActiveStepIndex();
	const currentStep = STEPS[activeStepIndex];

	// Load data from localStorage on component mount
	useEffect(() => {
		const savedTotemsData = localStorage.getItem("tag-der-toten-totems-data");
		const savedApothicanData = localStorage.getItem("tag-der-toten-apothican-data");
		const savedSealData = localStorage.getItem("tag-der-toten-seal-data");
		const savedOrbData = localStorage.getItem("tag-der-toten-orb-data");

		if (savedTotemsData) {
			setTotemsData(JSON.parse(savedTotemsData));
		}
		if (savedApothicanData) {
			setApothicanData(JSON.parse(savedApothicanData));
		}
		if (savedSealData) {
			setSealData(JSON.parse(savedSealData));
		}
		if (savedOrbData) {
			setOrbData(JSON.parse(savedOrbData));
		}
	}, []);

	// Navigation functions
	const goToStep = (stepPath) => {
		// If we're currently on settings page, we need to navigate away from settings first
		if (currentPath.endsWith("/settings")) {
			// Navigate to the step and close settings
			navigate(stepPath);
		} else {
			navigate(stepPath);
		}
	};

	const goToNext = () => {
		if (activeStepIndex < STEPS.length - 1) {
			navigate(STEPS[activeStepIndex + 1].path);
		}
	};

	const goToPrevious = () => {
		if (activeStepIndex > 0) {
			navigate(STEPS[activeStepIndex - 1].path);
		}
	};

	// Reset function
	const handleReset = () => {
		setTotemsData({});
		setApothicanData({});
		setSealData({});
		setOrbData({});
		// Clear localStorage
		localStorage.removeItem("tag-der-toten-totems-data");
		localStorage.removeItem("tag-der-toten-apothican-data");
		localStorage.removeItem("tag-der-toten-seal-data");
		localStorage.removeItem("tag-der-toten-orb-data");
	};

	// Data management functions
	const getStepData = (stepId) => {
		switch (stepId) {
			case "totems":
				return totemsData;
			case "apothican-offerings":
				return apothicanData;
			case "seal-of-duality":
				return sealData;
			case "orb-locations":
				return orbData;
			default:
				return {};
		}
	};

	const handleTotemsChange = useCallback((data) => setTotemsData(data), []);

	const handleApothicanChange = useCallback((data) => setApothicanData(data), []);

	const handleSealChange = useCallback((data) => setSealData(data), []);

	const handleOrbChange = useCallback((data) => setOrbData(data), []);

	const getStepOnChange = (stepId) => {
		switch (stepId) {
			case "totems":
				return handleTotemsChange;
			case "apothican-offerings":
				return handleApothicanChange;
			case "seal-of-duality":
				return handleSealChange;
			case "orb-locations":
				return handleOrbChange;
			default:
				return () => {};
		}
	};

	return (
		<div className="map-page tag-der-toten">
			<div className="map-info">
				<h1 className="map-title">Tag der Toten</h1>
			</div>

			<div className="map-header">
				<MapNavigation
					backTo="/bo4"
					onReset={handleReset}
				/>

				<div className="step-navigation">
					<div className="step-tabs">
						{STEPS.map((step, index) => (
							<button
								key={step.id}
								onClick={() => goToStep(step.path)}
								className={`step-tab ${
									activeStepIndex === index ? "step-tab--active" : ""
								}`}
							>
								<span className="step-number">{index + 1}</span>
								<span className="step-name">{step.name}</span>
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="map-content">
				<Routes>
					{/* Default route - show TotemsSection when no sub-path */}
					<Route
						path="/"
						element={
							<TotemsSection
								data={getStepData("totems")}
								onChange={getStepOnChange("totems")}
								onNext={goToNext}
								onPrevious={goToPrevious}
								currentStep={activeStepIndex}
								totalSteps={STEPS.length}
							/>
						}
					/>

					{/* Individual step routes */}
					{STEPS.map((step) => (
						<Route
							key={step.id}
							path={step.id}
							element={
								<step.component
									data={getStepData(step.id)}
									onChange={getStepOnChange(step.id)}
									onNext={goToNext}
									onPrevious={goToPrevious}
									currentStep={activeStepIndex}
									totalSteps={STEPS.length}
								/>
							}
						/>
					))}
				</Routes>

				{/* Navigation buttons - Only show if not on settings page */}
				{!currentPath.endsWith("/settings") && (
					<div className="map-navigation">
						<div className="navigation-buttons">
							<button
								onClick={goToPrevious}
								disabled={activeStepIndex === 0}
								className="btn btn-secondary nav-btn"
							>
								<span className="btn-text">← Previous</span>
							</button>

							<div className="step-indicator">
								<span className="current-step">{activeStepIndex + 1}</span>
								<span className="step-separator">of</span>
								<span className="total-steps">{STEPS.length}</span>
							</div>

							<button
								onClick={goToNext}
								disabled={activeStepIndex === STEPS.length - 1}
								className="btn btn-primary nav-btn"
							>
								<span className="btn-text">Next →</span>
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default TagDerToten;

import { useState, useCallback, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import StepNavigation from "../../../../common/StepNavigation";
import MapNavigation from "../../../../common/MapNavigation";
import SettingsPage from "../../../../common/SettingsPage";
import FloatingCard from "../../../../common/FloatingCard";
import Button from "../../../../common/Button";
import TotemsSection from "./sections/TotemsSection";
import SealOfDualitySection from "./sections/SealOfDualitySection";
import OrbLocationsSection from "./sections/OrbLocationsSection";
import StepNavigationButtons from "../../../../common/StepNavigationButtons";

const STEPS = [
	{
		id: "totems",
		name: "Totems",
		path: "totems",
		component: TotemsSection,
	},
	{
		id: "seal-of-duality",
		name: "Seal of Duality",
		path: "seal-of-duality",
		component: SealOfDualitySection,
	},
	{
		id: "orb-locations",
		name: "Orb Locations",
		path: "orb-locations",
		component: OrbLocationsSection,
	},
];

function TagDerToten() {
	// State management for each section
	const [totemsData, setTotemsData] = useState({});
	const [sealData, setSealData] = useState({});
	const [orbData, setOrbData] = useState({});

	const navigate = useNavigate();
	const location = useLocation();

	// Get current step index
	const currentPath = location.pathname;
	const currentStepIndex = STEPS.findIndex(
		(step) =>
			currentPath.endsWith(step.path) || currentPath === "/bo4/tag-der-toten"
	);

	// Handle redirect to first step if needed
	useEffect(() => {
		if (currentStepIndex === -1 && location.pathname === "/bo4/tag-der-toten") {
			navigate(STEPS[0].path, { replace: true });
		}
	}, [currentStepIndex, location.pathname, navigate]);

	// Active step logic
	const getActiveStepIndex = () => {
		if (currentStepIndex >= 0) {
			return currentStepIndex;
		}
		// Default to first step if no match
		return 0;
	};

	const activeStepIndex = getActiveStepIndex();

	// Navigation functions
	const goToStep = (stepIndex) => {
		navigate(STEPS[stepIndex].path);
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
		setSealData({});
		setOrbData({});
		// Clear localStorage
		localStorage.removeItem("tag-der-toten-totems-data");
		localStorage.removeItem("tag-der-toten-seal-data");
		localStorage.removeItem("tag-der-toten-orb-data");
	};

	// Data management functions
	const getStepData = (stepId) => {
		switch (stepId) {
			case "totems":
				return totemsData;
			case "seal-of-duality":
				return sealData;
			case "orb-locations":
				return orbData;
			default:
				return {};
		}
	};

	const handleTotemsChange = useCallback((data) => setTotemsData(data), []);

	const handleSealChange = useCallback((data) => setSealData(data), []);

	const handleOrbChange = useCallback((data) => setOrbData(data), []);

	const getStepOnChange = (stepId) => {
		switch (stepId) {
			case "totems":
				return handleTotemsChange;
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
					settingsPath="/bo4/tag-der-toten/settings"
					onReset={handleReset}
				/>

				<div className="step-navigation">
					<StepNavigation
						steps={STEPS}
						currentStep={activeStepIndex}
						onStepChange={goToStep}
					/>
				</div>
			</div>

			<div className="map-content">
				<Routes>
					<Route path="/" element={<TotemsSection />} />
					<Route path="/totems" element={<TotemsSection />} />
					<Route path="/seal-of-duality" element={<SealOfDualitySection />} />
					<Route path="/orb-locations" element={<OrbLocationsSection />} />
					<Route
						path="/settings"
						element={<SettingsPage backTo="/bo4/tag-der-toten" />}
					/>
					<Route path="*" element={<TotemsSection />} />
				</Routes>
			</div>

			<div className="map-footer">
				<StepNavigationButtons
					currentStepIndex={activeStepIndex}
					totalSteps={STEPS.length}
					onPrevious={goToPrevious}
					onNext={goToNext}
					stepNames={STEPS.map((step) => step.name)}
				/>
			</div>
		</div>
	);
}

export default TagDerToten;

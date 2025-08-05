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

const STEPS = [
	{
		id: "totems",
		name: "Totems",
		path: "/bo4/tag-der-toten/totems",
		component: TotemsSection,
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
	const [sealData, setSealData] = useState({});
	const [orbData, setOrbData] = useState({});

	const navigate = useNavigate();
	const location = useLocation();

	// Get current step index
	const currentPath = location.pathname;
	const currentStepIndex = STEPS.findIndex((step) => step.path === currentPath);

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
		<>
			{/* Map Info - Standardized container for map metadata */}
			<div className="map-info">
				<h1 className="map-title">Tag der Toten</h1>
			</div>

			{/* Map Header - Standardized container for map navigation */}
			<div className="map-header">
				{/* Map Navigation - Reusable component */}
				<MapNavigation
					gameId="bo4"
					mapId="tag-der-toten"
					onReset={handleReset}
					settingsPath="/bo4/tag-der-toten/settings"
					currentPath={currentPath}
				/>

				{/* Step Navigation - Reusable component across all maps */}
				<StepNavigation
					steps={STEPS}
					activeStep={activeStepIndex}
					onStepChange={goToStep}
				/>
			</div>

			{/* Map Content - Standardized container for map-specific content */}
			<div className="map-content">
				<Routes>
					{/* Settings route */}
					<Route
						path="settings"
						element={
							<SettingsPage mapId="tag-der-toten" gameId="bo4">
								<p>Tag der Toten specific settings will be added here.</p>
							</SettingsPage>
						}
					/>

					{/* Step Content */}
					{STEPS.map((step) => {
						const StepComponent = step.component;
						return (
							<Route
								key={step.id}
								path={step.id}
								element={
									<FloatingCard>
										<StepComponent
											data={getStepData(step.id)}
											onChange={getStepOnChange(step.id)}
										/>

										{/* Navigation Buttons */}
										<div className="tag-der-toten__navigation">
											<Button
												variantType="secondary"
												onClick={goToPrevious}
												disabled={activeStepIndex === 0}
											>
												← Previous
											</Button>
											<Button
												variantType="primary"
												onClick={goToNext}
												disabled={activeStepIndex === STEPS.length - 1}
											>
												Next →
											</Button>
										</div>
									</FloatingCard>
								}
							/>
						);
					})}
					{/* Default route to first step */}
					<Route
						path="*"
						element={
							<FloatingCard>
								<TotemsSection
									data={getStepData("totems")}
									onChange={getStepOnChange("totems")}
								/>

								{/* Navigation Buttons */}
								<div className="tag-der-toten__navigation">
									<Button
										variantType="secondary"
										onClick={goToPrevious}
										disabled={activeStepIndex === 0}
									>
										← Previous
									</Button>
									<Button
										variantType="primary"
										onClick={goToNext}
										disabled={activeStepIndex === STEPS.length - 1}
									>
										Next →
									</Button>
								</div>
							</FloatingCard>
						}
					/>
				</Routes>
			</div>
		</>
	);
}

export default TagDerToten;

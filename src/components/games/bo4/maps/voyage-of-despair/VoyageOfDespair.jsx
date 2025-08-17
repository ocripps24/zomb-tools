import { useState, useCallback, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import MapNavigation from "../../../../common/MapNavigation";
import SettingsPage from "../../../../common/SettingsPage";
import StepNavigationButtons from "../../../../common/StepNavigationButtons";
import ClockSection from "./sections/ClockSection";
import OutletSection from "./sections/OutletSection";
import PlanetSection from "./sections/PlanetSection";

const STEPS = [
	{
		id: "clocks",
		name: "Clocks",
		path: "/bo4/voyage-of-despair/clocks",
		component: ClockSection,
	},
	{
		id: "outlets",
		name: "Outlets",
		path: "/bo4/voyage-of-despair/outlets",
		component: OutletSection,
	},
	{
		id: "planets",
		name: "Planets",
		path: "/bo4/voyage-of-despair/planets",
		component: PlanetSection,
	},
];

function VoyageOfDespair() {
	// State management for each section
	const [clockData, setClockData] = useState({});
	const [outletData, setOutletData] = useState({});
	const [planetData, setPlanetData] = useState([]);

	const navigate = useNavigate();
	const location = useLocation();

	// Default to clocks step if no specific step
	const currentPath = location.pathname;
	const currentStepIndex = STEPS.findIndex((step) => step.path === currentPath);

	useEffect(() => {
		// Redirect to first step if user visits base voyage URL
		if (currentPath === "/bo4/voyage-of-despair" || currentPath === "/bo4/voyage-of-despair/") {
			navigate(STEPS[0].path, { replace: true });
		}
	}, [currentPath, navigate]);

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
	const goToStep = (stepPath) => {
		navigate(stepPath);
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
		if (
			window.confirm(
				"Are you sure you want to reset all data? This cannot be undone."
			)
		) {
			setClockData({});
			setOutletData({});
			setPlanetData([]);
			// Clear localStorage
			localStorage.removeItem("voyage-clock-data");
			localStorage.removeItem("voyage-outlet-data");
			localStorage.removeItem("voyage-planet-data");
		}
	};

	const getStepData = (stepId) => {
		switch (stepId) {
			case "clocks":
				return clockData;
			case "outlets":
				return outletData;
			case "planets":
				return planetData;
			default:
				return {};
		}
	};

	const handleClockChange = useCallback((data) => setClockData(data), []);
	const handleOutletChange = useCallback((data) => setOutletData(data), []);
	const handlePlanetChange = useCallback((data) => setPlanetData(data), []);

	const getStepOnChange = (stepId) => {
		switch (stepId) {
			case "clocks":
				return handleClockChange;
			case "outlets":
				return handleOutletChange;
			case "planets":
				return handlePlanetChange;
			default:
				return () => {};
		}
	};

	return (
		<div className="map-page voyage-of-despair">
			<div className="map-info">
				<h1 className="map-title">Voyage of Despair</h1>
			</div>

			<div className="map-header">
				<MapNavigation
					backTo="/bo4"
					settingsPath="/bo4/voyage-of-despair/settings"
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
					{/* Settings route */}
					<Route
						path="settings"
						element={<SettingsPage backTo="/bo4/voyage-of-despair" />}
					/>

					{/* Default route - show ClockSection when no sub-path */}
					<Route
						path="/"
						element={
							<ClockSection
								data={getStepData("clocks")}
								onChange={getStepOnChange("clocks")}
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
								step.component ? (
									<step.component
										data={getStepData(step.id)}
										onChange={getStepOnChange(step.id)}
										onNext={goToNext}
										onPrevious={goToPrevious}
										currentStep={activeStepIndex}
										totalSteps={STEPS.length}
									/>
								) : (
									<div className="placeholder-content">
										<h2>{step.name} - Coming Soon</h2>
										<p>This section is still under development.</p>
									</div>
								)
							}
						/>
					))}
				</Routes>

				{/* Step Navigation Buttons */}
				<StepNavigationButtons
					currentStepIndex={activeStepIndex}
					totalSteps={STEPS.length}
					onPrevious={goToPrevious}
					onNext={goToNext}
					stepNames={STEPS.map(step => step.name)}
				/>
			</div>
		</div>
	);
}

export default VoyageOfDespair;

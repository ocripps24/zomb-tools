import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { MapNavigation } from "../../../../core/index.js";
import { StepNavigationButtons } from "../../../../core/index.js";
import SafeCodeSection from "./sections/SafeCodeSection";
import ChalkboardCodeSection from "./sections/ChalkboardCodeSection";

const STEPS = [
	{
		id: "chalkboard-code", 
		name: "Chalkboard Code",
		path: "/bo6/shattered-veil/chalkboard-code",
		component: ChalkboardCodeSection,
	},
	{
		id: "safe-code",
		name: "Safe Code",
		path: "/bo6/shattered-veil/safe-code",
		component: SafeCodeSection,
	},
];

function ShatteredVeil() {
	// State management for each section
	const [safeData, setSafeData] = useState({});
	const [chalkboardData, setChalkboardData] = useState({});

	const navigate = useNavigate();
	const location = useLocation();

	// Navigation helpers
	const currentPath = location.pathname;
	const activeStepIndex = STEPS.findIndex((step) => step.path === currentPath);

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

	useEffect(() => {
		// Redirect to first step if user visits base shattered-veil URL
		if (currentPath === "/bo6/shattered-veil" || currentPath === "/bo6/shattered-veil/") {
			navigate(STEPS[0].path, { replace: true });
		}
	}, [currentPath, navigate]);

	const handleReset = () => {
		// Note: Confirmation already handled by MapNavigation component
		setSafeData({});
		setChalkboardData({});
		// Clear localStorage
		localStorage.removeItem("shattered-veil-safe-data");
		localStorage.removeItem("shattered-veil-chalkboard-data");
	};

	const getStepData = (stepId) => {
		switch (stepId) {
			case "chalkboard-code":
				return chalkboardData;
			case "safe-code":
				return safeData;
			default:
				return {};
		}
	};

	const handleStepDataChange = (stepId, data) => {
		switch (stepId) {
			case "chalkboard-code":
				setChalkboardData(data);
				break;
			case "safe-code":
				setSafeData(data);
				break;
		}
	};

	return (
		<div className="map-page shattered-veil">
			<div className="map-info">
				<h1 className="map-title">Shattered Veil</h1>
			</div>

			<div className="map-header">
				<MapNavigation
					backTo="/bo6"
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
					{/* Default route - show ChalkboardCodeSection when no sub-path */}
					<Route
						path="/"
						element={
							<ChalkboardCodeSection
								data={getStepData("chalkboard-code")}
								onChange={(data) =>
									handleStepDataChange("chalkboard-code", data)
								}
							/>
						}
					/>

					{/* Step routes */}
					{STEPS.map((step) => (
						<Route
							key={step.id}
							path={step.id}
							element={
								<step.component
									data={getStepData(step.id)}
									onChange={(data) => handleStepDataChange(step.id, data)}
								/>
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
					stepNames={STEPS.map((step) => step.name)}
				/>
			</div>
		</div>
	);
}

export default ShatteredVeil;
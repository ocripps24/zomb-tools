import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import MapNavigation from "../../../../common/MapNavigation";
import StepNavigationButtons from "../../../../common/StepNavigationButtons";
import VaultCodeSection from "./sections/VaultCodeSection";

const STEPS = [
	{
		id: "vault-code",
		name: "Vault Code",
		path: "/bo6/liberty-falls/vault-code",
		component: VaultCodeSection,
	},
];

function LibertyFalls() {
	// State management for each section
	const [vaultData, setVaultData] = useState({});

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
		// Redirect to first step if user visits base liberty-falls URL
		if (currentPath === "/bo6/liberty-falls" || currentPath === "/bo6/liberty-falls/") {
			navigate(STEPS[0].path, { replace: true });
		}
	}, [currentPath, navigate]);

	const handleReset = () => {
		// Note: Confirmation already handled by MapNavigation component
		setVaultData({});
		// Clear localStorage
		localStorage.removeItem("liberty-falls-vault-data");
	};

	const getStepData = (stepId) => {
		switch (stepId) {
			case "vault-code":
				return vaultData;
			default:
				return {};
		}
	};

	const handleStepDataChange = (stepId, data) => {
		switch (stepId) {
			case "vault-code":
				setVaultData(data);
				break;
		}
	};

	return (
		<div className="map-page liberty-falls">
			<div className="map-info">
				<h1 className="map-title">Liberty Falls</h1>
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
					{/* Default route - show VaultCodeSection when no sub-path */}
					<Route
						path="/"
						element={
							<VaultCodeSection
								data={getStepData("vault-code")}
								onChange={(data) =>
									handleStepDataChange("vault-code", data)
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

export default LibertyFalls;
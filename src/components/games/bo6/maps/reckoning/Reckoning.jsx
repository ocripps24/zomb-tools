import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import MapNavigation from "../../../../common/MapNavigation";
import StepNavigationButtons from "../../../../common/StepNavigationButtons";
import DocumentsCodeSection from "./sections/DocumentsCodeSection";
import DoorCodeSection from "./sections/DoorCodeSection";

const STEPS = [
	{
		id: "documents-code",
		name: "Documents Code",
		path: "/bo6/reckoning/documents-code",
		component: DocumentsCodeSection,
	},
	{
		id: "door-code",
		name: "Door Code",
		path: "/bo6/reckoning/door-code",
		component: DoorCodeSection,
	},
];

function Reckoning() {
	// State management for each section
	const [documentsData, setDocumentsData] = useState({});
	const [doorData, setDoorData] = useState({});

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
		// Redirect to first step if user visits base reckoning URL
		if (currentPath === "/bo6/reckoning" || currentPath === "/bo6/reckoning/") {
			navigate(STEPS[0].path, { replace: true });
		}
	}, [currentPath, navigate]);


	const handleReset = () => {
		// Note: Confirmation already handled by MapNavigation component
		setDocumentsData({});
		setDoorData({});
		// Clear localStorage
		localStorage.removeItem("reckoning-documents-data");
		localStorage.removeItem("reckoning-door-data");
	};

	const getStepData = (stepId) => {
		switch (stepId) {
			case "documents-code":
				return documentsData;
			case "door-code":
				return doorData;
			default:
				return {};
		}
	};

	const handleStepDataChange = (stepId, data) => {
		switch (stepId) {
			case "documents-code":
				setDocumentsData(data);
				break;
			case "door-code":
				setDoorData(data);
				break;
		}
	};

	return (
		<div className="map-page reckoning">
			<div className="map-info">
				<h1 className="map-title">Reckoning</h1>
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
					{/* Default route - show DocumentsCodeSection when no sub-path */}
					<Route
						path="/"
						element={
							<DocumentsCodeSection
								data={getStepData("documents-code")}
								onChange={(data) =>
									handleStepDataChange("documents-code", data)
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

export default Reckoning;
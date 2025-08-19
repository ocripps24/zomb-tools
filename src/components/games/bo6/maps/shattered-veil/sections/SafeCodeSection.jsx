import { useState, useEffect, useRef } from "react";
import SectionHeader from "../../../../../common/SectionHeader";

// Define the three locations and their value ranges
const CODE_LOCATIONS = [
	{
		id: "left",
		name: "Left Wall",
		description: "Number on the left wall surrounding the lift",
		min: 0,
		max: 59,
	},
	{
		id: "back",
		name: "Back Wall", 
		description: "Number on the back wall surrounding the lift",
		min: 0,
		max: 59,
	},
	{
		id: "right",
		name: "Right Wall",
		description: "Number on the right wall surrounding the lift",
		min: 0,
		max: 59,
	},
];

// Initialize with empty values
const getInitialData = () => {
	const initialData = {};
	CODE_LOCATIONS.forEach((location) => {
		initialData[location.id] = "";
	});
	return initialData;
};

function SafeCodeSection({
	data,
	onChange,
	onNext,
	onPrevious,
	currentStep,
	totalSteps,
}) {
	const [localData, setLocalData] = useState(data || getInitialData());
	const isInitializing = useRef(true);

	// Load from localStorage on mount or when parent data changes (reset)
	useEffect(() => {
		// Check if parent data is empty (indicating a reset)
		const isParentDataEmpty = !data || Object.keys(data).length === 0;

		if (isParentDataEmpty) {
			// Parent has been reset, check localStorage or use initial data
			const saved = localStorage.getItem("shattered-veil-safe-data");
			if (saved) {
				try {
					const parsedData = JSON.parse(saved);
					setLocalData(parsedData);
				} catch (e) {
					console.error("Failed to parse safe code data:", e);
					const initial = getInitialData();
					setLocalData(initial);
				}
			} else {
				const initial = getInitialData();
				setLocalData(initial);
			}
		}
		isInitializing.current = true;
	}, [data]);

	// Save to localStorage and update parent when data changes
	useEffect(() => {
		localStorage.setItem(
			"shattered-veil-safe-data",
			JSON.stringify(localData)
		);

		// Only call onChange after initial load is complete
		if (!isInitializing.current) {
			onChange(localData);
		} else {
			isInitializing.current = false;
		}
	}, [localData]); // Removed onChange from dependencies to prevent infinite loop

	// Handle input changes with validation
	const handleInputChange = (locationId, value) => {
		// Find the location to get min/max values
		const location = CODE_LOCATIONS.find((loc) => loc.id === locationId);
		if (!location) return;

		// Allow empty string or valid numbers within range
		if (
			value === "" ||
			(Number.isInteger(Number(value)) &&
				Number(value) >= location.min &&
				Number(value) <= location.max)
		) {
			setLocalData((prevData) => ({
				...prevData,
				[locationId]: value,
			}));
		}
	};

	// Get completion status
	const getCompletionStatus = () => {
		const completedCount = CODE_LOCATIONS.filter(
			(location) =>
				localData[location.id] !== "" && localData[location.id] !== undefined
		).length;
		return {
			completed: completedCount,
			total: CODE_LOCATIONS.length,
			isComplete: completedCount === CODE_LOCATIONS.length,
		};
	};

	// Reset function
	const resetAll = () => {
		const initialData = getInitialData();
		setLocalData(initialData);
	};

	// Get the final code in correct order with spaces between dials
	const getFinalCode = () => {
		const { isComplete } = getCompletionStatus();
		if (!isComplete) return null;

		return `${localData.left} - ${localData.back} - ${localData.right}`;
	};

	const status = getCompletionStatus();
	const finalCode = getFinalCode();

	return (
		<div className="safe-code-section">
			<SectionHeader
				title="Safe Code"
				progress={status}
				description="Collect three numbers from the walls around the lift to open the safe."
				onReset={resetAll}
				resetButtonText="Reset Safe Code"
			/>

			<div className="code-inputs">
				{CODE_LOCATIONS.map((location) => (
					<div key={location.id} className="code-input-group">
						<div className="input-label">
							<h3>{location.name}</h3>
						</div>

						<div className="input-container">
							<input
								type="number"
								min={location.min}
								max={location.max}
								value={localData[location.id] || ""}
								onChange={(e) => handleInputChange(location.id, e.target.value)}
								placeholder={`${location.min}-${location.max}`}
								className="code-input"
							/>
						</div>
					</div>
				))}
			</div>

			<div className="code-summary">
				<div className="completion-status">
					<h3>Progress</h3>
					<div className="progress-bar">
						<div
							className="progress-fill"
							style={{ width: `${(status.completed / status.total) * 100}%` }}
						></div>
					</div>
					<span className="progress-text">
						{status.completed} of {status.total} numbers collected
					</span>
				</div>

				{finalCode && (
					<div className="final-code">
						<h3>Safe Code</h3>
						<div className="code-display">
							<span className="code-number">{finalCode}</span>
						</div>
						<p className="code-note">
							Enter these numbers into the safe's three dials: Left - Back - Right
						</p>
					</div>
				)}
			</div>

			<div className="section-tips">
				<h3>Tips</h3>
				<ul>
					<li>
						<strong>Left Wall:</strong> Look for the number on the left wall surrounding the lift area
					</li>
					<li>
						<strong>Back Wall:</strong> Find the number on the back wall surrounding the lift area
					</li>
					<li>
						<strong>Right Wall:</strong> Check the right wall surrounding the lift area
					</li>
					<li>
						<strong>Order:</strong> Each number goes on its corresponding dial: Left number on left dial, Back number on middle dial, Right number on right dial
					</li>
				</ul>
			</div>
		</div>
	);
}

export default SafeCodeSection;
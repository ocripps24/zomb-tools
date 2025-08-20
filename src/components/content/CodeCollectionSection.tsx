import { useState, useEffect, useRef } from "react";
import { SectionHeader } from "../core";

/**
 * Reusable component for collecting multiple numbers/codes from different locations
 * Used across maps like Liberty Falls Bank Vault, Shattered Veil Safe, Terminus Nathan Code, etc.
 */
function CodeCollectionSection({
	// Required props
	title,
	description,
	locations, // Array of {id, name, description, min, max, tertiaryText?}
	storageKey,
	data,
	onChange,

	// Optional props
	codeFormat = "spaced", // "spaced" (XX - XX - XX) or "concatenated" (XXXXXX)
	className = "",
	resetButtonText,
	finalCodeNote,
	tipsConfig, // {show: boolean, items: Array<{label: string, text: string}>}

	// Standard section props (passed through but not always used)
	onNext,
	onPrevious,
	currentStep,
	totalSteps,
}) {
	// Initialize with empty values based on locations
	const getInitialData = () => {
		const initialData = {};
		locations.forEach((location) => {
			initialData[location.id] = "";
		});
		return initialData;
	};

	const [localData, setLocalData] = useState(data || getInitialData());
	const isInitializing = useRef(true);

	// Load from localStorage on mount or when parent data changes (reset)
	useEffect(() => {
		// Check if parent data is empty (indicating a reset)
		const isParentDataEmpty = !data || Object.keys(data).length === 0;

		if (isParentDataEmpty) {
			// Parent has been reset, check localStorage or use initial data
			const saved = localStorage.getItem(storageKey);
			if (saved) {
				try {
					const parsedData = JSON.parse(saved);
					setLocalData(parsedData);
				} catch (e) {
					console.error(`Failed to parse ${storageKey} data:`, e);
					const initial = getInitialData();
					setLocalData(initial);
				}
			} else {
				const initial = getInitialData();
				setLocalData(initial);
			}
		}
		isInitializing.current = true;
	}, [data, storageKey]);

	// Save to localStorage and update parent when data changes
	useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(localData));

		// Only call onChange after initial load is complete
		if (!isInitializing.current) {
			onChange(localData);
		} else {
			isInitializing.current = false;
		}
	}, [localData, storageKey]); // Removed onChange from dependencies to prevent infinite loop

	// Handle input changes with validation
	const handleInputChange = (locationId, value) => {
		// Find the location to get min/max values
		const location = locations.find((loc) => loc.id === locationId);
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
		const completedCount = locations.filter(
			(location) =>
				localData[location.id] !== "" && localData[location.id] !== undefined
		).length;
		return {
			completed: completedCount,
			total: locations.length,
			isComplete: completedCount === locations.length,
		};
	};

	// Reset function
	const resetAll = () => {
		const initialData = getInitialData();
		setLocalData(initialData);
	};

	// Get the final code in the specified format
	const getFinalCode = () => {
		const { isComplete } = getCompletionStatus();
		if (!isComplete) return null;

		const values = locations.map((location) => localData[location.id]);
		
		return codeFormat === "spaced" 
			? values.join(" - ")
			: values.join("");
	};

	const status = getCompletionStatus();
	const finalCode = getFinalCode();

	return (
		<div className={`code-collection-section ${className}`.trim()}>
			<SectionHeader
				title={title}
				progress={status}
				description={description}
				onReset={resetAll}
				resetButtonText={resetButtonText || `Reset ${title}`}
			/>

			<div className="code-inputs">
				{locations.map((location) => (
					<div key={location.id} className="code-input-group">
						<div className="input-label">
							<h3>{location.name}</h3>
							{location.description && (
								<p className="input-description">{location.description}</p>
							)}
							{location.tertiaryText && (
								<p className="input-tertiary">{location.tertiaryText}</p>
							)}
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
						<h3>{title}</h3>
						<div className="code-display">
							<span className="code-number">{finalCode}</span>
						</div>
						{finalCodeNote && (
							<p className="code-note">{finalCodeNote}</p>
						)}
					</div>
				)}
			</div>

			{tipsConfig?.show && tipsConfig?.items && (
				<div className="section-tips">
					<h3>Tips</h3>
					<ul>
						{tipsConfig.items.map((tip, index) => (
							<li key={index}>
								<strong>{tip.label}:</strong> {tip.text}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export default CodeCollectionSection;
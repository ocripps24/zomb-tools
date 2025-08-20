import { useState, useEffect, useRef } from "react";
import SectionHeader from "../../../../../common/SectionHeader";

// Import chalkboard images - using absolute paths from src
import chalkboard1 from "/src/assets/maps/bo6/shattered-veil/chalkboard-1.jpg";
import chalkboard2 from "/src/assets/maps/bo6/shattered-veil/chalkboard-2.jpg";
import chalkboard3 from "/src/assets/maps/bo6/shattered-veil/chalkboard-3.jpg";
import chalkboard4 from "/src/assets/maps/bo6/shattered-veil/chalkboard-4.jpg";

// Chalkboard solutions data
const CHALKBOARD_SOLUTIONS = {
	1: {
		identifier: "BCDEF",
		solutions: {
			YETI: "3576",
			MOTH: "1676",
			WORM: "7671",
			CRAB: "5775",
		},
	},
	2: {
		identifier: "AIOUY",
		solutions: {
			YETI: "5785",
			MOTH: "8587",
			WORM: "8588",
			CRAB: "7857",
		},
	},
	3: {
		identifier: "E",
		solutions: {
			YETI: "3192",
			MOTH: "7394",
			WORM: "9377",
			CRAB: "9729",
		},
	},
	4: {
		identifier: "OSTUHJLD",
		solutions: {
			YETI: "5482",
			MOTH: "1888",
			WORM: "5861",
			CRAB: "4664",
		},
	},
};

// Available codewords from the dot-matrix printer
const CODEWORDS = ["CRAB", "MOTH", "WORM", "YETI"];

// Map chalkboard IDs to their imported images
const CHALKBOARD_IMAGES = {
	1: chalkboard1,
	2: chalkboard2,
	3: chalkboard3,
	4: chalkboard4,
};

// Initialize with empty values
const getInitialData = () => {
	return {
		selectedChalkboard: null,
		selectedCodeword: "",
	};
};

function ChalkboardCodeSection({
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
			const saved = localStorage.getItem("shattered-veil-chalkboard-data");
			if (saved) {
				try {
					const parsedData = JSON.parse(saved);
					setLocalData(parsedData);
				} catch (e) {
					console.error("Failed to parse chalkboard code data:", e);
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
			"shattered-veil-chalkboard-data",
			JSON.stringify(localData)
		);

		// Only call onChange after initial load is complete
		if (!isInitializing.current) {
			onChange(localData);
		} else {
			isInitializing.current = false;
		}
	}, [localData]); // Removed onChange from dependencies to prevent infinite loop

	// Handle chalkboard selection
	const handleChalkboardSelect = (chalkboardId) => {
		setLocalData((prev) => ({
			...prev,
			selectedChalkboard: chalkboardId,
		}));
	};

	// Handle codeword selection
	const handleCodewordSelect = (codeword) => {
		setLocalData((prev) => ({
			...prev,
			selectedCodeword: codeword,
		}));
	};

	// Get completion status
	const getCompletionStatus = () => {
		const hasChalkboard = Boolean(localData.selectedChalkboard);
		const hasCodeword = Boolean(localData.selectedCodeword && localData.selectedCodeword.trim());
		const completed = [hasChalkboard, hasCodeword].filter(Boolean).length;

		return {
			completed,
			total: 2,
			isComplete: hasChalkboard && hasCodeword,
		};
	};

	// Reset function
	const resetAll = () => {
		const initialData = getInitialData();
		setLocalData(initialData);
	};

	// Get the final code
	const getFinalCode = () => {
		const { isComplete } = getCompletionStatus();
		if (!isComplete) return null;

		const chalkboard = CHALKBOARD_SOLUTIONS[localData.selectedChalkboard];
		if (!chalkboard) return null;

		return chalkboard.solutions[localData.selectedCodeword];
	};

	const status = getCompletionStatus();
	const finalCode = getFinalCode();
	const selectedChalkboard = CHALKBOARD_SOLUTIONS[localData.selectedChalkboard];

	return (
		<div className="chalkboard-code-section">
			<SectionHeader
				title="Chalkboard Code"
				progress={status}
				description="Select your chalkboard and enter the codeword from the dot-matrix printer to generate the code."
				onReset={resetAll}
				resetButtonText="Reset Chalkboard Code"
			/>

			{/* Chalkboard Selection */}
			<div className="chalkboard-selection">
				<h3>Select Your Chalkboard</h3>
				<p className="selection-description">
					Choose the chalkboard that matches your game. Look at the top-left
					group of letters to identify it.
				</p>

				<div className="chalkboard-grid">
					{Object.entries(CHALKBOARD_SOLUTIONS).map(([id, chalkboard]) => (
						<div
							key={id}
							className={`chalkboard-option ${
								localData.selectedChalkboard === parseInt(id)
									? "chalkboard-option--selected"
									: ""
							}`}
							onClick={() => handleChalkboardSelect(parseInt(id))}
						>
							<div className="chalkboard-image">
								<img
									src={CHALKBOARD_IMAGES[parseInt(id)]}
									alt={`Chalkboard ${id}`}
									loading="lazy"
								/>
							</div>
							<div className="chalkboard-info">
								<h4>{chalkboard.identifier}</h4>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Codeword Selection */}
			<div className="codeword-selection">
				<h3>Select Your Codeword</h3>
				<p className="selection-description">
					Enter the codeword obtained from the dot-matrix printer in the East
					Hallway after inserting the floppy disk.
				</p>

				<div className="codeword-buttons">
					{CODEWORDS.map((codeword) => (
						<button
							key={codeword}
							onClick={() => handleCodewordSelect(codeword)}
							className={`codeword-btn ${
								localData.selectedCodeword === codeword
									? "codeword-btn--selected"
									: ""
							}`}
						>
							{codeword}
						</button>
					))}
				</div>
			</div>

			{/* Code Summary */}
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
						{status.completed} of {status.total} selections made
					</span>
				</div>

				{finalCode && (
					<div className="final-code">
						<h3>Chalkboard Code</h3>
						<div className="code-display">
							<span className="code-number">{finalCode}</span>
						</div>
						<div className="code-breakdown">
							<p>
								<strong>Chalkboard: </strong>
								{selectedChalkboard?.identifier}
							</p>
							<p>
								<strong>Codeword:</strong> {localData.selectedCodeword}
							</p>
						</div>
						<p className="code-note">
							Use this 4-digit code to unlick the Doppleghast chamber.
						</p>
					</div>
				)}
			</div>

			<div className="section-tips">
				<h3>Tips</h3>
				<ul>
					<li>
						<strong>Chalkboard Identification:</strong> Look at the top-left
						group of letters on your chalkboard to identify which one you have
					</li>
					<li>
						<strong>Getting the Codeword:</strong> Insert the floppy disk into
						the computer in the East Hallway, then check the dot-matrix printer
						for your codeword
					</li>
					<li>
						<strong>Code Generation:</strong> Each chalkboard has 6 letter
						groups, and the code is determined by counting letters in groups
						that contain each letter of your codeword
					</li>
					<li>
						<strong>Order:</strong> The 4-digit code corresponds to each letter
						of your codeword in sequence (1st letter → 1st digit, etc.)
					</li>
				</ul>
			</div>
		</div>
	);
}

export default ChalkboardCodeSection;

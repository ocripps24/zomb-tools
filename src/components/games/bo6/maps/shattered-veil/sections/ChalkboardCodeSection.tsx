import React from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// Import chalkboard images - using absolute paths from src
import chalkboard1 from "@/assets/maps/bo6/shattered-veil/chalkboard-1.jpg";
import chalkboard2 from "@/assets/maps/bo6/shattered-veil/chalkboard-2.jpg";
import chalkboard3 from "@/assets/maps/bo6/shattered-veil/chalkboard-3.jpg";
import chalkboard4 from "@/assets/maps/bo6/shattered-veil/chalkboard-4.jpg";

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

// Data interface for this section
interface ChalkboardData {
	selectedChalkboard: number | null;
	selectedCodeword: string;
}

function ChalkboardCodeSection(props: BaseSectionProps<ChalkboardData>) {
	return (
		<BaseSection
			config={{
				storageKey: "shattered-veil-chalkboard-data",
				defaultValue: {
					selectedChalkboard: null,
					selectedCodeword: "",
				},
				title: "Chalkboard Code",
				description: "Select your chalkboard and enter the codeword from the dot-matrix printer to generate the code.",
				resetButtonText: "Reset Chalkboard Code"
			}}
			getProgress={(data: ChalkboardData) => {
				const hasChalkboard = Boolean(data.selectedChalkboard);
				const hasCodeword = Boolean(data.selectedCodeword && data.selectedCodeword.trim());
				const completed = [hasChalkboard, hasCodeword].filter(Boolean).length;

				return {
					completed,
					total: 2,
					isComplete: hasChalkboard && hasCodeword,
				};
			}}
			{...props}
		>
			{({ data, setData, progress }) => {
				// Handle chalkboard selection
				const handleChalkboardSelect = (chalkboardId: number) => {
					setData((prev: ChalkboardData) => ({
						...prev,
						selectedChalkboard: chalkboardId,
					}));
				};

				// Handle codeword selection
				const handleCodewordSelect = (codeword: string) => {
					setData((prev: ChalkboardData) => ({
						...prev,
						selectedCodeword: codeword,
					}));
				};

				// Get the final code
				const getFinalCode = () => {
					if (!progress.isComplete) return null;

					const chalkboard = CHALKBOARD_SOLUTIONS[data.selectedChalkboard as keyof typeof CHALKBOARD_SOLUTIONS];
					if (!chalkboard) return null;

					return chalkboard.solutions[data.selectedCodeword as keyof typeof chalkboard.solutions];
				};

				const finalCode = getFinalCode();
				const selectedChalkboard = CHALKBOARD_SOLUTIONS[data.selectedChalkboard as keyof typeof CHALKBOARD_SOLUTIONS];

				return (
					<div className="chalkboard-code-section">
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
											data.selectedChalkboard === parseInt(id)
												? "chalkboard-option--selected"
												: ""
										}`}
										onClick={() => handleChalkboardSelect(parseInt(id))}
									>
										<div className="chalkboard-image">
											<img
												src={CHALKBOARD_IMAGES[parseInt(id) as keyof typeof CHALKBOARD_IMAGES]}
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
											data.selectedCodeword === codeword
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
										style={{ width: `${(progress.completed / progress.total) * 100}%` }}
									></div>
								</div>
								<span className="progress-text">
									{progress.completed} of {progress.total} selections made
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
											<strong>Codeword:</strong> {data.selectedCodeword}
										</p>
									</div>
									<p className="code-note">
										Use this 4-digit code to unlock the Doppleghast chamber.
									</p>
								</div>
							)}
						</div>

					</div>
				);
			}}
		</BaseSection>
	);
}

export default ChalkboardCodeSection;
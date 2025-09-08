import { useState } from "react";
import { NumberPad } from "@/components/content";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// Data interface for this section
interface ClocksData {
	selectedSetId: number | null;
	finalTime: string;
}

// Clock sets data - each set contains 5 codes plus the blank house letter
const CLOCK_SETS = [
	{
		id: 1,
		codes: [
			{ letter: "D", time: "07:45" },
			{ letter: "C", time: "06:15" },
			{ letter: "F", time: "01:15" },
			{ letter: "A", time: "02:30" },
			{ letter: "E", time: "03:00" },
		],
		blankHouse: "B",
	},
	{
		id: 2,
		codes: [
			{ letter: "A", time: "11:00" },
			{ letter: "F", time: "05:30" },
			{ letter: "D", time: "03:45" },
			{ letter: "E", time: "09:45" },
			{ letter: "C", time: "04:00" },
		],
		blankHouse: "B",
	},
	{
		id: 3,
		codes: [
			{ letter: "E", time: "02:15" },
			{ letter: "A", time: "02:45" },
			{ letter: "C", time: "12:00" },
			{ letter: "B", time: "10:15" },
			{ letter: "D", time: "09:00" },
		],
		blankHouse: "F",
	},
	{
		id: 4,
		codes: [
			{ letter: "E", time: "10:45" },
			{ letter: "B", time: "06:00" },
			{ letter: "F", time: "11:45" },
			{ letter: "D", time: "08:30" },
			{ letter: "C", time: "12:15" },
		],
		blankHouse: "A",
	},
	{
		id: 5,
		codes: [
			{ letter: "C", time: "06:45" },
			{ letter: "D", time: "05:15" },
			{ letter: "A", time: "12:00" },
			{ letter: "F", time: "08:30" },
			{ letter: "B", time: "03:00" },
		],
		blankHouse: "E",
	},
	{
		id: 6,
		codes: [
			{ letter: "F", time: "09:30" },
			{ letter: "C", time: "10:15" },
			{ letter: "D", time: "08:15" },
			{ letter: "E", time: "11:30" },
			{ letter: "B", time: "04:45" },
		],
		blankHouse: "A",
	},
];

// Get set by ID
const getSetById = (id: number) => {
	return CLOCK_SETS.find((set) => set.id === id);
};

function ClocksSection(props: BaseSectionProps<ClocksData>) {
	const [inputMethod, setInputMethod] = useState<"keypad" | "text">("keypad");

	return (
		<BaseSection
			config={{
				storageKey: "alpha-omega-clocks-data",
				defaultValue: {
					selectedSetId: null,
					finalTime: "",
				},
				title: "Clocks",
				description:
					"Select your clock set based on the first code you find from TV static screens, then record the final house time.",
				resetButtonText: "Reset Clock Data",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Finding Static TVs",
							text: "Check 4 TV locations in Diner, Beds, and Lounge to find one displaying static",
						},
						{
							label: "Getting Codes",
							text: "Kill a zombie with Galvaknuckles next to the static TV to hear a quote containing a letter (A-F) and 4-digit time",
						},
						{
							label: "Set Selection",
							text: "Select the set that matches the first code you find - each button shows the first code from that set",
						},
						{
							label: "Final House",
							text: "The final house time will be shown when you interact with the clock in that house",
						},
					],
				},
				settingsConfig: {
					show: true,
					title: "Input Preferences",
					description: "Customize how you input the final house time.",
					settings: [
						{
							id: "time-input-method",
							label: "Time Entry",
							value: inputMethod,
							options: [
								{ value: "keypad", label: "Number Keypad" },
								{ value: "text", label: "Text Input" },
							],
							note: "Choose how to enter times (HH:MM format)",
							onChange: (value) => setInputMethod(value as "keypad" | "text"),
						},
					],
				},
			}}
			getProgress={(data: ClocksData) => {
				const hasSelectedSet = data.selectedSetId !== null;
				const hasFinalTime = data.finalTime && data.finalTime.length === 4;

				let completed = 0;
				if (hasSelectedSet) completed++;
				if (hasFinalTime) completed++;

				return {
					completed,
					total: 2,
					isComplete: completed === 2,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const selectedSet = data.selectedSetId
					? getSetById(data.selectedSetId)
					: null;

				const handleSetSelect = (setId: number) => {
					setData((prevData) => ({
						...prevData,
						selectedSetId: setId,
					}));
				};

				const handleFinalTimeChange = (time: string) => {
					setData((prevData) => ({
						...prevData,
						finalTime: time,
					}));
				};

				return (
					<div className="clocks-section-content">
						{/* Row 1: Set Selection Buttons */}
						<div className="set-selection-row">
							<h3>Select Your Clock Set</h3>
							<p>
								Choose the set that matches the first code you found from the TV
								static screen:
							</p>
							<div className="set-buttons">
								{CLOCK_SETS.map((set) => {
									const firstCode = set.codes[0];
									return (
										<button
											key={set.id}
											type="button"
											className={`set-button ${
												data.selectedSetId === set.id ? "selected" : ""
											}`}
											onClick={() => handleSetSelect(set.id)}
										>
											<span className="first-code">
												{firstCode.letter} - {firstCode.time}
											</span>
										</button>
									);
								})}
							</div>
						</div>

						{/* Row 2: Two Column Layout */}
						{selectedSet && (
							<div className="data-display-row">
								{/* Left Column: Selected Set Display */}
								<div className="selected-set-display">
									<h3>Set {selectedSet.id} - Complete Sequence</h3>
									<div className="codes-list">
										{selectedSet.codes.map((code, index) => (
											<div key={index} className="code-item">
												<span className="house-letter">
													House {code.letter}
												</span>
												<span className="time-value">{code.time}</span>
											</div>
										))}
										<div className={`code-item blank-house ${
											data.finalTime && data.finalTime.length === 4 ? 'complete' : ''
										}`}>
											<span className="house-letter">
												House {selectedSet.blankHouse}
											</span>
											<span className="time-value">
												{data.finalTime && data.finalTime.length === 4 
													? `${data.finalTime.slice(0, 2)}:${data.finalTime.slice(2, 4)}` 
													: "--:--"
												}
											</span>
										</div>
									</div>
								</div>

								{/* Right Column: Final Time Input */}
								<div className="final-time-section">
									<h3>Set {selectedSet.id} - Rushmore Code</h3>

									<NumberPad
										value={data.finalTime || ""}
										onChange={handleFinalTimeChange}
										title={`House ${selectedSet.blankHouse} Time`}
										placeholder="Time (HHMM)"
										maxLength={4}
										includeZero={true}
										inputMode={inputMethod}
										className="final-time-numberpad"
									/>
								</div>
							</div>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default ClocksSection;

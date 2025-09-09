import React, { useState } from "react";
import { FloatingCard } from "@/components/ui";
import { BaseSection } from "@/components/core";
import { NumberPad } from "@/components/ui";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// Code data - ordered by the sequence they should be displayed in results
const CODES_DATA = [
	{
		id: 1,
		map: "SHI NO NUMA",
		location: "DESERTED HALLWAY",
		order: 1,
		tip: "With a packed weapon shoot the paintings with George Washington as 1 in this order: 1 -> 3 -> 2 -> 4",
	},
	{
		id: 4,
		map: "DER REISE",
		location: "MAIN OFFICE",
		order: 2,
		tip: "Obtain the key opposite the Cola perk machine to unlock the desk drawer in Main Offices",
	},
	{
		id: 3,
		map: "SHANG-RI-LA",
		location: "SOUTH LABORATORIES",
		order: 3,
		tip: "Use a Frag/Acid Grenade or an explosive packed weapon to trigger an explosion in the large chrome tub in the spawn window",
	},
	{
		id: 2,
		map: "KINO DER TOTEN",
		location: "PANIC ROOM",
		order: 4,
		tip: "To enter the Panic Room, activate Defcon 5 in the following order: Catwalk Corner -> Server Room -> Top of Stairs -> Underneath Staircase. Interact with the static TV",
	},
];

// Tips configuration with introduction and conclusion
const TIPS = [
	{
		label: "Project Skibaldi Activation",
		text: "Activate Project Skibaldi by interacting with the office door in Main Offices 5 times",
	},
	...CODES_DATA.map((code) => ({
		label: `${code.map} (${code.location})`,
		text: code.tip,
	})),
	{
		label: "Final Step",
		text: "Place the teleporter pieces to travel to Groom Lake and survive for 3 rounds",
	},
];

// Data interface for this section
interface CodesSectionData {
	codes: {
		[key: string]: string; // code1, code2, code3, code4
	};
}

function CodesSection(props: BaseSectionProps<CodesSectionData>) {
	const [inputType, setInputType] = useState<"keypad" | "text">("keypad");
	const [uiMode, setUiMode] = useState<"standard" | "compact">("standard");

	return (
		<BaseSection
			config={{
				storageKey: "classified-codes-data",
				defaultValue: { codes: {} },
				title: "Classified Codes",
				description:
					"Collect 4 codes and their related maps to obtain the correct sequence for Project Skibaldi.",
				resetButtonText: "Reset Codes",
				tipsConfig: {
					show: true,
					items: TIPS,
				},
				settingsConfig: {
					show: true,
					title: "Input Preferences",
					description: "Customize how you input the 4-digit codes and adjust the UI layout.",
					settings: [
						{
							id: "inputType",
							label: "Input Type",
							value: inputType,
							options: [
								{ value: "keypad", label: "Keypad" },
								{ value: "text", label: "Text Input" },
							],
							note: "Choose your preferred input method for the 4-digit codes",
							onChange: (value) => setInputType(value as "keypad" | "text"),
						},
						{
							id: "uiMode",
							label: "UI Mode", 
							value: uiMode,
							options: [
								{ value: "standard", label: "Standard" },
								{ value: "compact", label: "Compact" },
							],
							note: "Adjust the layout density of the code input grid",
							onChange: (value) => setUiMode(value as "standard" | "compact"),
						},
					],
				},
			}}
			getProgress={(data: CodesSectionData) => {
				const enteredCodes = Object.values(data.codes || {}).filter(
					(code) => code && code.trim() !== ""
				).length;
				return {
					completed: enteredCodes,
					total: 4,
					isComplete: enteredCodes === 4,
				};
			}}
			{...props}
		>
			{({ data, setData, progress }) => {
				const handleCodeChange = (codeKey: string, value: string) => {
					setData((prev: CodesSectionData) => ({
						...prev,
						codes: {
							...prev.codes,
							[codeKey]: value,
						},
					}));
				};

				// Get codes in the correct order for results
				const getOrderedCodes = () => {
					return CODES_DATA.map((codeData) => ({
						...codeData,
						value: data.codes?.[`code${codeData.id}`] || "",
					}));
				};

				return (
					<div className="codes-section-content">
						{/* Input Section */}
						<div className="codes-input-section">
							<h3>Code Collection</h3>

							<div className={`codes-input-grid ${uiMode === 'compact' ? 'codes-input-grid--compact' : ''}`}>
								{CODES_DATA.map((codeData) => (
									<div key={codeData.id} className="code-input-item">
										<NumberPad
											value={data.codes?.[`code${codeData.id}`] || ""}
											onChange={(value) =>
												handleCodeChange(`code${codeData.id}`, value)
											}
											title={`${codeData.map} - ${codeData.location}`}
											maxLength={4}
											placeholder="____"
											inputMode={inputType}
										/>
									</div>
								))}
							</div>
						</div>

						{/* Results Section */}
						{progress.isComplete && (
							<div className="codes-results-section">
								<FloatingCard className="completion-card">
									<h4>🎉 All Codes Collected!</h4>
									<p>Here are your codes in the correct sequence order:</p>

									<div className="codes-sequence">
										{getOrderedCodes().map((code, index) => (
											<div key={code.id} className="sequence-item">
												<div className="sequence-number">{index + 1}</div>
												<div className="sequence-details">
													<div className="sequence-map">{code.map}</div>
													<div className="sequence-code">{code.value}</div>
												</div>
											</div>
										))}
									</div>

									<p className="sequence-note">
										Use these codes in this exact order to complete the
										Classified Easter Egg.
									</p>
								</FloatingCard>
							</div>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default CodesSection;

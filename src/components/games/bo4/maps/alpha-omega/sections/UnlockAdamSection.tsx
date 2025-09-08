import React, { useState } from "react";
import { NumberPad } from "@/components/ui";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// Data interface for this section
interface UnlockAdamData {
	code1: string; // Always 7626 (Operations)
	code2: string; // Sawyer (APD Interrogation)
	code3: string; // McCain (APD Control)
	code4: string; // Pernell (A House)
}

// Code information data
const CODE_INFO = [
	{
		id: "code1",
		name: "Code 1 - Operations",
		description: "Always the same code",
		value: "7626",
		readonly: true,
		location: "Found in Operations",
	},
	{
		id: "code2",
		name: "Code 2 - Sawyer",
		description: "3 possible spawns",
		value: "",
		readonly: false,
		location: "APD Interrogation",
	},
	{
		id: "code3",
		name: "Code 3 - McCain",
		description: "Under shootable papers",
		value: "",
		readonly: false,
		location: "APD Control",
	},
	{
		id: "code4",
		name: "Code 4 - Pernell",
		description: "Collect key from Solitary, unlock desk drawer",
		value: "",
		readonly: false,
		location: "A House (Yellow House) upstairs",
	},
];

function UnlockAdamSection(props: BaseSectionProps<UnlockAdamData>) {
	const [inputMethod, setInputMethod] = useState<"keypad" | "text">("keypad");

	return (
		<BaseSection
			config={{
				storageKey: "alpha-omega-unlock-adam-data",
				defaultValue: {
					code1: "7626",
					code2: "",
					code3: "",
					code4: "",
				},
				title: "Unlock A.D.A.M",
				description:
					"Enter 4 codes into Rushmore (computer terminal) to unlock A.D.A.M. Players must interact with Rushmore by entering 4-digit codes into its keypad.",
				resetButtonText: "Reset All Codes",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Code 1",
							text: "Always 7626 - Found in Operations"
						},
						{
							label: "Code 2 (Sawyer)",
							text: "Check all 3 possible spawns in APD Interrogation"
						},
						{
							label: "Code 3 (McCain)",
							text: "Shoot the stack of papers in APD Control to reveal the code underneath"
						},
						{
							label: "Code 4 (Pernell)",
							text: "Collect a key from Solitary, go upstairs in A House (Yellow House), unlock the desk drawer with the key"
						},
						{
							label: "Final Step",
							text: "Enter each code into Rushmore's keypad in order"
						}
					]
				},
				settingsConfig: {
					show: true,
					title: "Code Entry Preferences",
					description: "Customize how you input the 4-digit codes for Rushmore.",
					settings: [
						{
							id: "input-method",
							label: "Entry Format",
							value: inputMethod,
							options: [
								{ value: "keypad", label: "Keypad (touch buttons)" },
								{ value: "text", label: "Text Entry (keyboard input)" }
							],
							note: "Choose your preferred method for entering codes",
							onChange: (value) => setInputMethod(value as "keypad" | "text")
						}
					]
				}
			}}
			getProgress={(data: UnlockAdamData) => {
				// Code1 is always complete (readonly), only count user-entered codes for progress
				const userCodes = [data.code2, data.code3, data.code4];
				const completedUserCodes = userCodes.filter(
					(code) => code && code.length === 4
				).length;

				// For display purposes, add the readonly code to the total completed count
				const totalCompletedCodes = completedUserCodes + 1; // +1 for the readonly code1

				return {
					completed: totalCompletedCodes,
					total: 4,
					isComplete: totalCompletedCodes === 4,
				};
			}}
			{...props}
		>
			{({ data, setData, progress }) => {

				const handleCodeChange = (
					codeId: keyof UnlockAdamData,
					value: string
				) => {
					setData((prevData: UnlockAdamData) => ({
						...prevData,
						[codeId]: value,
					}));
				};

				return (
					<div className="unlock-adam-section-content">
						{/* Code Entry Section */}
						<div className="codes-input-section">
							<h3>Enter Codes</h3>
							<div className="codes-grid">
								{CODE_INFO.map((codeInfo) => {
									const currentValue =
										data[codeInfo.id as keyof UnlockAdamData] || "";

									// Skip showing the readonly code in the input section
									if (codeInfo.readonly) return null;

									return (
										<NumberPad
											key={codeInfo.id}
											value={currentValue}
											onChange={(value) =>
												handleCodeChange(
													codeInfo.id as keyof UnlockAdamData,
													value
												)
											}
											title={codeInfo.name}
											maxLength={4}
											includeZero={true}
											inputMode={inputMethod}
											className="code-numberpad"
										/>
									);
								})}
							</div>
						</div>

						{/* Results Section - Show when we have at least one code */}
						{progress.completed > 0 && (
							<div className="codes-results-section">
								<h3>Rushmore Code Sequence</h3>
								<div className="results-grid">
									{CODE_INFO.map((codeInfo) => {
										const currentValue =
											data[codeInfo.id as keyof UnlockAdamData] || "";
										const hasValue = currentValue.length === 4;

										return (
											<div
												key={codeInfo.id}
												className={`result-item ${
													hasValue ? "complete" : "incomplete"
												}`}
											>
												<div className="result-number">
													{hasValue ? currentValue : "----"}
												</div>
												<div className="result-label">{codeInfo.name}</div>
												{codeInfo.readonly && (
													<div className="result-note">Always the same</div>
												)}
											</div>
										);
									})}
								</div>
							</div>
						)}


					</div>
				);
			}}
		</BaseSection>
	);
}

export default UnlockAdamSection;

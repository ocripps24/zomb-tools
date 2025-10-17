import React, { useState, useEffect } from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { SymbolPicker } from "@/components/ui";
import { MovementSlider } from "@/components/ui";
import { MovementStepper } from "@/components/ui";
import { MovementButtons } from "@/components/ui";
import { SYMBOL_ICONS, SYMBOL_NAMES } from "./SymbolIcons";
import { createUiSizeSetting } from "@/utils/settingsHelpers";

const CLOCK_LOCATIONS = [
	{ id: "mailrooms", name: "Mailrooms" },
	{ id: "bridge", name: "Bridge" },
	{ id: "grand-stairs", name: "Grand Stairs" },
	{ id: "first-class", name: "1st Class" },
	{ id: "galley", name: "Galley" },
	{ id: "third-class", name: "3rd Class" },
];

const SYMBOLS = [
	"triangle-up",
	"triangle-down",
	"triangle-up-dash",
	"triangle-down-dash",
];

// Movement limits for each symbol type
const MOVEMENT_LIMITS = {
	"triangle-up": { min: -5, max: 5 },
	"triangle-down": { min: -5, max: 5 },
	"triangle-up-dash": { min: -3, max: 3 },
	"triangle-down-dash": { min: -3, max: 3 },
};

// Convert movement to time
const movementToTime = (movement: number, type?: string) => {
	if (type === "hour") {
		// Hour dial: 0 = 12, +1 = 1, +2 = 2, ..., -1 = 11, -2 = 10
		let hour = (12 + movement) % 12;
		if (hour === 0) hour = 12;
		return hour.toString().padStart(2, "0");
	} else {
		// Minute dial: 0 = 00, +1 = 05, +2 = 10, ..., -1 = 55, -2 = 50
		let minute = (movement * 5 + 60) % 60;
		return minute.toString().padStart(2, "0");
	}
};

// Convert time to movement
const timeToMovement = (timeValue: string, type: string) => {
	if (!timeValue || timeValue === "") return 0;

	const numValue = parseInt(timeValue);
	if (isNaN(numValue)) return 0;

	if (type === "hour") {
		let hour = numValue;
		if (hour === 12) hour = 0;
		// Movement from 12: 1 = +1, 2 = +2, ..., 11 = -1, 10 = -2
		return hour <= 6 ? hour : hour - 12;
	} else {
		let minute = numValue;
		// Movement from 00: 05 = +1, 10 = +2, ..., 55 = -1, 50 = -2
		return minute <= 30 ? minute / 5 : (minute - 60) / 5;
	}
};

// Initialize all locations with empty values
const getInitialData = () => {
	const initialData: ClocksData["clocks"] = {};
	CLOCK_LOCATIONS.forEach((location) => {
		initialData[location.id] = {
			hour: "",
			minute: "",
			symbol: "",
			hourMovement: 0,
			minuteMovement: 0,
			hourError: false,
			minuteError: false,
		};
	});
	return initialData;
};

// Data interface for this section
interface ClocksData {
	clocks: {
		[locationId: string]: {
			hour: string;
			minute: string;
			symbol: string;
			hourMovement: number;
			minuteMovement: number;
			hourError: boolean;
			minuteError: boolean;
		};
	};
}

function ClockSection(props: BaseSectionProps<ClocksData>) {
	// Load initial UI preferences from localStorage
	const getInitialSettings = () => {
		try {
			const saved = localStorage.getItem("voyage-clocks-settings");
			if (saved) {
				const settings = JSON.parse(saved);
				return {
					displayFormat: settings.displayFormat || "time",
					inputMethod: settings.inputMethod || "sliders",
				};
			}
		} catch (e) {
			console.error("Failed to parse clock settings:", e);
		}
		return { displayFormat: "time", inputMethod: "sliders" };
	};

	// UI preference states
	const initialSettings = getInitialSettings();
	const [displayFormat, setDisplayFormat] = useState(
		initialSettings.displayFormat
	);
	const [inputMethod, setInputMethod] = useState(initialSettings.inputMethod);
	const uiSizeSetting = createUiSizeSetting();

	// Save UI preferences to localStorage when they change
	useEffect(() => {
		const settings = { displayFormat, inputMethod };
		localStorage.setItem("voyage-clocks-settings", JSON.stringify(settings));
	}, [displayFormat, inputMethod]);

	return (
		<BaseSection
			config={{
				storageKey: "voyage-of-despair-clock-data",
				defaultValue: { clocks: getInitialData() },
				title: "Clock Locations & Times",
				description:
					"Record times and symbols for active clocks. Enter hour and minute separately. Each symbol can only be used once.",
				resetButtonText: "Reset Clocks",
				settingsConfig: {
					show: true,
					title: "Clock Input Preferences",
					description:
						"Customize how you input clock times and how they are displayed.",
					settings: [
						{
							id: "display-format",
							label: "Display Format",
							value: displayFormat,
							options: [
								{ value: "time", label: "Time Format (01:45)" },
								{ value: "movements", label: "Movement Format (+1/-3)" },
							],
							note: "How times are displayed throughout the interface",
							onChange: (value) => setDisplayFormat(value),
						},
						{
							id: "input-method",
							label: "Input Method",
							value: inputMethod,
							options: [
								{ value: "sliders", label: "Sliders (range controls)" },
								{ value: "steppers", label: "Steppers (+/- buttons)" },
								{ value: "buttons", label: "Button Grid" },
								{ value: "text", label: "Text Fields" },
							],
							note: "How you input time values for each clock location",
							onChange: (value) => setInputMethod(value),
						},
						uiSizeSetting,
					],
				},
			}}
			getProgress={(data: ClocksData) => {
				const completeClocks = Object.values(data.clocks || {}).filter(
					(clock) =>
						clock.hour !== "" && clock.minute !== "" && clock.symbol !== ""
				).length;
				return {
					completed: completeClocks,
					total: 4,
					isComplete: completeClocks === 4,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				// Validation functions
				const isMovementValid = (movement: number, symbol: string) => {
					if (!symbol) return true; // No symbol selected, no validation needed
					const limits =
						MOVEMENT_LIMITS[symbol as keyof typeof MOVEMENT_LIMITS];
					return movement >= limits.min && movement <= limits.max;
				};

				const isTimeValueValid = (
					timeValue: string,
					type: string,
					symbol: string
				) => {
					if (!timeValue || timeValue === "" || !symbol) return true;
					const movement = timeToMovement(timeValue, type);
					return isMovementValid(movement, symbol);
				};

				const validateClockData = (clockData: any) => {
					const symbol = clockData.symbol;
					const hourError =
						clockData.hour !== "" &&
						!isTimeValueValid(clockData.hour, "hour", symbol);
					const minuteError =
						clockData.minute !== "" &&
						!isTimeValueValid(clockData.minute, "minute", symbol);

					return { hourError, minuteError };
				};

				const handleHourChange = (locationId: string, hour: string) => {
					// Allow only numbers and limit to reasonable hour values
					if (hour === "" || (/^\d{1,2}$/.test(hour) && parseInt(hour) <= 12)) {
						const hourMovement = timeToMovement(hour, "hour");
						setData((prev: ClocksData) => {
							const currentData = prev.clocks[locationId] || {};
							const newData = { ...currentData, hour, hourMovement };
							const { hourError, minuteError } = validateClockData(newData);

							return {
								...prev,
								clocks: {
									...prev.clocks,
									[locationId]: {
										...newData,
										hourError,
										minuteError,
									},
								},
							};
						});
					}
				};

				const handleMinuteChange = (locationId: string, minute: string) => {
					// Allow only numbers and limit to 0-59
					if (
						minute === "" ||
						(/^\d{1,2}$/.test(minute) && parseInt(minute) <= 59)
					) {
						const minuteMovement = timeToMovement(minute, "minute");
						setData((prev: ClocksData) => {
							const currentData = prev.clocks[locationId] || {};
							const newData = { ...currentData, minute, minuteMovement };
							const { hourError, minuteError } = validateClockData(newData);

							return {
								...prev,
								clocks: {
									...prev.clocks,
									[locationId]: {
										...newData,
										hourError,
										minuteError,
									},
								},
							};
						});
					}
				};

				const handleMovementChange = (
					locationId: string,
					movement: number,
					type?: string
				) => {
					const timeValue = movementToTime(movement, type);
					if (type === "hour") {
						setData((prev: ClocksData) => {
							const currentData = prev.clocks[locationId] || {};
							// Ensure minute has a value if minute movement exists but no minute time
							const ensuredMinute =
								currentData.minute ||
								(currentData.minuteMovement !== undefined
									? movementToTime(currentData.minuteMovement || 0, "minute")
									: movementToTime(0, "minute"));

							return {
								...prev,
								clocks: {
									...prev.clocks,
									[locationId]: {
										...currentData,
										hour: timeValue,
										hourMovement: movement,
										minute: ensuredMinute,
										minuteMovement:
											currentData.minuteMovement !== undefined
												? currentData.minuteMovement
												: 0,
									},
								},
							};
						});
					} else {
						setData((prev: ClocksData) => {
							const currentData = prev.clocks[locationId] || {};
							// Ensure hour has a value if hour movement exists but no hour time
							const ensuredHour =
								currentData.hour ||
								(currentData.hourMovement !== undefined
									? movementToTime(currentData.hourMovement || 0, "hour")
									: movementToTime(0, "hour"));

							return {
								...prev,
								clocks: {
									...prev.clocks,
									[locationId]: {
										...currentData,
										minute: timeValue,
										minuteMovement: movement,
										hour: ensuredHour,
										hourMovement:
											currentData.hourMovement !== undefined
												? currentData.hourMovement
												: 0,
									},
								},
							};
						});
					}
				};

				const handleSymbolChange = (locationId: string, symbol: string) => {
					setData((prev: ClocksData) => {
						const currentData = prev.clocks[locationId] || {};
						const newData = { ...currentData, symbol };
						const { hourError, minuteError } = validateClockData(newData);

						return {
							...prev,
							clocks: {
								...prev.clocks,
								[locationId]: { ...newData, hourError, minuteError },
							},
						};
					});
				};

				const getUsedSymbols = () => {
					return Object.values(data.clocks || {})
						.map((clock) => clock.symbol)
						.filter((symbol) => symbol !== "");
				};

				// Convert SYMBOLS to format expected by SymbolPicker
				const getSymbolsForPicker = () => {
					return SYMBOLS.map((symbolId) => ({
						id: symbolId,
						component: SYMBOL_ICONS[symbolId as keyof typeof SYMBOL_ICONS],
						name: SYMBOL_NAMES[symbolId as keyof typeof SYMBOL_NAMES],
					}));
				};

				// Get clocks that have complete data (hour, minute, and symbol)
				const getCompleteClocks = () => {
					return Object.entries(data.clocks || {})
						.filter(
							([, clock]) =>
								clock.hour !== "" && clock.minute !== "" && clock.symbol !== ""
						)
						.map(([locationId, clock]) => ({
							locationId,
							locationName:
								CLOCK_LOCATIONS.find((loc) => loc.id === locationId)?.name ||
								locationId,
							...clock,
						}));
				};

				const completeClocks = getCompleteClocks();

				// Group clocks by symbol type for helper section
				const getClocksBySymbol = () => {
					const clocksBySymbol: any = {};
					completeClocks.forEach((clock) => {
						clocksBySymbol[clock.symbol] = clock;
					});
					return clocksBySymbol;
				};

				const clocksBySymbol = getClocksBySymbol();

				return (
					<div className="clocks-section">
						<div className="clock-grid">
							{CLOCK_LOCATIONS.map((location) => {
								const clockData = data.clocks?.[location.id] || {
									hour: "",
									minute: "",
									symbol: "",
									hourMovement: 0,
									minuteMovement: 0,
								};

								// Ensure we don't show converted values for empty data in text inputs
								const displayHour = clockData.hour || "";
								const displayMinute = clockData.minute || "";
								const hasData =
									clockData.hour !== "" &&
									clockData.minute !== "" &&
									clockData.symbol !== "";

								const hasSymbol = clockData.symbol !== "";

								// Determine the class based on completion state
								let locationClass = "clock-location";
								if (hasData) {
									locationClass += " clock-location--active";
								} else if (hasSymbol) {
									locationClass += " clock-location--symbol-selected";
								}

								return (
									<div key={location.id} className={locationClass}>
										<div className="clock-location-header">
											<h4>{location.name}</h4>
										</div>

										{/* Symbol Selection */}
										<div className="symbol-selection">
											<label className="symbol-label">Symbol:</label>
											<SymbolPicker
												symbols={getSymbolsForPicker()}
												selectedSymbol={clockData.symbol || ""}
												onSymbolChange={handleSymbolChange}
												usedSymbols={getUsedSymbols()}
												locationId={location.id}
												className="symbol-picker--voyage"
												gridConfig={{ columns: 4, rows: 1 }}
												allowDeselect={true}
												greyOutUnselected={true}
											/>
										</div>

										{/* Time/Movement Inputs */}
										<div className="time-inputs">
											{inputMethod === "text" && (
												<div className="text-input-group">
													<div className="input-group">
														<label
															htmlFor={`hour-${location.id}`}
															className="time-label"
														>
															Hour:
														</label>
														<input
															id={`hour-${location.id}`}
															type="text"
															inputMode="numeric"
															value={displayHour}
															onChange={(e) =>
																handleHourChange(location.id, e.target.value)
															}
															placeholder="Hour"
															className={`time-input time-input--small ${
																clockData.hourError ? "time-input--error" : ""
															}`}
															maxLength={2}
														/>
													</div>
													<div className="input-group">
														<label
															htmlFor={`minute-${location.id}`}
															className="time-label"
														>
															Minute:
														</label>
														<input
															id={`minute-${location.id}`}
															type="text"
															inputMode="numeric"
															value={displayMinute}
															onChange={(e) =>
																handleMinuteChange(location.id, e.target.value)
															}
															placeholder="Minute"
															className={`time-input time-input--small ${
																clockData.minuteError ? "time-input--error" : ""
															}`}
															maxLength={2}
														/>
													</div>
												</div>
											)}

											{inputMethod === "sliders" && (
												<div className="slider-input-group">
													<MovementSlider
														locationId={location.id}
														label="Hour"
														type="hour"
														movement={clockData.hourMovement || 0}
														limits={
															clockData.symbol
																? MOVEMENT_LIMITS[
																		clockData.symbol as keyof typeof MOVEMENT_LIMITS
																  ]
																: { min: -5, max: 5 }
														}
														displayFormat={displayFormat}
														movementToTime={movementToTime}
														onChange={handleMovementChange}
													/>
													<MovementSlider
														locationId={location.id}
														label="Minute"
														type="minute"
														movement={clockData.minuteMovement || 0}
														limits={
															clockData.symbol
																? MOVEMENT_LIMITS[
																		clockData.symbol as keyof typeof MOVEMENT_LIMITS
																  ]
																: { min: -5, max: 5 }
														}
														displayFormat={displayFormat}
														movementToTime={movementToTime}
														onChange={handleMovementChange}
													/>
												</div>
											)}

											{inputMethod === "steppers" && (
												<div className="stepper-input-group">
													<MovementStepper
														locationId={location.id}
														label="Hour"
														type="hour"
														movement={clockData.hourMovement || 0}
														limits={
															clockData.symbol
																? MOVEMENT_LIMITS[
																		clockData.symbol as keyof typeof MOVEMENT_LIMITS
																  ]
																: { min: -5, max: 5 }
														}
														displayFormat={displayFormat}
														movementToTime={movementToTime}
														onChange={handleMovementChange}
													/>
													<MovementStepper
														locationId={location.id}
														label="Minute"
														type="minute"
														movement={clockData.minuteMovement || 0}
														limits={
															clockData.symbol
																? MOVEMENT_LIMITS[
																		clockData.symbol as keyof typeof MOVEMENT_LIMITS
																  ]
																: { min: -5, max: 5 }
														}
														displayFormat={displayFormat}
														movementToTime={movementToTime}
														onChange={handleMovementChange}
													/>
												</div>
											)}

											{inputMethod === "buttons" && (
												<div className="button-input-group">
													<MovementButtons
														locationId={location.id}
														label="Hour"
														type="hour"
														movement={clockData.hourMovement || 0}
														limits={
															clockData.symbol
																? MOVEMENT_LIMITS[
																		clockData.symbol as keyof typeof MOVEMENT_LIMITS
																  ]
																: { min: -5, max: 5 }
														}
														displayFormat={displayFormat}
														movementToTime={movementToTime}
														onChange={handleMovementChange}
													/>
													<MovementButtons
														locationId={location.id}
														label="Minute"
														type="minute"
														movement={clockData.minuteMovement || 0}
														limits={
															clockData.symbol
																? MOVEMENT_LIMITS[
																		clockData.symbol as keyof typeof MOVEMENT_LIMITS
																  ]
																: { min: -5, max: 5 }
														}
														displayFormat={displayFormat}
														movementToTime={movementToTime}
														onChange={handleMovementChange}
													/>
												</div>
											)}
										</div>
									</div>
								);
							})}
						</div>

						{/* Helper Section */}
						{completeClocks.length > 0 && (
							<div className="clock-helper">
								<h4>Dial Locations & Inputs</h4>
								<p className="helper-description">
									All symbols match the in-game positioning of their respective
									dials:
								</p>

								<div className="helper-locations">
									{/* Bridge - All symbols, use minutes */}
									<div className="helper-location">
										<h5>1. Bridge - Minutes</h5>
										<div className="helper-levers helper-levers--four">
											<div className="helper-lever-pair">
												<span className="lever-position">Left:</span>
												<div
													className={`helper-lever ${
														clocksBySymbol["triangle-up-dash"]
															? "helper-lever--available"
															: "helper-lever--missing"
													}`}
												>
													<div className="helper-symbol">
														{React.createElement(
															SYMBOL_ICONS["triangle-up-dash"],
															{
																size: 24,
															}
														)}
													</div>
													<div className="helper-data">
														{clocksBySymbol["triangle-up-dash"]
															? displayFormat === "movements"
																? `${
																		clocksBySymbol["triangle-up-dash"]
																			.minuteMovement >= 0
																			? "+"
																			: ""
																  }${
																		clocksBySymbol["triangle-up-dash"]
																			.minuteMovement
																  }`
																: movementToTime(
																		clocksBySymbol["triangle-up-dash"]
																			.minuteMovement,
																		"minute"
																  )
															: "?"}
													</div>
												</div>
											</div>
											<div className="helper-lever-pair">
												<span className="lever-position">Mid-L:</span>
												<div
													className={`helper-lever ${
														clocksBySymbol["triangle-down"]
															? "helper-lever--available"
															: "helper-lever--missing"
													}`}
												>
													<div className="helper-symbol">
														{React.createElement(
															SYMBOL_ICONS["triangle-down"],
															{
																size: 24,
															}
														)}
													</div>
													<div className="helper-data">
														{clocksBySymbol["triangle-down"]
															? displayFormat === "movements"
																? `${
																		clocksBySymbol["triangle-down"]
																			.minuteMovement >= 0
																			? "+"
																			: ""
																  }${
																		clocksBySymbol["triangle-down"]
																			.minuteMovement
																  }`
																: movementToTime(
																		clocksBySymbol["triangle-down"]
																			.minuteMovement,
																		"minute"
																  )
															: "?"}
													</div>
												</div>
											</div>
											<div className="helper-lever-pair">
												<span className="lever-position">Mid-R:</span>
												<div
													className={`helper-lever ${
														clocksBySymbol["triangle-down-dash"]
															? "helper-lever--available"
															: "helper-lever--missing"
													}`}
												>
													<div className="helper-symbol">
														{React.createElement(
															SYMBOL_ICONS["triangle-down-dash"],
															{
																size: 24,
															}
														)}
													</div>
													<div className="helper-data">
														{clocksBySymbol["triangle-down-dash"]
															? displayFormat === "movements"
																? `${
																		clocksBySymbol["triangle-down-dash"]
																			.minuteMovement >= 0
																			? "+"
																			: ""
																  }${
																		clocksBySymbol["triangle-down-dash"]
																			.minuteMovement
																  }`
																: movementToTime(
																		clocksBySymbol["triangle-down-dash"]
																			.minuteMovement,
																		"minute"
																  )
															: "?"}
													</div>
												</div>
											</div>
											<div className="helper-lever-pair">
												<span className="lever-position">Right:</span>
												<div
													className={`helper-lever ${
														clocksBySymbol["triangle-up"]
															? "helper-lever--available"
															: "helper-lever--missing"
													}`}
												>
													<div className="helper-symbol">
														{React.createElement(SYMBOL_ICONS["triangle-up"], {
															size: 24,
														})}
													</div>
													<div className="helper-data">
														{clocksBySymbol["triangle-up"]
															? displayFormat === "movements"
																? `${
																		clocksBySymbol["triangle-up"]
																			.minuteMovement >= 0
																			? "+"
																			: ""
																  }${
																		clocksBySymbol["triangle-up"].minuteMovement
																  }`
																: movementToTime(
																		clocksBySymbol["triangle-up"]
																			.minuteMovement,
																		"minute"
																  )
															: "?"}
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Poop Deck - Dash symbols, use hours */}
									<div className="helper-location">
										<h5>2. Poop Deck - Hours</h5>
										<div className="helper-levers helper-levers--two">
											<div className="helper-lever-pair">
												<span className="lever-position">Left:</span>
												<div
													className={`helper-lever ${
														clocksBySymbol["triangle-up-dash"]
															? "helper-lever--available"
															: "helper-lever--missing"
													}`}
												>
													<div className="helper-symbol">
														{React.createElement(
															SYMBOL_ICONS["triangle-up-dash"],
															{
																size: 24,
															}
														)}
													</div>
													<div className="helper-data">
														{clocksBySymbol["triangle-up-dash"]
															? displayFormat === "movements"
																? `${
																		clocksBySymbol["triangle-up-dash"]
																			.hourMovement >= 0
																			? "+"
																			: ""
																  }${
																		clocksBySymbol["triangle-up-dash"]
																			.hourMovement
																  }`
																: movementToTime(
																		clocksBySymbol["triangle-up-dash"]
																			.hourMovement,
																		"hour"
																  )
															: "?"}
													</div>
												</div>
											</div>
											<div className="helper-lever-pair">
												<span className="lever-position">Right:</span>
												<div
													className={`helper-lever ${
														clocksBySymbol["triangle-down-dash"]
															? "helper-lever--available"
															: "helper-lever--missing"
													}`}
												>
													<div className="helper-symbol">
														{React.createElement(
															SYMBOL_ICONS["triangle-down-dash"],
															{
																size: 24,
															}
														)}
													</div>
													<div className="helper-data">
														{clocksBySymbol["triangle-down-dash"]
															? displayFormat === "movements"
																? `${
																		clocksBySymbol["triangle-down-dash"]
																			.hourMovement >= 0
																			? "+"
																			: ""
																  }${
																		clocksBySymbol["triangle-down-dash"]
																			.hourMovement
																  }`
																: movementToTime(
																		clocksBySymbol["triangle-down-dash"]
																			.hourMovement,
																		"hour"
																  )
															: "?"}
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Boiler Room - Non-dash symbols, use hours */}
									<div className="helper-location">
										<h5>3. Boiler Room - Hours</h5>
										<div className="helper-levers helper-levers--two">
											<div className="helper-lever-pair">
												<span className="lever-position">Left:</span>
												<div
													className={`helper-lever ${
														clocksBySymbol["triangle-up"]
															? "helper-lever--available"
															: "helper-lever--missing"
													}`}
												>
													<div className="helper-symbol">
														{React.createElement(SYMBOL_ICONS["triangle-up"], {
															size: 24,
														})}
													</div>
													<div className="helper-data">
														{clocksBySymbol["triangle-up"]
															? displayFormat === "movements"
																? `${
																		clocksBySymbol["triangle-up"]
																			.hourMovement >= 0
																			? "+"
																			: ""
																  }${
																		clocksBySymbol["triangle-up"].hourMovement
																  }`
																: movementToTime(
																		clocksBySymbol["triangle-up"].hourMovement,
																		"hour"
																  )
															: "?"}
													</div>
												</div>
											</div>
											<div className="helper-lever-pair">
												<span className="lever-position">Right:</span>
												<div
													className={`helper-lever ${
														clocksBySymbol["triangle-down"]
															? "helper-lever--available"
															: "helper-lever--missing"
													}`}
												>
													<div className="helper-symbol">
														{React.createElement(
															SYMBOL_ICONS["triangle-down"],
															{
																size: 24,
															}
														)}
													</div>
													<div className="helper-data">
														{clocksBySymbol["triangle-down"]
															? displayFormat === "movements"
																? `${
																		clocksBySymbol["triangle-down"]
																			.hourMovement >= 0
																			? "+"
																			: ""
																  }${
																		clocksBySymbol["triangle-down"].hourMovement
																  }`
																: movementToTime(
																		clocksBySymbol["triangle-down"]
																			.hourMovement,
																		"hour"
																  )
															: "?"}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default ClockSection;

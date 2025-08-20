import React, { useState, useEffect, useRef, useCallback } from "react";
import { SymbolPicker } from "../../../../../content/index.js";
import { SectionHeader } from "../../../../../core/index.js";
import { MovementSlider } from "../../../../../content/index.js";
import { MovementStepper } from "../../../../../content/index.js";
import { MovementButtons } from "../../../../../content/index.js";
import { SYMBOL_ICONS, SYMBOL_NAMES } from "./SymbolIcons";

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
const movementToTime = (movement, type) => {
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
const timeToMovement = (timeValue, type) => {
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
	const initialData = {};
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

function ClockSection({ data, onChange }) {
	const [localData, setLocalData] = useState(data || getInitialData());
	const isInitializing = useRef(true);

	// Load initial UI preferences from localStorage
	const getInitialSettings = () => {
		try {
			const saved = localStorage.getItem("voyage-clocks-settings");
			if (saved) {
				const settings = JSON.parse(saved);
				return {
					displayFormat: settings.displayFormat || "time",
					inputMethod: settings.inputMethod || "sliders"
				};
			}
		} catch (e) {
			console.error("Failed to parse clock settings:", e);
		}
		return { displayFormat: "time", inputMethod: "sliders" };
	};

	// UI preference states
	const initialSettings = getInitialSettings();
	const [displayFormat, setDisplayFormat] = useState(initialSettings.displayFormat);
	const [inputMethod, setInputMethod] = useState(initialSettings.inputMethod);

	// Load from localStorage on mount or when parent data changes (reset)
	useEffect(() => {
		// Check if parent data is empty (indicating a reset)
		const isParentDataEmpty = !data || Object.keys(data).length === 0;

		if (isParentDataEmpty) {
			// Parent has been reset, check localStorage or use initial data
			const saved = localStorage.getItem("voyage-clock-data");
			if (saved) {
				try {
					const parsedData = JSON.parse(saved);
					// Convert old time format to new hour/minute format if needed
					const convertedData = {};
					CLOCK_LOCATIONS.forEach((location) => {
						if (parsedData[location.id]) {
							const clockData = parsedData[location.id];
							if (clockData.time && !clockData.hour && !clockData.minute) {
								// Convert "3:15" format to separate hour/minute
								const timeParts = clockData.time.split(":");
								const hour = timeParts[0] || "";
								const minute = timeParts[1] || "";
								convertedData[location.id] = {
									hour,
									minute,
									symbol:
										clockData.symbol === "triangle"
											? "triangle-up"
											: clockData.symbol || "",
									hourMovement: timeToMovement(hour, "hour"),
									minuteMovement: timeToMovement(minute, "minute"),
									hourError: clockData.hourError || false,
									minuteError: clockData.minuteError || false,
								};
							} else {
								// Already in new format or empty
								const hour = clockData.hour || "";
								const minute = clockData.minute || "";
								convertedData[location.id] = {
									hour,
									minute,
									symbol:
										clockData.symbol === "triangle"
											? "triangle-up"
											: clockData.symbol || "",
									hourMovement:
										clockData.hourMovement !== undefined
											? clockData.hourMovement
											: timeToMovement(hour, "hour"),
									minuteMovement:
										clockData.minuteMovement !== undefined
											? clockData.minuteMovement
											: timeToMovement(minute, "minute"),
									hourError: clockData.hourError || false,
									minuteError: clockData.minuteError || false,
								};
							}
						} else {
							convertedData[location.id] = {
								hour: "",
								minute: "",
								symbol: "",
								hourMovement: 0,
								minuteMovement: 0,
								hourError: false,
								minuteError: false,
							};
						}
					});
					setLocalData(convertedData);
				} catch (e) {
					console.error("Failed to parse clock data:", e);
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
		localStorage.setItem("voyage-clock-data", JSON.stringify(localData));

		// Only call onChange after initial load is complete
		if (!isInitializing.current) {
			onChange(localData);
		} else {
			isInitializing.current = false;
		}
	}, [localData]); // Removed onChange from dependencies to prevent infinite loop

	// Save UI preferences to localStorage when they change
	useEffect(() => {
		const settings = { displayFormat, inputMethod };
		localStorage.setItem("voyage-clocks-settings", JSON.stringify(settings));
	}, [displayFormat, inputMethod]);

	// Validation functions
	const isMovementValid = (movement, symbol) => {
		if (!symbol) return true; // No symbol selected, no validation needed
		const limits = MOVEMENT_LIMITS[symbol];
		return movement >= limits.min && movement <= limits.max;
	};

	const isTimeValueValid = (timeValue, type, symbol) => {
		if (!timeValue || timeValue === "" || !symbol) return true;
		const movement = timeToMovement(timeValue, type);
		return isMovementValid(movement, symbol);
	};

	const validateClockData = (clockData) => {
		const symbol = clockData.symbol;
		const hourError =
			clockData.hour !== "" &&
			!isTimeValueValid(clockData.hour, "hour", symbol);
		const minuteError =
			clockData.minute !== "" &&
			!isTimeValueValid(clockData.minute, "minute", symbol);

		return { hourError, minuteError };
	};

	const handleHourChange = (locationId, hour) => {
		// Allow only numbers and limit to reasonable hour values
		if (hour === "" || (/^\d{1,2}$/.test(hour) && parseInt(hour) <= 12)) {
			const hourMovement = timeToMovement(hour, "hour");
			setLocalData((prev) => {
				const currentData = prev[locationId] || {};
				const newData = { ...currentData, hour, hourMovement };
				const { hourError, minuteError } = validateClockData(newData);

				return {
					...prev,
					[locationId]: {
						...newData,
						hourError,
						minuteError: currentData.minuteError, // Keep existing minute error state
					},
				};
			});
		}
	};

	const handleMinuteChange = (locationId, minute) => {
		// Allow only numbers and limit to 0-59
		if (minute === "" || (/^\d{1,2}$/.test(minute) && parseInt(minute) <= 59)) {
			const minuteMovement = timeToMovement(minute, "minute");
			setLocalData((prev) => {
				const currentData = prev[locationId] || {};
				const newData = { ...currentData, minute, minuteMovement };
				const { hourError, minuteError } = validateClockData(newData);

				return {
					...prev,
					[locationId]: {
						...newData,
						hourError: currentData.hourError, // Keep existing hour error state
						minuteError,
					},
				};
			});
		}
	};

	const handleMovementChange = (locationId, movement, type) => {
		const timeValue = movementToTime(movement, type);
		if (type === "hour") {
			setLocalData((prev) => {
				const currentData = prev[locationId] || {};
				// Ensure minute has a value if minute movement exists but no minute time
				const ensuredMinute =
					currentData.minute ||
					(currentData.minuteMovement !== undefined
						? movementToTime(currentData.minuteMovement || 0, "minute")
						: movementToTime(0, "minute"));

				return {
					...prev,
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
				};
			});
		} else {
			setLocalData((prev) => {
				const currentData = prev[locationId] || {};
				// Ensure hour has a value if hour movement exists but no hour time
				const ensuredHour =
					currentData.hour ||
					(currentData.hourMovement !== undefined
						? movementToTime(currentData.hourMovement || 0, "hour")
						: movementToTime(0, "hour"));

				return {
					...prev,
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
				};
			});
		}
	};

	const handleSymbolChange = (locationId, symbol) => {
		setLocalData((prev) => {
			const currentData = prev[locationId] || {};
			const newData = { ...currentData, symbol };
			const { hourError, minuteError } = validateClockData(newData);

			return {
				...prev,
				[locationId]: { ...newData, hourError, minuteError },
			};
		});
	};

	const getUsedSymbols = () => {
		return Object.values(localData)
			.map((clock) => clock.symbol)
			.filter((symbol) => symbol !== "");
	};

	const getAvailableSymbols = (currentSymbol) => {
		const used = getUsedSymbols();
		return SYMBOLS.filter(
			(symbol) => symbol === currentSymbol || !used.includes(symbol)
		);
	};

	// Convert SYMBOLS to format expected by SymbolPicker
	const getSymbolsForPicker = () => {
		return SYMBOLS.map(symbolId => ({
			id: symbolId,
			component: SYMBOL_ICONS[symbolId],
			name: SYMBOL_NAMES[symbolId]
		}));
	};


	// Get clocks that have complete data (hour, minute, and symbol)
	const getCompleteClocks = () => {
		return Object.entries(localData)
			.filter(
				([locationId, clock]) =>
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
		const clocksBySymbol = {};
		completeClocks.forEach((clock) => {
			clocksBySymbol[clock.symbol] = clock;
		});
		return clocksBySymbol;
	};

	const clocksBySymbol = getClocksBySymbol();


	return (
		<div className="clocks-section">
			<SectionHeader
				title="Clock Locations & Times"
				progress={{ completed: completeClocks.length, total: 4 }}
				description="Record times and symbols for active clocks. Enter hour and minute separately. Each symbol can only be used once."
				onReset={() => {
					// Reset all clock data
					const emptyData = getInitialData();
					setLocalData(emptyData);
					onChange(emptyData);
				}}
				resetButtonText="Reset Clocks"
			/>

			<div className="clock-grid">
				{CLOCK_LOCATIONS.map((location) => {
					const clockData = localData[location.id] || {
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
						<div
							key={location.id}
							className={locationClass}
						>
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
												maxLength="2"
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
												maxLength="2"
											/>
										</div>
									</div>
								)}

								{inputMethod === "sliders" && (
									<div className="slider-input-group">
										<MovementSlider
											locationId={location.id}
											type="hour"
											movement={clockData.hourMovement || 0}
											limits={clockData.symbol ? MOVEMENT_LIMITS[clockData.symbol] : { min: -5, max: 5 }}
											displayFormat={displayFormat}
											movementToTime={movementToTime}
											onChange={handleMovementChange}
										/>
										<MovementSlider
											locationId={location.id}
											type="minute"
											movement={clockData.minuteMovement || 0}
											limits={clockData.symbol ? MOVEMENT_LIMITS[clockData.symbol] : { min: -5, max: 5 }}
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
											type="hour"
											movement={clockData.hourMovement || 0}
											limits={clockData.symbol ? MOVEMENT_LIMITS[clockData.symbol] : { min: -5, max: 5 }}
											displayFormat={displayFormat}
											movementToTime={movementToTime}
											onChange={handleMovementChange}
										/>
										<MovementStepper
											locationId={location.id}
											type="minute"
											movement={clockData.minuteMovement || 0}
											limits={clockData.symbol ? MOVEMENT_LIMITS[clockData.symbol] : { min: -5, max: 5 }}
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
											symbol={clockData.symbol}
											hourMovement={clockData.hourMovement || 0}
											minuteMovement={clockData.minuteMovement || 0}
											limits={clockData.symbol ? MOVEMENT_LIMITS[clockData.symbol] : { min: -5, max: 5 }}
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

			{/* Clock Input Settings */}
			<div className="section-settings">
				<h4>Clock Input Preferences</h4>
				<p className="settings-description">
					Customize how you input clock times and how they are displayed.
				</p>
				
				<div className="settings-grid">
					<div className="setting-group">
						<label htmlFor="display-format">Display Format:</label>
						<select
							id="display-format"
							value={displayFormat}
							onChange={(e) => setDisplayFormat(e.target.value)}
							className="setting-select"
						>
							<option value="time">Time Format (01:45)</option>
							<option value="movements">Movement Format (+1/-3)</option>
						</select>
						<span className="setting-note">
							How times are displayed throughout the interface
						</span>
					</div>

					<div className="setting-group">
						<label htmlFor="input-method">Input Method:</label>
						<select
							id="input-method"
							value={inputMethod}
							onChange={(e) => setInputMethod(e.target.value)}
							className="setting-select"
						>
							<option value="sliders">Sliders (range controls)</option>
							<option value="steppers">Steppers (+/- buttons)</option>
							<option value="buttons">Button Grid</option>
							<option value="text">Text Fields</option>
						</select>
						<span className="setting-note">
							How you input time values for each clock location
						</span>
					</div>
				</div>
			</div>

			{/* Helper Section */}
			{completeClocks.length > 0 && (
				<div className="clock-helper">
					<h4>Dial Locations & Inputs</h4>
					<p className="helper-description">
						All symbols match the in-game positioning of their respective dials:
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
											{React.createElement(SYMBOL_ICONS["triangle-up-dash"], {
												size: 24,
											})}
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
															clocksBySymbol["triangle-up-dash"].minuteMovement
													  }`
													: movementToTime(
															clocksBySymbol["triangle-up-dash"].minuteMovement,
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
											{React.createElement(SYMBOL_ICONS["triangle-down"], {
												size: 24,
											})}
										</div>
										<div className="helper-data">
											{clocksBySymbol["triangle-down"]
												? displayFormat === "movements"
													? `${
															clocksBySymbol["triangle-down"].minuteMovement >=
															0
																? "+"
																: ""
													  }${clocksBySymbol["triangle-down"].minuteMovement}`
													: movementToTime(
															clocksBySymbol["triangle-down"].minuteMovement,
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
											{React.createElement(SYMBOL_ICONS["triangle-down-dash"], {
												size: 24,
											})}
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
															clocksBySymbol["triangle-up"].minuteMovement >= 0
																? "+"
																: ""
													  }${clocksBySymbol["triangle-up"].minuteMovement}`
													: movementToTime(
															clocksBySymbol["triangle-up"].minuteMovement,
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
											{React.createElement(SYMBOL_ICONS["triangle-up-dash"], {
												size: 24,
											})}
										</div>
										<div className="helper-data">
											{clocksBySymbol["triangle-up-dash"]
												? displayFormat === "movements"
													? `${
															clocksBySymbol["triangle-up-dash"].hourMovement >=
															0
																? "+"
																: ""
													  }${clocksBySymbol["triangle-up-dash"].hourMovement}`
													: movementToTime(
															clocksBySymbol["triangle-up-dash"].hourMovement,
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
											{React.createElement(SYMBOL_ICONS["triangle-down-dash"], {
												size: 24,
											})}
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
															clocksBySymbol["triangle-down-dash"].hourMovement
													  }`
													: movementToTime(
															clocksBySymbol["triangle-down-dash"].hourMovement,
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
															clocksBySymbol["triangle-up"].hourMovement >= 0
																? "+"
																: ""
													  }${clocksBySymbol["triangle-up"].hourMovement}`
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
											{React.createElement(SYMBOL_ICONS["triangle-down"], {
												size: 24,
											})}
										</div>
										<div className="helper-data">
											{clocksBySymbol["triangle-down"]
												? displayFormat === "movements"
													? `${
															clocksBySymbol["triangle-down"].hourMovement >= 0
																? "+"
																: ""
													  }${clocksBySymbol["triangle-down"].hourMovement}`
													: movementToTime(
															clocksBySymbol["triangle-down"].hourMovement,
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
}

export default ClockSection;

import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { ResultsDisplay } from "@/components/ui";
import type { ResultItem } from "@/components/ui/ResultsDisplay";

// Valve locations
const VALVE_LOCATIONS = [
	{ id: "armoury", name: "Armoury" },
	{ id: "dept-store", name: "Dept. Store" },
	{ id: "dragon-command", name: "Dragon Cmd" },
	{ id: "infirmary", name: "Infirmary" },
	{ id: "supply-depot", name: "Supply Depot" },
	{ id: "tank-factory", name: "Tank Factory" },
];

// Solution lookup table
// Key format: "greenLight-purpleCypher" (e.g., "dept-store-dragon-command")
const VALVE_SOLUTIONS: Record<string, Record<string, number | null>> = {
	"dept-store-dragon-command": {
		"dept-store": 2,
		infirmary: 2,
		"tank-factory": 3,
		armoury: 1,
		"supply-depot": 1,
		"dragon-command": null,
	},
	"dept-store-supply-depot": {
		"dept-store": 1,
		infirmary: 3,
		"tank-factory": 1,
		armoury: 2,
		"supply-depot": null,
		"dragon-command": 1,
	},
	"dept-store-tank-factory": {
		"dept-store": 2,
		infirmary: 3,
		"tank-factory": null,
		armoury: 2,
		"supply-depot": 2,
		"dragon-command": 1,
	},
	"dept-store-armoury": {
		"dept-store": 3,
		infirmary: 2,
		"tank-factory": 2,
		armoury: null,
		"supply-depot": 2,
		"dragon-command": 3,
	},
	"dept-store-infirmary": {
		"dept-store": 1,
		infirmary: null,
		"tank-factory": 2,
		armoury: 2,
		"supply-depot": 1,
		"dragon-command": 3,
	},
	"armoury-dept-store": {
		"dept-store": null,
		infirmary: 3,
		"tank-factory": 1,
		armoury: 1,
		"supply-depot": 3,
		"dragon-command": 2,
	},
	"armoury-dragon-command": {
		"dept-store": 2,
		infirmary: 2,
		"tank-factory": 2,
		armoury: 3,
		"supply-depot": 1,
		"dragon-command": null,
	},
	"armoury-supply-depot": {
		"dept-store": 3,
		infirmary: 1,
		"tank-factory": 1,
		armoury: 2,
		"supply-depot": null,
		"dragon-command": 1,
	},
	"armoury-tank-factory": {
		"dept-store": 2,
		infirmary: 3,
		"tank-factory": null,
		armoury: 3,
		"supply-depot": 3,
		"dragon-command": 1,
	},
	"armoury-infirmary": {
		"dept-store": 2,
		infirmary: null,
		"tank-factory": 2,
		armoury: 2,
		"supply-depot": 1,
		"dragon-command": 2,
	},
	"tank-factory-dept-store": {
		"dept-store": null,
		infirmary: 3,
		"tank-factory": 1,
		armoury: 3,
		"supply-depot": 2,
		"dragon-command": 1,
	},
	"tank-factory-armoury": {
		"dept-store": 3,
		infirmary: 1,
		"tank-factory": 1,
		armoury: null,
		"supply-depot": 2,
		"dragon-command": 1,
	},
	"tank-factory-dragon-command": {
		"dept-store": 1,
		infirmary: 1,
		"tank-factory": 1,
		armoury: 1,
		"supply-depot": 1,
		"dragon-command": null,
	},
	"tank-factory-supply-depot": {
		"dept-store": 1,
		infirmary: 3,
		"tank-factory": 1,
		armoury: 1,
		"supply-depot": null,
		"dragon-command": 2,
	},
	"tank-factory-infirmary": {
		"dept-store": 3,
		infirmary: null,
		"tank-factory": 2,
		armoury: 3,
		"supply-depot": 2,
		"dragon-command": 3,
	},
	"infirmary-dept-store": {
		"dept-store": null,
		infirmary: 3,
		"tank-factory": 3,
		armoury: 3,
		"supply-depot": 3,
		"dragon-command": 1,
	},
	"infirmary-armoury": {
		"dept-store": 1,
		infirmary: 2,
		"tank-factory": 2,
		armoury: null,
		"supply-depot": 1,
		"dragon-command": 2,
	},
	"infirmary-tank-factory": {
		"dept-store": 1,
		infirmary: 3,
		"tank-factory": null,
		armoury: 1,
		"supply-depot": 3,
		"dragon-command": 2,
	},
	"infirmary-dragon-command": {
		"dept-store": 3,
		infirmary: 2,
		"tank-factory": 2,
		armoury: 3,
		"supply-depot": 2,
		"dragon-command": null,
	},
	"infirmary-supply-depot": {
		"dept-store": 1,
		infirmary: 3,
		"tank-factory": 2,
		armoury: 2,
		"supply-depot": null,
		"dragon-command": 2,
	},
	"dragon-command-dept-store": {
		"dept-store": null,
		infirmary: 1,
		"tank-factory": 1,
		armoury: 2,
		"supply-depot": 2,
		"dragon-command": 1,
	},
	"dragon-command-armoury": {
		"dept-store": 1,
		infirmary: 1,
		"tank-factory": 1,
		armoury: null,
		"supply-depot": 3,
		"dragon-command": 1,
	},
	"dragon-command-tank-factory": {
		"dept-store": 1,
		infirmary: 1,
		"tank-factory": null,
		armoury: 1,
		"supply-depot": 3,
		"dragon-command": 3,
	},
	"dragon-command-infirmary": {
		"dept-store": 2,
		infirmary: null,
		"tank-factory": 3,
		armoury: 3,
		"supply-depot": 3,
		"dragon-command": 1,
	},
	"dragon-command-supply-depot": {
		"dept-store": 2,
		infirmary: 2,
		"tank-factory": 3,
		armoury: 1,
		"supply-depot": null,
		"dragon-command": 2,
	},
	"supply-depot-dept-store": {
		"dept-store": null,
		infirmary: 3,
		"tank-factory": 1,
		armoury: 2,
		"supply-depot": 2,
		"dragon-command": 2,
	},
	"supply-depot-armoury": {
		"dept-store": 1,
		infirmary: 3,
		"tank-factory": 1,
		armoury: null,
		"supply-depot": 3,
		"dragon-command": 2,
	},
	"supply-depot-tank-factory": {
		"dept-store": 3,
		infirmary: 2,
		"tank-factory": null,
		armoury: 3,
		"supply-depot": 2,
		"dragon-command": 3,
	},
	"supply-depot-infirmary": {
		"dept-store": 3,
		infirmary: null,
		"tank-factory": 3,
		armoury: 3,
		"supply-depot": 3,
		"dragon-command": 3,
	},
	"supply-depot-dragon-command": {
		"dept-store": 2,
		infirmary: 3,
		"tank-factory": 3,
		armoury: 3,
		"supply-depot": 3,
		"dragon-command": null,
	},
};

// Data interface for this section
interface ValvesData {
	greenLight: string;
	purpleCypher: string;
	startingPositions: {
		[locationId: string]: 1 | 2 | 3 | null;
	};
}

function ValvesSection(props: BaseSectionProps<ValvesData>) {
	return (
		<BaseSection
			config={{
				storageKey: "gorod-krovi-valves-data",
				defaultValue: {
					greenLight: "",
					purpleCypher: "",
					startingPositions: {},
				},
				title: "Valves",
				description:
					"Set the locations of the Green Light and Purple Cypher to get the correct valve positions.",
				resetButtonText: "Reset Valves",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Steps",
							text: "Locate the Purple Cypher and optionally record starting postions of valves. Activate the Generator at the Hatchery to trigger the Green Light.",
						},
						{
							label: "Valve Locations",
							nested: [
								{
									label: "Armoury",
									text: "Top floor - immediately to the left of the stairs",
								},
								{
									label: "Infirmary",
									text: "Middle Bunk Beds - Straight ahead when entering from Dragon Cmd.",
								},
								{
									label: "Dragon Cmd",
									text: "Balcony - right hand side",
								},
								{
									label: "Dept. Store",
									text: "Top floor - back of the room between the two stair cases",
								},
								{
									label: "Supply Depot",
									text: "Ground floor - underneath the central stair case",
								},
								{
									label: "Tank Factory",
									text: "Ground floor - straight ahead from lower entrance",
								},
							],
						},
					],
				},
			}}
			getProgress={(data: ValvesData) => {
				const hasGreenLight = Boolean(data.greenLight);
				const hasPurpleCypher = Boolean(data.purpleCypher);
				const completed = (hasGreenLight ? 1 : 0) + (hasPurpleCypher ? 1 : 0);
				return {
					completed,
					total: 2,
					isComplete: hasGreenLight && hasPurpleCypher,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				// Handle purple cypher/green light selection
				const handleLocationTypeSelect = (
					locationId: string,
					type: "purple-cypher" | "green-light"
				) => {
					setData((prev: ValvesData) => {
						if (type === "purple-cypher") {
							// Toggle purple cypher
							return {
								...prev,
								purpleCypher:
									prev.purpleCypher === locationId ? "" : locationId,
							};
						} else {
							// Toggle green light
							return {
								...prev,
								greenLight: prev.greenLight === locationId ? "" : locationId,
							};
						}
					});
				};

				// Handle starting position selection
				const handleStartingPositionSelect = (
					locationId: string,
					position: 1 | 2 | 3
				) => {
					setData((prev: ValvesData) => ({
						...prev,
						startingPositions: {
							...(prev.startingPositions || {}),
							[locationId]:
								prev.startingPositions?.[locationId] === position
									? null
									: position,
						},
					}));
				};

				// Get the solution for the current selection
				const getSolution = () => {
					if (!data.greenLight || !data.purpleCypher) return null;
					if (data.greenLight === data.purpleCypher) return null;

					const key = `${data.greenLight}-${data.purpleCypher}`;
					return VALVE_SOLUTIONS[key] || null;
				};

				const solution = getSolution();

				// Build result items for ResultsDisplay with color coding
				const getResultItems = (): ResultItem[] => {
					if (!solution) return [];

					return VALVE_LOCATIONS.filter(
						(location) => solution[location.id] !== null
					).map((location) => {
						const requiredPosition = solution[location.id]!;
						const startingPosition = data.startingPositions?.[location.id];

						// Determine status based on position comparison
						let status: "complete" | "incomplete" | "pending" = "pending";
						if (startingPosition === null || startingPosition === undefined) {
							status = "pending"; // Yellow - unknown
						} else if (startingPosition === requiredPosition) {
							status = "complete"; // Green - match
						} else {
							status = "incomplete"; // Red - mismatch
						}

						return {
							id: location.id,
							value: requiredPosition.toString(),
							label: location.name,
							status,
							metadata: {
								Start: startingPosition
									? startingPosition.toString()
									: "Unknown",
							},
						};
					});
				};

				return (
					<div className="valves-section">
						{/* Unified Location Cards */}
						<div className="valve-location-grid">
							{VALVE_LOCATIONS.map((location) => {
								const isPurpleCypher = data.purpleCypher === location.id;
								const isGreenLight = data.greenLight === location.id;
								const startingPosition = data.startingPositions?.[location.id];

								// Disable buttons based on selections
								const purpleCypherDisabled =
									(data.purpleCypher !== "" &&
										data.purpleCypher !== location.id) ||
									isGreenLight;
								const greenLightDisabled =
									(data.greenLight !== "" && data.greenLight !== location.id) ||
									isPurpleCypher;

								return (
									<div key={location.id} className="valve-location-card">
										<h4 className="valve-location-name">{location.name}</h4>

										{/* Type Selection Buttons */}
										<div className="valve-type-buttons">
											<button
												type="button"
												className={`valve-type-btn ${
													isPurpleCypher ? "valve-type-btn--selected" : ""
												}`}
												onClick={() =>
													handleLocationTypeSelect(location.id, "purple-cypher")
												}
												disabled={purpleCypherDisabled}
											>
												Purple Cypher
											</button>
											<button
												type="button"
												className={`valve-type-btn ${
													isGreenLight ? "valve-type-btn--selected" : ""
												}`}
												onClick={() =>
													handleLocationTypeSelect(location.id, "green-light")
												}
												disabled={greenLightDisabled}
											>
												Green Light
											</button>
										</div>

										{/* Starting Position Buttons */}
										<div className="valve-position-section">
											<label className="valve-position-label">
												Starting Position:
											</label>
											<div className="valve-position-buttons">
												{([1, 2, 3] as const).map((position) => (
													<button
														key={position}
														type="button"
														className={`valve-position-btn ${
															startingPosition === position
																? "valve-position-btn--selected"
																: ""
														}`}
														onClick={() =>
															handleStartingPositionSelect(
																location.id,
																position
															)
														}
													>
														{position}
													</button>
												))}
											</div>
										</div>
									</div>
								);
							})}
						</div>

						{/* Solution Display */}
						<ResultsDisplay
							variant="grid"
							title="Valve Positions"
							description={
								solution
									? "Required positions for each valve - Green = Already correct, Yellow = Unknown starting position, Red = Needs adjustment"
									: ""
							}
							results={solution ? getResultItems() : []}
							gridColumns={5}
							colorScheme="success"
							progressMode="replace"
							progress={{
								completed:
									(data.greenLight ? 1 : 0) + (data.purpleCypher ? 1 : 0),
								total: 2,
							}}
							note={
								solution ? (
									<>
										<strong>Note:</strong> Once all valves are set, collect the
										cypher cylinder from{" "}
										{VALVE_LOCATIONS.find((l) => l.id === data.purpleCypher)
											?.name || data.purpleCypher}{" "}
										and give it to Sophia.
									</>
								) : undefined
							}
						/>

						{/* Show message when both are selected but they're the same */}
						{data.greenLight &&
							data.purpleCypher &&
							data.greenLight === data.purpleCypher && (
								<div className="valve-error">
									<p>
										⚠️ The green light and purple cypher cannot be at the same
										location. Please check your selections.
									</p>
								</div>
							)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default ValvesSection;

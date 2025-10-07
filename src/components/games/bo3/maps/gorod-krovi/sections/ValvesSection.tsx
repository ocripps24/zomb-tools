import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { LocationCard, ResultsDisplay } from "@/components/ui";
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
}

function ValvesSection(props: BaseSectionProps<ValvesData>) {
	return (
		<BaseSection
			config={{
				storageKey: "gorod-krovi-valves-data",
				defaultValue: {
					greenLight: "",
					purpleCypher: "",
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
							text: "Record the locations of the Green Light and Purple Cypher. Activate the Generator at the Hatchery",
						},
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
				const handleGreenLightSelect = (locationId: string) => {
					setData((prev: ValvesData) => ({
						...prev,
						greenLight: prev.greenLight === locationId ? "" : locationId,
					}));
				};

				const handlePurpleCypherSelect = (locationId: string) => {
					setData((prev: ValvesData) => ({
						...prev,
						purpleCypher: prev.purpleCypher === locationId ? "" : locationId,
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

				// Build result items for ResultsDisplay
				const getResultItems = (): ResultItem[] => {
					if (!solution) return [];

					return VALVE_LOCATIONS.filter(
						(location) => solution[location.id] !== null
					).map((location) => ({
						id: location.id,
						value: solution[location.id]!.toString(),
						label: location.name,
						status: "complete" as const,
					}));
				};

				// Check if a location is disabled based on current selections
				const isLocationDisabled = (locationId: string, forCypher: boolean) => {
					if (forCypher) {
						// Can't select the same location as green light
						return locationId === data.greenLight;
					} else {
						// Can't select the same location as purple cypher
						return locationId === data.purpleCypher;
					}
				};

				return (
					<div className="valves-section">
						{/* Location Selection Cards */}
						<div className="valve-selection-grid">
							{/* Green Light Selection */}
							<div className="valve-selection-card">
								<h3 className="selection-title">Green Light Location</h3>
								<div className="location-grid">
									{VALVE_LOCATIONS.map((location) => {
										const disabled = isLocationDisabled(location.id, false);
										return (
											<LocationCard
												key={location.id}
												primaryText={location.name}
												isCompleted={data.greenLight === location.id}
												selectable={true}
												isSelected={data.greenLight === location.id}
												onSelect={
													disabled
														? undefined
														: () => handleGreenLightSelect(location.id)
												}
												variant="default"
												disabled={disabled}
											/>
										);
									})}
								</div>
							</div>

							{/* Purple Cypher Selection */}
							<div className="valve-selection-card">
								<h3 className="selection-title">Purple Cypher Location</h3>
								<div className="location-grid">
									{VALVE_LOCATIONS.map((location) => {
										const disabled = isLocationDisabled(location.id, true);
										return (
											<LocationCard
												key={location.id}
												primaryText={location.name}
												isCompleted={data.purpleCypher === location.id}
												selectable={true}
												isSelected={data.purpleCypher === location.id}
												onSelect={
													disabled
														? undefined
														: () => handlePurpleCypherSelect(location.id)
												}
												variant="default"
												disabled={disabled}
											/>
										);
									})}
								</div>
							</div>
						</div>

						{/* Solution Display */}
						<ResultsDisplay
							variant="grid"
							title="Valve Positions"
							description=""
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

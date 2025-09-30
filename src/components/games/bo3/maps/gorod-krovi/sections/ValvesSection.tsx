import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { LocationCard } from "@/components/ui";

// Valve locations
const VALVE_LOCATIONS = [
	{ id: "dept-store", name: "Dept. Store" },
	{ id: "armoury", name: "Armoury" },
	{ id: "tank-factory", name: "Tank Factory" },
	{ id: "infirmary", name: "Infirmary" },
	{ id: "dragon-command", name: "Dragon Command" },
	{ id: "supply-depot", name: "Supply Depot" },
];

// Solution lookup table
// Key format: "greenLight-purpleCanister" (e.g., "dept-store-dragon-command")
const VALVE_SOLUTIONS: Record<string, Record<string, number | null>> = {
	// Green Light at Dept. Store
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
	// Green Light at Armoury - PLACEHOLDER DATA (update later)
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
	// Green Light at Tank Factory - PLACEHOLDER DATA (update later)
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
	// Green Light at Infirmary - PLACEHOLDER DATA (update later)
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
	// Green Light at Dragon Command - PLACEHOLDER DATA (update later)
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
	// Green Light at Supply Depot - PLACEHOLDER DATA (update later)
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
	purpleCanister: string;
}

function ValvesSection(props: BaseSectionProps<ValvesData>) {
	return (
		<BaseSection
			config={{
				storageKey: "gorod-krovi-valves-data",
				defaultValue: {
					greenLight: "",
					purpleCanister: "",
				},
				title: "Valves",
				description:
					"Find the two variations around the map: one valve with a green light and another with a purple canister. Select their locations below to see the correct valve positions.",
				resetButtonText: "Reset Valves",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Step 1",
							text: "Search all 6 valve locations around the map",
						},
						{
							label: "Step 2",
							text: "Find which valve has a green light",
						},
						{
							label: "Step 3",
							text: "Find which valve has a purple canister",
						},
						{
							label: "Step 4",
							text: "Select both locations below to reveal valve positions",
						},
						{
							label: "Step 5",
							text: "Set each valve to the corresponding position (1, 2, or 3)",
						},
					],
				},
			}}
			getProgress={(data: ValvesData) => {
				const hasGreenLight = Boolean(data.greenLight);
				const hasPurpleCanister = Boolean(data.purpleCanister);
				const completed = (hasGreenLight ? 1 : 0) + (hasPurpleCanister ? 1 : 0);
				return {
					completed,
					total: 2,
					isComplete: hasGreenLight && hasPurpleCanister,
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

				const handlePurpleCanisterSelect = (locationId: string) => {
					setData((prev: ValvesData) => ({
						...prev,
						purpleCanister:
							prev.purpleCanister === locationId ? "" : locationId,
					}));
				};

				// Get the solution for the current selection
				const getSolution = () => {
					if (!data.greenLight || !data.purpleCanister) return null;
					if (data.greenLight === data.purpleCanister) return null;

					const key = `${data.greenLight}-${data.purpleCanister}`;
					return VALVE_SOLUTIONS[key] || null;
				};

				const solution = getSolution();

				// Check if a location is disabled based on current selections
				const isLocationDisabled = (locationId: string, forCanister: boolean) => {
					if (forCanister) {
						// Can't select the same location as green light
						return locationId === data.greenLight;
					} else {
						// Can't select the same location as purple canister
						return locationId === data.purpleCanister;
					}
				};

				return (
					<div className="valves-section">
						{/* Location Selection Cards */}
						<div className="valve-selection-grid">
							{/* Green Light Selection */}
							<div className="valve-selection-card">
								<h3 className="selection-title">Green Light Location</h3>
								<p className="selection-description">
									Select the valve location with the green light
								</p>
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

							{/* Purple Canister Selection */}
							<div className="valve-selection-card">
								<h3 className="selection-title">Purple Canister Location</h3>
								<p className="selection-description">
									Select the valve location with the purple canister
								</p>
								<div className="location-grid">
									{VALVE_LOCATIONS.map((location) => {
										const disabled = isLocationDisabled(location.id, true);
										return (
											<LocationCard
												key={location.id}
												primaryText={location.name}
												isCompleted={data.purpleCanister === location.id}
												selectable={true}
												isSelected={data.purpleCanister === location.id}
												onSelect={
													disabled
														? undefined
														: () => handlePurpleCanisterSelect(location.id)
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
						{solution && (
							<div className="valve-solution result-display">
								<h3>Valve Positions</h3>
								<p className="solution-description">
									Set each valve to the following position:
								</p>

								<div className="valve-positions-grid">
									{VALVE_LOCATIONS.filter(
										(location) => solution[location.id] !== null
									).map((location) => {
										const position = solution[location.id];

										return (
											<div key={location.id} className="valve-position-card">
												<div className="valve-location">{location.name}</div>
												<div className="valve-position">{position}</div>
											</div>
										);
									})}
								</div>

								<div className="solution-note">
									<p>
										<strong>Note:</strong> Set each valve to its corresponding
										position in any order. Once all valves are correctly set,
										the step will be complete.
									</p>
								</div>
							</div>
						)}

						{/* Show message when both are selected but they're the same */}
						{data.greenLight &&
							data.purpleCanister &&
							data.greenLight === data.purpleCanister && (
								<div className="valve-error">
									<p>
										⚠️ The green light and purple canister cannot be at the same
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

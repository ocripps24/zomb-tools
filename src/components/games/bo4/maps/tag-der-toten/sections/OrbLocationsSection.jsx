import { useState, useEffect } from "react";
import { FloatingCard } from "../../../../../content/index.js";
import { SectionHeader } from "../../../../../core/index.js";
import { LocationCard } from "../../../../../content/index.js";

// Orb location data - each orb can spawn in one of these locations
const ORBS_DATA = [
	{
		id: "orb-1",
		name: "Orb 1",
		found: false,
		possibleLocations: [
			"Docks",
			"Boathouse", 
			"L.H. Annex",
			"Crevasse",
			"Lagoon",
			"Ice Grotto"
		],
	},
	{
		id: "orb-2", 
		name: "Orb 2",
		found: false,
		possibleLocations: [
			"L.H. Cove",
			"Hidden Path",
			"Beach",
			"L.H. Approach",
			"L.H. Station"
		],
	},
	{
		id: "orb-3",
		name: "Orb 3", 
		found: false,
		possibleLocations: [
			"Security Lobby",
			"Decontamination",
			"Geological",
			"Specimen", 
			"Human Infusion",
			"Loading Platform"
		],
	},
];

function OrbLocationsSection({ data, onChange }) {
	const [localData, setLocalData] = useState(
		(data && data.orbs) ? data : { orbs: [...ORBS_DATA] }
	);

	// Load from localStorage on mount or when parent data changes (reset)
	useEffect(() => {
		// Check if parent data is empty (indicating a reset)
		const isParentDataEmpty = !data || Object.keys(data).length === 0;

		if (isParentDataEmpty) {
			// Parent has been reset, check localStorage or use initial data
			const saved = localStorage.getItem("tag-der-toten-orbs-data");
			if (saved) {
				try {
					const parsedData = JSON.parse(saved);
					setLocalData(parsedData);
				} catch (e) {
					console.error("Failed to parse orbs data:", e);
					setLocalData({ orbs: [...ORBS_DATA] });
				}
			} else {
				// Set default data if no saved data exists
				setLocalData({ orbs: [...ORBS_DATA] });
			}
		}
	}, [data]);

	useEffect(() => {
		localStorage.setItem("tag-der-toten-orbs-data", JSON.stringify(localData));
		onChange?.(localData);
	}, [localData, onChange]);

	const toggleOrbFound = (orbId) => {
		setLocalData((prev) => ({
			...prev,
			orbs: prev.orbs.map((orb) =>
				orb.id === orbId ? { ...orb, found: !orb.found } : orb
			),
		}));
	};

	const resetAll = () => {
		setLocalData({ orbs: [...ORBS_DATA] });
	};

	const foundCount = localData.orbs?.filter((orb) => orb.found).length || 0;
	const totalCount = localData.orbs?.length || 0;

	return (
		<div className="orb-locations-section">
			<SectionHeader
				title="Orb Locations"
				progress={{ completed: foundCount, total: totalCount }}
				description="Find 3 orbs by searching their possible spawn locations. Each orb can appear in one of the listed locations."
				onReset={resetAll}
				resetButtonText="Reset All Orbs"
			/>

			<div className="location-grid location-grid--orbs">
				{localData.orbs?.map((orb) => (
					<LocationCard
						key={orb.id}
						primaryText={orb.name}
						isCompleted={orb.found}
						onToggle={() => toggleOrbFound(orb.id)}
						showSecondaryAlways={true}
						variant="location"
					>
						<ul className="orb-locations-list">
							{orb.possibleLocations.map((location, index) => (
								<li key={index}>
									{location}
								</li>
							))}
						</ul>
					</LocationCard>
				))}
			</div>

			{foundCount === totalCount && totalCount > 0 && (
				<div className="section-completion">
					<FloatingCard className="completion-card">
						<h4>🎉 All Orbs Found!</h4>
						<p>
							You've successfully located all 3 orbs! You can now proceed to the next step of the Easter Egg.
						</p>
					</FloatingCard>
				</div>
			)}
		</div>
	);
}

export default OrbLocationsSection;

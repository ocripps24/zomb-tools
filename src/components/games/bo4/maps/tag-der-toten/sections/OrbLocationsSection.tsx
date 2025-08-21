import React from "react";
import { FloatingCard, LocationCard } from "@/components/content";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

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

// Data interface for this section
interface OrbsData {
	orbs: Array<{
		id: string;
		name: string;
		found: boolean;
		possibleLocations: string[];
	}>;
}

function OrbLocationsSection(props: BaseSectionProps<OrbsData>) {
	return (
		<BaseSection
			config={{
				storageKey: "tag-der-toten-orb-locations-data",
				defaultValue: { orbs: [...ORBS_DATA] },
				title: "Orb Locations",
				description: "Find 3 orbs by searching their possible spawn locations. Each orb can appear in one of the listed locations.",
				resetButtonText: "Reset All Orbs"
			}}
			getProgress={(data: OrbsData) => {
				const foundCount = data.orbs?.filter((orb) => orb.found).length || 0;
				const totalCount = data.orbs?.length || 0;
				return {
					completed: foundCount,
					total: totalCount,
					isComplete: foundCount === totalCount && totalCount > 0
				};
			}}
			{...props}
		>
			{({ data, setData, progress }) => {
				const toggleOrbFound = (orbId: string) => {
					setData((prev: OrbsData) => ({
						...prev,
						orbs: prev.orbs.map((orb) =>
							orb.id === orbId ? { ...orb, found: !orb.found } : orb
						),
					}));
				};

				return (
					<div className="orb-locations-section-content">
						<div className="location-grid location-grid--orbs">
							{data.orbs?.map((orb) => (
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

						{progress.isComplete && (
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
			}}
		</BaseSection>
	);
}

export default OrbLocationsSection;
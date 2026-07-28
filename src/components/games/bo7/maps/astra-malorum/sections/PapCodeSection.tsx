import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { ResultsDisplay } from "@/components/ui";
import { useSectionSettings } from "@/hooks/useSectionSettings";

interface PapCodeData {
	selectedPlanets: string[];
}

// Planets in order from the Sun with their positions
const PLANETS = [
	{ id: "mercury", name: "Mercury", position: 1 },
	{ id: "venus", name: "Venus", position: 2 },
	{ id: "earth", name: "Earth", position: 3 },
	{ id: "mars", name: "Mars", position: 4 },
	{ id: "jupiter", name: "Jupiter", position: 5 },
	{ id: "saturn", name: "Saturn", position: 6 },
	{ id: "uranus", name: "Uranus", position: 7 },
	{ id: "neptune", name: "Neptune", position: 8 },
] as const;

function PapCodeSection(props: BaseSectionProps<PapCodeData>) {
	// Register with the global settings system (no custom settings needed)
	useSectionSettings({
		mapId: "astra-malorum",
		sectionId: "oscar-code",
		sectionName: "OSCAR Code",
		settings: [],
	});

	return (
		<BaseSection
			config={{
				storageKey: "astra-malorum-oscar-code-data",
				defaultValue: { selectedPlanets: [] },
				title: "OSCAR Code",
				description:
					"Follow O.S.C.A.R around and wait for him to say three planets. Select them in the order he says them.",
				resetButtonText: "Clear Code",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Step 1",
							text: "Follow O.S.C.A.R around the map and listen to his dialogue",
						},
						{
							label: "Step 2",
							text: "He will eventually say three planet names",
						},
						{
							label: "Step 3",
							text: "The code is the order of those planets from the Sun (1-8)",
						},
						{
							label: "Example",
							text: "If he says 'Mercury, Earth, Mars' the code would be 1-3-4",
						},
						{
							label: "Location",
							text: "O.S.C.A.R patrols various locations around the map",
						},
					],
				},
			}}
			getProgress={(data: PapCodeData) => {
				const completed = data.selectedPlanets.length;
				return {
					completed,
					total: 3,
					isComplete: completed === 3,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const handlePlanetClick = (planetId: string) => {
					const isSelected = data.selectedPlanets.includes(planetId);

					if (isSelected) {
						// Deselect planet - remove it from the array
						setData({
							selectedPlanets: data.selectedPlanets.filter(
								(id) => id !== planetId,
							),
						});
					} else if (data.selectedPlanets.length < 3) {
						// Select planet - add to the end of the array
						setData({
							selectedPlanets: [...data.selectedPlanets, planetId],
						});
					}
				};

				// Determine result state for styling
				const hasSelection = data.selectedPlanets.length > 0;
				const isComplete = data.selectedPlanets.length === 3;
				const resultStateClass = isComplete
					? "pap-code-section__result--success"
					: hasSelection
						? "pap-code-section__result--warning"
						: "";

				return (
					<div className="pap-code-section">
						<div className="planet-grid">
							{PLANETS.map((planet) => {
								const selectionIndex = data.selectedPlanets.indexOf(planet.id);
								const isSelected = selectionIndex !== -1;
								const orderNumber = isSelected ? selectionIndex + 1 : null;

								return (
									<button
										key={planet.id}
										className={`planet-button ${
											isSelected ? "planet-button--selected" : ""
										}`}
										onClick={() => handlePlanetClick(planet.id)}
									>
										{isSelected && (
											<span className="planet-button__order">
												{orderNumber}
											</span>
										)}
										<span className="planet-button__name">{planet.name}</span>
										<span className="planet-button__position">
											{planet.position}
										</span>
									</button>
								);
							})}
						</div>

						{/* Results Display */}
						{hasSelection && (
							<div className={`pap-code-section__results ${resultStateClass}`}>
								{isComplete ? (
									<div className="pap-code-section__complete">
										<h4>OSCAR Code</h4>
										<ResultsDisplay
											variant="sequence"
											showIncomplete={true}
											totalExpected={3}
											sequenceItems={data.selectedPlanets.map(
												(planetId, index) => {
													const planet = PLANETS.find((p) => p.id === planetId);
													return {
														id: planetId,
														order: index + 1,
														value: planet?.position.toString() || "",
														metadata: {
															planet: planet?.name || "",
														},
													};
												},
											)}
										/>
										<p className="code-instruction">
											Enter this code in a terminal on a column in the PAP room.
										</p>
									</div>
								) : (
									<div className="pap-code-section__partial">
										<h4>Selected Planets ({data.selectedPlanets.length}/3)</h4>
										<p>
											Select {3 - data.selectedPlanets.length} more planet(s)
										</p>
										<div className="partial-planets">
											{data.selectedPlanets.map((planetId, index) => {
												const planet = PLANETS.find((p) => p.id === planetId);
												return (
													<div key={planetId} className="partial-planet">
														<span className="partial-planet__order">
															{index + 1}.
														</span>
														<span className="partial-planet__name">
															{planet?.name}
														</span>
														<span className="partial-planet__position">
															(Position: {planet?.position})
														</span>
													</div>
												);
											})}
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default PapCodeSection;

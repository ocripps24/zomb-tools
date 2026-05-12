import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { useSectionSettings } from "@/hooks/useSectionSettings";

interface TeleporterData {
	marsCoordinates: string;
	paperData: {
		mars: string | null;
		saturn: string | null;
		neptune: string | null;
	};
}

type Planet = "mars" | "saturn" | "neptune";
type Direction = "NW" | "NE" | "SE" | "SW";

const DIRECTIONS: Direction[] = ["NW", "NE", "SE", "SW"];

function TeleporterSection(props: BaseSectionProps<TeleporterData>) {
	// Register settings with the global settings system
	const { getSetting } = useSectionSettings({
		mapId: "astra-malorum",
		sectionId: "teleporter",
		sectionName: "Teleporter",
		settings: [
			{
				id: "input-method",
				label: "Coordinate Input",
				defaultValue: "buttons",
				options: [
					{ value: "buttons", label: "Number Buttons" },
					{ value: "text", label: "Text Input" },
				],
				note: "Choose how to enter Mars coordinates",
			},
		],
	});

	// Get input method from settings
	const inputMethod = getSetting("input-method", "buttons") as "buttons" | "text";

	return (
		<BaseSection
			config={{
				storageKey: "astra-malorum-teleporter-data",
				defaultValue: {
					marsCoordinates: "",
					paperData: {
						mars: null,
						saturn: null,
						neptune: null,
					},
				},
				title: "Teleporter",
				description:
					"Record the planet orientations from the papers and the Mars coordinates from the telescope.",
				resetButtonText: "Clear All",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Planet Papers",
							text: "Find papers at 3 locations showing planets and compass directions",
						},
						{
							label: "Coordinates",
							text: "Use the telescope to find Mars and record the 4-digit coordinates",
						},
						{
							label: "Location",
							text: "Telescope and papers are located around the map",
						},
					],
				},
			}}
			getProgress={(data: TeleporterData) => {
				const coordinatesComplete = data.marsCoordinates.length === 4;
				const papersComplete = Object.values(data.paperData).every(
					(dir) => dir !== null
				);
				const totalComplete =
					(coordinatesComplete ? 1 : 0) + (papersComplete ? 1 : 0);

				return {
					completed: totalComplete,
					total: 2,
					isComplete: totalComplete === 2,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const handleNumberClick = (num: number) => {
					if (data.marsCoordinates.length < 4) {
						setData({
							...data,
							marsCoordinates: data.marsCoordinates + num.toString(),
						});
					}
				};

				const handleBackspace = () => {
					setData({
						...data,
						marsCoordinates: data.marsCoordinates.slice(0, -1),
					});
				};

				const handleTextInput = (value: string) => {
					// Only allow digits and max 4 characters
					const sanitized = value.replace(/\D/g, "").slice(0, 4);
					setData({
						...data,
						marsCoordinates: sanitized,
					});
				};

				const handleDirectionClick = (planet: Planet, direction: Direction) => {
					// If this direction is already selected by another planet, clear it first
					const updatedPaperData = { ...data.paperData };

					// Clear this direction from all planets
					Object.keys(updatedPaperData).forEach((key) => {
						if (updatedPaperData[key as Planet] === direction) {
							updatedPaperData[key as Planet] = null;
						}
					});

					// Set the direction for the selected planet
					updatedPaperData[planet] = direction;

					setData({
						...data,
						paperData: updatedPaperData,
					});
				};

				// Get all selected directions to disable them for other planets
				const getSelectedDirections = (): Set<Direction> => {
					return new Set(
						Object.values(data.paperData).filter(
							(dir): dir is Direction => dir !== null
						)
					);
				};

				const selectedDirections = getSelectedDirections();

				return (
					<div className="teleporter-section">
						{/* Paper Data - Now first */}
						<div className="paper-data-block">
							<h3>Planet Orientations</h3>
							<p className="block-description">
								Record the compass directions from the papers at each location
							</p>

							<div className="planet-directions">
								{(["mars", "saturn", "neptune"] as Planet[]).map((planet) => (
									<div key={planet} className="planet-column">
										<h4 className="planet-name">
											{planet.charAt(0).toUpperCase() + planet.slice(1)}
										</h4>
										<div className="direction-buttons">
											{DIRECTIONS.map((direction) => {
												const isSelected = data.paperData[planet] === direction;
												const isDisabled =
													!isSelected && selectedDirections.has(direction);

												return (
													<button
														key={direction}
														className={`direction-btn ${
															isSelected ? "direction-btn--selected" : ""
														}`}
														onClick={() =>
															handleDirectionClick(planet, direction)
														}
														disabled={isDisabled}
													>
														{direction}
													</button>
												);
											})}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Mars Coordinates - Now second */}
						<div className="coordinates-block">
							<h3>Mars Coordinates</h3>
							<p className="block-description">
								Use the telescope to find Mars and record the coordinates
							</p>

							{inputMethod === "buttons" ? (
								<div className="number-input">
									<div className="number-row">
										{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
											<button
												key={num}
												className="number-btn"
												onClick={() => handleNumberClick(num)}
												disabled={data.marsCoordinates.length >= 4}
											>
												{num}
											</button>
										))}
										<button
											className="number-btn number-btn--backspace"
											onClick={handleBackspace}
											disabled={data.marsCoordinates.length === 0}
										>
											←
										</button>
									</div>
									<div className="number-display">
										{[0, 1, 2, 3].map((index) => (
											<div key={index} className="digit-slot">
												{data.marsCoordinates[index] || "-"}
											</div>
										))}
									</div>
								</div>
							) : (
								<div className="text-input">
									<input
										type="text"
										inputMode="numeric"
										pattern="[0-9]*"
										maxLength={4}
										value={data.marsCoordinates}
										onChange={(e) => handleTextInput(e.target.value)}
										placeholder="Enter 4-digit code"
										className="code-input"
									/>
								</div>
							)}
						</div>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default TeleporterSection;

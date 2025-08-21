import React, { useMemo, useCallback } from "react";
import { BaseSection } from "../../../../../core/index.js";
import type { BaseSectionProps } from "../../../../../core/BaseSection.tsx";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	MouseSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const PLANETS = [
	"Mercury",
	"Venus",
	"Moon",
	"Mars",
	"Jupiter",
	"Saturn",
	"Uranus",
	"Neptune",
];

const PLANET_LOCATIONS = {
	Mercury: "Mailrooms",
	Venus: "Millionaire Suite",
	Moon: "Lower Grand Stairs",
	Mars: "Boiler Room",
	Jupiter: "Engine Room",
	Saturn: "Bridge",
	Uranus: "State Rooms",
	Neptune: "Aft Deck",
	Sun: "Forecastle/Spawn",
};

// Sortable Planet Item Component
function SortablePlanetItem({
	planet,
	index,
	displayNumber,
	isLastSun,
	isLastPlanet,
	onRemove,
}: {
	planet: string;
	index: number;
	displayNumber: number;
	isLastSun: boolean;
	isLastPlanet: boolean;
	onRemove: (index: number) => void;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: planet });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`planet-order-item ${isLastSun ? "planet-final" : ""} ${
				isDragging ? "planet-order-item--dragging" : ""
			}`}
			title={isLastSun ? "Sun (Final step)" : "Drag to reorder"}
		>
			<span className="planet-number">{displayNumber}</span>
			<div className="planet-info">
				<span className="planet-name">
					{planet} - {PLANET_LOCATIONS[planet as keyof typeof PLANET_LOCATIONS]}
				</span>
			</div>
			{!isLastSun && (
				<div className="planet-actions">
					<button
						className="drag-handle"
						{...attributes}
						{...listeners}
						title="Drag to reorder"
						type="button"
					>
						⋮⋮
					</button>
					{isLastPlanet && (
						<button
							onClick={() => onRemove(index)}
							className="delete-btn"
							title="Remove last planet"
							type="button"
						>
							✕
						</button>
					)}
				</div>
			)}
		</div>
	);
}

// Data interface for this section
interface PlanetData {
	planets: string[];
}

function PlanetSection(props: BaseSectionProps<PlanetData>) {
	return (
		<BaseSection
			config={{
				storageKey: "voyage-of-despair-planet-data",
				defaultValue: { planets: [] },
				title: "Planet Order",
				description: "Record the order of planets as they appear. Sun is automatically added as the final step.",
				resetButtonText: "Reset Planets"
			}}
			getProgress={(data: PlanetData) => {
				const planetCount = data.planets?.length || 0;
				return {
					completed: planetCount,
					total: 8,
					isComplete: planetCount === 8
				};
			}}
			{...props}
		>
			{({ data, setData, progress }) => {
				// Configure sensors for @dnd-kit
				const sensors = useSensors(
					useSensor(MouseSensor, {
						activationConstraint: {
							distance: 5, // Small distance for mouse
						},
					}),
					useSensor(TouchSensor, {
						activationConstraint: {
							delay: 250, // 250ms delay for touch
							tolerance: 5, // 5px tolerance during delay
						},
					}),
					useSensor(KeyboardSensor, {
						coordinateGetter: sortableKeyboardCoordinates,
					})
				);

				const addPlanet = useCallback(
					(planet: string) => {
						if (!data.planets.includes(planet)) {
							setData((prev: PlanetData) => ({
								...prev,
								planets: [...prev.planets, planet]
							}));
						}
					},
					[data.planets, setData]
				);

				const removePlanet = useCallback((index: number) => {
					setData((prev: PlanetData) => ({
						...prev,
						planets: prev.planets.filter((_, i) => i !== index)
					}));
				}, [setData]);

				const handleDragEnd = useCallback((event: any) => {
					const { active, over } = event;

					if (active.id !== over?.id) {
						setData((prev: PlanetData) => {
							const items = prev.planets;
							const oldIndex = items.indexOf(active.id);
							const newIndex = items.indexOf(over.id);

							return {
								...prev,
								planets: arrayMove(items, oldIndex, newIndex)
							};
						});
					}
				}, [setData]);

				const clearAll = useCallback(() => {
					setData((prev: PlanetData) => ({
						...prev,
						planets: []
					}));
				}, [setData]);

				const availablePlanets = useMemo(() => {
					return PLANETS.filter((planet) => !data.planets.includes(planet));
				}, [data.planets]);

				// Get display order with Sun automatically added at the end
				const displayOrder = useMemo(() => {
					const order = [...data.planets];
					// Always add Sun at the end (step 9)
					order.push("Sun");
					return order;
				}, [data.planets]);

				return (
					<div className="planets-section">
						{/* Available planets - only show when there are planets available */}
						{availablePlanets.length > 0 && (
							<div className="available-planets">
								<h4>Available Planets:</h4>
								<div className="planet-grid">
									{availablePlanets.map((planet) => (
										<button
											key={planet}
											onClick={() => addPlanet(planet)}
											className="planet-btn"
										>
											{planet}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Current planet order */}
						<div className="planet-order">
							<h4>Current Order:</h4>
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
								<SortableContext
									items={data.planets}
									strategy={verticalListSortingStrategy}
								>
									<div className="planet-order-list">
										{displayOrder.map((planet, index) => {
											const isLastSun =
												planet === "Sun" && index === displayOrder.length - 1;
											const isLastPlanet =
												!isLastSun && index === data.planets.length - 1; // Last user-added planet
											// For Sun, always show 9 regardless of current index
											const displayNumber = isLastSun ? 9 : index + 1;

											return (
												<SortablePlanetItem
													key={planet}
													planet={planet}
													index={index}
													displayNumber={displayNumber}
													isLastSun={isLastSun}
													isLastPlanet={isLastPlanet}
													onRemove={removePlanet}
												/>
											);
										})}
									</div>
								</SortableContext>
							</DndContext>
							{data.planets.length > 0 && (
								<button onClick={clearAll} className="btn btn-secondary clear-btn">
									Clear All
								</button>
							)}
						</div>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default PlanetSection;
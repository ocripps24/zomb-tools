import { useState } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	TouchSensor,
	MouseSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	rectSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { useSectionSettings } from "@/hooks/useSectionSettings";

import Note1Svg from "@/assets/maps/bo7/paradox-junction/paradox-junction-note-1.svg";
import Note25Svg from "@/assets/maps/bo7/paradox-junction/paradox-junction-note-2-5.svg";
import Note3Svg from "@/assets/maps/bo7/paradox-junction/paradox-junction-note-3.svg";
import Note468Svg from "@/assets/maps/bo7/paradox-junction/paradox-junction-note-4-6-8.svg";
import Note7Svg from "@/assets/maps/bo7/paradox-junction/paradox-junction-note-7.svg";

type NoteSvg = React.ComponentType<React.SVGProps<SVGSVGElement>>;

// 5 unique visual appearances — shared notes labelled with all their numbers
const NOTE_VISUALS: {
	id: string;
	svg: NoteSvg;
	group: number[];
	label: string;
}[] = [
	{ id: "1", svg: Note1Svg as unknown as NoteSvg, group: [1], label: "1" },
	{
		id: "2-5",
		svg: Note25Svg as unknown as NoteSvg,
		group: [2, 5],
		label: "2-5",
	},
	{ id: "3", svg: Note3Svg as unknown as NoteSvg, group: [3], label: "3" },
	{
		id: "4-6-8",
		svg: Note468Svg as unknown as NoteSvg,
		group: [4, 6, 8],
		label: "4-6-8",
	},
	{ id: "7", svg: Note7Svg as unknown as NoteSvg, group: [7], label: "7" },
];

const LOCATIONS = [
	{ id: "bunker", short: "Bunker", long: "Bunker (Green House Garden)" },
	{
		id: "double-points",
		short: "Double Points",
		long: "Double Points (Spawn Top Middle)",
	},
	{ id: "bus", short: "Bus", long: "Bus (Spawn School Bus)" },
	{
		id: "mini-golf",
		short: "Mini Golf",
		long: "Mini Golf (Yellow House Garden)",
	},
	{ id: "exfil", short: "Exfil", long: "Exfil (Trinity Top Left)" },
	{
		id: "blue-house",
		short: "Blue House",
		long: "Blue House (Trinity Bottom Left)",
	},
	{ id: "truck", short: "Truck", long: "Truck (Trinity Top Right)" },
	{ id: "tree", short: "Tree", long: "Tree (Trinity Bottom Right)" },
] as const;

// Suggested walkthrough order
const DEFAULT_ORDER = [
	"bunker",
	"bus",
	"double-points",
	"mini-golf",
	"exfil",
	"blue-house",
	"tree",
	"truck",
];

const PIANO_SEQUENCE = [8, 6, 7, 5, 6, 5, 3, 5];

interface PianoNotesData {
	locationNotes: Record<string, number | null>;
	locationOrder: string[];
	locationNames?: Record<string, string>;
}

const DEFAULT_VALUE: PianoNotesData = {
	locationNotes: Object.fromEntries(LOCATIONS.map((l) => [l.id, null])),
	locationOrder: [...DEFAULT_ORDER],
};

// ─── Sortable card ────────────────────────────────────────────────────────────

interface SortableCardProps {
	locationId: string;
	displayName: string;
	long: string;
	assignedNote: number | null;
	isActive: boolean;
	activeGroup: number[] | null;
	usedNumbers: Set<number>;
	onAssign: (noteNumber: number) => void;
	onClear: () => void;
}

function SortableLocationCard({
	locationId,
	displayName,
	long,
	assignedNote,
	isActive,
	activeGroup,
	usedNumbers,
	onAssign,
	onClear,
}: SortableCardProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: locationId });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.4 : 1,
	};

	const classNames = [
		"location-note-card",
		assignedNote !== null ? "location-note-card--assigned" : "",
		isActive ? "location-note-card--active" : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div ref={setNodeRef} style={style} className={classNames}>
			<div className="location-note-card__header">
				<button
					className="location-note-card__drag-handle"
					{...attributes}
					{...listeners}
					aria-label="Drag to reorder"
					type="button"
				>
					⋮⋮
				</button>
				<span className="location-note-card__short">{displayName}</span>
				{assignedNote !== null && (
					<button
						className="location-note-card__clear"
						onClick={onClear}
						aria-label="Clear note"
					>
						×
					</button>
				)}
			</div>
			<span className="location-note-card__long">{long}</span>
			<div className="location-note-card__picker">
				{[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
					const isSelected = assignedNote === num;
					const isUsedElsewhere = !isSelected && usedNumbers.has(num);
					const isFilteredOut =
						activeGroup !== null && !activeGroup.includes(num) && !isSelected;
					return (
						<button
							key={num}
							className={[
								"note-btn",
								isSelected ? "note-btn--selected" : "",
								isUsedElsewhere ? "note-btn--used" : "",
								isFilteredOut ? "note-btn--filtered" : "",
							]
								.filter(Boolean)
								.join(" ")}
							onClick={() => onAssign(num)}
							disabled={isUsedElsewhere || isFilteredOut}
						>
							{num}
						</button>
					);
				})}
			</div>
		</div>
	);
}

// ─── Section ──────────────────────────────────────────────────────────────────

function PianoNotesSection(props: BaseSectionProps<PianoNotesData>) {
	const [activeFilter, setActiveFilter] = useState<string | null>(null);
	const [showRenamePanel, setShowRenamePanel] = useState(false);

	const sensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
		useSensor(TouchSensor, {
			activationConstraint: { delay: 250, tolerance: 5 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	useSectionSettings({
		mapId: "paradox-junction",
		sectionId: "piano-notes",
		sectionName: "Piano Notes",
		settings: [],
	});

	return (
		<BaseSection
			config={{
				storageKey: "paradox-junction-piano-notes-data",
				defaultValue: DEFAULT_VALUE,
				title: "Piano Notes",
				description:
					"Find each musical note around the map in the Present and count how many times it flashes to determine its number (1–8). Assign each location below, then head to the Past to play the piano. FOR ROSS: LOCATION NAMES CAN BE CHANGED IN THE RENAME LOCATIONS PANEL BELOW!",
				resetButtonText: "Clear All",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Counting",
							text: "Stand near a note and count how many times the symbol flashes — that number is the note's value (1–8).",
						},
						{
							label: "Collection Order",
							text: "Once all notes are identified, collect them in order from 1 to 8 in the Present.",
						},
						{
							label: "Piano",
							text: "Head to the Past and play the piano keys in the sequence shown below. Keys are numbered 1–8 from left to right.",
						},
					],
				},
			}}
			getProgress={(data: PianoNotesData) => {
				const completed = Object.values(data.locationNotes).filter(
					(v) => v !== null,
				).length;
				return { completed, total: 8, isComplete: completed === 8 };
			}}
			{...props}
		>
			{({ data, setData }) => {
				const locationOrder = data.locationOrder ?? DEFAULT_ORDER;

				const getDisplayName = (locationId: string) => {
					const location = LOCATIONS.find((l) => l.id === locationId);
					return (
						data.locationNames?.[locationId] || location?.short || locationId
					);
				};

				const handleRenameLocation = (locationId: string, name: string) => {
					setData({
						...data,
						locationNames: { ...data.locationNames, [locationId]: name },
					});
				};

				const handleResetNames = () => {
					setData({ ...data, locationNames: {} });
				};

				const usedNumbers = new Set(
					Object.values(data.locationNotes).filter(
						(v): v is number => v !== null,
					),
				);

				// First unassigned location in the current order
				const activeLocationId =
					locationOrder.find((id) => data.locationNotes[id] === null) ?? null;

				const activeGroup =
					activeFilter !== null
						? (NOTE_VISUALS.find((v) => v.id === activeFilter)?.group ?? null)
						: null;

				const handleAssign = (locationId: string, noteNumber: number) => {
					const current = data.locationNotes[locationId];
					const isDeselecting = current === noteNumber;
					const newNotes = {
						...data.locationNotes,
						[locationId]: isDeselecting ? null : noteNumber,
					};

					// Autocomplete the 8th location when 7 are assigned
					if (!isDeselecting) {
						const assignedCount = Object.values(newNotes).filter(
							(v) => v !== null,
						).length;
						if (assignedCount === 7) {
							const unassignedId = LOCATIONS.find(
								(l) => newNotes[l.id] === null,
							)?.id;
							const usedNums = new Set(
								Object.values(newNotes).filter((v): v is number => v !== null),
							);
							const remainingNum = [1, 2, 3, 4, 5, 6, 7, 8].find(
								(n) => !usedNums.has(n),
							);
							if (unassignedId !== undefined && remainingNum !== undefined) {
								newNotes[unassignedId] = remainingNum;
							}
						}
						setActiveFilter(null);
					}

					setData({ ...data, locationNotes: newNotes });
				};

				const handleVisualClick = (visual: (typeof NOTE_VISUALS)[number]) => {
					// Toggle off if this visual is already the active filter
					if (activeFilter === visual.id) {
						setActiveFilter(null);
						return;
					}

					// How many numbers in this group are still unassigned?
					const available = visual.group.filter((n) => !usedNumbers.has(n));

					if (available.length === 0) {
						// All numbers in this group are used — nothing to do
						return;
					}

					if (available.length === 1) {
						// Only one possibility — auto-assign to the active location
						if (activeLocationId !== null) {
							handleAssign(activeLocationId, available[0]);
						}
						setActiveFilter(null);
					} else {
						// Multiple possibilities — activate visual filter on pickers
						setActiveFilter(visual.id);
					}
				};

				const handleDragEnd = (event: DragEndEvent) => {
					const { active, over } = event;
					if (over && active.id !== over.id) {
						const oldIndex = locationOrder.indexOf(active.id as string);
						const newIndex = locationOrder.indexOf(over.id as string);
						setData({
							...data,
							locationOrder: arrayMove(locationOrder, oldIndex, newIndex),
						});
					}
				};

				return (
					<div className="piano-notes-section">
						{/* Location grid */}
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={locationOrder}
								strategy={rectSortingStrategy}
							>
								<div className="location-note-grid">
									{locationOrder.map((locationId) => {
										const location = LOCATIONS.find((l) => l.id === locationId);
										if (!location) return null;
										return (
											<SortableLocationCard
												key={locationId}
												locationId={locationId}
												displayName={getDisplayName(locationId)}
												long={location.long}
												assignedNote={data.locationNotes[locationId] ?? null}
												isActive={locationId === activeLocationId}
												activeGroup={activeGroup}
												usedNumbers={usedNumbers}
												onAssign={(num) => handleAssign(locationId, num)}
												onClear={() =>
													setData({
														...data,
														locationNotes: {
															...data.locationNotes,
															[locationId]: null,
														},
													})
												}
											/>
										);
									})}
								</div>
							</SortableContext>
						</DndContext>

						{/* Visual note identifier */}
						<div
							className={`note-visual-block${activeGroup !== null ? " note-visual-block--filtered" : ""}`}
						>
							<h3>Visual Note Identifier</h3>
							<p className="note-visual-block__description">
								Click the note matching what you see in-game. Unique notes (1,
								3, 7) assign directly to the active location; shared notes
								filter the pickers above to only the possible numbers.
							</p>
							<div className="note-visual-grid">
								{NOTE_VISUALS.map((visual) => {
									const NoteComponent = visual.svg;
									const isActive = activeFilter === visual.id;
									const isDimmed = activeFilter !== null && !isActive;
									const isFullyUsed = visual.group.every((n) =>
										usedNumbers.has(n),
									);
									return (
										<button
											key={visual.id}
											className={[
												"note-visual-btn",
												isActive ? "note-visual-btn--active" : "",
												isDimmed ? "note-visual-btn--dimmed" : "",
												isFullyUsed ? "note-visual-btn--used" : "",
											]
												.filter(Boolean)
												.join(" ")}
											onClick={() => handleVisualClick(visual)}
											disabled={isFullyUsed}
										>
											<NoteComponent className="note-visual-icon" />
											<span className="note-visual-btn__label">
												{visual.label}
											</span>
										</button>
									);
								})}
							</div>
							{activeGroup !== null && (
								<button
									className="note-visual-clear"
									onClick={() => setActiveFilter(null)}
								>
									Clear filter
								</button>
							)}
						</div>

						{/* Piano sequence block */}
						<div className="piano-sequence-block">
							<h3>Piano Sequence</h3>
							<p className="piano-sequence-block__description">
								Play the piano keys in this order (keys numbered 1–8, left to
								right):
							</p>
							<div className="piano-sequence-block__sequence">
								{PIANO_SEQUENCE.join(" - ")}
							</div>
						</div>

						{/* Rename locations panel */}
						<div className="rename-locations-panel">
							<button
								className="rename-locations-panel__toggle"
								onClick={() => setShowRenamePanel((v) => !v)}
								type="button"
							>
								<span>Rename Locations</span>
								<span
									className={`rename-locations-panel__chevron${showRenamePanel ? " rename-locations-panel__chevron--open" : ""}`}
								>
									▾
								</span>
							</button>
							{showRenamePanel && (
								<div className="rename-locations-panel__body">
									<div className="rename-locations-panel__grid">
										{LOCATIONS.map((location) => (
											<div
												key={location.id}
												className="rename-locations-panel__field"
											>
												<label
													htmlFor={`rename-${location.id}`}
													className="rename-locations-panel__label"
												>
													{location.long}
												</label>
												<input
													id={`rename-${location.id}`}
													type="text"
													className="rename-locations-panel__input"
													value={
														data.locationNames?.[location.id] ?? location.short
													}
													onChange={(e) =>
														handleRenameLocation(location.id, e.target.value)
													}
													placeholder={location.short}
												/>
											</div>
										))}
									</div>
									<button
										className="rename-locations-panel__reset"
										onClick={handleResetNames}
										type="button"
									>
										Reset to defaults
									</button>
								</div>
							)}
						</div>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default PianoNotesSection;

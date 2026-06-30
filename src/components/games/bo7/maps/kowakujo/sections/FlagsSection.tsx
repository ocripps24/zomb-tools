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
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

import Num1Icon from "@/assets/maps/bo7/kowakujo/kowakujo-number-1.svg";
import Num2Icon from "@/assets/maps/bo7/kowakujo/kowakujo-number-2.svg";
import Num3Icon from "@/assets/maps/bo7/kowakujo/kowakujo-number-3.svg";
import Num4Icon from "@/assets/maps/bo7/kowakujo/kowakujo-number-4.svg";

type NumIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const POSITION_ICONS: NumIcon[] = [
	Num1Icon as unknown as NumIcon,
	Num2Icon as unknown as NumIcon,
	Num3Icon as unknown as NumIcon,
	Num4Icon as unknown as NumIcon,
];

const LOCATIONS = [
	"Central Courtyard",
	"Stables",
	"Flower Garden",
	"Outer Ward",
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface FlagsData {
	clockNumbers: (number | null)[];
	flagValues: number[];
	locationOrder: string[];
}

const DEFAULT_VALUE: FlagsData = {
	clockNumbers: [null, null, null, null],
	flagValues: [],
	locationOrder: [],
};

// ─── Solver ───────────────────────────────────────────────────────────────────

// Returns for each of the 4 positions an array of flag VALUES to use,
// or null if that position can't be solved. Prefers single-flag solutions
// (more efficient) before trying pairs.
function solveFlags(
	clockNumbers: (number | null)[],
	flagValues: number[],
): (number[] | null)[] {
	const empty: (number[] | null)[] = [null, null, null, null];
	if (clockNumbers.some((n) => n === null) || flagValues.length === 0) {
		return empty;
	}

	const targets = clockNumbers as number[];
	const used = new Array(flagValues.length).fill(false);
	const assignments: number[][] = [];

	function backtrack(targetIdx: number): boolean {
		if (targetIdx === 4) return true;
		const target = targets[targetIdx];

		// Try single flag first (prefer efficient solutions)
		for (let i = 0; i < flagValues.length; i++) {
			if (!used[i] && flagValues[i] === target) {
				used[i] = true;
				assignments.push([i]);
				if (backtrack(targetIdx + 1)) return true;
				assignments.pop();
				used[i] = false;
			}
		}

		// Try pairs
		for (let i = 0; i < flagValues.length; i++) {
			if (used[i]) continue;
			for (let j = i + 1; j < flagValues.length; j++) {
				if (!used[j] && flagValues[i] + flagValues[j] === target) {
					used[i] = used[j] = true;
					assignments.push([i, j]);
					if (backtrack(targetIdx + 1)) return true;
					assignments.pop();
					used[i] = used[j] = false;
				}
			}
		}

		return false;
	}

	if (!backtrack(0)) return empty;
	return assignments.map((indices) => indices.map((i) => flagValues[i]));
}

function formatCombo(values: number[] | null): string {
	if (!values) return "----";
	return values.join(" + ");
}

// ─── Sortable location item ───────────────────────────────────────────────────

function SortableLocationItem({
	locId,
	position,
	showRemove,
	onRemove,
}: {
	locId: string;
	position: number;
	showRemove: boolean;
	onRemove: () => void;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: locId });

	return (
		<div
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className={[
				"flags-location-item",
				isDragging ? "flags-location-item--dragging" : "",
			]
				.filter(Boolean)
				.join(" ")}
		>
			<span className="flags-location-item__number">{position}</span>
			<span className="flags-location-item__name">{locId}</span>
			<div className="flags-location-item__actions">
				<button
					className="flags-location-item__drag"
					{...attributes}
					{...listeners}
					type="button"
					title="Drag to reorder"
				>
					⋮⋮
				</button>
				{showRemove && (
					<button
						className="flags-location-item__remove"
						onClick={onRemove}
						type="button"
						title="Remove"
					>
						✕
					</button>
				)}
			</div>
		</div>
	);
}

// ─── Section ──────────────────────────────────────────────────────────────────

function FlagsSection(props: BaseSectionProps<FlagsData>) {
	const [locationOpen, setLocationOpen] = useState(false);

	const sensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
		useSensor(TouchSensor, {
			activationConstraint: { delay: 250, tolerance: 5 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	return (
		<BaseSection
			config={{
				storageKey: "kowakujo-flags-data",
				defaultValue: DEFAULT_VALUE,
				title: "Flags",
				description:
					"Record the four times shown by the Lantern Clock, then the flag values from the defence round to work out which flags go where.",
				resetButtonText: "Reset",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Clock Times",
							text: "Interact with the Lantern Clock to trigger it. The hands spin and stop four times — record each hour shown (1–9).",
						},
						{
							label: "Flags",
							text: "After the clock, a defence round spawns zombies carrying flags. Kill them to release wisps. Count the objects depicted on each flag (1–7 per flag).",
						},
						{
							label: "Flag Count",
							text: "We believe there are always 6 flags per game, but this may vary — enter however many you receive. This will be updated as more data is gathered.",
						},
						{
							label: "Locations",
							text: "Place the flag combinations at Central Courtyard, Stables, Flower Garden, and Outer Ward. The Japanese number shown on each sign tells you which clock time to match — the mapping changes every game.",
						},
					],
				},
			}}
			getProgress={(data: FlagsData) => {
				const clockFilled = data.clockNumbers.filter((n) => n !== null).length;
				const solved =
					clockFilled === 4 &&
					data.flagValues.length > 0 &&
					solveFlags(data.clockNumbers, data.flagValues)[0] !== null;
				return {
					completed: solved ? 1 : 0,
					total: 1,
					isComplete: solved,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const clockFull = data.clockNumbers.every((n) => n !== null);
				const clockFilledCount = data.clockNumbers.filter(
					(n) => n !== null,
				).length;

				// ── Clock handlers ──────────────────────────────────────────────

				const handleClockInput = (n: number) => {
					if (clockFull) return;
					setData((prev) => {
						const next = [...prev.clockNumbers];
						const idx = next.findIndex((v) => v === null);
						if (idx !== -1) next[idx] = n;
						return { ...prev, clockNumbers: next };
					});
				};

				const handleClockUndo = () => {
					setData((prev) => {
						const next = [...prev.clockNumbers];
						for (let i = next.length - 1; i >= 0; i--) {
							if (next[i] !== null) {
								next[i] = null;
								break;
							}
						}
						return { ...prev, clockNumbers: next };
					});
				};

				// ── Flag handlers ───────────────────────────────────────────────

				const handleFlagInput = (n: number) => {
					if (data.flagValues.length >= 8) return;
					setData((prev) => ({
						...prev,
						flagValues: [...prev.flagValues, n],
					}));
				};

				const handleFlagUndo = () => {
					setData((prev) => ({
						...prev,
						flagValues: prev.flagValues.slice(0, -1),
					}));
				};

				// ── Location handlers ───────────────────────────────────────────

				const addLocation = (locId: string) => {
					if (data.locationOrder.includes(locId)) return;
					const newOrder = [...data.locationOrder, locId];
					// Auto-fill 4th when 3rd is chosen
					if (newOrder.length === 3) {
						const remaining = LOCATIONS.find((l) => !newOrder.includes(l));
						if (remaining) newOrder.push(remaining);
					}
					setData((prev) => ({ ...prev, locationOrder: newOrder }));
				};

				const removeLastLocation = () => {
					setData((prev) => ({
						...prev,
						locationOrder: prev.locationOrder.slice(0, -1),
					}));
				};

				const clearLocations = () => {
					setData((prev) => ({ ...prev, locationOrder: [] }));
				};

				const handleDragEnd = (event: DragEndEvent) => {
					const { active, over } = event;
					if (!over || active.id === over.id) return;
					setData((prev) => {
						const order = prev.locationOrder;
						const oldIdx = order.indexOf(active.id as string);
						const newIdx = order.indexOf(over.id as string);
						if (oldIdx === -1 || newIdx === -1) return prev;
						return {
							...prev,
							locationOrder: arrayMove(order, oldIdx, newIdx),
						};
					});
				};

				// ── Derived state ───────────────────────────────────────────────

				const solution = solveFlags(data.clockNumbers, data.flagValues);
				const hasSolution = solution[0] !== null;
				const noSolution =
					clockFull && data.flagValues.length > 0 && !hasSolution;

				const availableLocations = LOCATIONS.filter(
					(l) => !data.locationOrder.includes(l),
				);

				// When 4 are filled, the last item was auto-filled so we don't
				// show an individual remove — only "Clear All".
				const isFullyAssigned = data.locationOrder.length === 4;

				return (
					<div className="flags-section">
						{/* ── Clock Times ───────────────────────────────────────── */}
						<div className="flags-block">
							<h3 className="flags-block__heading">Clock Times</h3>
							{!clockFull && (
								<div className="flags-number-row">
									{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
										<button
											key={n}
											className="flags-num-btn"
											onClick={() => handleClockInput(n)}
											type="button"
										>
											{n}
										</button>
									))}
									<button
										className="flags-action-btn"
										onClick={handleClockUndo}
										disabled={clockFilledCount === 0}
										type="button"
									>
										Undo
									</button>
								</div>
							)}
							<div className="flags-clock-slots">
								{data.clockNumbers.map((n, i) => (
									<div
										key={i}
										className={[
											"flags-clock-slot",
											n !== null
												? "flags-clock-slot--filled"
												: "flags-clock-slot--empty",
										].join(" ")}
									>
										{n ?? "—"}
									</div>
								))}
								{clockFull && (
									<button
										className="flags-action-btn"
										onClick={handleClockUndo}
										type="button"
									>
										Undo
									</button>
								)}
							</div>
						</div>

						{/* ── Flag Values ───────────────────────────────────────── */}
						<div className="flags-block">
							<h3 className="flags-block__heading">Flag Values</h3>
							<div className="flags-number-row">
								{[1, 2, 3, 4, 5, 6, 7].map((n) => (
									<button
										key={n}
										className="flags-num-btn"
										onClick={() => handleFlagInput(n)}
										disabled={data.flagValues.length >= 8}
										type="button"
									>
										{n}
									</button>
								))}
								<button
									className="flags-action-btn"
									onClick={handleFlagUndo}
									disabled={data.flagValues.length === 0}
									type="button"
								>
									Undo
								</button>
							</div>
							{data.flagValues.length > 0 && (
								<div className="flags-chips">
									{data.flagValues.map((v, i) => (
										<span key={i} className="flags-chip">
											{v}
										</span>
									))}
								</div>
							)}
						</div>

						{/* ── Location Order (collapsible) ──────────────────────── */}
						<div className="flags-location-panel">
							<button
								className="flags-location-panel__toggle"
								onClick={() => setLocationOpen((v) => !v)}
								type="button"
							>
								<span>Location Order (Optional)</span>
								<span
									className={[
										"flags-location-panel__chevron",
										locationOpen
											? "flags-location-panel__chevron--open"
											: "",
									]
										.filter(Boolean)
										.join(" ")}
								>
									▾
								</span>
							</button>
							{locationOpen && (
								<div className="flags-location-panel__body">
									<p className="flags-location-panel__hint">
										Click locations in the order their Japanese number signs
										correspond to positions 1–4. Enter 3 and the 4th fills
										automatically.
									</p>
									{availableLocations.length > 0 && (
										<div className="flags-location-available">
											{availableLocations.map((loc) => (
												<button
													key={loc}
													className="flags-location-btn"
													onClick={() => addLocation(loc)}
													type="button"
												>
													{loc}
												</button>
											))}
										</div>
									)}
									{data.locationOrder.length > 0 && (
										<DndContext
											sensors={sensors}
											collisionDetection={closestCenter}
											onDragEnd={handleDragEnd}
										>
											<SortableContext
												items={data.locationOrder}
												strategy={verticalListSortingStrategy}
											>
												<div className="flags-location-ordered">
													{data.locationOrder.map((locId, index) => (
														<SortableLocationItem
															key={locId}
															locId={locId}
															position={index + 1}
															showRemove={
																!isFullyAssigned &&
																index === data.locationOrder.length - 1
															}
															onRemove={removeLastLocation}
														/>
													))}
												</div>
											</SortableContext>
										</DndContext>
									)}
									{data.locationOrder.length > 0 && (
										<button
											className="flags-action-btn flags-action-btn--clear"
											onClick={clearLocations}
											type="button"
										>
											Clear All
										</button>
									)}
								</div>
							)}
						</div>

						{/* ── Results ───────────────────────────────────────────── */}
						{clockFull && (
							<div className="flags-results-section">
								<h3 className="flags-results-section__heading">
									Flag Placement
								</h3>
								{data.flagValues.length === 0 && (
									<p className="flags-results-section__prompt">
										Enter flag values above to see which flags to place at each
										position.
									</p>
								)}
								{noSolution && (
									<p className="flags-results-section__no-solution">
										No valid combination found — check your clock numbers and
										flag values.
									</p>
								)}
								<div className="flags-results">
									{POSITION_ICONS.map((Icon, i) => {
										const combo = solution[i];
										const location = data.locationOrder[i] ?? null;
										const isComplete = combo !== null;
										return (
											<div
												key={i}
												className={[
													"flags-result-card",
													isComplete ? "flags-result-card--complete" : "",
												]
													.filter(Boolean)
													.join(" ")}
											>
												<Icon className="flags-result-card__icon" />
												<span className="flags-result-card__combo">
													{formatCombo(combo)}
												</span>
												<span className="flags-result-card__location">
													{location ?? "-----"}
												</span>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default FlagsSection;

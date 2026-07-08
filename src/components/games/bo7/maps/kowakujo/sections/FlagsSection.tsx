import { useState } from "react";
import { useSectionSettings } from "@/hooks/useSectionSettings";
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
	"Outer Ward",
	"Flower Garden",
] as const;

type Location = (typeof LOCATIONS)[number];

// ─── Types ────────────────────────────────────────────────────────────────────

interface FlagsData {
	clockNumbers: (number | null)[];
	flagValues: number[];
	// Display order of the four location cards (drag reorder)
	locationOrder: string[];
	// positionMap[i] = location assigned to position i+1, or "" if empty
	positionMap: string[];
}

const DEFAULT_VALUE: FlagsData = {
	clockNumbers: [null, null, null, null],
	flagValues: [],
	locationOrder: [...LOCATIONS],
	positionMap: ["", "", "", ""],
};

// ─── Solver ───────────────────────────────────────────────────────────────────

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

		for (let i = 0; i < flagValues.length; i++) {
			if (!used[i] && flagValues[i] === target) {
				used[i] = true;
				assignments.push([i]);
				if (backtrack(targetIdx + 1)) return true;
				assignments.pop();
				used[i] = false;
			}
		}

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

// ─── Draggable location card ──────────────────────────────────────────────────

function SortableLocationBox({
	locId,
	assignedPos,
	allAssignedPositions,
	showJapanese,
	onAssign,
}: {
	locId: string;
	assignedPos: number; // 1–4, or 0 if not yet assigned
	allAssignedPositions: Set<number>;
	showJapanese: boolean;
	onAssign: (locId: string, pos: number) => void;
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
				"flags-location-box",
				isDragging ? "flags-location-box--dragging" : "",
			]
				.filter(Boolean)
				.join(" ")}
		>
			<div className="flags-location-box__header">
				<span className="flags-location-box__name">{locId}</span>
				<button
					className="flags-location-box__drag"
					{...attributes}
					{...listeners}
					type="button"
					tabIndex={-1}
					aria-label={`Drag ${locId} to reorder`}
				>
					⋮⋮
				</button>
			</div>
			<div className="flags-location-box__positions">
				{([1, 2, 3, 4] as const).map((pos) => {
					const isActive = assignedPos === pos;
					const isTaken = allAssignedPositions.has(pos) && !isActive;
					return (
						<button
							key={pos}
							className={[
								"flags-position-btn",
								isActive ? "flags-position-btn--active" : "",
							]
								.filter(Boolean)
								.join(" ")}
							disabled={isTaken}
							onClick={() => onAssign(locId, pos)}
							type="button"
						>
							{showJapanese
								? (() => {
										const Icon = POSITION_ICONS[pos - 1];
										return <Icon className="flags-position-btn__icon" />;
									})()
								: pos}
						</button>
					);
				})}
			</div>
		</div>
	);
}

// ─── Section ──────────────────────────────────────────────────────────────────

function FlagsSection(props: BaseSectionProps<FlagsData>) {
	const [locationOpen, setLocationOpen] = useState(false);

	const { getSetting } = useSectionSettings({
		mapId: "kowakujo",
		sectionId: "flags",
		sectionName: "Flags",
		settings: [
			{
				id: "position-labels",
				label: "Position Labels",
				defaultValue: "japanese",
				options: [
					{ value: "japanese", label: "Japanese" },
					{ value: "numbers", label: "Numbers" },
				],
			},
		],
	});
	const showJapanese = getSetting("position-labels", "japanese") !== "numbers";

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
							text: "Interact with the Lantern Clock to trigger it. The hands spin and stop four times — record each hour shown (1–11).",
						},
						{
							label: "Flags",
							text: "After the clock, a defence round spawns zombies carrying flags. Kill them to release wisps. Count the objects depicted on each flag (1–7 per flag).",
						},
						{
							label: "Flag Count",
							nested: [
								{
									text: "Always 6 flags spawn in the staging area.",
								},
								{
									text: "Entering all 6 turns the row green if they form a valid combination.",
								},
								{
									text: "Yellow means fewer than 6 are entered yet, or the 6 entered don't match a valid combination.",
								},
							],
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

				// Normalize display order: always contains all 4 locations
				const displayOrder = (() => {
					const raw = (data.locationOrder ?? []).filter((l) =>
						LOCATIONS.includes(l as Location),
					);
					const missing = LOCATIONS.filter((l) => !raw.includes(l));
					return [...raw, ...missing];
				})();

				// Normalize positionMap: always length 4
				const positionMap = Array.from(
					{ length: 4 },
					(_, i) => (data.positionMap ?? [])[i] ?? "",
				);

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
					if (data.flagValues.length >= 6) return;
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

				const assignLocation = (locId: string, pos: number) => {
					setData((prev) => {
						const pm = Array.from(
							{ length: 4 },
							(_, i) => (prev.positionMap ?? [])[i] ?? "",
						);

						// Toggle: clicking the active position clears it
						if (pm[pos - 1] === locId) {
							pm[pos - 1] = "";
							return { ...prev, positionMap: pm };
						}

						// Remove this loc from any current slot
						const existingIdx = pm.indexOf(locId);
						if (existingIdx !== -1) pm[existingIdx] = "";

						// Assign to the new position
						pm[pos - 1] = locId;

						// Auto-fill: when 3 are assigned, fill the 4th
						const filled = pm.filter(Boolean);
						if (filled.length === 3) {
							const emptyIdx = pm.findIndex((v) => !v);
							const usedSet = new Set(filled);
							const remaining = LOCATIONS.find((l) => !usedSet.has(l));
							if (emptyIdx !== -1 && remaining) pm[emptyIdx] = remaining;
						}

						return { ...prev, positionMap: pm };
					});
				};

				const clearLocations = () => {
					setData((prev) => ({ ...prev, positionMap: ["", "", "", ""] }));
				};

				const handleDragEnd = (event: DragEndEvent) => {
					const { active, over } = event;
					if (!over || active.id === over.id) return;
					const oldIdx = displayOrder.indexOf(active.id as string);
					const newIdx = displayOrder.indexOf(over.id as string);
					if (oldIdx === -1 || newIdx === -1) return;
					setData((prev) => ({
						...prev,
						locationOrder: arrayMove(displayOrder, oldIdx, newIdx),
					}));
				};

				// ── Derived state ───────────────────────────────────────────────

				const solution = solveFlags(data.clockNumbers, data.flagValues);
				const hasSolution = solution[0] !== null;
				const noSolution =
					clockFull && data.flagValues.length > 0 && !hasSolution;
				const flagsValid =
					clockFull && data.flagValues.length === 6 && hasSolution;

				const anyLocationAssigned = positionMap.some(Boolean);

				// Positions already assigned to any location
				const allAssignedPositions = new Set(
					positionMap
						.map((loc, i) => (loc ? i + 1 : null))
						.filter((p): p is number => p !== null),
				);

				// Shared input row targets the clock until it's full, then flags.
				// Undo always removes the single most recent entry across both
				// (flags first since they come after the clock), so it stays
				// available to fix a mistake no matter which phase is active.
				const flagsFull = data.flagValues.length === 6;
				const bothComplete = clockFull && flagsFull;
				const enteringFlags = clockFull;
				const undoFlagsNext = data.flagValues.length > 0;
				const handleUndo = undoFlagsNext ? handleFlagUndo : handleClockUndo;
				const canUndo = undoFlagsNext || clockFilledCount > 0;

				return (
					<div className="flags-section">
						<div className="flags-input-section">
							{/* ── Shared input row (clock, then flags) ─────────────── */}
							<div className="flags-block">
								<h3 className="flags-block__heading">
									{enteringFlags ? "Enter Flag Value" : "Enter Clock Time"}
								</h3>
								<div className="flags-number-row">
									{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => (
										<button
											key={n}
											className="flags-num-btn"
											onClick={() =>
												enteringFlags ? handleFlagInput(n) : handleClockInput(n)
											}
											disabled={bothComplete || (enteringFlags && n > 7)}
											type="button"
										>
											{n}
										</button>
									))}
									<button
										className="flags-action-btn"
										onClick={handleUndo}
										disabled={!canUndo}
										type="button"
									>
										Undo
									</button>
								</div>
							</div>

							{/* ── Results (clock times + flag values) ──────────────── */}
							<div className="flags-results-columns">
								<div className="flags-block">
									<h3 className="flags-block__heading">Clock Times</h3>
									<div className="flags-clock-slots">
										{data.clockNumbers.map((n, i) => (
											<div
												key={i}
												className={[
													"flags-clock-slot",
													n !== null
														? flagsValid
															? "flags-clock-slot--complete"
															: "flags-clock-slot--filled"
														: "flags-clock-slot--empty",
												].join(" ")}
											>
												{n ?? "—"}
											</div>
										))}
									</div>
								</div>

								<div className="flags-block">
									<h3 className="flags-block__heading">
										Flag Values
										<span className="flags-block__subheading">
											{" "}
											- Always 6 flags
										</span>
									</h3>
									<div className="flags-flag-slots">
										{Array.from({ length: 6 }, (_, i) => {
											const v = data.flagValues[i] ?? null;
											return (
												<div
													key={i}
													className={[
														"flags-flag-slot",
														v !== null
															? flagsValid
																? "flags-flag-slot--success"
																: "flags-flag-slot--warning"
															: "flags-flag-slot--empty",
													].join(" ")}
												>
													{v ?? "—"}
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</div>

						{/* ── Location Order (collapsible) ──────────────────────── */}
						<div className="flags-location-panel">
							{/* Toggle row — div, not button, so the clear button can live inside */}
							<div
								className="flags-location-panel__toggle"
								onClick={() => setLocationOpen((v) => !v)}
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ")
										setLocationOpen((v) => !v);
								}}
							>
								<span>Location Order (Optional)</span>
								<div className="flags-location-panel__toggle-end">
									{anyLocationAssigned && (
										<button
											className="flags-location-panel__clear-btn"
											onClick={(e) => {
												e.stopPropagation();
												clearLocations();
											}}
											type="button"
										>
											Clear
										</button>
									)}
									<span
										className={[
											"flags-location-panel__chevron",
											locationOpen ? "flags-location-panel__chevron--open" : "",
										]
											.filter(Boolean)
											.join(" ")}
									>
										▾
									</span>
								</div>
							</div>
							{locationOpen && (
								<div className="flags-location-panel__body">
									<p className="flags-location-panel__hint">
										Tap a number to assign each location to a position. Assign 3
										and the 4th fills automatically. Drag to reorder the cards.
									</p>
									<DndContext
										sensors={sensors}
										collisionDetection={closestCenter}
										onDragEnd={handleDragEnd}
									>
										<SortableContext
											items={displayOrder}
											strategy={rectSortingStrategy}
										>
											<div className="flags-location-list">
												{displayOrder.map((loc) => {
													const assignedPos = positionMap.indexOf(loc) + 1; // 0 = unassigned
													return (
														<SortableLocationBox
															key={loc}
															locId={loc}
															assignedPos={assignedPos}
															allAssignedPositions={allAssignedPositions}
															showJapanese={showJapanese}
															onAssign={assignLocation}
														/>
													);
												})}
											</div>
										</SortableContext>
									</DndContext>
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
										const location = positionMap[i] || null;
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

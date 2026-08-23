import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { ResultsDisplay } from "@/components/ui";
import type { ResultItem } from "@/components/ui/ResultsDisplay";
import { useSectionSettings } from "@/hooks/useSectionSettings";
import RotationArrowIcon from "@/assets/icons/rotation-arrow.svg";

const RotationArrow = RotationArrowIcon as unknown as React.ComponentType<
	React.SVGProps<SVGSVGElement>
>;

type LocationId =
	| "north-totem"
	| "dravakar"
	| "caltheris"
	| "house"
	| "nyxara"
	| "veytherion";

type RingId = "outer" | "middle" | "inner";

type Direction = "clockwise" | "anticlockwise";

interface LocationInfo {
	id: LocationId;
	name: string;
	temple: boolean;
	angle: number; // degrees clockwise from top, for the diagram layout only
}

// Order matches the confirmed clockwise sequence of the 6 physical stops.
// The North Totem and House are resting stops only (northern and southern
// grapple totems) — neither has a temple to power up.
const LOCATIONS: LocationInfo[] = [
	{ id: "north-totem", name: "North Grapple", temple: false, angle: 0 },
	{ id: "dravakar", name: "Dravakar", temple: true, angle: 60 },
	{ id: "caltheris", name: "Caltheris", temple: true, angle: 120 },
	{ id: "house", name: "House", temple: false, angle: 180 },
	{ id: "nyxara", name: "Nyxara", temple: true, angle: 240 },
	{ id: "veytherion", name: "Veytherion", temple: true, angle: 300 },
];

const TEMPLES = LOCATIONS.filter((l) => l.temple);

const locationIndex = (id: LocationId) =>
	LOCATIONS.findIndex((l) => l.id === id);

const RINGS: { id: RingId; name: string; radius: number }[] = [
	{ id: "outer", name: "Outer", radius: 44 },
	{ id: "middle", name: "Middle", radius: 30 },
	{ id: "inner", name: "Inner", radius: 16 },
];

// Pressing a ring's monolith advances it 1 stop and the other two rings 2
// stops each, in whatever direction the nexus core handle is set to. These
// are the pre-computed inverses (mod 6) of that effect, so a target shift
// vector maps directly onto the number of presses needed per ring — verified
// against recorded in-game move tables for all three monoliths.
const CW_SOLVE_MATRIX = [
	[3, 4, 4],
	[4, 3, 4],
	[4, 4, 3],
];
const CCW_SOLVE_MATRIX = [
	[3, 2, 2],
	[2, 3, 2],
	[2, 2, 3],
];

const mod6 = (n: number) => ((n % 6) + 6) % 6;

function solvePresses(
	direction: Direction,
	startIndices: [number, number, number],
	targetIndex: number,
): [number, number, number] {
	const shifts = startIndices.map((s) => mod6(targetIndex - s));
	const matrix = direction === "clockwise" ? CW_SOLVE_MATRIX : CCW_SOLVE_MATRIX;
	return matrix.map((row) =>
		mod6(row[0] * shifts[0] + row[1] * shifts[1] + row[2] * shifts[2]),
	) as [number, number, number];
}

const PRESS_SECONDS = 15;
const NEXUS_CORE_TRAVEL_SECONDS = 5;

// The handle can't be touched while a monolith is still physically rotating.
// If the switch happens right after a press — which it always does whenever
// there's a phase1 — the player only gets a `NEXUS_CORE_TRAVEL_SECONDS` head
// start on that press's rotation before they arrive, so they wait out
// whatever's left of it before they can actually flip the handle.
const DIRECTION_SWITCH_SECONDS = NEXUS_CORE_TRAVEL_SECONDS * 2;
const DIRECTION_SWITCH_WITH_WAIT_SECONDS =
	NEXUS_CORE_TRAVEL_SECONDS +
	Math.max(0, PRESS_SECONDS - NEXUS_CORE_TRAVEL_SECONDS) +
	NEXUS_CORE_TRAVEL_SECONDS;

const directionLabel = (d: Direction) =>
	d === "clockwise" ? "Clockwise" : "Anti-clockwise";
const otherDirectionOf = (d: Direction): Direction =>
	d === "clockwise" ? "anticlockwise" : "clockwise";

interface RingPressStep {
	ring: RingId;
	ringName: string;
	count: number;
}

// For each ring independently, pressing it in the CURRENT direction costs
// `stayCount` presses; pressing it after switching costs `(6 - stayCount)
// mod 6` presses instead (proven below). Since each ring's press count is
// governed by an independent scalar equation, picking whichever is cheaper
// per ring — rather than committing the whole sequence to one direction —
// is always optimal, and never needs more than a single switch:
//
//   Pure-direction totals are M·x = S (mod 6) for presses x in one
//   direction. Splitting presses across a switch gives M·x - M·y = S, i.e.
//   M·(x-y) = S, which (since M is invertible mod 6) has a UNIQUE solution
//   (x-y) = M⁻¹·S — the same vector as the pure-direction solve. That means
//   each ring's own x_i - y_i is fixed independently of the others, so the
//   minimum x_i + y_i for that ring is min(stayCount, 6 - stayCount), chosen
//   per ring with no interaction between rings. A second switch could only
//   ever re-open a choice already made optimally the first time.
function computeMixedPlan(
	startIndices: [number, number, number],
	targetIndex: number,
	currentDirection: Direction,
	allowSwitch: boolean,
) {
	const stayCounts = solvePresses(currentDirection, startIndices, targetIndex);
	const otherDirection = otherDirectionOf(currentDirection);

	const phase1: RingPressStep[] = [];
	const phase2: RingPressStep[] = [];

	RINGS.forEach((ring, idx) => {
		const stayCount = stayCounts[idx];
		const switchCount = mod6(6 - stayCount);
		if (allowSwitch && switchCount < stayCount) {
			phase2.push({ ring: ring.id, ringName: ring.name, count: switchCount });
		} else {
			phase1.push({ ring: ring.id, ringName: ring.name, count: stayCount });
		}
	});

	const usesSwitch = phase2.length > 0;
	const phase1Presses = phase1.reduce((sum, p) => sum + p.count, 0);
	const phase2Presses = phase2.reduce((sum, p) => sum + p.count, 0);
	const totalPresses = phase1Presses + phase2Presses;

	// Travel to the nexus core starts the instant the last phase1 press is
	// made, overlapping with that press's own settle time — so it only ever
	// costs the REMAINING settle time (folded into the switch cost below),
	// not a fresh PRESS_SECONDS on top of it. Any EARLIER phase1 presses
	// still have to fully settle before the next one can happen, so only
	// those pay the full PRESS_SECONDS each. A ring can land in phase1 with
	// a count of 0 (already at the target either direction), which isn't a
	// real press — checking `phase1Presses` (not `phase1.length`) is what
	// decides whether there's a press to overlap the switch with.
	let totalTimeSeconds: number;
	if (usesSwitch) {
		const switchCost =
			phase1Presses > 0
				? DIRECTION_SWITCH_WITH_WAIT_SECONDS
				: DIRECTION_SWITCH_SECONDS;
		const priorPhase1Cost =
			phase1Presses > 0 ? (phase1Presses - 1) * PRESS_SECONDS : 0;
		totalTimeSeconds =
			priorPhase1Cost + switchCost + phase2Presses * PRESS_SECONDS;
	} else {
		totalTimeSeconds = totalPresses * PRESS_SECONDS;
	}

	return {
		phase1,
		phase2,
		otherDirection,
		usesSwitch,
		totalPresses,
		totalTimeSeconds,
	};
}

function radialStyle(angleDeg: number, radiusPercent: number) {
	const rad = (angleDeg * Math.PI) / 180;
	return {
		left: `${50 + radiusPercent * Math.sin(rad)}%`,
		top: `${50 - radiusPercent * Math.cos(rad)}%`,
	};
}

// Anchors label text away from the circle instead of centering it on the
// point, so it doesn't collide with the ring marker sitting just inside it
// on the same radial line.
function labelStyle(angleDeg: number, radiusPercent: number) {
	const rad = (angleDeg * Math.PI) / 180;
	const sin = Math.sin(rad);
	const cos = Math.cos(rad);
	const base = radialStyle(angleDeg, radiusPercent);

	if (Math.abs(sin) > 0.3) {
		return {
			...base,
			transform:
				sin > 0 ? "translate(6px, -50%)" : "translate(calc(-100% - 6px), -50%)",
		};
	}
	return {
		...base,
		transform:
			cos > 0 ? "translate(-50%, calc(-100% - 4px))" : "translate(-50%, 4px)",
	};
}

// The source icon (rotation-arrow.svg) is drawn bulging right with its
// arrowhead pointing up — i.e. a "right side, anti-clockwise" tangent, since
// clockwise motion points downward on the right of a circle and upward on
// the left. The other three side/direction combos are CSS flips of that one
// drawing: right+CW flips vertically (arrow now points down), left+CW flips
// horizontally (bulges left, arrow still up), left+ACW flips both (bulges
// left, arrow down).
function DirectionArrow({
	side,
	direction,
}: {
	side: "left" | "right";
	direction: Direction;
}) {
	// Combined with the CSS vertical centering, since an inline `transform`
	// replaces the stylesheet's value entirely rather than composing with it.
	const flip =
		side === "right"
			? direction === "clockwise"
				? " scaleY(-1)"
				: ""
			: direction === "clockwise"
				? " scaleX(-1)"
				: " scale(-1, -1)";

	return (
		<RotationArrow
			className={`nexus-forge-direction-arrow nexus-forge-direction-arrow--${side}`}
			style={{ transform: `translateY(-50%)${flip}` }}
			aria-hidden="true"
		/>
	);
}

interface NexusForgeData {
	outer: LocationId | null;
	middle: LocationId | null;
	inner: LocationId | null;
	target: LocationId | null;
	direction: Direction;
	completedTemples: LocationId[];
}

// The pillars always start here once the Nexus Forge is activated, so
// pre-fill them rather than making players set the same starting state every
// game — they only need to pick a target and confirm their direction.
const DEFAULT_VALUE: NexusForgeData = {
	outer: "north-totem",
	middle: "dravakar",
	inner: "caltheris",
	target: "dravakar",
	direction: "anticlockwise",
	completedTemples: [],
};

function NexusForgeSection(props: BaseSectionProps<NexusForgeData>) {
	const { getSetting } = useSectionSettings({
		mapId: "rex-infernus",
		sectionId: "nexus-forge",
		sectionName: "Nexus Forge",
		settings: [
			{
				id: "direction-switching",
				label: "Direction Switching",
				defaultValue: "include",
				options: [
					{ value: "include", label: "Include switches" },
					{ value: "exclude", label: "Single direction only" },
				],
				note: "Whether the solution can suggest switching the nexus handle partway through for a faster overall solve.",
			},
		],
	});
	const allowSwitch =
		getSetting("direction-switching", "include") === "include";

	return (
		<BaseSection
			config={{
				storageKey: "rex-infernus-nexus-forge-data",
				defaultValue: DEFAULT_VALUE,
				title: "Nexus Forge",
				description:
					"Using starting positions, rotation direction and a target, the solver calculates the interactions for each monolith.",
				resetButtonText: "Clear",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Starting Positions",
							text: "The pillars always start at Outer: North Grapple, Middle: Dravakar, Inner: Caltheris once the Nexus Forge is activated — already set below by default.",
						},
						{
							label: "Monolith Handles",
							text: "Interacting with a ring's monolith always advances that ring 1 stop and the other two rings 2 stops each, in the current nexus direction.",
						},
						{
							label: "Nexus Direction",
							text: "The handle in the nexus core sets the direction: pointing toward the centre moves everything clockwise, pointing away moves everything anti-clockwise. A successful first-time activation will set the Nexus Direction to Anti-clockwise.",
						},
						{
							label: "Timing",
							text: "Each monolith press takes about 15s to settle. Switching direction takes about 10s (5s down to the nexus core, 5s back) if nothing's mid-rotation — but you can't touch the handle while a monolith is turning, so if you switch right after a press it's closer to 20s: 5s down, then waiting out the rest of that rotation, then 5s back.",
						},
						{
							label: "Mid-Sequence Switching",
							text: "The solution below is always based on your current direction. If it's faster to press some monoliths now and the rest after switching, it'll tell you exactly which ones go in each step — otherwise it'll say no switch is needed. Turn this off in the settings widget if you'd rather always stick to a single direction.",
						},
						{
							label: "Fastest Temple",
							text: "Each temple button shows its fastest achievable time from the rings' current positions, with the cheapest one tagged. This updates as you go, so it stays accurate for your second and third temple too, not just the first.",
						},
						{
							label: "After You've Powered a Temple",
							text: 'Once you\'ve done the real interactions in-game, tap "Mark rings at [temple]" to update the diagram to match — quicker than clicking all three rings by hand, and it automatically selects the next fastest temple as your new target.',
						},
						{
							label: "Tracking Completed Temples",
							text: 'A temple is marked done automatically the moment you use "Mark rings at [temple]" for it. You can also tap the circle on any temple button to mark or unmark it by hand. Completed temples are excluded from the Fastest suggestion, even if the rings later pass back through 0s there.',
						},
						{
							label: "Fastest Route",
							text: "Dravakar → Caltheris → Nyxara → Veytherion assuming default start positions and direction changes are followed.",
						},
					],
				},
			}}
			getProgress={(data: NexusForgeData) => {
				const completed = (data.completedTemples ?? []).length;
				return {
					completed,
					total: TEMPLES.length,
					isComplete: completed === TEMPLES.length,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const setRing = (ring: RingId, id: LocationId) =>
					setData({ ...data, [ring]: id });

				const completedTemples = data.completedTemples ?? [];
				const isCompleted = (id: LocationId) => completedTemples.includes(id);
				const toggleCompleted = (id: LocationId) => {
					const wasDone = isCompleted(id);
					setData({
						...data,
						completedTemples: wasDone
							? completedTemples.filter((t) => t !== id)
							: [...completedTemples, id],
						// Un-marking means the player wants to revisit this temple,
						// so point the picker at it — otherwise it'd stay parked on
						// whatever was last completed and the solution panel would
						// keep showing that instead of the temple just reopened.
						target: wasDone ? id : data.target,
					});
				};

				// Ring positions always have a value (defaulted), so only the
				// target is ever genuinely unset.
				const ringStartIndices: [number, number, number] = [
					locationIndex(data.outer as LocationId),
					locationIndex(data.middle as LocationId),
					locationIndex(data.inner as LocationId),
				];
				const targetIdx = data.target ? locationIndex(data.target) : null;

				// The real starting direction isn't a free choice — it's whatever
				// the handle physically points to — so `computeMixedPlan` anchored
				// to it is already the true optimum: it discovers "switch before
				// pressing anything" on its own (as an empty phase1) whenever
				// that's genuinely cheapest, with the switch cost correctly
				// charged. There's no separate "what if I'd started the other way"
				// case worth computing — a parallel plan anchored to the other
				// direction always either matches this one or, whenever the two
				// disagree, undercounts by exactly one switch cost, because it
				// treats that direction as free to already be in.
				const plan =
					targetIdx !== null
						? computeMixedPlan(
								ringStartIndices,
								targetIdx,
								data.direction,
								allowSwitch,
							)
						: null;

				// From the CURRENT ring positions (not a fixed default), work out
				// the fastest achievable time to each temple, so the picker can
				// flag the best next temple even after the player has already
				// moved on from an earlier one.
				const templeTimes = TEMPLES.map((temple) => {
					const idx = locationIndex(temple.id);
					const { totalTimeSeconds } = computeMixedPlan(
						ringStartIndices,
						idx,
						data.direction,
						allowSwitch,
					);
					return { id: temple.id, timeSeconds: totalTimeSeconds };
				});
				// 0s means the rings are already sitting there, and a completed
				// temple doesn't need revisiting — neither is a useful "go here
				// next" suggestion, so both are excluded from Fastest eligibility.
				const eligibleTimes = templeTimes
					.filter((t) => t.timeSeconds > 0 && !isCompleted(t.id))
					.map((t) => t.timeSeconds);
				const fastestTimeSeconds =
					eligibleTimes.length > 0 ? Math.min(...eligibleTimes) : null;

				const targetTemple = TEMPLES.find((t) => t.id === data.target);
				const ringsAtTarget =
					data.target !== null &&
					data.outer === data.target &&
					data.middle === data.target &&
					data.inner === data.target;

				// Moves the rings to the target temple (and flips the direction
				// too, if the solution called for a switch), marks it complete,
				// then immediately re-runs the fastest-temple search from that new
				// state so the picker jumps straight to the next real move instead
				// of leaving the player to work it out by hand.
				const markRingsAtTarget = () => {
					if (!data.target || !plan) return;
					const newDirection = plan.usesSwitch
						? plan.otherDirection
						: data.direction;
					const newCompletedTemples = [
						...completedTemples.filter((t) => t !== data.target),
						data.target,
					];
					const newRingIndex = locationIndex(data.target);
					const newRingIndices: [number, number, number] = [
						newRingIndex,
						newRingIndex,
						newRingIndex,
					];

					const nextTimes = TEMPLES.map((temple) => {
						const idx = locationIndex(temple.id);
						const { totalTimeSeconds } = computeMixedPlan(
							newRingIndices,
							idx,
							newDirection,
							allowSwitch,
						);
						return { id: temple.id, timeSeconds: totalTimeSeconds };
					});
					const nextFastest = nextTimes
						.filter(
							(t) => t.timeSeconds > 0 && !newCompletedTemples.includes(t.id),
						)
						.reduce<{ id: LocationId; timeSeconds: number } | null>(
							(best, t) =>
								!best || t.timeSeconds < best.timeSeconds ? t : best,
							null,
						);

					setData({
						...data,
						outer: data.target,
						middle: data.target,
						inner: data.target,
						direction: newDirection,
						completedTemples: newCompletedTemples,
						target: nextFastest ? nextFastest.id : data.target,
					});
				};

				const placeholderResults: ResultItem[] = [
					{
						id: "outer",
						value: "----",
						label: "Outer Monolith",
						status: "pending",
					},
					{
						id: "middle",
						value: "----",
						label: "Middle Monolith",
						status: "pending",
					},
					{
						id: "inner",
						value: "----",
						label: "Inner Monolith",
						status: "pending",
					},
				];

				return (
					<div className="nexus-forge-section">
						<div className="nexus-forge-top-row">
							<div className="nexus-forge-diagram">
								<DirectionArrow side="left" direction={data.direction} />
								<DirectionArrow side="right" direction={data.direction} />

								<div className="nexus-forge-diagram__center">
									Nexus
									<br />
									Forge
								</div>

								{LOCATIONS.map((loc) => (
									<div
										key={loc.id}
										className={[
											"nexus-forge-diagram__label",
											loc.temple ? "" : "nexus-forge-diagram__label--totem",
										]
											.filter(Boolean)
											.join(" ")}
										style={labelStyle(loc.angle, 50)}
									>
										{loc.name}
									</div>
								))}

								{RINGS.map((ring) => (
									<div
										key={ring.id}
										className={`nexus-forge-ring nexus-forge-ring--${ring.id}`}
									>
										<div
											className="nexus-forge-ring__track"
											style={{
												width: `${ring.radius * 2}%`,
												height: `${ring.radius * 2}%`,
											}}
										/>
										{LOCATIONS.map((loc) => (
											<button
												key={loc.id}
												type="button"
												className={[
													"nexus-forge-ring__marker",
													data[ring.id] === loc.id
														? "nexus-forge-ring__marker--active"
														: "",
												]
													.filter(Boolean)
													.join(" ")}
												style={radialStyle(loc.angle, ring.radius)}
												onClick={() => setRing(ring.id, loc.id)}
												aria-label={`Set ${ring.name} ring to ${loc.name}`}
											>
												{ring.name[0]}
											</button>
										))}
									</div>
								))}
							</div>

							<div className="nexus-forge-target-picker">
								<h3 className="nexus-forge-target-picker__title">
									Target Temple
								</h3>
								<p className="nexus-forge-target-picker__hint">
									Times shown are the fastest achievable from where the rings
									are right now.
								</p>
								<div className="nexus-forge-target-picker__buttons">
									{TEMPLES.map((temple) => {
										const time = templeTimes.find((t) => t.id === temple.id)!;
										const isFastest = time.timeSeconds === fastestTimeSeconds;
										const done = isCompleted(temple.id);
										return (
											<button
												key={temple.id}
												type="button"
												className={[
													"nexus-forge-target-btn",
													isFastest ? "nexus-forge-target-btn--fastest" : "",
													done ? "nexus-forge-target-btn--completed" : "",
													data.target === temple.id
														? "nexus-forge-target-btn--selected"
														: "",
												]
													.filter(Boolean)
													.join(" ")}
												onClick={() => setData({ ...data, target: temple.id })}
											>
												<span
													className={[
														"nexus-forge-target-btn__check",
														done ? "nexus-forge-target-btn__check--done" : "",
													]
														.filter(Boolean)
														.join(" ")}
													onClick={(e) => {
														e.stopPropagation();
														toggleCompleted(temple.id);
													}}
													aria-label={
														done
															? `Mark ${temple.name} as not completed`
															: `Mark ${temple.name} as completed`
													}
												>
													{done ? "✓" : ""}
												</span>
												<span className="nexus-forge-target-btn__name">
													{temple.name}
												</span>
												<span className="nexus-forge-target-btn__time">
													{done ? (
														"Done"
													) : (
														<>
															{isFastest && (
																<span className="nexus-forge-target-btn__badge">
																	Fastest
																</span>
															)}
															~{time.timeSeconds}s
														</>
													)}
												</span>
											</button>
										);
									})}
								</div>
							</div>

							<div className="nexus-forge-direction-toggle">
								<h3 className="nexus-forge-direction-toggle__title">
									Current Nexus Direction
								</h3>
								<div className="nexus-forge-direction-toggle__buttons">
									<button
										type="button"
										className={[
											"nexus-forge-direction-btn",
											data.direction === "anticlockwise"
												? "nexus-forge-direction-btn--selected"
												: "",
										]
											.filter(Boolean)
											.join(" ")}
										onClick={() =>
											setData({ ...data, direction: "anticlockwise" })
										}
									>
										Anti-clockwise
									</button>
									<button
										type="button"
										className={[
											"nexus-forge-direction-btn",
											data.direction === "clockwise"
												? "nexus-forge-direction-btn--selected"
												: "",
										]
											.filter(Boolean)
											.join(" ")}
										onClick={() => setData({ ...data, direction: "clockwise" })}
									>
										Clockwise
									</button>
								</div>
								<p className="nexus-forge-direction-toggle__hint">
									Anticlockwise: the handle points towards the cogs in the Nexus
									Core. Clockwise: the handle points to the centre of the room.
								</p>
							</div>
						</div>

						{plan ? (
							<div className="nexus-forge-solution">
								<h3 className="nexus-forge-solution__title">
									Monolith Solution
								</h3>

								{/* One row of boxes — the ring presses plus, only when a
									switch is needed, one more box for it. A ring that needs 0
									presses isn't an action the player has to take, so it's
									left out entirely rather than shown as an empty "0x" box.
									When NOTHING needs pressing (rings are already sitting on
									the target), skip the row — and the press-count line below
									it — entirely rather than rendering an empty green box.
									Always the same style in both standard and compact mode;
									only the box sizing (below, via CSS) changes between them. */}
								{(() => {
									const visiblePhase1 = plan.phase1.filter(
										(step) => step.count > 0,
									);
									const visibleCount =
										visiblePhase1.length +
										(plan.usesSwitch ? 1 : 0) +
										plan.phase2.length;
									if (visibleCount === 0) return null;

									return (
										<>
											<div
												className="nexus-forge-solution__results"
												style={{
													gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
												}}
											>
												{visiblePhase1.map((step) => (
													<div
														key={step.ring}
														className="nexus-forge-solution__result-cell"
													>
														<span className="nexus-forge-solution__result-value">
															{step.count}x
														</span>
														<span className="nexus-forge-solution__result-label">
															{step.ringName}
														</span>
													</div>
												))}
												{plan.usesSwitch && (
													<div
														className="nexus-forge-solution__result-cell nexus-forge-solution__result-cell--switch"
														title={`Switch the nexus handle to ${directionLabel(plan.otherDirection)}`}
													>
														<span className="nexus-forge-solution__result-value">
															⟳
														</span>
														<span className="nexus-forge-solution__result-label">
															Switch to {directionLabel(plan.otherDirection)}
														</span>
													</div>
												)}
												{plan.phase2.map((step) => (
													<div
														key={step.ring}
														className="nexus-forge-solution__result-cell"
													>
														<span className="nexus-forge-solution__result-value">
															{step.count}x
														</span>
														<span className="nexus-forge-solution__result-label">
															{step.ringName}
														</span>
													</div>
												))}
											</div>

											<p className="nexus-forge-solution__total">
												{plan.totalPresses} press
												{plan.totalPresses === 1 ? "" : "es"}
												{plan.usesSwitch ? " + 1 direction switch" : ""} — about{" "}
												{plan.totalTimeSeconds}s total.
											</p>
										</>
									);
								})()}

								{ringsAtTarget ? (
									<p className="nexus-forge-solution__done">
										✓ All rings are at {targetTemple?.name}.
									</p>
								) : (
									<button
										type="button"
										className="nexus-forge-solution__mark-done"
										onClick={markRingsAtTarget}
									>
										{plan.usesSwitch
											? `Confirm direction change & mark rings at ${targetTemple?.name}`
											: `Mark rings at ${targetTemple?.name}`}
									</button>
								)}
							</div>
						) : (
							<ResultsDisplay
								variant="grid"
								title="Monolith Solution"
								description="Interact with each monolith handle this many times:"
								results={placeholderResults}
								gridColumns={3}
								colorScheme="accent"
							/>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default NexusForgeSection;

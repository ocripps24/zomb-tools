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
	const totalPresses = [...phase1, ...phase2].reduce(
		(sum, p) => sum + p.count,
		0,
	);
	// No wait if the switch is the very first action (nothing's rotating
	// yet); otherwise it follows straight on from phase1's last press, so
	// the handle isn't reachable until that rotation finishes.
	const switchCost = usesSwitch
		? phase1.length > 0
			? DIRECTION_SWITCH_WITH_WAIT_SECONDS
			: DIRECTION_SWITCH_SECONDS
		: 0;
	const totalTimeSeconds = totalPresses * PRESS_SECONDS + switchCost;

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
}

// The pillars always start here once the Nexus Forge is activated, so
// pre-fill them rather than making players set the same starting state every
// game — they only need to pick a target and confirm their direction.
const DEFAULT_VALUE: NexusForgeData = {
	outer: "north-totem",
	middle: "dravakar",
	inner: "caltheris",
	target: null,
	direction: "anticlockwise",
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
							text: 'Once you\'ve done the real interactions in-game, tap "Mark rings at [temple]" to update the diagram to match — quicker than clicking all three rings by hand, and it immediately recalculates the fastest next temple.',
						},
					],
				},
			}}
			getProgress={(data: NexusForgeData) => {
				const fields = [data.outer, data.middle, data.inner, data.target];
				const completed = fields.filter(Boolean).length;
				return { completed, total: fields.length, isComplete: completed === 4 };
			}}
			{...props}
		>
			{({ data, setData }) => {
				const setRing = (ring: RingId, id: LocationId) =>
					setData({ ...data, [ring]: id });

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
				const fastestTimeSeconds = Math.min(
					...templeTimes.map((t) => t.timeSeconds),
				);

				const targetTemple = TEMPLES.find((t) => t.id === data.target);
				const ringsAtTarget =
					data.target !== null &&
					data.outer === data.target &&
					data.middle === data.target &&
					data.inner === data.target;

				const toResultItems = (steps: RingPressStep[]): ResultItem[] =>
					steps.map((step) => ({
						id: step.ring,
						value: `${step.count}x`,
						label: `${step.ringName} Monolith`,
						status: "complete",
					}));

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
										return (
											<button
												key={temple.id}
												type="button"
												className={[
													"nexus-forge-target-btn",
													isFastest ? "nexus-forge-target-btn--fastest" : "",
													data.target === temple.id
														? "nexus-forge-target-btn--selected"
														: "",
												]
													.filter(Boolean)
													.join(" ")}
												onClick={() => setData({ ...data, target: temple.id })}
											>
												<span className="nexus-forge-target-btn__name">
													{temple.name}
												</span>
												<span className="nexus-forge-target-btn__time">
													{isFastest && (
														<span className="nexus-forge-target-btn__badge">
															Fastest
														</span>
													)}
													~{time.timeSeconds}s
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

								{plan.phase1.length > 0 && (
									<>
										<h4 className="nexus-forge-solution__phase-title">
											Direction: Now — {directionLabel(data.direction)}{" "}
											(current)
										</h4>
										<ResultsDisplay
											variant="grid"
											results={toResultItems(plan.phase1)}
											gridColumns={plan.phase1.length}
											colorScheme="accent"
										/>
									</>
								)}

								{plan.usesSwitch && (
									<>
										<div className="nexus-forge-solution__switch-step">
											⟳ {plan.phase1.length > 0 ? "Then switch" : "Switch"} the
											nexus handle to {directionLabel(plan.otherDirection)}
										</div>
										<h4 className="nexus-forge-solution__phase-title">
											Direction: After switching —{" "}
											{directionLabel(plan.otherDirection)}
										</h4>
										<ResultsDisplay
											variant="grid"
											results={toResultItems(plan.phase2)}
											gridColumns={plan.phase2.length}
											colorScheme="accent"
										/>
									</>
								)}

								<p className="nexus-forge-solution__total">
									{plan.totalPresses} press{plan.totalPresses === 1 ? "" : "es"}
									{plan.usesSwitch ? " + 1 direction switch" : ""} — about{" "}
									{plan.totalTimeSeconds}s total.
								</p>

								{ringsAtTarget ? (
									<p className="nexus-forge-solution__done">
										✓ All rings are at {targetTemple?.name}.
									</p>
								) : (
									<button
										type="button"
										className="nexus-forge-solution__mark-done"
										onClick={() =>
											setData({
												...data,
												outer: data.target,
												middle: data.target,
												inner: data.target,
											})
										}
									>
										Mark rings at {targetTemple?.name}
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

import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// ─── Types ────────────────────────────────────────────────────────────────────

type Cell = 0 | 1;
type Grid = Cell[][];

interface NeilHackData {
	grid: Grid;
	isFirstTime: boolean;
}

const GRID_SIZE = 4;
const SWITCH_COUNT = GRID_SIZE * GRID_SIZE;

const DEFAULT_VALUE: NeilHackData = {
	grid: Array.from({ length: GRID_SIZE }, () =>
		Array.from({ length: GRID_SIZE }, () => 0 as Cell),
	),
	isFirstTime: true,
};

// ─── Switch/light model ─────────────────────────────────────────────────────
//
// Switches are numbered 1-16 in reading order:
//   1  2  3  4
//   5  6  7  8
//   9  10 11 12
//   13 14 15 16
//
// Pressing a switch flips itself plus a fixed set of 8 other lights. This
// mapping was derived from in-game testing (not a simple "toggle neighbors"
// rule), so it's kept as an explicit lookup rather than a formula.
const SWITCH_LIGHTS: Record<number, number[]> = {
	1: [1, 2, 4, 6, 8, 10, 12, 14, 16],
	5: [5, 2, 4, 6, 8, 10, 12, 14, 16],
	9: [9, 2, 4, 6, 8, 10, 12, 14, 16],
	13: [13, 2, 4, 6, 8, 10, 12, 14, 16],

	2: [2, 1, 4, 6, 7, 10, 11, 13, 16],
	3: [3, 1, 4, 6, 7, 10, 11, 13, 16],
	14: [14, 1, 4, 6, 7, 10, 11, 13, 16],
	15: [15, 1, 4, 6, 7, 10, 11, 13, 16],

	6: [6, 2, 3, 5, 8, 9, 12, 14, 15],
	7: [7, 2, 3, 5, 8, 9, 12, 14, 15],
	10: [10, 2, 3, 5, 8, 9, 12, 14, 15],
	11: [11, 2, 3, 5, 8, 9, 12, 14, 15],

	4: [4, 1, 3, 5, 7, 9, 11, 13, 15],
	8: [8, 1, 3, 5, 7, 9, 11, 13, 15],
	12: [12, 1, 3, 5, 7, 9, 11, 13, 15],
	16: [16, 1, 3, 5, 7, 9, 11, 13, 15],
};

// matrix[light][switch] = 1 when that switch flips that light (0-indexed).
function buildSwitchMatrix(): number[][] {
	const matrix = Array.from({ length: SWITCH_COUNT }, () =>
		Array(SWITCH_COUNT).fill(0),
	);
	for (let switchNumber = 1; switchNumber <= SWITCH_COUNT; switchNumber++) {
		for (const lightNumber of SWITCH_LIGHTS[switchNumber]) {
			matrix[lightNumber - 1][switchNumber - 1] = 1;
		}
	}
	return matrix;
}

const SWITCH_MATRIX = buildSwitchMatrix();

// ─── GF(2) linear solver ─────────────────────────────────────────────────────
//
// Reduces A*x = target to reduced row-echelon form over GF(2), then
// enumerates every assignment of the free (non-pivot) variables to find the
// solution with the fewest presses. The switch matrix isn't full rank (e.g.
// switches 1/5/9/13 each flip the same other 8 lights), so free variables
// exist and minimizing over them actually matters here.

interface ReducedSystem {
	matrix: number[][];
	target: number[];
	pivotColumns: number[];
}

function rowReduce(matrix: number[][], target: number[]): ReducedSystem {
	const rows = matrix.length;
	const cols = matrix[0].length;
	const reduced = matrix.map((row) => [...row]);
	const result = [...target];
	const pivotColumns: number[] = [];
	let pivotRow = 0;

	for (let col = 0; col < cols && pivotRow < rows; col++) {
		let selected = -1;
		for (let row = pivotRow; row < rows; row++) {
			if (reduced[row][col] === 1) {
				selected = row;
				break;
			}
		}
		if (selected === -1) continue;

		[reduced[pivotRow], reduced[selected]] = [
			reduced[selected],
			reduced[pivotRow],
		];
		[result[pivotRow], result[selected]] = [result[selected], result[pivotRow]];

		for (let row = 0; row < rows; row++) {
			if (row !== pivotRow && reduced[row][col] === 1) {
				for (let c = col; c < cols; c++) {
					reduced[row][c] ^= reduced[pivotRow][c];
				}
				result[row] ^= result[pivotRow];
			}
		}

		pivotColumns.push(col);
		pivotRow++;
	}

	return { matrix: reduced, target: result, pivotColumns };
}

function systemIsConsistent(matrix: number[][], target: number[]): boolean {
	return matrix.every((row, i) => row.some((v) => v === 1) || target[i] === 0);
}

function solutionForFreeValues(
	matrix: number[][],
	target: number[],
	pivotColumns: number[],
	freeColumns: number[],
	freeValuesMask: number,
): number[] {
	const solution = Array(SWITCH_COUNT).fill(0);
	freeColumns.forEach((col, index) => {
		solution[col] = (freeValuesMask >> index) & 1;
	});
	pivotColumns.forEach((pivotCol, row) => {
		let value = target[row];
		for (const freeCol of freeColumns) {
			if (matrix[row][freeCol] === 1) value ^= solution[freeCol];
		}
		solution[pivotCol] = value;
	});
	return solution;
}

// Returns the minimum-size set of switches (1-16) that brings every light to
// `target`, or null if that target is unreachable from this initial state.
function minimumSwitches(initial: number[], target: 0 | 1): number[] | null {
	const requiredFlips = initial.map((v) => v ^ target);
	const {
		matrix,
		target: reducedTarget,
		pivotColumns,
	} = rowReduce(SWITCH_MATRIX, requiredFlips);

	if (!systemIsConsistent(matrix, reducedTarget)) return null;

	const freeColumns = Array.from({ length: SWITCH_COUNT }, (_, i) => i).filter(
		(col) => !pivotColumns.includes(col),
	);

	let best: number[] | null = null;
	let bestCount = SWITCH_COUNT + 1;

	const totalMasks = 1 << freeColumns.length;
	for (let mask = 0; mask < totalMasks; mask++) {
		const solution = solutionForFreeValues(
			matrix,
			reducedTarget,
			pivotColumns,
			freeColumns,
			mask,
		);
		const count = solution.reduce((sum, v) => sum + v, 0);
		if (count < bestCount) {
			best = solution;
			bestCount = count;
		}
	}

	if (!best) return null;
	return best.flatMap((pressed, index) => (pressed ? [index + 1] : []));
}

// Solves for both all-off and all-on, and returns whichever needs fewer
// presses (speedrun-friendly: always the fastest path to a solved panel).
function solveFastest(
	grid: Grid,
): { target: 0 | 1; switches: number[] } | null {
	const flat = grid.flat();
	const offSwitches = minimumSwitches(flat, 0);
	const onSwitches = minimumSwitches(flat, 1);

	if (offSwitches && onSwitches) {
		return offSwitches.length <= onSwitches.length
			? { target: 0, switches: offSwitches }
			: { target: 1, switches: onSwitches };
	}
	if (offSwitches) return { target: 0, switches: offSwitches };
	if (onSwitches) return { target: 1, switches: onSwitches };
	return null;
}

// On redo attempts the switch mapping is reset to an unknown layout, so the
// exact GF(2) solve above can't be computed. The community-verified fallback
// is to press every switch of one orientation (all currently-vertical, or
// all currently-horizontal) — either group is guaranteed to align the panel,
// so we recommend whichever group is smaller.
function solveGeneric(grid: Grid): number[] {
	const flat = grid.flat();
	const horizontalSwitches = flat.flatMap((v, i) => (v === 0 ? [i + 1] : []));
	const verticalSwitches = flat.flatMap((v, i) => (v === 1 ? [i + 1] : []));
	return horizontalSwitches.length <= verticalSwitches.length
		? horizontalSwitches
		: verticalSwitches;
}

// ─── Grids ────────────────────────────────────────────────────────────────────

interface InputGridProps {
	grid: Grid;
	onToggle: (row: number, col: number) => void;
}

function InputGrid({ grid, onToggle }: InputGridProps) {
	return (
		<div className="bfb-neil-hack-grid">
			{grid.map((row, rowIndex) =>
				row.map((cell, colIndex) => {
					const isOn = cell === 1;
					return (
						<button
							key={`${rowIndex}-${colIndex}`}
							type="button"
							className={`bfb-neil-hack-cell ${isOn ? "bfb-neil-hack-cell--on" : ""}`.trim()}
							onClick={() => onToggle(rowIndex, colIndex)}
							aria-pressed={isOn}
							aria-label={`Switch ${rowIndex * GRID_SIZE + colIndex + 1}, ${isOn ? "vertical" : "horizontal"}`}
						>
							<span
								className={`bfb-neil-hack-cell__line bfb-neil-hack-cell__line--${isOn ? "vertical" : "horizontal"}`}
							/>
						</button>
					);
				}),
			)}
		</div>
	);
}

interface SolutionGridProps {
	pressSet: Set<number>;
}

function SolutionGrid({ pressSet }: SolutionGridProps) {
	return (
		<div className="bfb-neil-hack-grid bfb-neil-hack-grid--readonly">
			{Array.from({ length: SWITCH_COUNT }, (_, i) => {
				const switchNumber = i + 1;
				const shouldPress = pressSet.has(switchNumber);
				return (
					<div
						key={switchNumber}
						className={`bfb-neil-hack-cell bfb-neil-hack-cell--readonly ${shouldPress ? "bfb-neil-hack-cell--press" : ""}`.trim()}
						aria-label={
							shouldPress
								? `Press switch ${switchNumber}`
								: `Switch ${switchNumber}, no action needed`
						}
					/>
				);
			})}
		</div>
	);
}

// ─── Section ──────────────────────────────────────────────────────────────────

function NeilHackSection(props: BaseSectionProps<NeilHackData>) {
	return (
		<BaseSection
			config={{
				storageKey: "beast-from-beyond-neil-hack-data",
				defaultValue: DEFAULT_VALUE,
				title: "Neil Hack",
				description:
					"Use the grid to match the current state of Neil's hack panel. The Solution grid highlights which switches to press to solve it.",
				resetButtonText: "Clear Grid",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "How It Works",
							nested: [
								{
									text: "Each switch points either vertically or horizontally. Tap a cell in the left grid to toggle it to match the panel's current state.",
								},
								{
									text: "Pressing a switch flips itself and 8 other fixed switches, not just its neighbors.",
								},
								{
									text: "The panel is solved once every switch points the same way (all vertical or all horizontal). The solution grid shows whichever direction takes fewer presses.",
								},
							],
						},
						{
							label: "Caveat",
							nested: [
								{
									text: "The exact fastest-solve calculation only works for the first hack attempt.",
								},
								{
									text: "If you fail to complete the Neil escort during the first hack window then the linked switches change to one of several other sets, invalidating the solver.",
								},
								{
									text: 'Switch to "No, redoing it" above and the Solution grid will instead provide the generic solution (pressing all of either vertical or horizontal switches).',
								},
							],
						},
						{
							label: "Panel Location",
							nested: [
								{
									text: "The panel is found in the Medbay.",
								},
								{
									text: "Players must first use the entanger to grab the button in the Afterlife Theatre and place it in the Beast poster.",
								},
								{
									text: "It will then appear in the secondary Medbay room and must be interacted with to start the hack process.",
								},
							],
						},
					],
				},
			}}
			getProgress={(data: NeilHackData) => {
				const hasInput = data.grid.some((row) =>
					row.some((cell) => cell === 1),
				);
				return {
					completed: hasInput ? 1 : 0,
					total: 1,
					isComplete: hasInput,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const handleToggle = (row: number, col: number) => {
					setData((prev) => ({
						...prev,
						grid: prev.grid.map((r, rIndex) =>
							rIndex !== row
								? r
								: r.map((cell, cIndex) =>
										cIndex !== col ? cell : ((cell ^ 1) as Cell),
									),
						),
					}));
				};

				const setIsFirstTime = (isFirstTime: boolean) =>
					setData((prev) => ({ ...prev, isFirstTime }));

				// Older saved data predates this field, so it may be missing entirely —
				// default to true (matches DEFAULT_VALUE) rather than reading as falsy.
				const isFirstTime = data.isFirstTime ?? true;

				let pressSwitches: number[] | null;
				if (isFirstTime) {
					const solved = solveFastest(data.grid);
					pressSwitches = solved ? solved.switches : null;
				} else {
					pressSwitches = solveGeneric(data.grid);
				}
				const pressSet = new Set(pressSwitches ?? []);

				let outputStatusText: string | null;
				if (pressSwitches === null) {
					outputStatusText =
						"No solution found for this layout — double-check your grid.";
				} else if (pressSwitches.length === 0) {
					outputStatusText = null;
				} else {
					outputStatusText = `Flip these ${pressSwitches.length} switches`;
				}

				return (
					<div className="bfb-neil-hack">
						<div className="bfb-neil-hack__mode">
							<span className="bfb-neil-hack__mode-label">
								Is this your first Neil Hack this game?
							</span>
							<div className="bfb-neil-hack__mode-buttons">
								<button
									type="button"
									className={`bfb-neil-hack__mode-btn${isFirstTime ? " bfb-neil-hack__mode-btn--active" : ""}`}
									onClick={() => setIsFirstTime(true)}
								>
									Yes, first time
								</button>
								<button
									type="button"
									className={`bfb-neil-hack__mode-btn${!isFirstTime ? " bfb-neil-hack__mode-btn--active" : ""}`}
									onClick={() => setIsFirstTime(false)}
								>
									No, redoing it
								</button>
							</div>
						</div>

						<div className="bfb-neil-hack__panels">
							<div className="bfb-neil-hack__panel">
								<span className="bfb-neil-hack__panel-label">Input</span>
								<InputGrid grid={data.grid} onToggle={handleToggle} />
								<p className="bfb-neil-hack__status">Map your switches</p>
							</div>
							<div className="bfb-neil-hack__panel">
								<span className="bfb-neil-hack__panel-label">Solution</span>
								<SolutionGrid pressSet={pressSet} />
								{outputStatusText && (
									<p className="bfb-neil-hack__status">{outputStatusText}</p>
								)}
							</div>
						</div>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default NeilHackSection;

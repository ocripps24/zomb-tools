import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScrollsData {
	scrollsOn: number[];
}

const DEFAULT_VALUE: ScrollsData = { scrollsOn: [] };

const GRID_SIZE = 3;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;

function cellIndex(row: number, col: number): number {
	return row * GRID_SIZE + col;
}

// Row i lists which cells toggle when cell i is pressed: itself plus its
// orthogonal (non-diagonal) neighbours.
const TOGGLE_ROWS: number[][] = Array.from({ length: CELL_COUNT }, (_, i) => {
	const row = Array(CELL_COUNT).fill(0);
	const r = Math.floor(i / GRID_SIZE);
	const c = i % GRID_SIZE;
	row[i] = 1;
	if (r > 0) row[cellIndex(r - 1, c)] = 1;
	if (r < GRID_SIZE - 1) row[cellIndex(r + 1, c)] = 1;
	if (c > 0) row[cellIndex(r, c - 1)] = 1;
	if (c < GRID_SIZE - 1) row[cellIndex(r, c + 1)] = 1;
	return row;
});

function onIndicesToState(onIndices: number[]): number[] {
	const state = Array(CELL_COUNT).fill(0);
	for (const i of onIndices) state[i] = 1;
	return state;
}

// Solves TOGGLE_ROWS * x = target (mod 2) via Gaussian elimination over GF(2).
// x is the press pattern needed to turn every scroll off from the given state.
// Returns null if the target is unreachable (kept for safety/messaging, though
// the 3x3 toggle matrix is full rank so every state is solvable in practice).
function gf2Solve(target: number[]): number[] | null {
	const n = CELL_COUNT;
	const matrix = TOGGLE_ROWS.map((row, i) => [...row, target[i]]);
	const pivotRowForCol = Array(n).fill(-1);

	let row = 0;
	for (let col = 0; col < n && row < n; col++) {
		let found = -1;
		for (let r = row; r < n; r++) {
			if (matrix[r][col] === 1) {
				found = r;
				break;
			}
		}
		if (found === -1) continue;

		[matrix[row], matrix[found]] = [matrix[found], matrix[row]];
		pivotRowForCol[col] = row;

		for (let r = 0; r < n; r++) {
			if (r !== row && matrix[r][col] === 1) {
				for (let c = 0; c <= n; c++) matrix[r][c] ^= matrix[row][c];
			}
		}
		row++;
	}

	for (let r = row; r < n; r++) {
		if (matrix[r][n] === 1) return null;
	}

	const solution = Array(n).fill(0);
	for (let col = 0; col < n; col++) {
		if (pivotRowForCol[col] !== -1)
			solution[col] = matrix[pivotRowForCol[col]][n];
	}
	return solution;
}

// ─── Grids ────────────────────────────────────────────────────────────────────

interface InputGridProps {
	scrollsOn: Set<number>;
	onToggle: (index: number) => void;
}

function InputGrid({ scrollsOn, onToggle }: InputGridProps) {
	return (
		<div className="scrolls-grid">
			{Array.from({ length: CELL_COUNT }, (_, i) => {
				const isOn = scrollsOn.has(i);
				return (
					<button
						key={i}
						type="button"
						className={`scrolls-cell ${isOn ? "scrolls-cell--on" : ""}`.trim()}
						onClick={() => onToggle(i)}
						aria-pressed={isOn}
						aria-label={`Scroll ${i + 1}, ${isOn ? "sticking out" : "inside cabinet"}`}
					/>
				);
			})}
		</div>
	);
}

interface SolutionGridProps {
	pressSet: Set<number>;
}

function SolutionGrid({ pressSet }: SolutionGridProps) {
	return (
		<div className="scrolls-grid scrolls-grid--solution">
			{Array.from({ length: CELL_COUNT }, (_, i) => {
				const shouldPress = pressSet.has(i);
				return (
					<div
						key={i}
						className={`scrolls-cell scrolls-cell--readonly ${
							shouldPress ? "scrolls-cell--press" : ""
						}`.trim()}
						aria-label={
							shouldPress
								? `Press position ${i + 1}`
								: `Position ${i + 1}, no action needed`
						}
					/>
				);
			})}
		</div>
	);
}

// ─── Section ──────────────────────────────────────────────────────────────────

function ScrollsSection(props: BaseSectionProps<ScrollsData>) {
	return (
		<BaseSection
			config={{
				storageKey: "kowakujo-scrolls-data",
				defaultValue: DEFAULT_VALUE,
				title: "Scrolls",
				description:
					"INPUT: Use the left grid to select which scrolls are sticking OUT of the cabinet in your game. SOLUTION: Shoot the locations indicated in yellow by the solution grid.",
				resetButtonText: "Clear Grid",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "The Goal",
							text: "Get every scroll fully inside the cabinet (off position).",
						},
						{
							label: "How It Works",
							text: "Interacting with a scroll toggles it and the scrolls directly above, below, left and right of it - never diagonally.",
						},
						{
							label: "Using The Grids",
							text: "Click a cell in the left grid to mark all scrolls that are currently sticking out. The right grid highlights which positions to shoot/melee in-game; order doesn't matter.",
						},
					],
				},
			}}
			getProgress={(data: ScrollsData) => ({
				completed: data.scrollsOn.length === 0 ? 1 : 0,
				total: 1,
				isComplete: data.scrollsOn.length === 0,
			})}
			{...props}
		>
			{({ data, setData }) => {
				const scrollsOn = new Set(data.scrollsOn);
				const isSolved = data.scrollsOn.length === 0;
				const solution = isSolved
					? null
					: gf2Solve(onIndicesToState(data.scrollsOn));
				const pressSet = new Set(
					solution ? solution.flatMap((press, i) => (press ? [i] : [])) : [],
				);

				const handleToggle = (index: number) => {
					setData((prev) => {
						const next = new Set(prev.scrollsOn);
						if (next.has(index)) {
							next.delete(index);
						} else {
							next.add(index);
						}
						return { scrollsOn: Array.from(next) };
					});
				};

				let statusText: string;
				if (isSolved) {
					statusText = "All scrolls are in - cabinet solved.";
				} else if (solution) {
					statusText =
						pressSet.size === 1
							? "Shoot the scroll"
							: `Shoot these ${pressSet.size} scrolls`;
				} else {
					statusText =
						"No solution found for this layout - double-check your grid.";
				}

				return (
					<div className="scrolls-section">
						<div className="scrolls-section__panels">
							<div className="scrolls-panel">
								<span className="scrolls-panel__label">
									Initial Scroll State
								</span>
								<InputGrid scrollsOn={scrollsOn} onToggle={handleToggle} />
								<p className="scrolls-section__status">
									Add your scrolls (OUT only)
								</p>
							</div>
							<div className="scrolls-panel">
								<span className="scrolls-panel__label">SOLUTION</span>
								<SolutionGrid pressSet={pressSet} />
								<p className="scrolls-section__status">{statusText}</p>
							</div>
						</div>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default ScrollsSection;

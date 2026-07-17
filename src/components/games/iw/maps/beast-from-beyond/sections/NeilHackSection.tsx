import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// ─── Types ────────────────────────────────────────────────────────────────────

type Cell = 0 | 1;
type Grid = Cell[][];

interface NeilHackData {
	grid: Grid;
}

const GRID_SIZE = 4;

const DEFAULT_VALUE: NeilHackData = {
	grid: Array.from({ length: GRID_SIZE }, () =>
		Array.from({ length: GRID_SIZE }, () => 0 as Cell),
	),
};

function columnSum(grid: Grid, col: number): number {
	return grid.reduce((sum, row) => sum + row[col], 0);
}

// A single flip bit is derived from the whole grid, then XORed onto a fixed
// set of 8 cells (the other 8 always pass through unchanged). The flip bit
// is 1 if either the outer columns (1+4) or the middle columns (2+3) sum to
// an odd number.
function computeFlip(grid: Grid): 0 | 1 {
	const outerParity = (columnSum(grid, 0) + columnSum(grid, 3)) % 2;
	const middleParity = (columnSum(grid, 1) + columnSum(grid, 2)) % 2;
	return outerParity === 1 || middleParity === 1 ? 1 : 0;
}

// On the outer rows (1 and 4) the right two columns flip; on the inner rows
// (2 and 3) the left two columns flip. Always the same 8 cells.
function isFlipCell(row: number, col: number): boolean {
	const outerRow = row === 0 || row === GRID_SIZE - 1;
	const leftCol = col === 0 || col === 1;
	return outerRow ? !leftCol : leftCol;
}

function solve(grid: Grid, flip: 0 | 1): Grid {
	return grid.map((row, rowIndex) =>
		row.map((cell, colIndex) =>
			isFlipCell(rowIndex, colIndex) ? ((cell ^ flip) as Cell) : cell,
		),
	);
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
							aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}, ${isOn ? "on" : "off"}`}
						>
							{cell}
						</button>
					);
				}),
			)}
		</div>
	);
}

interface OutputGridProps {
	grid: Grid;
}

function OutputGrid({ grid }: OutputGridProps) {
	return (
		<div className="bfb-neil-hack-grid bfb-neil-hack-grid--readonly">
			{grid.map((row, rowIndex) =>
				row.map((cell, colIndex) => {
					const isOn = cell === 1;
					return (
						<div
							key={`${rowIndex}-${colIndex}`}
							className={`bfb-neil-hack-cell bfb-neil-hack-cell--readonly ${isOn ? "bfb-neil-hack-cell--on" : ""}`.trim()}
							aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}, ${isOn ? "on" : "off"}`}
						>
							{cell}
						</div>
					);
				}),
			)}
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
					"INPUT: Use the left grid to match the current 1/0 state of Neil's hack panel. OUTPUT: The right grid shows the pattern to set on the panel.",
				resetButtonText: "Clear Grid",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Panel Location",
							text: "TODO: describe where to find Neil's hack panel.",
						},
						{
							label: "How It Works",
							text: "Tap each cell in the left grid to match the panel's current state. The right grid updates automatically with the pattern to set.",
						},
					],
				},
			}}
			getProgress={(data: NeilHackData) => {
				const hasInput = data.grid.some((row) => row.some((cell) => cell === 1));
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

				const flip = computeFlip(data.grid);
				const outputGrid = solve(data.grid, flip);
				const statusText =
					flip === 1
						? "Flip mode is ON — set the panel to the pattern shown on the right."
						: "Flip mode is OFF — the panel's target pattern matches the input exactly.";

				return (
					<div className="bfb-neil-hack">
						<div className="bfb-neil-hack__panels">
							<div className="bfb-neil-hack__panel">
								<span className="bfb-neil-hack__panel-label">Input</span>
								<InputGrid grid={data.grid} onToggle={handleToggle} />
							</div>
							<div className="bfb-neil-hack__panel">
								<span className="bfb-neil-hack__panel-label">Output</span>
								<OutputGrid grid={outputGrid} />
							</div>
						</div>
						<p className="bfb-neil-hack__status">{statusText}</p>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default NeilHackSection;

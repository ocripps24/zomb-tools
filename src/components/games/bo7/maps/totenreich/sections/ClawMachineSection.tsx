import { useState } from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { useSectionSettings } from "@/hooks/useSectionSettings";

// ─── Types ────────────────────────────────────────────────────────────────────

type Pos = [number, number];
type CellType = "empty" | "core" | "uranium";

interface ClawMachineData {
	cores: string[];
}

const DEFAULT_VALUE: ClawMachineData = { cores: [] };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pk(r: number, c: number): string {
	return `${r},${c}`;
}

function unpack(key: string): Pos {
	const parts = key.split(",");
	return [Number(parts[0]), Number(parts[1])];
}

// ─── BFS / Solver ─────────────────────────────────────────────────────────────

interface Group {
	size: number;
}

const DIRS: [number, number][] = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1],
];

function findGroups(coreSet: Set<string>, uraniumSet: Set<string>): Group[] {
	const allActive = new Set([...coreSet, ...uraniumSet]);
	const visited = new Set<string>();
	const groups: Group[] = [];

	for (const key of allActive) {
		if (visited.has(key)) continue;
		let size = 0;
		const queue: string[] = [key];
		visited.add(key);
		while (queue.length > 0) {
			const cur = queue.shift()!;
			const [r, c] = unpack(cur);
			size++;
			for (const [dr, dc] of DIRS) {
				const nr = r + dr;
				const nc = c + dc;
				if (nr < 0 || nr >= 4 || nc < 0 || nc >= 4) continue;
				const nk = pk(nr, nc);
				if (!allActive.has(nk) || visited.has(nk)) continue;
				visited.add(nk);
				queue.push(nk);
			}
		}
		groups.push({ size });
	}
	return groups;
}

type ConfigType = "7+2" | "6+3" | "7+1+1" | "6+2+1";

// A circuit is just a connected group of the right size — nothing in the
// real game requires uranium to appear in *every* group. A pair of
// pre-existing cores that were already isolated from the rest (0 uranium
// touching them) is just as valid a "2" as a pair formed by placing 2
// uranium next to each other; the size split is all that matters. Matching
// on `hasUranium` here was the bug that produced false negatives on
// otherwise-valid 7+2/6+3 layouts.
const CONFIG_BY_SIZES: Record<string, ConfigType> = {
	"7,2": "7+2",
	"6,3": "6+3",
	"7,1,1": "7+1+1",
	"6,2,1": "6+2+1",
};

// Tier 1 (7+2 / 6+3) is the well-tested, common case and always wins when
// available. 7+1+1 and 6+2+1 only ever get surfaced when NO tier-1 solve
// exists at all — they're rarer, less-verified layouts, not alternatives to
// offer alongside a normal solve.
const CONFIG_TIER: Record<ConfigType, 1 | 2 | 3> = {
	"7+2": 1,
	"6+3": 1,
	"7+1+1": 2,
	"6+2+1": 3,
};
const isExperimentalConfig = (t: ConfigType) => CONFIG_TIER[t] > 1;

function classifyConfig(groups: Group[]): ConfigType | null {
	const sizes = groups
		.map((g) => g.size)
		.sort((a, b) => b - a)
		.join(",");
	return CONFIG_BY_SIZES[sizes] ?? null;
}

function fn(n: number): number {
	return 6.4 * n * n + 10.6 * n;
}

function estimateScore(groups: Group[]): number {
	const groupScore = groups.reduce((sum, g) => sum + fn(g.size), 0);
	// The +104 split bonus is only confirmed for the standard 2-circuit
	// (7+2 / 6+3) case — there's no in-game data yet on whether a 3-way
	// 7+1+1 / 6+2+1 split scores a bonus at all, so it's left out for those.
	const splitBonus = groups.length === 2 ? 104 : 0;
	return Math.round(27 + groupScore + splitBonus);
}

interface Arrangement {
	uranium: Pos[];
	configType: ConfigType;
	score: number;
}

function findArrangements(cores: string[]): Arrangement[] {
	if (cores.length !== 6) return [];

	const coreSet = new Set(cores);
	const emptyCells: Pos[] = [];
	for (let r = 0; r < 4; r++) {
		for (let c = 0; c < 4; c++) {
			if (!coreSet.has(pk(r, c))) emptyCells.push([r, c]);
		}
	}

	// One pass over every 3-cell uranium placement, bucketed by tier —
	// cheaper than re-searching per tier, and the search space (≤C(10,3) =
	// 120 combinations) is tiny either way.
	const byTier: Record<1 | 2 | 3, Arrangement[]> = { 1: [], 2: [], 3: [] };
	const n = emptyCells.length;

	for (let i = 0; i < n - 2; i++) {
		for (let j = i + 1; j < n - 1; j++) {
			for (let k = j + 1; k < n; k++) {
				const uranium: Pos[] = [emptyCells[i], emptyCells[j], emptyCells[k]];
				const uraniumSet = new Set(uranium.map(([r, c]) => pk(r, c)));
				const groups = findGroups(coreSet, uraniumSet);
				const configType = classifyConfig(groups);
				if (configType) {
					byTier[CONFIG_TIER[configType]].push({
						uranium,
						configType,
						score: estimateScore(groups),
					});
				}
			}
		}
	}

	const results = byTier[1].length > 0 ? byTier[1] : byTier[2].length > 0 ? byTier[2] : byTier[3];

	results.sort((a, b) => {
		const colA = a.uranium.reduce((s, [, c]) => s + c, 0);
		const colB = b.uranium.reduce((s, [, c]) => s + c, 0);
		if (colA !== colB) return colA - colB;
		return (
			a.uranium.reduce((s, [r]) => s + r, 0) -
			b.uranium.reduce((s, [r]) => s + r, 0)
		);
	});

	return results.slice(0, 5);
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

function buildCellTypeMap(
	coreSet: Set<string>,
	arrangement: Arrangement | null,
): Map<string, CellType> {
	const map = new Map<string, CellType>();
	for (let r = 0; r < 4; r++) {
		for (let c = 0; c < 4; c++) {
			const key = pk(r, c);
			map.set(key, coreSet.has(key) ? "core" : "empty");
		}
	}

	// Every pre-existing core stays the same plain grey regardless of which
	// circuit it ends up in — only the placed uranium gets highlighted, so
	// the grid reads as "here's what to add", not "here's the circuit shape".
	if (arrangement) {
		for (const [r, c] of arrangement.uranium) {
			map.set(pk(r, c), "uranium");
		}
	}

	return map;
}

interface ClawGridProps {
	coreSet: Set<string>;
	arrangement: Arrangement | null;
	onToggle: (r: number, c: number) => void;
	coreCount: number;
}

function ClawGrid({
	coreSet,
	arrangement,
	onToggle,
	coreCount,
}: ClawGridProps) {
	const cellTypeMap = buildCellTypeMap(coreSet, arrangement);

	return (
		<div className="claw-grid">
			<div className="claw-grid__header-row">
				<div className="claw-grid__corner" />
				{[1, 2, 3, 4].map((col) => (
					<div key={col} className="claw-grid__col-label">
						{col}
					</div>
				))}
			</div>
			{Array.from({ length: 4 }, (_, r) => (
				<div key={r} className="claw-grid__row">
					<div className="claw-grid__row-label">{r + 1}</div>
					{Array.from({ length: 4 }, (_, c) => {
						const key = pk(r, c);
						const cellType = cellTypeMap.get(key)!;
						const isCore = coreSet.has(key);
						const canClick = isCore || coreCount < 6;
						return (
							<button
								key={c}
								className={`claw-cell claw-cell--${cellType}`}
								onClick={() => onToggle(r, c)}
								type="button"
								disabled={!canClick}
								aria-pressed={isCore}
							>
								{isCore ? "C" : cellType.startsWith("uranium") ? "U" : null}
							</button>
						);
					})}
				</div>
			))}
		</div>
	);
}

// ─── Result ───────────────────────────────────────────────────────────────────

interface ClawResultProps {
	arrangement: Arrangement;
	index: number;
	total: number;
	onPrev: () => void;
	onNext: () => void;
}

function ClawResult({
	arrangement,
	index,
	total,
	onPrev,
	onNext,
}: ClawResultProps) {
	const sortedUranium = [...arrangement.uranium].sort(([r1, c1], [r2, c2]) => {
		if (r1 !== r2) return r1 - r2;
		return c1 - c2;
	});

	const configId = arrangement.configType.replace(/\+/g, "");

	return (
		<div className="claw-result">
			<div className="claw-result__header">
				<span className={`claw-result__badge claw-result__badge--${configId}`}>
					{arrangement.configType}
				</span>
				{total > 1 && (
					<div className="claw-result__nav">
						<span className="claw-result__nav-label">
							{index + 1} / {total}
						</span>
						<button
							className="claw-result__nav-btn"
							onClick={onPrev}
							disabled={index === 0}
							type="button"
							aria-label="Previous arrangement"
						>
							‹
						</button>
						<button
							className="claw-result__nav-btn"
							onClick={onNext}
							disabled={index === total - 1}
							type="button"
							aria-label="Next arrangement"
						>
							›
						</button>
					</div>
				)}
			</div>

			<div className="claw-result__placements">
				{sortedUranium.map(([r, c], i) => (
					<div key={i} className="claw-placement">
						<span className="claw-placement__label">U{i + 1}</span>
						<span className="claw-placement__coords">
							Row {r + 1}, Col {c + 1}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

// ─── Section ──────────────────────────────────────────────────────────────────

function ClawMachineSection(props: BaseSectionProps<ClawMachineData>) {
	const [arrangementIndex, setArrangementIndex] = useState(0);

	useSectionSettings({
		mapId: "totenreich",
		sectionId: "claw-machine",
		sectionName: "Claw Machine",
		settings: [],
	});

	return (
		<BaseSection
			config={{
				storageKey: "totenreich-claw-machine-data",
				defaultValue: DEFAULT_VALUE,
				title: "Claw Machine",
				description:
					"Mark the 6 inactive core positions on the grid. The solver will find valid uranium placements for 7+2 and 6+3 circuit configurations, falling back to a rarer 7+1+1 or 6+2+1 split if neither is possible.",
				resetButtonText: "Clear Grid",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "The Goal",
							text: "Place 3 uranium cores to split the grid into separate circuits of the right sizes.",
						},
						{
							label: "7+2 Config",
							text: "Connect 6 inactive cores with 1 uranium (7-node circuit). Place the remaining 2 uranium adjacent to each other, isolated from that circuit.",
						},
						{
							label: "6+3 Config",
							text: "Connect 5 inactive cores with 1 uranium (6-node circuit). Connect 1 isolated inactive core with 2 adjacent uranium to form a separate 3-node circuit.",
						},
						{
							label: "7+1+1 / 6+2+1 Configs",
							text: "Rarer layouts that only get suggested when no 7+2 or 6+3 solve exists for your cores. A circuit doesn't need uranium in it to count — 2 pre-existing cores that are already isolated from everything else are just as valid a group as one you build with uranium. These configs are less tested in-game, so treat them as a best guess.",
						},
						{
							label: "Grid Layout",
							text: "Click a cell to mark it as an inactive core. Click it again to remove it. Nodes connect if they are directly adjacent horizontally or vertically.",
						},
					],
				},
			}}
			getProgress={(data: ClawMachineData) => ({
				completed: Math.min(data.cores.length, 6),
				total: 6,
				isComplete: data.cores.length === 6,
			})}
			{...props}
		>
			{({ data, setData }) => {
				const coreSet = new Set(data.cores);
				const coreCount = data.cores.length;
				const arrangements = findArrangements(data.cores);
				const clampedIndex = Math.min(
					arrangementIndex,
					Math.max(0, arrangements.length - 1),
				);
				const arrangement = arrangements[clampedIndex] ?? null;

				const handleToggle = (r: number, c: number) => {
					const key = pk(r, c);
					if (coreSet.has(key)) {
						setData({ cores: data.cores.filter((k) => k !== key) });
						setArrangementIndex(0);
					} else if (coreCount < 6) {
						setData({ cores: [...data.cores, key] });
						setArrangementIndex(0);
					}
				};

				let statusText: string;
				if (coreCount < 6) {
					statusText = `${coreCount} / 6 cores placed — click cells to mark inactive nodes`;
				} else if (arrangements.length > 0) {
					statusText = `${arrangements.length} valid arrangement${arrangements.length !== 1 ? "s" : ""} found`;
				} else {
					statusText =
						"No valid arrangements found — check your core placement";
				}

				return (
					<div className="claw-machine-section">
						<div className="claw-machine-section__grid-area">
							<div className="claw-machine-section__grid-row">
								<ClawGrid
									coreSet={coreSet}
									arrangement={arrangement}
									onToggle={handleToggle}
									coreCount={coreCount}
								/>
								{arrangement && isExperimentalConfig(arrangement.configType) && (
									<p className="claw-machine-section__warning">
										<strong>Heads up:</strong> no 7+2 or 6+3 split was
										possible, in rare cases a 7+1+1 or 6-2-1 layout can work.
										Given the rarity, not all 7-1-1 or 6-2-1 solutions have
										been fully tested, however the tested ones have been
										successful.
									</p>
								)}
							</div>
							<p className="claw-machine-section__status">{statusText}</p>
						</div>

						{arrangement && (
							<ClawResult
								arrangement={arrangement}
								index={clampedIndex}
								total={arrangements.length}
								onPrev={() => setArrangementIndex((i) => Math.max(0, i - 1))}
								onNext={() =>
									setArrangementIndex((i) =>
										Math.min(arrangements.length - 1, i + 1),
									)
								}
							/>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default ClawMachineSection;

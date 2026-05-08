import { useState } from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { useSectionSettings } from "@/hooks/useSectionSettings";

// ─── Types ────────────────────────────────────────────────────────────────────

type Pos = [number, number];
type CellType =
	| "empty"
	| "core"
	| "core-a"
	| "core-b"
	| "uranium-a"
	| "uranium-b";

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
	cells: string[];
	uraniumCount: number;
	hasUranium: boolean;
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
		const cells: string[] = [];
		let uraniumCount = 0;
		const queue: string[] = [key];
		visited.add(key);
		while (queue.length > 0) {
			const cur = queue.shift()!;
			const [r, c] = unpack(cur);
			cells.push(cur);
			if (uraniumSet.has(cur)) uraniumCount++;
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
		groups.push({
			cells,
			uraniumCount,
			hasUranium: uraniumCount > 0,
			size: cells.length,
		});
	}
	return groups;
}

type ConfigType = "7+2" | "6+3";

function classifyConfig(groups: Group[]): ConfigType | null {
	const scoring = groups.filter((g) => g.hasUranium);
	if (scoring.length !== 2) return null;
	const sizes = scoring.map((g) => g.size).sort((a, b) => b - a);
	if (sizes[0] === 7 && sizes[1] === 2) return "7+2";
	if (sizes[0] === 6 && sizes[1] === 3) return "6+3";
	return null;
}

function fn(n: number): number {
	return 6.4 * n * n + 10.6 * n;
}

function estimateScore(groups: Group[]): number {
	const scoring = groups.filter((g) => g.hasUranium);
	const groupScore = scoring.reduce((sum, g) => sum + fn(g.size), 0);
	const splitBonus = scoring.length === 2 ? 104 : 0;
	return Math.round(27 + groupScore + splitBonus);
}

interface Arrangement {
	uranium: Pos[];
	configType: ConfigType;
	score: number;
	groups: Group[];
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

	const results: Arrangement[] = [];
	const n = emptyCells.length;

	for (let i = 0; i < n - 2; i++) {
		for (let j = i + 1; j < n - 1; j++) {
			for (let k = j + 1; k < n; k++) {
				const uranium: Pos[] = [emptyCells[i], emptyCells[j], emptyCells[k]];
				const uraniumSet = new Set(uranium.map(([r, c]) => pk(r, c)));
				const groups = findGroups(coreSet, uraniumSet);
				const configType = classifyConfig(groups);
				if (configType) {
					results.push({
						uranium,
						configType,
						score: estimateScore(groups),
						groups,
					});
				}
			}
		}
	}

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

	if (arrangement) {
		const sortedGroups = arrangement.groups
			.filter((g) => g.hasUranium)
			.sort((a, b) => b.size - a.size);
		const uraniumKeys = new Set(arrangement.uranium.map(([r, c]) => pk(r, c)));

		sortedGroups.forEach((group, idx) => {
			const suffix = idx === 0 ? "a" : "b";
			for (const key of group.cells) {
				map.set(
					key,
					uraniumKeys.has(key) ? `uranium-${suffix}` : `core-${suffix}`,
				);
			}
		});
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
	const sortedGroups = arrangement.groups
		.filter((g) => g.hasUranium)
		.sort((a, b) => b.size - a.size);
	const groupAKeys = new Set(sortedGroups[0]?.cells ?? []);

	const sortedUranium = [...arrangement.uranium].sort(([r1, c1], [r2, c2]) => {
		const aInA = groupAKeys.has(pk(r1, c1));
		const bInA = groupAKeys.has(pk(r2, c2));
		if (aInA !== bInA) return aInA ? -1 : 1;
		if (r1 !== r2) return r1 - r2;
		return c1 - c2;
	});

	const configId = arrangement.configType.replace("+", "");

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
				{sortedUranium.map(([r, c], i) => {
					const inA = groupAKeys.has(pk(r, c));
					const group = inA ? sortedGroups[0] : sortedGroups[1];
					return (
						<div
							key={i}
							className={`claw-placement claw-placement--${inA ? "a" : "b"}`}
						>
							<span className="claw-placement__label">U{i + 1}</span>
							<span className="claw-placement__coords">
								Row {r + 1}, Col {c + 1}
							</span>
							<span className="claw-placement__circuit">
								Circuit {inA ? "A" : "B"} · {group?.size ?? "?"} nodes
							</span>
						</div>
					);
				})}
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
					"Mark the 6 inactive core positions on the grid. The solver will find valid uranium placements for 7+2 and 6+3 circuit configurations.",
				resetButtonText: "Clear Grid",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "The Goal",
							text: "Place 3 uranium cores to create two separate circuits.",
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
							<ClawGrid
								coreSet={coreSet}
								arrangement={arrangement}
								onToggle={handleToggle}
								coreCount={coreCount}
							/>
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

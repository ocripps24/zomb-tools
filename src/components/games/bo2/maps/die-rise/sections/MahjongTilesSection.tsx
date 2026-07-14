import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { ResultsDisplay } from "@/components/ui";
import type { ResultItem } from "@/components/ui/ResultsDisplay";

import mahjongNorth from "@/assets/maps/bo2/die-rise/die-rise-mahjong-north.jpg";
import mahjongSouth from "@/assets/maps/bo2/die-rise/die-rise-mahjong-south.jpg";
import mahjongEast from "@/assets/maps/bo2/die-rise/die-rise-mahjong-east.jpg";
import mahjongWest from "@/assets/maps/bo2/die-rise/die-rise-mahjong-west.jpg";
import mahjong1 from "@/assets/maps/bo2/die-rise/die-rise-mahjong-1.jpg";
import mahjong2 from "@/assets/maps/bo2/die-rise/die-rise-mahjong-2.jpg";
import mahjong3 from "@/assets/maps/bo2/die-rise/die-rise-mahjong-3.jpg";
import mahjong4 from "@/assets/maps/bo2/die-rise/die-rise-mahjong-4.jpg";

// ─── Types ────────────────────────────────────────────────────────────────────

type MahjongColor = "red" | "blue" | "green" | "black";
type CompassDirection = "north" | "south" | "east" | "west";

interface MahjongTilesData {
	compass: Record<CompassDirection, MahjongColor | null>;
	// index 0-3 => tiles 1-4
	numbers: (MahjongColor | null)[];
}

const DEFAULT_VALUE: MahjongTilesData = {
	compass: { north: null, south: null, east: null, west: null },
	numbers: [null, null, null, null],
};

// ─── Tile & colour config ──────────────────────────────────────────────────────

// Each tile's symbol is fixed - only the colour behind it changes game to game -
// so the reference photo lets a player identify a tile before knowing its colour.
const COMPASS_TILES: { id: CompassDirection; label: string; image: string }[] =
	[
		{ id: "north", label: "North", image: mahjongNorth },
		{ id: "south", label: "South", image: mahjongSouth },
		{ id: "east", label: "East", image: mahjongEast },
		{ id: "west", label: "West", image: mahjongWest },
	];

const NUMBER_TILES: { label: string; image: string }[] = [
	{ label: "1", image: mahjong1 },
	{ label: "2", image: mahjong2 },
	{ label: "3", image: mahjong3 },
	{ label: "4", image: mahjong4 },
];

const COLOR_OPTIONS: {
	value: MahjongColor;
	label: string;
	swatch: string;
	initial: string;
}[] = [
	{ value: "red", label: "Red", swatch: "#c0392b", initial: "R" },
	{ value: "blue", label: "Blue", swatch: "#2f6fb3", initial: "B" },
	{ value: "green", label: "Green", swatch: "#3f9142", initial: "G" },
	{ value: "black", label: "Black", swatch: "#2b2b2b", initial: "K" },
];

// ─── Matching ───────────────────────────────────────────────────────────────────

function findDirectionMatch(
	color: MahjongColor | null,
	compass: Record<CompassDirection, MahjongColor | null>,
): string | null {
	if (!color) return null;
	return COMPASS_TILES.find((t) => compass[t.id] === color)?.label ?? null;
}

// If exactly 3 of the 4 colours in a set are already picked, the 4th is
// forced - every colour appears exactly once per set, so it can only be
// the one colour not yet used.
function remainingColor(colors: (MahjongColor | null)[]): MahjongColor | null {
	const used = new Set(colors.filter((c): c is MahjongColor => c !== null));
	if (used.size !== 3) return null;
	return COLOR_OPTIONS.map((o) => o.value).find((c) => !used.has(c)) ?? null;
}

// ─── Tile colour field ──────────────────────────────────────────────────────────

interface TileColorFieldProps {
	label: string;
	image: string;
	value: MahjongColor | null;
	// Colours already used by other tiles in this set - never includes this
	// tile's own value, so its current selection is always clickable.
	disabledColors: Set<MahjongColor>;
	onChange: (color: MahjongColor) => void;
}

function TileColorField({
	label,
	image,
	value,
	disabledColors,
	onChange,
}: TileColorFieldProps) {
	return (
		<div className="mahjong-tile-field">
			<img
				src={image}
				alt={`${label} tile symbol`}
				className="mahjong-tile-field__image"
			/>
			<span className="mahjong-tile-field__label">{label}</span>
			<div className="mahjong-tile-field__swatches">
				{COLOR_OPTIONS.map((opt) => (
					<button
						key={opt.value}
						type="button"
						className={`mahjong-swatch ${
							value === opt.value ? "mahjong-swatch--selected" : ""
						}`.trim()}
						style={{ backgroundColor: opt.swatch }}
						onClick={() => onChange(opt.value)}
						disabled={disabledColors.has(opt.value)}
						aria-pressed={value === opt.value}
						aria-label={`${label} is ${opt.label}`}
						title={opt.label}
					>
						{opt.initial}
					</button>
				))}
			</div>
		</div>
	);
}

// ─── Section ──────────────────────────────────────────────────────────────────

function MahjongTilesSection(props: BaseSectionProps<MahjongTilesData>) {
	return (
		<BaseSection
			config={{
				storageKey: "die-rise-mahjong-tiles-data",
				defaultValue: DEFAULT_VALUE,
				title: "Mahjong Tiles",
				description:
					"Record the color you see on each tile, once only one color option remains it will auto-complete.",
				resetButtonText: "Reset",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "The Goal",
							text: "Each compass tile (North, South, East, West) shares its colour with exactly one number tile (1-4). Find the matching pair.",
						},
						{
							label: "The Pylon",
							text: "There is a guaranteed spawn for a Mahjong tile next to the North facing side of the tower.",
						},
						{
							label: "Galvaknuckles",
							text: "The Galvaknuckles are required to melee the Pylon.",
						},
					],
				},
			}}
			getProgress={(data: MahjongTilesData) => {
				const compassFilled = COMPASS_TILES.filter(
					(t) => data.compass[t.id] !== null,
				).length;
				const numbersFilled = data.numbers.filter((c) => c !== null).length;
				const completed = compassFilled + numbersFilled;
				return {
					completed,
					total: 8,
					isComplete: completed === 8,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const setCompass = (dir: CompassDirection, color: MahjongColor) => {
					setData((prev) => {
						const nextCompass = { ...prev.compass, [dir]: color };
						const emptyDir = COMPASS_TILES.find(
							(t) => nextCompass[t.id] === null,
						)?.id;
						if (emptyDir) {
							const auto = remainingColor(
								COMPASS_TILES.map((t) => nextCompass[t.id]),
							);
							if (auto) nextCompass[emptyDir] = auto;
						}
						return { ...prev, compass: nextCompass };
					});
				};

				const setNumber = (index: number, color: MahjongColor) => {
					setData((prev) => {
						const nextNumbers = [...prev.numbers];
						nextNumbers[index] = color;
						const emptyIdx = nextNumbers.findIndex((c) => c === null);
						if (emptyIdx !== -1) {
							const auto = remainingColor(nextNumbers);
							if (auto) nextNumbers[emptyIdx] = auto;
						}
						return { ...prev, numbers: nextNumbers };
					});
				};

				// Colours already used by other tiles in the same set - excludes the
				// tile itself, so its own current colour is never disabled.
				const compassDisabled = (excludeDir: CompassDirection) =>
					new Set(
						COMPASS_TILES.filter((t) => t.id !== excludeDir)
							.map((t) => data.compass[t.id])
							.filter((c): c is MahjongColor => c !== null),
					);

				const numberDisabled = (excludeIndex: number) =>
					new Set(
						data.numbers.filter(
							(c, i): c is MahjongColor => i !== excludeIndex && c !== null,
						),
					);

				const allFilled =
					COMPASS_TILES.every((t) => data.compass[t.id] !== null) &&
					data.numbers.every((c) => c !== null);

				const results: ResultItem[] = NUMBER_TILES.map((tile, index) => {
					const direction = findDirectionMatch(
						data.numbers[index],
						data.compass,
					);
					return {
						id: tile.label,
						label: tile.label,
						value: direction ?? "----",
						status: direction ? "complete" : "pending",
					};
				});

				return (
					<div className="mahjong-tiles-section">
						<div className="mahjong-tiles-columns">
							<div className="mahjong-tiles-block">
								<h3 className="mahjong-tiles-block__heading">Compass Tiles</h3>
								<div className="mahjong-tiles-list">
									{COMPASS_TILES.map((tile) => (
										<TileColorField
											key={tile.id}
											label={tile.label}
											image={tile.image}
											value={data.compass[tile.id]}
											disabledColors={compassDisabled(tile.id)}
											onChange={(color) => setCompass(tile.id, color)}
										/>
									))}
								</div>
							</div>

							<div className="mahjong-tiles-block">
								<h3 className="mahjong-tiles-block__heading">Number Tiles</h3>
								<div className="mahjong-tiles-list">
									{NUMBER_TILES.map((tile, index) => (
										<TileColorField
											key={tile.label}
											label={tile.label}
											image={tile.image}
											value={data.numbers[index]}
											disabledColors={numberDisabled(index)}
											onChange={(color) => setNumber(index, color)}
										/>
									))}
								</div>
							</div>
						</div>

						<ResultsDisplay
							variant="grid"
							title="Melee Order"
							description="Melee the pylon poles in this order - each number shows which direction to hit:"
							results={results}
							gridColumns={4}
							colorScheme={allFilled ? "success" : "accent"}
							note={
								allFilled
									? undefined
									: "Pick a colour for every tile above to see the melee order."
							}
						/>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default MahjongTilesSection;

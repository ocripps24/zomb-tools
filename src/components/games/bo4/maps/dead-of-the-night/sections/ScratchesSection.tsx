import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { SymbolPicker, ResultsDisplay } from "@/components/ui";
import { useSectionSettings } from "@/hooks/useSectionSettings";
import type { SequenceItem } from "@/components/ui/ResultsDisplay";

// Import zodiac symbols
import AriesIcon from "@/assets/maps/bo4/dead-of-the-night/dotn-zodiac-aries.svg";
import TaurusIcon from "@/assets/maps/bo4/dead-of-the-night/dotn-zodiac-taurus.svg";
import GeminiIcon from "@/assets/maps/bo4/dead-of-the-night/dotn-zodiac-gemini.svg";
import CancerIcon from "@/assets/maps/bo4/dead-of-the-night/dotn-zodiac-cancer.svg";
import LeoIcon from "@/assets/maps/bo4/dead-of-the-night/dotn-zodiac-leo.svg";
import VirgoIcon from "@/assets/maps/bo4/dead-of-the-night/dotn-zodiac-virgo.svg";
import LibraIcon from "@/assets/maps/bo4/dead-of-the-night/dotn-zodiac-libra.svg";
import ScorpioIcon from "@/assets/maps/bo4/dead-of-the-night/dotn-zodiac-scorpio.svg";
import SagittariusIcon from "@/assets/maps/bo4/dead-of-the-night/dotn-zodiac-sagittarius.svg";
import CapricornIcon from "@/assets/maps/bo4/dead-of-the-night/dotn-zodiac-capricorn.svg";
import AquariusIcon from "@/assets/maps/bo4/dead-of-the-night/dotn-zodiac-aquarius.svg";
import PiscesIcon from "@/assets/maps/bo4/dead-of-the-night/dotn-zodiac-pisces.svg";

// Zodiac symbols configuration
const ZODIAC_SYMBOLS = [
	{
		id: "aries",
		name: "Aries",
		component: AriesIcon as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "taurus",
		name: "Taurus",
		component: TaurusIcon as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "gemini",
		name: "Gemini",
		component: GeminiIcon as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "cancer",
		name: "Cancer",
		component: CancerIcon as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "leo",
		name: "Leo",
		component: LeoIcon as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "virgo",
		name: "Virgo",
		component: VirgoIcon as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "libra",
		name: "Libra",
		component: LibraIcon as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "scorpio",
		name: "Scorpio",
		component: ScorpioIcon as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "sagittarius",
		name: "Sagittarius",
		component: SagittariusIcon as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "capricorn",
		name: "Capricorn",
		component: CapricornIcon as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "aquarius",
		name: "Aquarius",
		component: AquariusIcon as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "pisces",
		name: "Pisces",
		component: PiscesIcon as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
];

// ─── Scratch counting ───────────────────────────────────────────────────────
//
// The final total for a set can only ever be 7, 9, 11, 13, or 15 - never an
// even number. In Individual mode the player enters the count observed at
// each of up to 3 locations (0, 3, 4, or 5), which are added together.
//
// Only 6 location combinations are actually possible (derived from testing):
// whenever one location is 4, exactly one other is 3 or 5 and the third is
// empty (0); totals of 11/13/15 never involve a 4 at all.
type LocationValue = 0 | 3 | 4 | 5;
type LocationSlot = LocationValue | null;

interface ScratchCard {
	symbol: string;
	count: number;
	locations: [LocationSlot, LocationSlot, LocationSlot];
}

interface ScratchesData {
	cards: [ScratchCard, ScratchCard, ScratchCard];
}

const TOTAL_OPTIONS = [7, 9, 11, 13, 15] as const;
const LOCATION_OPTIONS: LocationValue[] = [0, 3, 4, 5];

const VALID_LOCATION_COMBOS: LocationValue[][] = [
	[0, 3, 4],
	[0, 4, 5],
	[3, 3, 3],
	[3, 3, 5],
	[3, 5, 5],
	[5, 5, 5],
];

function isSubMultiset(candidate: number[], combo: number[]): boolean {
	const comboCounts = new Map<number, number>();
	for (const n of combo) comboCounts.set(n, (comboCounts.get(n) ?? 0) + 1);
	const candidateCounts = new Map<number, number>();
	for (const n of candidate)
		candidateCounts.set(n, (candidateCounts.get(n) ?? 0) + 1);
	for (const [n, count] of candidateCounts) {
		if ((comboCounts.get(n) ?? 0) < count) return false;
	}
	return true;
}

// Every combo consistent with whatever's already known (nulls are ignored -
// still-open rows can be filled with whatever's needed to complete one).
function possibleCombos(
	locations: [LocationSlot, LocationSlot, LocationSlot],
): LocationValue[][] {
	const known = locations.filter((v): v is LocationValue => v !== null);
	return VALID_LOCATION_COMBOS.filter((combo) => isSubMultiset(known, combo));
}

// Same as possibleCombos, but steers away from combos whose total is already
// used by another card - UNLESS that's the only way to complete a valid
// combo at all, in which case the forced (duplicate-total) answer still
// wins, since it's what the player will actually observe in-game. The
// resulting duplicate is left for the existing isCountDuplicate error to
// surface, rather than silently hidden here.
function preferredCombos(
	locations: [LocationSlot, LocationSlot, LocationSlot],
	takenTotals: Set<number>,
): LocationValue[][] {
	const all = possibleCombos(locations);
	const nonDuplicate = all.filter(
		(combo) => !takenTotals.has(combo.reduce<number>((sum, v) => sum + v, 0)),
	);
	return nonDuplicate.length > 0 ? nonDuplicate : all;
}

// Whether `value` is still worth offering for this row, given the other rows'
// current values and totals already used by other cards.
function isLocationValueViable(
	locations: [LocationSlot, LocationSlot, LocationSlot],
	rowIndex: number,
	value: LocationValue,
	takenTotals: Set<number>,
): boolean {
	const candidate = [...locations] as [LocationSlot, LocationSlot, LocationSlot];
	candidate[rowIndex] = value;
	return preferredCombos(candidate, takenTotals).length > 0;
}

function locationsTotal(
	locations: [LocationSlot, LocationSlot, LocationSlot],
): number {
	if (locations.some((v) => v === null)) return 0;
	return (locations as LocationValue[]).reduce<number>((sum, v) => sum + v, 0);
}

// If the remaining unset rows only have one possible completion - preferring
// combos that don't duplicate another card's total - fill them in
// automatically rather than making the player click a foregone conclusion.
function withAutoFill(
	locations: [LocationSlot, LocationSlot, LocationSlot],
	takenTotals: Set<number>,
): [LocationSlot, LocationSlot, LocationSlot] {
	const nullIndices = locations
		.map((v, i) => (v === null ? i : -1))
		.filter((i) => i !== -1);
	if (nullIndices.length === 0) return locations;

	const combos = preferredCombos(locations, takenTotals);
	if (combos.length !== 1) return locations;

	const remaining = [...combos[0]];
	for (const known of locations) {
		if (known === null) continue;
		remaining.splice(remaining.indexOf(known), 1);
	}

	const result = [...locations] as [LocationSlot, LocationSlot, LocationSlot];
	nullIndices.forEach((rowIndex, i) => {
		result[rowIndex] = remaining[i];
	});
	return result;
}

const EMPTY_CARD: ScratchCard = {
	symbol: "",
	count: 0,
	locations: [null, null, null],
};

// Cards saved before Individual Scratches mode existed have no `locations`
// field at all in localStorage, so it can be undefined at runtime.
function getLocations(
	card: ScratchCard,
): [LocationSlot, LocationSlot, LocationSlot] {
	return card.locations ?? [null, null, null];
}

// Totals already used by the *other* two cards, for duplicate-avoiding
// narrowing while filling in the current card's locations.
function getTakenTotals(
	cards: [ScratchCard, ScratchCard, ScratchCard],
	excludeIndex: number,
): Set<number> {
	return new Set(
		cards
			.filter((_, i) => i !== excludeIndex)
			.map((c) => c.count)
			.filter((count) => count > 0),
	);
}

function ScratchesSection(props: BaseSectionProps<ScratchesData>) {
	// Register with the global settings system
	const { getSetting } = useSectionSettings({
		mapId: "dead-of-the-night",
		sectionId: "scratches",
		sectionName: "Scratches",
		settings: [
			{
				id: "count-mode",
				label: "Counting Method",
				defaultValue: "individual",
				options: [
					{ value: "total", label: "Total Scratches" },
					{ value: "individual", label: "Individual Scratches" },
				],
				note: "Total: enter the final tally directly. Individual: add up the count from each location.",
			},
		],
	});

	const countMode = getSetting("count-mode", "individual") as
		| "total"
		| "individual";

	return (
		<BaseSection
			config={{
				storageKey: "dead-of-the-night-scratches-data",
				defaultValue: {
					cards: [EMPTY_CARD, EMPTY_CARD, EMPTY_CARD],
				},
				title: "Scratches",
				description:
					"Select the zodiac symbols that appear with scratch marks, then record the total count for each. The solution is the symbols ordered from smallest to largest count.",
				resetButtonText: "Reset Scratches",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Finding Scratches",
							text: "Scratch marks spawn in 3 of 7 possible locations: Wine Cellar, Billiards Room, Library, Dining Room, Master Bedroom, Entrance Hall, or Main Hall",
						},
						{
							label: "Counting Scratches",
							text: "Each set has a zodiac symbol and up to 3 scratch mark locations. Count all scratches (0, 3, 4, or 5 per location) for each symbol",
						},
						{
							label: "Counting Modes",
							nested: [
								{
									text: "Total Scratches: if you already know the final tally, enter it directly.",
								},
								{
									text: "Individual Scratches: enter the count observed at each location and the total is calculated for you.",
								},
								{
									text: "If any location shows 4 scratches, exactly one other location will show 3 or 5, and the third will be empty (0).",
								},
							],
						},
						{
							label: "Total Range",
							text: "The total scratch count for each symbol will always be 7, 9, 11, 13, or 15 - never an even number",
						},
						{
							label: "Final Solution",
							text: "Enter the symbols into the greenhouse telescope from smallest to largest scratch count",
						},
					],
				},
			}}
			getProgress={(data: ScratchesData) => {
				const counts = data.cards
					.filter((card) => card.count > 0)
					.map((card) => card.count);
				const hasDuplicates = counts.length !== new Set(counts).size;

				const completeCards = data.cards.filter(
					(card) => card.symbol !== "" && card.count > 0,
				).length;

				return {
					completed: completeCards,
					total: 3,
					isComplete: completeCards === 3 && !hasDuplicates,
				};
			}}
			{...props}
		>
			{({ data, setData, progress }) => {
				// Get symbols that are already assigned to cards
				const getUsedSymbols = () => {
					return data.cards.map((card) => card.symbol).filter((s) => s !== "");
				};

				// Handle symbol selection from the main picker
				const handleSymbolSelect = (_locationId: string, symbolId: string) => {
					// Find first empty card
					const emptyCardIndex = data.cards.findIndex(
						(card) => card.symbol === "",
					);
					if (emptyCardIndex !== -1) {
						setData((prev) => {
							const newCards = [...prev.cards] as [
								ScratchCard,
								ScratchCard,
								ScratchCard,
							];
							newCards[emptyCardIndex] = { ...EMPTY_CARD, symbol: symbolId };
							return { ...prev, cards: newCards };
						});
					}
				};

				// Handle clearing a specific card
				const handleClearCard = (cardIndex: number) => {
					setData((prev) => {
						const newCards = [...prev.cards] as [
							ScratchCard,
							ScratchCard,
							ScratchCard,
						];
						newCards[cardIndex] = { ...EMPTY_CARD };
						return { ...prev, cards: newCards };
					});
				};

				// Handle picking a total directly (Total Scratches mode)
				const handleTotalSelect = (cardIndex: number, total: number) => {
					setData((prev) => {
						const newCards = [...prev.cards] as [
							ScratchCard,
							ScratchCard,
							ScratchCard,
						];
						const card = newCards[cardIndex];
						newCards[cardIndex] = {
							...card,
							count: card.count === total ? 0 : total,
						};
						return { ...prev, cards: newCards };
					});
				};

				// Handle picking a location's count (Individual Scratches mode)
				const handleLocationSelect = (
					cardIndex: number,
					rowIndex: number,
					value: LocationValue,
				) => {
					setData((prev) => {
						const newCards = [...prev.cards] as [
							ScratchCard,
							ScratchCard,
							ScratchCard,
						];
						const card = newCards[cardIndex];
						const cardLocations = getLocations(card);
						const takenTotals = getTakenTotals(prev.cards, cardIndex);
						const isSelected = cardLocations[rowIndex] === value;
						if (
							!isSelected &&
							!isLocationValueViable(cardLocations, rowIndex, value, takenTotals)
						) {
							return prev;
						}
						const newLocations = [...cardLocations] as [
							LocationSlot,
							LocationSlot,
							LocationSlot,
						];
						newLocations[rowIndex] = isSelected ? null : value;
						const filledLocations = withAutoFill(newLocations, takenTotals);
						newCards[cardIndex] = {
							...card,
							locations: filledLocations,
							count: locationsTotal(filledLocations),
						};
						return { ...prev, cards: newCards };
					});
				};

				// Get sorted results (smallest to largest count) as SequenceItems
				const getSortedResults = (): SequenceItem[] => {
					const completeCards = data.cards
						.filter((card) => card.symbol !== "" && card.count > 0)
						.sort((a, b) => a.count - b.count)
						.map((card, index) => {
							const symbolData = ZODIAC_SYMBOLS.find(
								(s) => s.id === card.symbol,
							);
							return {
								id: card.symbol,
								order: index + 1,
								image: symbolData?.component,
								status: "complete" as const,
							};
						});

					// Add pending items to show 3 total positions
					const pendingCount = 3 - completeCards.length;
					const pendingItems: SequenceItem[] = Array.from(
						{ length: pendingCount },
						(_, i) => ({
							id: `pending-${i}`,
							order: completeCards.length + i + 1,
							status: "pending" as const,
						}),
					);

					return [...completeCards, ...pendingItems];
				};

				const sortedResults = getSortedResults();

				// Check if a count is used on another card
				const isCountDuplicate = (count: number, currentCardIndex: number) => {
					if (count === 0) return false;
					return data.cards.some(
						(card, index) => index !== currentCardIndex && card.count === count,
					);
				};

				return (
					<div className="scratches-section">
						{/* Zodiac Symbol Picker */}
						<div className="zodiac-picker-section">
							<h3>Select Zodiac Symbols</h3>
							<p>
								Choose the symbols that appear with scratch marks in your game:
							</p>
							<SymbolPicker
								symbols={ZODIAC_SYMBOLS}
								selectedSymbol=""
								onSymbolChange={handleSymbolSelect}
								usedSymbols={getUsedSymbols()}
								locationId="zodiac-picker"
								className="zodiac-picker symbol-picker--zodiac"
								allowDeselect={false}
								greyOutUnselected={false}
							/>
						</div>

						{/* Scratch Cards */}
						<div className="scratch-cards">
							{data.cards.map((card, index) => {
								const symbolData = ZODIAC_SYMBOLS.find(
									(s) => s.id === card.symbol,
								);
								const SymbolComponent = symbolData?.component;
								const hasSymbol = card.symbol !== "";
								const hasCount = card.count > 0;
								const isDuplicate = isCountDuplicate(card.count, index);
								const isComplete = hasSymbol && hasCount && !isDuplicate;
								const cardLocations = getLocations(card);
								const takenTotals = getTakenTotals(data.cards, index);

								return (
									<div
										key={index}
										className={`scratch-card ${
											isComplete ? "scratch-card--complete" : ""
										} ${hasSymbol ? "scratch-card--has-symbol" : ""} ${
											isDuplicate ? "scratch-card--error" : ""
										}`}
									>
										<div className="scratch-card-header">
											<h4>Set {index + 1}</h4>
											{hasSymbol && (
												<button
													type="button"
													className="clear-card-btn"
													onClick={() => handleClearCard(index)}
													aria-label="Clear this card"
												>
													×
												</button>
											)}
										</div>

										{hasSymbol ? (
											<>
												{/* Symbol Display */}
												<div className="card-symbol">
													{SymbolComponent && <SymbolComponent />}
													<span className="symbol-name">
														{
															ZODIAC_SYMBOLS.find((s) => s.id === card.symbol)
																?.name
														}
													</span>
												</div>

												{/* Count Input */}
												<div className="card-count-input">
													{countMode === "total" ? (
														<>
															<label>Total Scratches:</label>
															<div className="scratch-total-buttons">
																{TOTAL_OPTIONS.map((total) => (
																	<button
																		key={total}
																		type="button"
																		className={`scratch-option-btn ${
																			card.count === total
																				? "scratch-option-btn--selected"
																				: ""
																		}`}
																		onClick={() =>
																			handleTotalSelect(index, total)
																		}
																	>
																		{total}
																	</button>
																))}
															</div>
														</>
													) : (
														<>
															<label>Scratches per Location:</label>
															<div className="scratch-location-rows">
																{cardLocations.map((locationValue, rowIndex) => (
																	<div
																		key={rowIndex}
																		className="scratch-location-row"
																	>
																		<span className="scratch-location-row__label">
																			Location {rowIndex + 1}
																		</span>
																		<div className="scratch-location-buttons">
																			{LOCATION_OPTIONS.map((value) => {
																				const isSelected =
																					locationValue === value;
																				const isViable =
																					isSelected ||
																					isLocationValueViable(
																						cardLocations,
																						rowIndex,
																						value,
																						takenTotals,
																					);
																				return (
																					<button
																						key={value}
																						type="button"
																						className={`scratch-option-btn ${
																							isSelected
																								? "scratch-option-btn--selected"
																								: ""
																						}`}
																						disabled={!isViable}
																						onClick={() =>
																							handleLocationSelect(
																								index,
																								rowIndex,
																								value,
																							)
																						}
																					>
																						{value}
																					</button>
																				);
																			})}
																		</div>
																	</div>
																))}
															</div>
															<div className="scratch-location-total">
																Total:{" "}
																{card.count > 0 ? card.count : "—"}
															</div>
														</>
													)}
													{isDuplicate && (
														<span className="error-text">
															This total is already used on another card
														</span>
													)}
												</div>
											</>
										) : (
											<div className="card-empty-state">
												<p>Select a symbol above</p>
											</div>
										)}
									</div>
								);
							})}
						</div>

						{/* Results Display */}
						<ResultsDisplay
							variant="sequence"
							sequenceItems={sortedResults}
							title={
								progress.isComplete
									? "🎉 Telescope Solution Complete!"
									: "🔭 Telescope Solution (Smallest to Largest)"
							}
							description={
								progress.isComplete
									? "Enter these symbols in this order into the greenhouse telescope:"
									: "Symbols collected so far:"
							}
							showIncomplete={true}
							totalExpected={3}
							progressMode="badge"
							colorScheme="success"
							progress={progress}
						/>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default ScratchesSection;

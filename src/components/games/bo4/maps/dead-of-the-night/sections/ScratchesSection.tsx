import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { SymbolPicker, ResultsDisplay } from "@/components/ui";
import { MovementSlider } from "@/components/ui";
import { MovementStepper } from "@/components/ui";
import { MovementButtons } from "@/components/ui";
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

// Data interface for this section
interface ScratchCard {
	symbol: string;
	count: number;
}

interface ScratchesData {
	cards: [ScratchCard, ScratchCard, ScratchCard];
}

const MIN_SCRATCHES = 7;
const MAX_SCRATCHES = 15;

function ScratchesSection(props: BaseSectionProps<ScratchesData>) {
	// Register with the global settings system
	const { getSetting } = useSectionSettings({
		mapId: "dead-of-the-night",
		sectionId: "scratches",
		sectionName: "Scratches",
		settings: [
			{
				id: "input-method",
				label: "Input Method",
				defaultValue: "sliders",
				options: [
					{ value: "sliders", label: "Sliders (range controls)" },
					{ value: "steppers", label: "Steppers (+/- buttons)" },
					{ value: "buttons", label: "Button Grid" },
					{ value: "text", label: "Text Input" },
				],
				note: "How you input scratch mark totals (7-15)",
			}
		],
	});

	// Get input method from settings
	const inputMethod = getSetting("input-method", "sliders") as string;

	return (
		<BaseSection
			config={{
				storageKey: "dead-of-the-night-scratches-data",
				defaultValue: {
					cards: [
						{ symbol: "", count: 0 },
						{ symbol: "", count: 0 },
						{ symbol: "", count: 0 },
					],
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
							label: "Total Range",
							text: "The total scratch count for each symbol will be between 7 and 15",
						},
						{
							label: "Final Solution",
							text: "Enter the symbols into the greenhouse telescope from smallest to largest scratch count",
						},
					],
				},
			}}
			getProgress={(data: ScratchesData) => {
				// Check for duplicate counts
				const counts = data.cards
					.filter((card) => card.count >= MIN_SCRATCHES)
					.map((card) => card.count);
				const hasDuplicates = counts.length !== new Set(counts).size;

				const completeCards = data.cards.filter(
					(card) => card.symbol !== "" && card.count >= MIN_SCRATCHES
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
						(card) => card.symbol === ""
					);
					if (emptyCardIndex !== -1) {
						setData((prev) => {
							const newCards = [...prev.cards] as [
								ScratchCard,
								ScratchCard,
								ScratchCard
							];
							newCards[emptyCardIndex] = { symbol: symbolId, count: 0 };
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
							ScratchCard
						];
						newCards[cardIndex] = { symbol: "", count: 0 };
						return { ...prev, cards: newCards };
					});
				};

				// Handle count change for a card
				const handleCountChange = (cardIndex: number, count: number) => {
					setData((prev) => {
						const newCards = [...prev.cards] as [
							ScratchCard,
							ScratchCard,
							ScratchCard
						];
						newCards[cardIndex] = { ...newCards[cardIndex], count };
						return { ...prev, cards: newCards };
					});
				};

				// Handle text input change
				const handleTextInputChange = (cardIndex: number, value: string) => {
					// Allow empty or valid numbers
					if (value === "" || /^\d+$/.test(value)) {
						const numValue = value === "" ? 0 : parseInt(value);
						handleCountChange(cardIndex, numValue);
					}
				};

				// Get sorted results (smallest to largest count) as SequenceItems
				const getSortedResults = (): SequenceItem[] => {
					const completeCards = data.cards
						.filter((card) => card.symbol !== "" && card.count >= MIN_SCRATCHES)
						.sort((a, b) => a.count - b.count)
						.map((card, index) => {
							const symbolData = ZODIAC_SYMBOLS.find(
								(s) => s.id === card.symbol
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
						})
					);

					return [...completeCards, ...pendingItems];
				};

				const sortedResults = getSortedResults();

				// Check if a count is out of valid range
				const isCountOutOfRange = (count: number) => {
					return (
						count !== 0 && (count < MIN_SCRATCHES || count > MAX_SCRATCHES)
					);
				};

				// Check if a count is used on another card
				const isCountDuplicate = (count: number, currentCardIndex: number) => {
					if (count === 0) return false;
					return data.cards.some(
						(card, index) =>
							index !== currentCardIndex &&
							card.count === count &&
							card.count >= MIN_SCRATCHES
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
								className="zodiac-picker"
								gridConfig={{ columns: 12, rows: 1 }}
								allowDeselect={false}
								greyOutUnselected={false}
							/>
						</div>

						{/* Scratch Cards */}
						<div className="scratch-cards">
							{data.cards.map((card, index) => {
								const symbolData = ZODIAC_SYMBOLS.find(
									(s) => s.id === card.symbol
								);
								const SymbolComponent = symbolData?.component;
								const hasSymbol = card.symbol !== "";
								const hasCount = card.count >= MIN_SCRATCHES;
								const outOfRange = isCountOutOfRange(card.count);
								const isDuplicate = isCountDuplicate(card.count, index);
								const hasError = outOfRange || isDuplicate;
								const isComplete = hasSymbol && hasCount && !hasError;

								return (
									<div
										key={index}
										className={`scratch-card ${
											isComplete ? "scratch-card--complete" : ""
										} ${hasSymbol ? "scratch-card--has-symbol" : ""} ${
											hasError ? "scratch-card--error" : ""
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
													<label>Scratch Count:</label>

													{inputMethod === "text" && (
														<div className="text-input-wrapper">
															<input
																type="text"
																inputMode="numeric"
																value={card.count === 0 ? "" : card.count}
																onChange={(e) =>
																	handleTextInputChange(index, e.target.value)
																}
																placeholder="0"
																className={`scratch-count-input ${
																	outOfRange || isDuplicate
																		? "scratch-count-input--error"
																		: ""
																}`}
															/>
															{outOfRange && (
																<span className="error-text">
																	Must be between {MIN_SCRATCHES}-
																	{MAX_SCRATCHES}
																</span>
															)}
															{!outOfRange && isDuplicate && (
																<span className="error-text">
																	This count is already used on another card
																</span>
															)}
														</div>
													)}

													{inputMethod === "sliders" && (
														<div className="slider-wrapper">
															<MovementSlider
																locationId={`card-${index}`}
																label="Scratches"
																movement={card.count}
																limits={{
																	min: MIN_SCRATCHES,
																	max: MAX_SCRATCHES,
																}}
																displayFormat="time"
																movementToTime={(count: number) =>
																	count.toString()
																}
																onChange={(_: string, count: number) =>
																	handleCountChange(index, count)
																}
															/>
														</div>
													)}

													{inputMethod === "steppers" && (
														<div className="stepper-wrapper">
															<MovementStepper
																locationId={`card-${index}`}
																label="Scratches"
																movement={card.count}
																limits={{
																	min: MIN_SCRATCHES,
																	max: MAX_SCRATCHES,
																}}
																displayFormat="time"
																movementToTime={(count: number) =>
																	count.toString()
																}
																onChange={(_: string, count: number) =>
																	handleCountChange(index, count)
																}
															/>
														</div>
													)}

													{inputMethod === "buttons" && (
														<div className="buttons-wrapper">
															<MovementButtons
																locationId={`card-${index}`}
																label="Scratches"
																movement={card.count}
																limits={{
																	min: MIN_SCRATCHES,
																	max: MAX_SCRATCHES,
																}}
																displayFormat="time"
																movementToTime={(count: number) =>
																	count.toString()
																}
																onChange={(_: string, count: number) =>
																	handleCountChange(index, count)
																}
															/>
														</div>
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

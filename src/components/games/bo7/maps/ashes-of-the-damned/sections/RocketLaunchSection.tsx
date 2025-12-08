import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import MultiSelectSymbolPicker from "@/components/ui/MultiSelectSymbolPicker";
import type { MultiSelectSymbol } from "@/components/ui/MultiSelectSymbolPicker";
import { useSectionSettings } from "@/hooks/useSectionSettings";

// Import all pig-pen symbols
import PigPenA from "@/assets/symbols/pig-pen/pig-pen-a.svg";
import PigPenB from "@/assets/symbols/pig-pen/pig-pen-b.svg";
import PigPenC from "@/assets/symbols/pig-pen/pig-pen-c.svg";
import PigPenD from "@/assets/symbols/pig-pen/pig-pen-d.svg";
import PigPenE from "@/assets/symbols/pig-pen/pig-pen-e.svg";
import PigPenF from "@/assets/symbols/pig-pen/pig-pen-f.svg";
import PigPenG from "@/assets/symbols/pig-pen/pig-pen-g.svg";
import PigPenH from "@/assets/symbols/pig-pen/pig-pen-h.svg";
import PigPenI from "@/assets/symbols/pig-pen/pig-pen-i.svg";
import PigPenJ from "@/assets/symbols/pig-pen/pig-pen-j.svg";
import PigPenK from "@/assets/symbols/pig-pen/pig-pen-k.svg";
import PigPenL from "@/assets/symbols/pig-pen/pig-pen-l.svg";
import PigPenM from "@/assets/symbols/pig-pen/pig-pen-m.svg";
import PigPenN from "@/assets/symbols/pig-pen/pig-pen-n.svg";
import PigPenO from "@/assets/symbols/pig-pen/pig-pen-o.svg";
import PigPenP from "@/assets/symbols/pig-pen/pig-pen-p.svg";
import PigPenQ from "@/assets/symbols/pig-pen/pig-pen-q.svg";
import PigPenR from "@/assets/symbols/pig-pen/pig-pen-r.svg";
import PigPenS from "@/assets/symbols/pig-pen/pig-pen-s.svg";
import PigPenT from "@/assets/symbols/pig-pen/pig-pen-t.svg";
import PigPenU from "@/assets/symbols/pig-pen/pig-pen-u.svg";
import PigPenV from "@/assets/symbols/pig-pen/pig-pen-v.svg";
import PigPenW from "@/assets/symbols/pig-pen/pig-pen-w.svg";
import PigPenX from "@/assets/symbols/pig-pen/pig-pen-x.svg";
import PigPenY from "@/assets/symbols/pig-pen/pig-pen-y.svg";
import PigPenZ from "@/assets/symbols/pig-pen/pig-pen-z.svg";

interface RocketLaunchData {
	selectedSymbols: string[];
	mode: "symbol-select" | "cheat-sheet";
	selectedWord?: string;
}

// Word data with their letter-to-number mappings (A=00, B=01, etc.)
const WORDS = [
	{
		word: "ROCKET",
		letters: ["R", "O", "C", "K", "E", "T"],
		numbers: ["17", "14", "02", "10", "04", "19"],
	},
	{
		word: "ENGINE",
		letters: ["E", "N", "G", "I", "N", "E"],
		numbers: ["04", "13", "06", "08", "13", "04"],
	},
	{
		word: "LAUNCH",
		letters: ["L", "A", "U", "N", "C", "H"],
		numbers: ["11", "00", "20", "13", "02", "07"],
	},
	{
		word: "WEAPON",
		letters: ["W", "E", "A", "P", "O", "N"],
		numbers: ["22", "04", "00", "15", "14", "13"],
	},
];

// Calculate which letters appear in any of the words
const USED_LETTERS = new Set(
	WORDS.flatMap((word) => word.letters.map((l) => l.toLowerCase()))
);

// All pig-pen symbol mappings
const ALL_SYMBOLS = [
	{ letter: "A", component: PigPenA },
	{ letter: "B", component: PigPenB },
	{ letter: "C", component: PigPenC },
	{ letter: "D", component: PigPenD },
	{ letter: "E", component: PigPenE },
	{ letter: "F", component: PigPenF },
	{ letter: "G", component: PigPenG },
	{ letter: "H", component: PigPenH },
	{ letter: "I", component: PigPenI },
	{ letter: "J", component: PigPenJ },
	{ letter: "K", component: PigPenK },
	{ letter: "L", component: PigPenL },
	{ letter: "M", component: PigPenM },
	{ letter: "N", component: PigPenN },
	{ letter: "O", component: PigPenO },
	{ letter: "P", component: PigPenP },
	{ letter: "Q", component: PigPenQ },
	{ letter: "R", component: PigPenR },
	{ letter: "S", component: PigPenS },
	{ letter: "T", component: PigPenT },
	{ letter: "U", component: PigPenU },
	{ letter: "V", component: PigPenV },
	{ letter: "W", component: PigPenW },
	{ letter: "X", component: PigPenX },
	{ letter: "Y", component: PigPenY },
	{ letter: "Z", component: PigPenZ },
];

// Filter to only show symbols that appear in the words (15 unique letters)
// This creates a more compact 2-row layout instead of 3 rows
const PIG_PEN_SYMBOLS: MultiSelectSymbol[] = ALL_SYMBOLS.filter((symbol) =>
	USED_LETTERS.has(symbol.letter.toLowerCase())
).map((symbol) => ({
	id: symbol.letter.toLowerCase(),
	label: symbol.letter,
	component: symbol.component as unknown as React.ComponentType<
		React.SVGProps<SVGSVGElement>
	>,
}));

function RocketLaunchSection(props: BaseSectionProps<RocketLaunchData>) {
	// Register with the global settings system
	const { getSetting } = useSectionSettings({
		mapId: "ashes-of-the-damned",
		sectionId: "rocket-launch",
		sectionName: "Rocket Launch",
		settings: [
			{
				id: "display-mode",
				label: "Display Mode",
				defaultValue: "symbol-select",
				options: [
					{ value: "symbol-select", label: "Symbol Select" },
					{ value: "cheat-sheet", label: "Cheat Sheet" },
				],
				note: "Symbol Select: Progressive elimination. Cheat Sheet: Quick reference.",
			},
		],
	});

	// Get display mode from settings
	const displayMode = getSetting("display-mode", "symbol-select") as "symbol-select" | "cheat-sheet";

	return (
		<BaseSection
			config={{
				storageKey: "ashes-of-the-damned-rocket-launch-data",
				defaultValue: { selectedSymbols: [], mode: "symbol-select" },
				title: "Rocket Launch",
				description:
					"Use the Necrofluid Gauntlet to slow the spinning antennae, then decode the symbols in the launch control room",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Step 1",
							text: "Use the Necrofluid Gauntlet to slow the spinning antennae at the Cosmodrone",
						},
						{
							label: "Step 2",
							text: "Enter the launch control room and observe the first bank of screens showing 2 pig-pen symbols (6 symbols total cycling through)",
						},
						{
							label: "Step 3",
							text: "The symbols spell out one of 4 words: ROCKET, ENGINE, LAUNCH, or WEAPON",
						},
						{
							label: "Step 4",
							text: "Shoot the red dots on the second bank of 6 screens to lock in the numbers corresponding to each letter (A=00, B=01, E=04, etc.)",
						},
						{
							label: "Location",
							text: "Launch control room at Cosmodrone",
						},
					],
				},
			}}
			getProgress={(data: RocketLaunchData) => {
				if (displayMode === "cheat-sheet") {
					return {
						completed: data.selectedWord ? 1 : 0,
						total: 1,
						isComplete: Boolean(data.selectedWord),
					};
				}
				// Symbol select mode - need to identify the word
				const possibleWords = getPossibleWords(data.selectedSymbols);
				return {
					completed: possibleWords.length === 1 ? 1 : 0,
					total: 1,
					isComplete: possibleWords.length === 1,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				// Helper function to get possible words based on selected symbols
				const getPossibleWords = (selectedSymbols: string[]) => {
					if (selectedSymbols.length === 0) {
						return WORDS;
					}

					return WORDS.filter((wordData) => {
						// Check if all selected symbols appear in this word
						return selectedSymbols.every((symbol) => {
							const letter = symbol.toUpperCase();
							return wordData.letters.includes(letter);
						});
					});
				};

				const handleSymbolSelect = (symbolId: string) => {
					const isSelected = data.selectedSymbols.includes(symbolId);

					if (isSelected) {
						// Deselect symbol
						setData({
							...data,
							selectedSymbols: data.selectedSymbols.filter(
								(id) => id !== symbolId
							),
						});
					} else {
						// Select symbol
						setData({
							...data,
							selectedSymbols: [...data.selectedSymbols, symbolId],
						});
					}
				};

				const handleWordSelect = (word: string) => {
					setData({
						...data,
						selectedWord: data.selectedWord === word ? undefined : word,
					});
				};

				const possibleWords = getPossibleWords(data.selectedSymbols);
				const confirmedWord =
					possibleWords.length === 1 ? possibleWords[0] : null;

				return (
					<>
						{displayMode === "symbol-select" ? (
							<div className="rocket-launch-section">
								<div className="rocket-launch-section__instructions">
									<p>
										Select the pig-pen symbols you see on the first bank of
										screens to identify the word
									</p>
								</div>

								<MultiSelectSymbolPicker
									symbols={PIG_PEN_SYMBOLS}
									selectedSymbols={data.selectedSymbols}
									onSymbolClick={handleSymbolSelect}
									showLabel={true}
								/>

								{/* Show possible words as they narrow down */}
								{data.selectedSymbols.length > 0 && (
									<div className="rocket-launch-section__results">
										{confirmedWord ? (
											<div className="rocket-launch-section__confirmed rocket-launch-section__result--success">
												<h4>Word Identified</h4>
												<div className="rocket-launch-section__word-display">
													<div className="word-title">{confirmedWord.word}</div>
													<div className="word-symbols">
														{confirmedWord.letters.map((letter, index) => {
															const symbolData = PIG_PEN_SYMBOLS.find(
																(s) => s.label === letter
															);
															const SymbolComponent = symbolData?.component;
															return (
																<div
																	key={index}
																	className="word-symbols__item"
																>
																	{SymbolComponent && (
																		<SymbolComponent className="symbol-icon" />
																	)}
																</div>
															);
														})}
													</div>
												</div>
												<div className="rocket-launch-section__numbers">
													<h5>Screen Numbers to Shoot</h5>
													<div className="numbers-grid">
														{confirmedWord.numbers.map((number, index) => (
															<div key={index} className="number-cell">
																<div className="number-label">
																	Screen {index + 1}
																</div>
																<div className="number-value">{number}</div>
															</div>
														))}
													</div>
												</div>
											</div>
										) : possibleWords.length > 0 ? (
											<div className="rocket-launch-section__multiple rocket-launch-section__result--warning">
												<h4>Possible Words</h4>
												<p>
													Select more symbols to narrow down to a single word
												</p>
												<div className="possible-words">
													{possibleWords.map((wordData) => (
														<div key={wordData.word} className="possible-word">
															{wordData.word}
														</div>
													))}
												</div>
											</div>
										) : (
											<div className="rocket-launch-section__error rocket-launch-section__result--error">
												<h4>No Matching Words</h4>
												<p className="error-message">
													The selected symbols do not match any of the 4 possible
													words. Please review your selections.
												</p>
												<p className="error-suggestion">
													<strong>Tip:</strong> Each word uses only certain
													letters. Try deselecting some symbols to see possible
													matches.
												</p>
											</div>
										)}
									</div>
								)}
							</div>
						) : (
							<div className="rocket-launch-section rocket-launch-section--cheat-sheet">
								<div className="rocket-launch-section__instructions">
									<p>
										Click on a word to view its corresponding screen numbers
									</p>
								</div>

								<div className="cheat-sheet">
									{WORDS.map((wordData) => {
										const isSelected = data.selectedWord === wordData.word;

										return (
											<button
												key={wordData.word}
												className={`cheat-sheet__row ${
													isSelected ? "cheat-sheet__row--selected" : ""
												}`}
												onClick={() => handleWordSelect(wordData.word)}
											>
												<div className="cheat-sheet__word">
													{wordData.word}
												</div>
												<div className="cheat-sheet__symbols">
													{wordData.letters.map((letter, index) => {
														const symbolData = PIG_PEN_SYMBOLS.find(
															(s) => s.label === letter
														);
														const SymbolComponent = symbolData?.component;
														return (
															<div
																key={index}
																className="cheat-sheet__symbol"
															>
																{SymbolComponent && (
																	<SymbolComponent className="symbol-icon" />
																)}
															</div>
														);
													})}
												</div>
												<div className="cheat-sheet__numbers">
													{wordData.numbers.join(" - ")}
												</div>
											</button>
										);
									})}
								</div>

								{data.selectedWord && (
									<div className="rocket-launch-section__results">
										<div className="rocket-launch-section__confirmed">
											<h4>Screen Numbers to Shoot</h4>
											<div className="rocket-launch-section__numbers">
												<div className="numbers-grid">
													{WORDS.find((w) => w.word === data.selectedWord)
														?.numbers.map((number, index) => (
															<div key={index} className="number-cell">
																<div className="number-label">
																	Screen {index + 1}
																</div>
																<div className="number-value">{number}</div>
															</div>
														))}
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						)}
					</>
				);
			}}
		</BaseSection>
	);
}

// Helper function for progress calculation (defined outside component)
function getPossibleWords(selectedSymbols: string[]) {
	if (selectedSymbols.length === 0) {
		return WORDS;
	}

	return WORDS.filter((wordData) => {
		return selectedSymbols.every((symbol) => {
			const letter = symbol.toUpperCase();
			return wordData.letters.includes(letter);
		});
	});
}

export default RocketLaunchSection;

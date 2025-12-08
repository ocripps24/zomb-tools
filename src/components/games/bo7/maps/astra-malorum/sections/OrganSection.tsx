import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { ResultsDisplay } from "@/components/ui";
import { useSectionSettings } from "@/hooks/useSectionSettings";

// Import symbols
import Symbol1 from "@/assets/maps/bo7/astra-malorum/astra-malorum-symbol-1.svg";
import Symbol2 from "@/assets/maps/bo7/astra-malorum/astra-malorum-symbol-2.svg";
import Symbol3 from "@/assets/maps/bo7/astra-malorum/astra-malorum-symbol-3.svg";
import Symbol4 from "@/assets/maps/bo7/astra-malorum/astra-malorum-symbol-4.svg";
import Symbol5 from "@/assets/maps/bo7/astra-malorum/astra-malorum-symbol-5.svg";

interface OrganData {
	sequence: Array<string>; // Array of symbol IDs or "static"
}

type SymbolId = "symbol-1" | "symbol-2" | "symbol-3" | "symbol-4" | "symbol-5";

const SYMBOLS = [
	{
		id: "symbol-1" as SymbolId,
		component: Symbol1 as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		order: 1,
	},
	{
		id: "symbol-2" as SymbolId,
		component: Symbol2 as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		order: 2,
	},
	{
		id: "symbol-3" as SymbolId,
		component: Symbol3 as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		order: 3,
	},
	{
		id: "symbol-4" as SymbolId,
		component: Symbol4 as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		order: 4,
	},
	{
		id: "symbol-5" as SymbolId,
		component: Symbol5 as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		order: 5,
	},
];

function OrganSection(props: BaseSectionProps<OrganData>) {
	// Register with the global settings system (no custom settings needed)
	useSectionSettings({
		mapId: "astra-malorum",
		sectionId: "organ",
		sectionName: "Organ / Mars",
		settings: [],
	});

	return (
		<BaseSection
			config={{
				storageKey: "astra-malorum-organ-data",
				defaultValue: { sequence: [] },
				title: "Organ / Mars",
				description:
					"Record the symbol sequence from the organ in the Pack-a-Punch room, then interact with the columns on Mars in that order.",
				resetButtonText: "Clear Sequence",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Organ Location",
							text: "Find the organ in the Pack-a-Punch room",
						},
						{
							label: "Recording Sequence",
							text: "The organ plays 5 tones but only shows 4 symbols - use STATIC for the missing symbol position",
						},
						{
							label: "Mars Columns",
							text: "Travel to Mars and interact with the 5 columns in the sequence shown, replacing STATIC with the missing symbol",
						},
					],
				},
			}}
			getProgress={(data: OrganData) => {
				const isComplete = data.sequence.length === 5;
				return {
					completed: isComplete ? 1 : 0,
					total: 1,
					isComplete,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const handleSymbolClick = (symbolId: SymbolId | "static") => {
					// Don't add if sequence is full
					if (data.sequence.length >= 5) return;

					// Don't add if this symbol is already in the sequence (except static can only be added once too)
					if (data.sequence.includes(symbolId)) return;

					setData({
						...data,
						sequence: [...data.sequence, symbolId],
					});
				};

				// Get which symbols have been used
				const usedSymbols = new Set(data.sequence);

				// Get the missing symbol (the one not in the sequence)
				const getMissingSymbol = (): SymbolId | null => {
					const allSymbolIds: SymbolId[] = SYMBOLS.map((s) => s.id);
					const symbolsInSequence = data.sequence.filter(
						(id) => id !== "static"
					) as SymbolId[];

					const missing = allSymbolIds.find(
						(id) => !symbolsInSequence.includes(id)
					);
					return missing || null;
				};

				const missingSymbol = getMissingSymbol();
				const isComplete = data.sequence.length === 5;

				return (
					<div className="organ-section">
						{/* Symbol Picker */}
						<div className="symbol-picker-block">
							<h3>Select Symbols & STATIC</h3>
							<p className="block-description">
								Click symbols and STATIC in the order they appear on the organ
								screen
							</p>

							<div className="symbol-picker">
								{/* Static button first */}
								<button
									className={`symbol-btn symbol-btn--static ${
										usedSymbols.has("static") ? "symbol-btn--disabled" : ""
									}`}
									onClick={() => handleSymbolClick("static")}
									disabled={
										data.sequence.length >= 5 || usedSymbols.has("static")
									}
								>
									{usedSymbols.has("static") && (
										<span className="symbol-btn__order">
											{data.sequence.indexOf("static") + 1}
										</span>
									)}
									<div className="symbol-btn__content">
										<div className="static-indicator">STATIC</div>
									</div>
								</button>

								{/* Then symbols in order */}
								{SYMBOLS.map((symbol) => {
									const SymbolComponent = symbol.component;
									const isUsed = usedSymbols.has(symbol.id);
									const selectionIndex = data.sequence.indexOf(symbol.id);
									const orderNumber = isUsed ? selectionIndex + 1 : null;

									return (
										<button
											key={symbol.id}
											className={`symbol-btn ${
												isUsed ? "symbol-btn--disabled" : ""
											}`}
											onClick={() => handleSymbolClick(symbol.id)}
											disabled={data.sequence.length >= 5 || isUsed}
										>
											{isUsed && (
												<span className="symbol-btn__order">
													{orderNumber}
												</span>
											)}
											<div className="symbol-btn__content">
												<SymbolComponent className="symbol-icon" />
											</div>
										</button>
									);
								})}
							</div>
						</div>

						{/* Results Display */}
						{data.sequence.length > 0 && (
							<div className="organ-section__results">
								<h4>{isComplete ? "Mars Column Sequence" : "Current Sequence"}</h4>
								<p className="result-instruction">
									{isComplete
										? "Interact with the columns on Mars in this order (STATIC has been replaced with the missing symbol):"
										: "Your current sequence from the organ (continue adding symbols):"}
								</p>

								<ResultsDisplay
									variant="sequence"
									showIncomplete={true}
									totalExpected={5}
									sequenceItems={data.sequence.map((item, index) => {
										// Only replace static with the missing symbol when complete
										const displayId =
											item === "static" && isComplete && missingSymbol
												? missingSymbol
												: item;

										// Handle STATIC display
										if (displayId === "static") {
											return {
												id: `${index}-static`,
												order: index + 1,
												value: "TBC",
											};
										}

										// Handle symbol display
										const symbol = SYMBOLS.find((s) => s.id === displayId);
										return {
											id: `${index}-${displayId}`,
											order: index + 1,
											image: symbol?.component,
										};
									})}
								/>
							</div>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default OrganSection;

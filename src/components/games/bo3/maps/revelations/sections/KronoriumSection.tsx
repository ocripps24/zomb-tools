import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { useSectionSettings } from "@/hooks/useSectionSettings";

// Import Runes of Creation symbols
import Symbol1 from "@/assets/maps/bo3/revelations/revelations-symbol-1.svg";
import Symbol2 from "@/assets/maps/bo3/revelations/revelations-symbol-2.svg";
import Symbol3 from "@/assets/maps/bo3/revelations/revelations-symbol-3.svg";
import Symbol4 from "@/assets/maps/bo3/revelations/revelations-symbol-4.svg";

type SymbolId = "symbol-1" | "symbol-2" | "symbol-3" | "symbol-4";

type SvgComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface Symbol {
	id: SymbolId;
	component: SvgComponent;
}

// Displayed in the same order the runes always appear in the player's HUD
const SYMBOLS: Symbol[] = [
	{ id: "symbol-1", component: Symbol1 as unknown as SvgComponent },
	{ id: "symbol-2", component: Symbol2 as unknown as SvgComponent },
	{ id: "symbol-3", component: Symbol3 as unknown as SvgComponent },
	{ id: "symbol-4", component: Symbol4 as unknown as SvgComponent },
];

interface KronoriumData {
	sequence: SymbolId[];
}

const DEFAULT_DATA: KronoriumData = { sequence: [] };

const ORDINALS = ["1st", "2nd", "3rd", "4th"];

function KronoriumSection(props: BaseSectionProps<KronoriumData>) {
	useSectionSettings({
		mapId: "revelations",
		sectionId: "kronorium",
		sectionName: "Kronorium",
		settings: [],
	});

	return (
		<BaseSection
			config={{
				storageKey: "revelations-kronorium-data",
				defaultValue: DEFAULT_DATA,
				title: "Kronorium",
				description:
					"Record the order the Runes of Creation appear in the Kronorium, then enter them in that order on the opposite side of the boss arena.",
				resetButtonText: "Clear Sequence",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Location",
							text: "After being teleported to the boss arena, interact with the Kronorium - it opens and cycles through 4 pages, each showing one symbol.",
						},
						{
							label: "Recording The Order",
							text: "The symbol picker is ordered as they appear in your HUD - enter the order received from the Kronorium. The final symbol will autocomplete.",
						},
						{
							label: "Entering The Code",
							text: "Head to the opposite side of the boss arena to find symbols cycling through, interact with the symbols in your given order to complete the step.",
						},
					],
				},
			}}
			getProgress={(data: KronoriumData) => ({
				completed: data.sequence.length,
				total: 4,
				isComplete: data.sequence.length === 4,
			})}
			{...props}
		>
			{({ data, setData }) => {
				const handleSymbolClick = (symbolId: SymbolId) => {
					if (data.sequence.includes(symbolId)) return;
					if (data.sequence.length >= 4) return;

					let next = [...data.sequence, symbolId];

					// Autocomplete: once 3 are picked, only one symbol remains
					if (next.length === 3) {
						const remaining = SYMBOLS.map((s) => s.id).find(
							(id) => !next.includes(id),
						);
						if (remaining) next = [...next, remaining];
					}

					setData({ sequence: next });
				};

				return (
					<div className="kronorium-section">
						<div className="kronorium-picker">
							{SYMBOLS.map((symbol, index) => {
								const SymbolComponent = symbol.component;
								const isUsed = data.sequence.includes(symbol.id);
								const order = isUsed
									? data.sequence.indexOf(symbol.id) + 1
									: null;

								return (
									<button
										key={symbol.id}
										className={`kronorium-symbol-btn ${
											isUsed ? "kronorium-symbol-btn--used" : ""
										}`}
										onClick={() => handleSymbolClick(symbol.id)}
										disabled={isUsed || data.sequence.length >= 4}
									>
										{isUsed && (
											<span className="kronorium-symbol-btn__order">
												{order}
											</span>
										)}
										<SymbolComponent className="kronorium-symbol-icon" />
										<span className="kronorium-symbol-btn__label">
											Symbol {index + 1}
										</span>
									</button>
								);
							})}
						</div>

						<div className="kronorium-section__results">
							<h4>Kronorium Order</h4>
							<p className="result-instruction">
								Lock in the purple symbols in this order:
							</p>

							<div className="kronorium-results-grid">
								{[0, 1, 2, 3].map((index) => {
									const symbolId = data.sequence[index];
									const symbol = symbolId
										? SYMBOLS.find((s) => s.id === symbolId)
										: undefined;
									const hudNumber = symbol ? SYMBOLS.indexOf(symbol) + 1 : null;
									const SymbolComponent = symbol?.component;

									return (
										<div key={index} className="kronorium-results-slot">
											<span className="kronorium-results-slot__ordinal">
												{ORDINALS[index]}
											</span>
											<div
												className={`kronorium-results-box ${
													symbol
														? "kronorium-results-box--filled"
														: "kronorium-results-box--pending"
												}`}
											>
												{SymbolComponent ? (
													<>
														<SymbolComponent className="kronorium-symbol-icon" />
														<span className="kronorium-symbol-btn__label kronorium-results-box__label">
															Symbol {hudNumber}
														</span>
													</>
												) : (
													<span className="kronorium-results-box__pending-text">
														Pending
													</span>
												)}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default KronoriumSection;

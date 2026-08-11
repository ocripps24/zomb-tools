import { useState } from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { ResultsDisplay } from "@/components/ui";
import { useSectionSettings } from "@/hooks/useSectionSettings";

// Import symbols
import CardSymbol from "@/assets/maps/bo3/der-eisendrache/de-symbol-card.svg";
import CircleSymbol from "@/assets/maps/bo3/der-eisendrache/de-symbol-circle.svg";
import DiamondSymbol from "@/assets/maps/bo3/der-eisendrache/de-symbol-diamond.svg";
import RocketSymbol from "@/assets/maps/bo3/der-eisendrache/de-symbol-rocket.svg";

type SymbolId = "card" | "circle" | "diamond" | "rocket";

type SvgComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface Symbol {
	id: SymbolId;
	name: string;
	component: SvgComponent;
}

const SYMBOLS: Symbol[] = [
	{
		id: "card",
		name: "Card",
		component: CardSymbol as unknown as SvgComponent,
	},
	{
		id: "circle",
		name: "Circle",
		component: CircleSymbol as unknown as SvgComponent,
	},
	{
		id: "diamond",
		name: "Diamond",
		component: DiamondSymbol as unknown as SvgComponent,
	},
	{
		id: "rocket",
		name: "Rocket",
		component: RocketSymbol as unknown as SvgComponent,
	},
];

const SYMBOL_MAP: Record<SymbolId, Symbol> = SYMBOLS.reduce(
	(acc, symbol) => ({ ...acc, [symbol.id]: symbol }),
	{} as Record<SymbolId, Symbol>,
);

interface SimonSaysData {
	safeCode: SymbolId[]; // Up to 3, repeats allowed
	screenPositions: Array<SymbolId | null>; // 4 screens, no repeats
}

const DEFAULT_DATA: SimonSaysData = {
	safeCode: [],
	screenPositions: [null, null, null, null],
};

function SimonSaysSection(props: BaseSectionProps<SimonSaysData>) {
	const [safeCodeOpen, setSafeCodeOpen] = useState(false);

	useSectionSettings({
		mapId: "der-eisendrache",
		sectionId: "simon-says",
		sectionName: "Simon Says",
		settings: [],
	});

	return (
		<BaseSection
			config={{
				storageKey: "der-eisendrache-simon-says-data",
				defaultValue: DEFAULT_DATA,
				title: "Simon Says",
				description:
					"Record the safe code and the Simon Says terminal layout to help complete the Death Ray and Rocket Pad puzzles.",
				resetButtonText: "Clear All",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Safe Code",
							text: "Collect the wisps and travel back in time. After collecting the fuses and a canister, watch Groph lock the safe with a 3-symbol code and note it above",
						},
						{
							label: "Opening the Safe",
							text: "Place fuses in the Death Ray and switch it from Destroy to Protect (activate it first if you haven't already), then enter your safe code at the upper terminals",
						},
						{
							label: "Reward",
							text: "A successful code plays a jingle - run to the teleporter room and grab the keycard and fuses from the now-open safe",
						},
						{
							label: "Starting Simon Says",
							text: "Add one fuse from the safe to each coil at the Death Ray and flip it back from Protect to Destroy, then visit either set of terminals",
						},
						{
							label: "Recording The Layout",
							text: "The 4 terminal screens will briefly show one symbol each before they disappear - record which screen shows which symbol above",
						},
						{
							label: "Playing Simon Says",
							text: "The large screen above will flash symbols one at a time - interact with the matching screen until the round is complete",
						},
						{
							label: "Second Round",
							text: "A successful round will add a wisp to one of the Death Ray coils. Play another round at the other set of terminals",
						},
						{
							label: "Finishing Up",
							text: "Once both rounds are complete, return to the Death Ray, hit the green button, and shoot down Dempsey",
						},
					],
				},
			}}
			getProgress={(data: SimonSaysData) => {
				const completed = data.screenPositions.filter(
					(symbolId) => symbolId !== null,
				).length;
				return {
					completed,
					total: 4,
					isComplete: completed === 4,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const handleSafeCodeClick = (symbolId: SymbolId) => {
					if (data.safeCode.length >= 3) return;
					setData({ ...data, safeCode: [...data.safeCode, symbolId] });
				};

				const handleRemoveLastSafeCode = () => {
					setData({ ...data, safeCode: data.safeCode.slice(0, -1) });
				};

				const handlePositionClick = (
					screenIndex: number,
					symbolId: SymbolId,
				) => {
					const usedElsewhere = data.screenPositions.some(
						(id, idx) => id === symbolId && idx !== screenIndex,
					);
					if (usedElsewhere) return;

					const next = [...data.screenPositions];
					next[screenIndex] = next[screenIndex] === symbolId ? null : symbolId;

					// Autocomplete: once 3 screens are assigned, fill the last one
					const filled = next.filter((id): id is SymbolId => id !== null);
					if (filled.length === 3) {
						const remaining = SYMBOLS.map((s) => s.id).find(
							(id) => !filled.includes(id),
						);
						const emptyIndex = next.findIndex((id) => id === null);
						if (remaining && emptyIndex !== -1) {
							next[emptyIndex] = remaining;
						}
					}

					setData({ ...data, screenPositions: next });
				};

				const handleClearPositions = () => {
					setData({ ...data, screenPositions: [null, null, null, null] });
				};

				const positionsFilled = data.screenPositions.filter(
					(id) => id !== null,
				).length;

				return (
					<div className="simon-says-section">
						{/* Safe Code (collapsible, optional) */}
						<div className="safe-code-panel">
							<div
								className="safe-code-panel__toggle"
								onClick={() => setSafeCodeOpen((v) => !v)}
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										setSafeCodeOpen((v) => !v);
									}
								}}
							>
								<span>Safe Code (Optional)</span>
								<span
									className={`safe-code-panel__chevron ${
										safeCodeOpen ? "safe-code-panel__chevron--open" : ""
									}`}
								>
									▾
								</span>
							</div>

							{safeCodeOpen && (
								<div className="safe-code-panel__body">
									<p className="safe-code-panel__hint">
										Click the symbols in the order Groph enters them on the
										safe. Symbols can repeat.
									</p>

									<div className="simon-symbol-picker">
										{SYMBOLS.map((symbol) => {
											const SymbolComponent = symbol.component;
											return (
												<button
													key={symbol.id}
													className="simon-symbol-btn"
													onClick={() => handleSafeCodeClick(symbol.id)}
													disabled={data.safeCode.length >= 3}
												>
													<SymbolComponent className="simon-symbol-icon" />
												</button>
											);
										})}
									</div>

									{data.safeCode.length > 0 && (
										<>
											<button
												className="safe-code-panel__remove-btn"
												onClick={handleRemoveLastSafeCode}
												type="button"
											>
												Remove Last
											</button>

											<ResultsDisplay
												variant="sequence"
												colorScheme="success"
												sequenceItems={data.safeCode.map((symbolId, index) => ({
													id: `${index}-${symbolId}`,
													order: index + 1,
													image: SYMBOL_MAP[symbolId].component,
												}))}
											/>
										</>
									)}
								</div>
							)}
						</div>

						{/* Simon Says terminal layout */}
						<div className="simon-says-panel">
							<div className="simon-says-panel__header">
								<h3>Terminal Layout</h3>
								{positionsFilled > 0 && (
									<button
										className="simon-says-panel__clear-btn"
										onClick={handleClearPositions}
										type="button"
									>
										Clear for Next Round
									</button>
								)}
							</div>
							<p className="simon-says-panel__hint">
								Before the screens go blank, record which symbol appeared on
								each one. Assign 3 and the 4th fills automatically.
							</p>

							<div className="simon-screens">
								{[0, 1, 2, 3].map((screenIndex) => (
									<div key={screenIndex} className="simon-screen">
										<h4 className="simon-screen__header">
											Screen {screenIndex + 1}
										</h4>
										<div className="simon-symbol-picker">
											{SYMBOLS.map((symbol) => {
												const SymbolComponent = symbol.component;
												const isSelected =
													data.screenPositions[screenIndex] === symbol.id;
												const isUsedElsewhere = data.screenPositions.some(
													(id, idx) => id === symbol.id && idx !== screenIndex,
												);

												return (
													<button
														key={symbol.id}
														className={`simon-symbol-btn ${
															isSelected ? "simon-symbol-btn--selected" : ""
														} ${
															isUsedElsewhere ? "simon-symbol-btn--dimmed" : ""
														}`}
														onClick={() =>
															handlePositionClick(screenIndex, symbol.id)
														}
														disabled={isUsedElsewhere && !isSelected}
													>
														<SymbolComponent className="simon-symbol-icon" />
													</button>
												);
											})}
										</div>
									</div>
								))}
							</div>

							{positionsFilled > 0 && (
								<div className="simon-says-panel__results">
									<h4>Recorded Layout</h4>
									<p className="result-instruction">
										Screens 1 to 4, in order:
									</p>

									<ResultsDisplay
										variant="sequence"
										colorScheme="success"
										sequenceItems={data.screenPositions.map(
											(symbolId, index) => ({
												id: `screen-${index}`,
												order: index + 1,
												image: symbolId
													? SYMBOL_MAP[symbolId].component
													: undefined,
												status: symbolId
													? ("complete" as const)
													: ("pending" as const),
											}),
										)}
									/>
								</div>
							)}
						</div>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default SimonSaysSection;

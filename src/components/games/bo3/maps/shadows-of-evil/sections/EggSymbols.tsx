import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import ResultsDisplay from "@/components/ui/ResultsDisplay";
import { ReferenceImages } from "@/components/ui/ReferenceImages";

// Import symbol SVGs
import Symbol1 from "@/assets/maps/bo3/shadows-of-evil/soe-symbol-1.svg";
import Symbol2 from "@/assets/maps/bo3/shadows-of-evil/soe-symbol-2.svg";
import Symbol3 from "@/assets/maps/bo3/shadows-of-evil/soe-symbol-3.svg";
import Symbol4 from "@/assets/maps/bo3/shadows-of-evil/soe-symbol-4.svg";
import Symbol5 from "@/assets/maps/bo3/shadows-of-evil/soe-symbol-5.svg";
import Symbol6 from "@/assets/maps/bo3/shadows-of-evil/soe-symbol-6.svg";
import Symbol7 from "@/assets/maps/bo3/shadows-of-evil/soe-symbol-7.svg";
import Symbol8 from "@/assets/maps/bo3/shadows-of-evil/soe-symbol-8.svg";
import Symbol9 from "@/assets/maps/bo3/shadows-of-evil/soe-symbol-9.svg";
import symbolsReference from "@/assets/maps/bo3/shadows-of-evil/soe-symbols.jpg";

interface EggSymbolsData {
	selectedSymbols: number[];
}

const SYMBOLS = [
	{
		id: 1,
		component: Symbol1 as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		alt: "Symbol 1",
	},
	{
		id: 2,
		component: Symbol2 as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		alt: "Symbol 2",
	},
	{
		id: 3,
		component: Symbol3 as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		alt: "Symbol 3",
	},
	{
		id: 4,
		component: Symbol4 as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		alt: "Symbol 4",
	},
	{
		id: 5,
		component: Symbol5 as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		alt: "Symbol 5",
	},
	{
		id: 6,
		component: Symbol6 as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		alt: "Symbol 6",
	},
	{
		id: 7,
		component: Symbol7 as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		alt: "Symbol 7",
	},
	{
		id: 8,
		component: Symbol8 as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		alt: "Symbol 8",
	},
	{
		id: 9,
		component: Symbol9 as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		alt: "Symbol 9",
	},
];

function EggSymbols(props: BaseSectionProps<EggSymbolsData>) {
	return (
		<BaseSection
			config={{
				storageKey: "shadows-of-evil-egg-symbols-data",
				defaultValue: { selectedSymbols: [] },
				title: "Egg Symbols",
				description: "Select the 3 symbols found in the Footlight, Canals and Waterfront Districts",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Tram Routes",
							text: "To find the symbols you can take the tram from: Footlight → Canals (look left for Footlight symbol then right for Canals symbol), Canals → Waterfront (look left for both symbols), Waterfront → Footlight (look right for both symbols)",
						},
					],
				},
			}}
			getProgress={(data: EggSymbolsData) => ({
				completed: data.selectedSymbols.length,
				total: 3,
				isComplete: data.selectedSymbols.length === 3,
			})}
			{...props}
		>
			{({ data, setData, progress }) => (
				<>
					<div className="egg-symbols">
						<div className="egg-symbols__grid">
							{SYMBOLS.map((symbol) => {
								const isSelected = data.selectedSymbols.includes(symbol.id);
								const canSelect = data.selectedSymbols.length < 3 || isSelected;
								const SymbolComponent = symbol.component;

								return (
									<button
										key={symbol.id}
										className={`egg-symbols__symbol ${
											isSelected ? "egg-symbols__symbol--selected" : ""
										} ${!canSelect ? "egg-symbols__symbol--disabled" : ""}`}
										onClick={() => {
											if (isSelected) {
												setData({
													selectedSymbols: data.selectedSymbols.filter(
														(id) => id !== symbol.id
													),
												});
											} else if (canSelect) {
												setData({
													selectedSymbols: [...data.selectedSymbols, symbol.id],
												});
											}
										}}
										disabled={!canSelect && !isSelected}
									>
										<div className="egg-symbols__symbol-number">{symbol.id}</div>
										<SymbolComponent className="egg-symbols__symbol-svg" />
									</button>
								);
							})}
						</div>
					</div>

					{data.selectedSymbols.length > 0 && (
						<ResultsDisplay
							variant="grid"
							gridColumns={3}
							showIncomplete={true}
							totalExpected={3}
							results={data.selectedSymbols
								.sort((a, b) => a - b)
								.map((id) => {
									const symbol = SYMBOLS.find((s) => s.id === id);
									return {
										id: `symbol-${id}`,
										value: id,
										image: symbol?.component,
									};
								})}
						/>
					)}

					<ReferenceImages
						images={[
							{
								src: symbolsReference,
								alt: "Shadows of Evil Egg Symbols",
							},
						]}
					/>
				</>
			)}
		</BaseSection>
	);
}

export default EggSymbols;

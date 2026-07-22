import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import ResultsDisplay from "@/components/ui/ResultsDisplay";
import { ReferenceImages } from "@/components/ui/ReferenceImages";

// Import symbol SVGs
import SymbolBlightfather from "@/assets/maps/bo4/ix/ix-symbol-blightfather.svg";
import SymbolBrawler from "@/assets/maps/bo4/ix/ix-symbol-brawler.svg";
import SymbolElectric from "@/assets/maps/bo4/ix/ix-symbol-electric.svg";
import SymbolFire from "@/assets/maps/bo4/ix/ix-symbol-fire.svg";
import SymbolGladiator from "@/assets/maps/bo4/ix/ix-symbol-gladiator.svg";
import SymbolPoison from "@/assets/maps/bo4/ix/ix-symbol-poison.svg";
import SymbolTiger from "@/assets/maps/bo4/ix/ix-symbol-tiger.svg";
import SymbolWater from "@/assets/maps/bo4/ix/ix-symbol-water.svg";
import symbolsReference from "@/assets/maps/bo4/ix/ix-symbols.png";

interface RaSymbolsSectionData {
	selectedSymbols: string[];
}

const SYMBOLS = [
	{
		id: "blightfather",
		type: "Blightfather",
		component: SymbolBlightfather as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "brawler",
		type: "Brawler",
		component: SymbolBrawler as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "electric",
		type: "Electric",
		component: SymbolElectric as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "fire",
		type: "Fire",
		component: SymbolFire as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "gladiator",
		type: "Gladiator",
		component: SymbolGladiator as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "poison",
		type: "Poison",
		component: SymbolPoison as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "tiger",
		type: "Tiger",
		component: SymbolTiger as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "water",
		type: "Water",
		component: SymbolWater as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
];

function RaSymbolsSection(props: BaseSectionProps<RaSymbolsSectionData>) {
	return (
		<BaseSection
			config={{
				storageKey: "ix-ra-symbols-data",
				defaultValue: { selectedSymbols: [] },
				title: "Ra Symbols",
				description: "Select the 4 symbols in the order they appear",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "How it works:",
							nested: [
								{
									text: "The symbols will appear on the column at the top of the Temple of Ra.",
								},
								{
									text: "Kill the special enemy types in the order corresponding to the symbols shown.",
								},
								{
									text: "This cannot be done on a special round.",
								},
							],
						},
					],
				},
			}}
			getProgress={(data: RaSymbolsSectionData) => ({
				completed: data.selectedSymbols.length,
				total: 4,
				isComplete: data.selectedSymbols.length === 4,
			})}
			{...props}
		>
			{({ data, setData }) => (
				<>
					<div className="ra-symbols">
						<div className="ra-symbols__grid">
							{SYMBOLS.map((symbol) => {
								const isSelected = data.selectedSymbols.includes(symbol.id);
								const canSelect = data.selectedSymbols.length < 4 || isSelected;
								const selectionIndex = data.selectedSymbols.indexOf(symbol.id);
								const SymbolComponent = symbol.component;

								return (
									<button
										key={symbol.id}
										className={`ra-symbols__symbol ${
											isSelected ? "ra-symbols__symbol--selected" : ""
										} ${!canSelect ? "ra-symbols__symbol--disabled" : ""}`}
										onClick={() => {
											if (isSelected) {
												setData({
													selectedSymbols: data.selectedSymbols.filter(
														(id) => id !== symbol.id,
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
										{isSelected && (
											<div className="ra-symbols__symbol-number">
												{selectionIndex + 1}
											</div>
										)}
										<SymbolComponent className="ra-symbols__symbol-svg" />
									</button>
								);
							})}
						</div>
					</div>

					{data.selectedSymbols.length > 0 && (
						<ResultsDisplay
							variant="grid"
							gridColumns={4}
							showIncomplete={true}
							totalExpected={4}
							results={data.selectedSymbols.map((id) => {
								const symbol = SYMBOLS.find((s) => s.id === id);
								return {
									id: `symbol-${id}`,
									value: symbol?.type || id,
									image: symbol?.component,
								};
							})}
						/>
					)}

					<ReferenceImages
						images={[
							{
								src: symbolsReference,
								alt: "IX Ra Symbols",
							},
						]}
					/>
				</>
			)}
		</BaseSection>
	);
}

export default RaSymbolsSection;

import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import ResultsDisplay from "@/components/ui/ResultsDisplay";
import { ReferenceImages } from "@/components/ui/ReferenceImages";

// Import symbol images
import symbol1 from "@/assets/maps/bo6/the-tomb/the-tomb-symbol-1.png";
import symbol2 from "@/assets/maps/bo6/the-tomb/the-tomb-symbol-2.png";
import symbol3 from "@/assets/maps/bo6/the-tomb/the-tomb-symbol-3.png";
import symbol4 from "@/assets/maps/bo6/the-tomb/the-tomb-symbol-4.png";
import symbol5 from "@/assets/maps/bo6/the-tomb/the-tomb-symbol-5.png";
import symbol6 from "@/assets/maps/bo6/the-tomb/the-tomb-symbol-6.png";
import symbol7 from "@/assets/maps/bo6/the-tomb/the-tomb-symbol-7.png";
import symbol8 from "@/assets/maps/bo6/the-tomb/the-tomb-symbol-8.png";
import symbolsReference from "@/assets/maps/bo6/the-tomb/the-tomb-symbols.jpg";

interface StaffUpgradeData {
	selectedSymbols: number[];
}

const SYMBOLS = [
	{ id: 1, src: symbol1, alt: "Symbol 1" },
	{ id: 2, src: symbol2, alt: "Symbol 2" },
	{ id: 3, src: symbol3, alt: "Symbol 3" },
	{ id: 4, src: symbol4, alt: "Symbol 4" },
	{ id: 5, src: symbol5, alt: "Symbol 5" },
	{ id: 6, src: symbol6, alt: "Symbol 6" },
	{ id: 7, src: symbol7, alt: "Symbol 7" },
	{ id: 8, src: symbol8, alt: "Symbol 8" },
];

function StaffUpgrade(props: BaseSectionProps<StaffUpgradeData>) {
	return (
		<BaseSection
			config={{
				storageKey: "the-tomb-staff-upgrade-data",
				defaultValue: { selectedSymbols: [] },
				title: "Staff Upgrade",
				description: "Select the 3 symbols present in the Dark Aether sky",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Lanterns",
							text: "Shoot 3 lanterns with the Ice Staff within 10 seconds to trigger the appearance of the symbols",
						},
						{
							label: "Rocks",
							text: "Identify and shoot 3 symbols on floating rocks in the Dark Aether sky",
						},
						{
							label: "Portal",
							text: "When shot correctly, the symbols will appear on the floor of the portal. If you don't see the symbols advance the round and try again",
						},
					],
				},
			}}
			getProgress={(data: StaffUpgradeData) => ({
				completed: data.selectedSymbols.length,
				total: 3,
				isComplete: data.selectedSymbols.length === 3,
			})}
			{...props}
		>
			{({ data, setData, progress }) => (
				<>
					<div className="staff-upgrade">
						<div className="staff-upgrade__grid">
							{SYMBOLS.map((symbol) => {
								const isSelected = data.selectedSymbols.includes(symbol.id);
								const canSelect = data.selectedSymbols.length < 3 || isSelected;

								return (
									<button
										key={symbol.id}
										className={`staff-upgrade__symbol ${
											isSelected ? "staff-upgrade__symbol--selected" : ""
										} ${!canSelect ? "staff-upgrade__symbol--disabled" : ""}`}
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
										<div className="staff-upgrade__symbol-number">
											{symbol.id}
										</div>
										<img src={symbol.src} alt={symbol.alt} />
									</button>
								);
							})}
						</div>
					</div>

					{progress.isComplete && (
						<ResultsDisplay
							variant="grid"
							gridColumns={3}
							results={data.selectedSymbols
								.sort((a, b) => a - b)
								.map((id) => {
									const symbol = SYMBOLS.find((s) => s.id === id);
									return {
										id: `symbol-${id}`,
										value: id,
										// label: `Symbol ${id}`,
										image: symbol?.src,
									};
								})}
						/>
					)}

					<ReferenceImages
						images={[
							{
								src: symbolsReference,
								alt: "Symbol locations in Dark Aether",
							},
						]}
					/>
				</>
			)}
		</BaseSection>
	);
}

export default StaffUpgrade;

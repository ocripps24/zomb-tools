import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import HouseSymbolsImage from "@/assets/maps/bo7/rex-infernus/rex-infernus-house-symbols.jpg";

const MAX_SYMBOLS = 4;

interface SymbolPosition {
	x: number; // percent, relative to the image
	y: number; // percent, relative to the image
}

interface HouseSymbolsData {
	positions: SymbolPosition[];
}

const DEFAULT_VALUE: HouseSymbolsData = {
	positions: [],
};

function HouseSymbolsSection(props: BaseSectionProps<HouseSymbolsData>) {
	return (
		<BaseSection
			config={{
				storageKey: "rex-infernus-house-symbols-data",
				defaultValue: DEFAULT_VALUE,
				title: "House Symbols",
				description:
					"A symbol appears on the house every round, up to 4. Click the image where each one shows up, in the order they appear, to build your shoot order for the next exfil round.",
				resetButtonText: "Clear",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Placing Symbols",
							text: "Click the image where a symbol appears. It's numbered in the order you click, up to 4 total.",
						},
						{
							label: "Fixing Mistakes",
							text: "Click a placed number to remove it — everything after it automatically renumbers.",
						},
						{
							label: "Exfil",
							text: "Shoot the symbols in the order shown (1 through 4) during the next exfil round.",
						},
					],
				},
			}}
			getProgress={(data: HouseSymbolsData) => ({
				completed: data.positions.length,
				total: MAX_SYMBOLS,
				isComplete: data.positions.length === MAX_SYMBOLS,
			})}
			{...props}
		>
			{({ data, setData }) => {
				const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
					if (data.positions.length >= MAX_SYMBOLS) return;
					const rect = e.currentTarget.getBoundingClientRect();
					const x = ((e.clientX - rect.left) / rect.width) * 100;
					const y = ((e.clientY - rect.top) / rect.height) * 100;
					setData({ positions: [...data.positions, { x, y }] });
				};

				const handleMarkerClick = (e: React.MouseEvent, index: number) => {
					e.stopPropagation();
					setData({
						positions: data.positions.filter((_, i) => i !== index),
					});
				};

				return (
					<div className="house-symbols-section">
						<p className="house-symbols-section__hint">
							{data.positions.length >= MAX_SYMBOLS
								? "All 4 symbols placed — click a number to remove and replace it."
								: `Click the image to place symbol ${data.positions.length + 1}.`}
						</p>

						<div
							className="house-symbols-image"
							onClick={handleImageClick}
							role="button"
							tabIndex={0}
						>
							<img
								src={HouseSymbolsImage}
								alt="Rex Infernus house, showing where symbols appear"
								draggable={false}
							/>
							{data.positions.map((pos, index) => (
								<button
									key={index}
									type="button"
									className="house-symbols-marker"
									style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
									onClick={(e) => handleMarkerClick(e, index)}
									aria-label={`Symbol ${index + 1} — click to remove`}
								>
									{index + 1}
								</button>
							))}
						</div>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default HouseSymbolsSection;

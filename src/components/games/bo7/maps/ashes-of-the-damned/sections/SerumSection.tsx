import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import ResultsDisplay from "@/components/ui/ResultsDisplay";
import { useSectionSettings } from "@/hooks/useSectionSettings";

// Import pig-pen symbols for first letters
import PigPenF from "@/assets/symbols/pig-pen/pig-pen-f.svg";
import PigPenL from "@/assets/symbols/pig-pen/pig-pen-l.svg";
import PigPenO from "@/assets/symbols/pig-pen/pig-pen-o.svg";
import PigPenC from "@/assets/symbols/pig-pen/pig-pen-c.svg";
import PigPenT from "@/assets/symbols/pig-pen/pig-pen-t.svg";

// Import part images
import FungiImage from "@/assets/maps/bo7/ashes-of-the-damned/ashes-of-the-damned-fungi.png";
import LimbsImage from "@/assets/maps/bo7/ashes-of-the-damned/ashes-of-the-damned-limbs.png";
import OculiImage from "@/assets/maps/bo7/ashes-of-the-damned/ashes-of-the-damned-oculi.png";
import ConchImage from "@/assets/maps/bo7/ashes-of-the-damned/ashes-of-the-damned-conch.png";
import TalusImage from "@/assets/maps/bo7/ashes-of-the-damned/ashes-of-the-damned-talus.png";

interface SerumData {
	selectedParts: string[];
}

const PARTS = [
	{
		id: "fungi",
		name: "Mushroom",
		codename: "Fungi",
		symbol: PigPenF as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		image: FungiImage,
	},
	{
		id: "limbs",
		name: "Mysterious Limbs",
		codename: "Limbs",
		symbol: PigPenL as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		image: LimbsImage,
	},
	{
		id: "oculi",
		name: "Eyes",
		codename: "Oculi",
		symbol: PigPenO as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		image: OculiImage,
	},
	{
		id: "conch",
		name: "Hoard Hunk Chucks",
		codename: "Conch",
		symbol: PigPenC as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		image: ConchImage,
	},
	{
		id: "talus",
		name: "Human Bone",
		codename: "Talus",
		symbol: PigPenT as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
		image: TalusImage,
	},
];

function SerumSection(props: BaseSectionProps<SerumData>) {
	// Register with the global settings system (no custom settings needed)
	useSectionSettings({
		mapId: "ashes-of-the-damned",
		sectionId: "serum",
		sectionName: "Serum Trial",
		settings: [],
	});

	return (
		<BaseSection
			config={{
				storageKey: "ashes-of-the-damned-serum-data",
				defaultValue: { selectedParts: [] },
				title: "Serum Trial",
				description:
					"Select the 5 parts in the order shown on the chalkboard behind the serum crafting table at the Cosmodrone",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Step 1",
							text: "Collect all 6 parts (Mushroom, Mysterious Limbs, Eyes, Hoard Hunk Chucks, Human Bone, and White Powder)",
						},
						{
							label: "Step 2",
							text: "Interact with the White Powder at the serum crafting table at the Cosmodrone",
						},
						{
							label: "Step 3",
							text: "Read the three lines of pig-pen symbols on the chalkboard behind the table - each line has 5 symbols",
						},
						{
							label: "Location",
							text: "Serum crafting table at Cosmodrone",
						},
					],
				},
			}}
			getProgress={(data: SerumData) => ({
				completed: data.selectedParts.length,
				total: 3,
				isComplete: data.selectedParts.length === 3,
			})}
			{...props}
		>
			{({ data, setData }) => {
				const handlePartClick = (partId: string) => {
					const isSelected = data.selectedParts.includes(partId);

					if (isSelected) {
						// Remove this part and all parts selected after it
						const index = data.selectedParts.indexOf(partId);
						setData({
							selectedParts: data.selectedParts.slice(0, index),
						});
					} else if (data.selectedParts.length < 3) {
						// Add this part to the selection
						setData({
							selectedParts: [...data.selectedParts, partId],
						});
					}
				};

				const getPartSelectionOrder = (partId: string): number | null => {
					const index = data.selectedParts.indexOf(partId);
					return index >= 0 ? index + 1 : null;
				};

				return (
					<>
						<div className="serum-section">
							<div className="serum-section__grid">
								{PARTS.map((part) => {
									const SymbolComponent = part.symbol;
									const selectionOrder = getPartSelectionOrder(part.id);
									const isSelected = selectionOrder !== null;
									const canSelect = data.selectedParts.length < 3 || isSelected;

									return (
										<button
											key={part.id}
											className={`serum-section__part ${
												isSelected ? "serum-section__part--selected" : ""
											} ${!canSelect ? "serum-section__part--disabled" : ""}`}
											onClick={() => handlePartClick(part.id)}
											disabled={!canSelect && !isSelected}
										>
											{isSelected && (
												<div className="serum-section__part-order">
													{selectionOrder}
												</div>
											)}
											<div className="serum-section__symbol-wrapper">
												<SymbolComponent className="serum-section__symbol" />
											</div>
											<div className="serum-section__part-info">
												<div className="serum-section__codename">
													{part.codename}
												</div>
												<div className="serum-section__name">{part.name}</div>
											</div>
										</button>
									);
								})}
							</div>
						</div>

						{data.selectedParts.length > 0 && (
							<ResultsDisplay
								variant="sequence"
								showIncomplete={true}
								totalExpected={3}
								sequenceItems={data.selectedParts.map((partId, index) => {
									const part = PARTS.find((p) => p.id === partId);
									return {
										id: partId,
										order: index + 1,
										value: part?.name || "",
										image: part?.image,
										metadata: {
											codename: part?.codename || "",
										},
									};
								})}
							/>
						)}
					</>
				);
			}}
		</BaseSection>
	);
}

export default SerumSection;

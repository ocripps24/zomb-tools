import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { ResultsDisplay } from "@/components/ui";
import { useSectionSettings } from "@/hooks/useSectionSettings";

// Import gauntlet symbols
import Symbol1 from "@/assets/maps/bo7/ashes-of-the-damned/ashes-gauntlet-symbol-1.svg";
import Symbol2 from "@/assets/maps/bo7/ashes-of-the-damned/ashes-gauntlet-symbol-2.svg";
import Symbol3 from "@/assets/maps/bo7/ashes-of-the-damned/ashes-gauntlet-symbol-3.svg";
import Symbol4 from "@/assets/maps/bo7/ashes-of-the-damned/ashes-gauntlet-symbol-4.svg";
import Symbol5 from "@/assets/maps/bo7/ashes-of-the-damned/ashes-gauntlet-symbol-5.svg";
import Symbol6 from "@/assets/maps/bo7/ashes-of-the-damned/ashes-gauntlet-symbol-6.svg";
import Symbol7 from "@/assets/maps/bo7/ashes-of-the-damned/ashes-gauntlet-symbol-7.svg";
import Symbol8 from "@/assets/maps/bo7/ashes-of-the-damned/ashes-gauntlet-symbol-8.svg";
import Symbol9 from "@/assets/maps/bo7/ashes-of-the-damned/ashes-gauntlet-symbol-9.svg";
import Symbol10 from "@/assets/maps/bo7/ashes-of-the-damned/ashes-gauntlet-symbol-10.svg";
import Symbol11 from "@/assets/maps/bo7/ashes-of-the-damned/ashes-gauntlet-symbol-11.svg";
import Symbol12 from "@/assets/maps/bo7/ashes-of-the-damned/ashes-gauntlet-symbol-12.svg";

type SymbolId =
	| "symbol-1"
	| "symbol-2"
	| "symbol-3"
	| "symbol-4"
	| "symbol-5"
	| "symbol-6"
	| "symbol-7"
	| "symbol-8"
	| "symbol-9"
	| "symbol-10"
	| "symbol-11"
	| "symbol-12";

type BuildingId = "silo" | "house" | "barn";

type SvgComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const SYMBOL_COMPONENTS: Record<SymbolId, SvgComponent> = {
	"symbol-1": Symbol1 as unknown as SvgComponent,
	"symbol-2": Symbol2 as unknown as SvgComponent,
	"symbol-3": Symbol3 as unknown as SvgComponent,
	"symbol-4": Symbol4 as unknown as SvgComponent,
	"symbol-5": Symbol5 as unknown as SvgComponent,
	"symbol-6": Symbol6 as unknown as SvgComponent,
	"symbol-7": Symbol7 as unknown as SvgComponent,
	"symbol-8": Symbol8 as unknown as SvgComponent,
	"symbol-9": Symbol9 as unknown as SvgComponent,
	"symbol-10": Symbol10 as unknown as SvgComponent,
	"symbol-11": Symbol11 as unknown as SvgComponent,
	"symbol-12": Symbol12 as unknown as SvgComponent,
};

interface Building {
	id: BuildingId;
	name: string;
	faceLabel: string;
	symbolIds: SymbolId[];
}

// Displayed left to right on screen
const BUILDINGS: Building[] = [
	{
		id: "silo",
		name: "Silo",
		faceLabel: "Left",
		symbolIds: ["symbol-9", "symbol-10", "symbol-11", "symbol-12"],
	},
	{
		id: "house",
		name: "House",
		faceLabel: "Right",
		symbolIds: ["symbol-1", "symbol-2", "symbol-3", "symbol-4"],
	},
	{
		id: "barn",
		name: "Barn",
		faceLabel: "Far",
		symbolIds: ["symbol-5", "symbol-6", "symbol-7", "symbol-8"],
	},
];

// Right, Far, Left - matches the order most players interact with the pillar
const RESULT_ORDER_RIGHT_FIRST: BuildingId[] = ["house", "barn", "silo"];
// Left, Far, Right - matches the visual left-to-right layout of the boxes above
const RESULT_ORDER_LEFT_FIRST: BuildingId[] = ["silo", "barn", "house"];

interface GauntletData {
	selections: Record<BuildingId, SymbolId | null>;
}

const DEFAULT_DATA: GauntletData = {
	selections: { silo: null, house: null, barn: null },
};

function GauntletSection(props: BaseSectionProps<GauntletData>) {
	// Register with the global settings system
	const { getSetting } = useSectionSettings({
		mapId: "ashes-of-the-damned",
		sectionId: "gauntlet",
		sectionName: "Gauntlet",
		settings: [
			{
				id: "result-order",
				label: "Result Order",
				defaultValue: "right-far-left",
				options: [
					{ value: "right-far-left", label: "Right, Far, Left" },
					{ value: "left-far-right", label: "Left, Far, Right" },
				],
				note: "Right, Far, Left matches how most players interact with the pillar",
			},
		],
	});

	const resultOrder =
		getSetting("result-order", "right-far-left") === "left-far-right"
			? RESULT_ORDER_LEFT_FIRST
			: RESULT_ORDER_RIGHT_FIRST;

	return (
		<BaseSection
			config={{
				storageKey: "ashes-of-the-damned-gauntlet-data",
				defaultValue: DEFAULT_DATA,
				title: "Gauntlet",
				description:
					"Identify the symbol shown on each building's rooftop, then use the pillar in the basement to cycle each face to the matching symbol.",
				resetButtonText: "Clear Selections",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Step 1",
							text: "Take the jump-pad near Farm to view the Silo, House, and Barn rooftops, and note the symbol shown on each one",
						},
						{
							label: "Step 2",
							text: "Retrieve a fully charged canister, then head to the basement underneath the House at Farm",
						},
						{
							label: "Step 3",
							text: "Interact with the pillar - it has three symbol faces, each cycling through 4 symbols",
						},
						{
							label: "Orientation",
							text: "Right, Far, and Left are relative to facing the near side of the pillar, where the Gauntlet sits",
						},
						{
							label: "Selecting Symbols",
							text: "Below, pick the symbol you saw on each building's roof - Silo, House, and Barn map to the Left, Right, and Far faces",
						},
					],
				},
			}}
			getProgress={(data: GauntletData) => {
				const completed = BUILDINGS.filter(
					(building) => data.selections[building.id] !== null,
				).length;
				return {
					completed,
					total: BUILDINGS.length,
					isComplete: completed === BUILDINGS.length,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const handleSymbolClick = (
					buildingId: BuildingId,
					symbolId: SymbolId,
				) => {
					setData({
						selections: {
							...data.selections,
							[buildingId]:
								data.selections[buildingId] === symbolId ? null : symbolId,
						},
					});
				};

				const hasSelection = BUILDINGS.some(
					(building) => data.selections[building.id] !== null,
				);

				return (
					<div className="gauntlet-section">
						<div className="gauntlet-section__boxes">
							{BUILDINGS.map((building) => {
								const selection = data.selections[building.id];

								return (
									<div key={building.id} className="gauntlet-box">
										<h3 className="gauntlet-box__header">{building.name}</h3>
										<div className="gauntlet-box__symbols">
											{building.symbolIds.map((symbolId) => {
												const SymbolComponent = SYMBOL_COMPONENTS[symbolId];
												const isSelected = selection === symbolId;
												const isDimmed = selection !== null && !isSelected;

												return (
													<button
														key={symbolId}
														className={`gauntlet-symbol-btn ${
															isSelected ? "gauntlet-symbol-btn--selected" : ""
														} ${isDimmed ? "gauntlet-symbol-btn--dimmed" : ""}`}
														onClick={() =>
															handleSymbolClick(building.id, symbolId)
														}
													>
														<SymbolComponent className="gauntlet-symbol-icon" />
													</button>
												);
											})}
										</div>
									</div>
								);
							})}
						</div>

						{hasSelection && (
							<div className="gauntlet-section__results">
								<h4>Pillar Interaction Order</h4>
								<p className="result-instruction">
									Facing the pillar from the Gauntlet (near) side, cycle each
									face to the position shown:
								</p>

								<ResultsDisplay
									variant="grid"
									gridColumns={3}
									colorScheme="success"
									results={resultOrder.map((buildingId) => {
										const building = BUILDINGS.find(
											(b) => b.id === buildingId,
										)!;
										const selection = data.selections[buildingId];
										const position = selection
											? building.symbolIds.indexOf(selection) + 1
											: null;

										return {
											id: buildingId,
											value: position ?? "-",
											label: building.faceLabel,
											image: selection
												? SYMBOL_COMPONENTS[selection]
												: undefined,
											status: selection
												? ("complete" as const)
												: ("pending" as const),
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

export default GauntletSection;

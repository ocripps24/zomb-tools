import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { ReferenceImages } from "@/components/ui/ReferenceImages";

// Import generator symbols
import GenSymbolBox from "@/assets/maps/bo4/blood-of-the-dead/botd-generator-symbol-Box-1.svg";
import GenSymbolLeft from "@/assets/maps/bo4/blood-of-the-dead/botd-generator-symbol-Left-2.svg";
import GenSymbolFront from "@/assets/maps/bo4/blood-of-the-dead/botd-generator-symbol-Front-3.svg";
import GenSymbolPack from "@/assets/maps/bo4/blood-of-the-dead/botd-generator-symbol-Pack-4.svg";
import GenSymbolICR from "@/assets/maps/bo4/blood-of-the-dead/botd-generator-symbol-ICR-5.svg";
import GenSymbolRight from "@/assets/maps/bo4/blood-of-the-dead/botd-generator-symbol-Right-6.svg";

// Import TV symbols
import TVSymbolA from "@/assets/maps/bo4/blood-of-the-dead/botd-tv-symbol-A.svg";
import TVSymbolB from "@/assets/maps/bo4/blood-of-the-dead/botd-tv-symbol-B.svg";
import TVSymbolC from "@/assets/maps/bo4/blood-of-the-dead/botd-tv-symbol-C.svg";
import TVSymbolD from "@/assets/maps/bo4/blood-of-the-dead/botd-tv-symbol-D.svg";
import TVSymbolE from "@/assets/maps/bo4/blood-of-the-dead/botd-tv-symbol-E.svg";
import TVSymbolF from "@/assets/maps/bo4/blood-of-the-dead/botd-tv-symbol-F.svg";

// Import reference images
import generatorsMap from "@/assets/maps/bo4/blood-of-the-dead/botd-generators-map.jpg";
import powerHouseSymbols from "@/assets/maps/bo4/blood-of-the-dead/botd-power-house-symbols.jpg";

type PowerUnit = "Front" | "Pack" | "ICR" | "Box" | "Left" | "Right";

interface GeneratorSymbol {
	location: PowerUnit;
	id: number;
	component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface TVSymbol {
	id: string;
	component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface PowerHouseData {
	// Phase 1: Simon Says sequence (up to 5 rounds)
	simonSaysSequence: PowerUnit[];
	// Phase 2: Selected power units that are lit (exactly 3)
	selectedPowerUnits: PowerUnit[];
	// Phase 3: Selected TV symbols (exactly 3)
	selectedTVSymbols: string[];
}

const POWER_UNITS: PowerUnit[] = ["Front", "Pack", "ICR", "Box", "Left", "Right"];

const GENERATOR_SYMBOLS: GeneratorSymbol[] = [
	{ location: "Box", id: 1, component: GenSymbolBox as unknown as React.ComponentType<React.SVGProps<SVGSVGElement>> },
	{ location: "Left", id: 2, component: GenSymbolLeft as unknown as React.ComponentType<React.SVGProps<SVGSVGElement>> },
	{ location: "Front", id: 3, component: GenSymbolFront as unknown as React.ComponentType<React.SVGProps<SVGSVGElement>> },
	{ location: "Pack", id: 4, component: GenSymbolPack as unknown as React.ComponentType<React.SVGProps<SVGSVGElement>> },
	{ location: "ICR", id: 5, component: GenSymbolICR as unknown as React.ComponentType<React.SVGProps<SVGSVGElement>> },
	{ location: "Right", id: 6, component: GenSymbolRight as unknown as React.ComponentType<React.SVGProps<SVGSVGElement>> },
];

const TV_SYMBOLS: TVSymbol[] = [
	{ id: "A", component: TVSymbolA as unknown as React.ComponentType<React.SVGProps<SVGSVGElement>> },
	{ id: "B", component: TVSymbolB as unknown as React.ComponentType<React.SVGProps<SVGSVGElement>> },
	{ id: "C", component: TVSymbolC as unknown as React.ComponentType<React.SVGProps<SVGSVGElement>> },
	{ id: "D", component: TVSymbolD as unknown as React.ComponentType<React.SVGProps<SVGSVGElement>> },
	{ id: "E", component: TVSymbolE as unknown as React.ComponentType<React.SVGProps<SVGSVGElement>> },
	{ id: "F", component: TVSymbolF as unknown as React.ComponentType<React.SVGProps<SVGSVGElement>> },
];

function PowerHouseSection(props: BaseSectionProps<PowerHouseData>) {
	return (
		<BaseSection
			config={{
				storageKey: "blood-of-the-dead-power-house-data",
				defaultValue: {
					simonSaysSequence: [],
					selectedPowerUnits: [],
					selectedTVSymbols: [],
				},
				title: "Power House",
				description: "Complete the Power House challenge in 3 phases",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Setup",
							text: "Get 3-digit code from Chronorium in Warden's House, enter at spiral staircase, blast red orb in Power House with shield, wait for ghost quote",
						},
						{
							label: "Phase 1",
							text: "At Building 64 generator, watch power units light up in sequence. Each round adds one unit (5 rounds total). Units can repeat.",
						},
						{
							label: "Phase 2",
							text: "Note the 3 power units lit solidly (not flashing). Each has a symbol on paper - record these.",
						},
						{
							label: "Phase 3",
							text: "Collect punch card, insert in Model Industries terminal. Match symbols on 6 screens, select 3 that appear. In Power House, shield blast ghost at corresponding switches (ordered A-F left to right).",
						},
					],
				},
			}}
			getProgress={(data: PowerHouseData) => ({
				completed:
					(data.simonSaysSequence.length === 5 ? 1 : 0) +
					(data.selectedPowerUnits.length === 3 ? 1 : 0) +
					(data.selectedTVSymbols.length === 3 ? 1 : 0),
				total: 3,
				isComplete:
					data.simonSaysSequence.length === 5 &&
					data.selectedPowerUnits.length === 3 &&
					data.selectedTVSymbols.length === 3,
			})}
			{...props}
		>
			{({ data, setData }) => (
				<>
					{/* Phase 1: Simon Says */}
					<div className="power-house-phase">
						<h3 className="power-house-phase__title">Phase 1: Simon Says Sequence</h3>
						<p className="power-house-phase__description">
							Click the power units in the order they light up (5 rounds total)
						</p>

						<div className="power-house-phase__controls">
							<div className="power-unit-grid">
								{POWER_UNITS.map((unit) => (
									<button
										key={unit}
										className="power-unit-button"
										onClick={() => {
											if (data.simonSaysSequence.length < 5) {
												setData({
													...data,
													simonSaysSequence: [...data.simonSaysSequence, unit],
												});
											}
										}}
										disabled={data.simonSaysSequence.length >= 5}
									>
										{unit}
									</button>
								))}
							</div>
						</div>

						{data.simonSaysSequence.length > 0 && (
							<div className="power-house-results">
								<div className="power-house-results__header">
									<h4>Sequence ({data.simonSaysSequence.length}/5)</h4>
									<button
										className="power-house-undo"
										onClick={() => {
											setData({
												...data,
												simonSaysSequence: data.simonSaysSequence.slice(0, -1),
											});
										}}
									>
										Undo Last
									</button>
								</div>
								<div className="power-house-sequence">
									{data.simonSaysSequence.map((unit, index) => (
										<div key={index} className="power-house-sequence-item">
											<span className="sequence-number">{index + 1}</span>
											<span className="sequence-unit">{unit}</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Phase 2: Generator Symbols */}
					<div className="power-house-phase">
						<h3 className="power-house-phase__title">Phase 2: Generator Symbols</h3>
						<p className="power-house-phase__description">
							Select the 3 power units that are lit solidly (not flashing)
						</p>

						<div className="power-unit-grid">
							{POWER_UNITS.map((unit) => {
								const isSelected = data.selectedPowerUnits.includes(unit);
								const canSelect = data.selectedPowerUnits.length < 3 || isSelected;

								return (
									<button
										key={unit}
										className={`power-unit-button ${isSelected ? "power-unit-button--selected" : ""} ${!canSelect ? "power-unit-button--disabled" : ""}`}
										onClick={() => {
											if (isSelected) {
												setData({
													...data,
													selectedPowerUnits: data.selectedPowerUnits.filter(
														(u) => u !== unit
													),
												});
											} else if (canSelect) {
												setData({
													...data,
													selectedPowerUnits: [...data.selectedPowerUnits, unit],
												});
											}
										}}
										disabled={!canSelect && !isSelected}
									>
										{unit}
									</button>
								);
							})}
						</div>

						{data.selectedPowerUnits.length === 3 && (
							<div className="power-house-results">
								<h4>Generator Symbols</h4>
								<div className="generator-symbols-grid">
									{data.selectedPowerUnits.map((unit) => {
										const symbol = GENERATOR_SYMBOLS.find((s) => s.location === unit);
										if (!symbol) return null;
										const SymbolComponent = symbol.component;

										return (
											<div key={unit} className="generator-symbol-item">
												<div className="generator-symbol-number">{symbol.id}</div>
												<SymbolComponent className="generator-symbol-svg" />
												<div className="generator-symbol-label">{unit}</div>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>

					{/* Phase 3: TV Symbols */}
					<div className="power-house-phase">
						<h3 className="power-house-phase__title">Phase 3: TV Symbols</h3>
						<p className="power-house-phase__description">
							Select the 3 symbols shown on the TV screens in Model Industries
						</p>

						<div className="tv-symbols-grid">
							{TV_SYMBOLS.map((symbol) => {
								const isSelected = data.selectedTVSymbols.includes(symbol.id);
								const canSelect = data.selectedTVSymbols.length < 3 || isSelected;
								const SymbolComponent = symbol.component;

								return (
									<button
										key={symbol.id}
										className={`tv-symbol-button ${isSelected ? "tv-symbol-button--selected" : ""} ${!canSelect ? "tv-symbol-button--disabled" : ""}`}
										onClick={() => {
											if (isSelected) {
												setData({
													...data,
													selectedTVSymbols: data.selectedTVSymbols.filter(
														(id) => id !== symbol.id
													),
												});
											} else if (canSelect) {
												setData({
													...data,
													selectedTVSymbols: [...data.selectedTVSymbols, symbol.id],
												});
											}
										}}
										disabled={!canSelect && !isSelected}
									>
										<div className="tv-symbol-id">{symbol.id}</div>
										<SymbolComponent className="tv-symbol-svg" />
									</button>
								);
							})}
						</div>

						{data.selectedTVSymbols.length === 3 && (
							<div className="power-house-results">
								<h4>Selected TV Symbols (Sorted Order)</h4>
								<div className="tv-symbols-result">
									{[...data.selectedTVSymbols].sort().map((id) => {
										const symbol = TV_SYMBOLS.find((s) => s.id === id);
										if (!symbol) return null;
										const SymbolComponent = symbol.component;

										return (
											<div key={id} className="tv-symbol-result-item">
												<div className="tv-symbol-id">{id}</div>
												<SymbolComponent className="tv-symbol-svg" />
											</div>
										);
									})}
								</div>
								<p className="power-house-instruction">
									Shoot the ghost at switches {[...data.selectedTVSymbols].sort().join(", ")} (left to right: A-F)
								</p>
							</div>
						)}
					</div>

					{/* Reference Images */}
					<ReferenceImages
						images={[
							{
								src: generatorsMap,
								alt: "Blood of the Dead Generators Map",
							},
							{
								src: powerHouseSymbols,
								alt: "Power House Symbols Reference",
							},
						]}
					/>
				</>
			)}
		</BaseSection>
	);
}

export default PowerHouseSection;

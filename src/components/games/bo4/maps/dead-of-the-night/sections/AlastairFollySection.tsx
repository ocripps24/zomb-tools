import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import ResultsDisplay from "@/components/ui/ResultsDisplay";
import type { SequenceItem } from "@/components/ui/ResultsDisplay";

// Import symbol SVGs
import SymbolA from "@/assets/maps/bo4/dead-of-the-night/dotn-symbol-a.svg";
import SymbolD from "@/assets/maps/bo4/dead-of-the-night/dotn-symbol-d.svg";
import SymbolX from "@/assets/maps/bo4/dead-of-the-night/dotn-symbol-x.svg";
import SymbolZ from "@/assets/maps/bo4/dead-of-the-night/dotn-symbol-z.svg";

// Symbol data
const SYMBOLS = [
	{
		id: "a",
		name: "A",
		component: SymbolA as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "d",
		name: "D",
		component: SymbolD as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "x",
		name: "X",
		component: SymbolX as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
	{
		id: "z",
		name: "Z",
		component: SymbolZ as unknown as React.ComponentType<
			React.SVGProps<SVGSVGElement>
		>,
	},
] as const;

// Cylinder data (lock positions)
const CYLINDERS = [
	{ id: "blue", name: "Blue", color: "#4A90E2", location: "Graveyard" },
	{ id: "green", name: "Green", color: "#7ED321", location: "Gardens" },
	{ id: "yellow", name: "Yellow", color: "#F5A623", location: "Forest Terrace" },
	{ id: "red", name: "Red", color: "#D0021B", location: "Mansion" },
] as const;

interface AlastairData {
	symbols: {
		[key: string]: string; // cylinderId -> symbolId
	};
}

const TIPS_CONFIG = {
	show: true,
	items: [
		{
			label: "Blue Symbols",
			text: "Located around the Graveyard",
		},
		{
			label: "Green Symbols",
			text: "Located around the Gardens",
		},
		{
			label: "Yellow Symbols",
			text: "Located in the Forest Terrace",
		},
		{
			label: "Red Symbols",
			text: "Located in the Mansion",
		},
		{
			label: "Symbol Spawns",
			text: "Each color has 4 possible spawn locations (A, D, X, Z). Only one will be active per color in your game.",
		},
	],
};

function AlastairFollySection(props: BaseSectionProps<AlastairData>) {
	return (
		<BaseSection
			config={{
				storageKey: "dead-of-the-night-alastair-folly-data",
				defaultValue: { symbols: {} },
				title: "Alastair's Folly",
				description: "Find and match the symbols to their corresponding colored cylinders on the cabinet lock",
				resetButtonText: "Reset Symbols",
				tipsConfig: TIPS_CONFIG,
			}}
			getProgress={(data: AlastairData) => {
				const completed = Object.keys(data.symbols).length;
				return {
					completed,
					total: 4,
					isComplete: completed === 4,
				};
			}}
			{...props}
		>
			{({ data, setData, progress }) => {
				const handleSymbolSelect = (cylinderId: string, symbolId: string) => {
					setData({
						symbols: {
							...data.symbols,
							[cylinderId]: symbolId,
						},
					});
				};

				return (
					<div className="alastair-folly-section">
						{/* Symbol Selection Grid */}
						<div className="cylinder-grid">
							{CYLINDERS.map((cylinder) => {
								const selectedSymbol = data.symbols[cylinder.id];

								return (
									<div
										key={cylinder.id}
										className="cylinder-card"
										data-color={cylinder.id}
									>
										<div className="cylinder-header">
											<h3>{cylinder.name}</h3>
											<p className="cylinder-location">{cylinder.location}</p>
										</div>

										<div className="symbol-buttons">
											{SYMBOLS.map((symbol) => {
												const SymbolComponent = symbol.component;
												const isSelected = selectedSymbol === symbol.id;

												return (
													<button
														key={symbol.id}
														className={`symbol-button ${
															isSelected ? "selected" : ""
														}`}
														onClick={() =>
															handleSymbolSelect(cylinder.id, symbol.id)
														}
														aria-label={`Select ${symbol.name} for ${cylinder.name} cylinder`}
													>
														<SymbolComponent className="symbol-icon" />
													</button>
												);
											})}
										</div>
									</div>
								);
							})}
						</div>

						{/* Results Display */}
						<ResultsDisplay
							variant="sequence"
							title={
								progress.isComplete
									? "🎉 Cabinet Code Complete!"
									: "🔒 Cabinet Lock Sequence"
							}
							description={
								progress.isComplete
									? "Enter these symbols into the cabinet lock in order:"
									: "Symbols collected so far:"
							}
							sequenceItems={CYLINDERS.map((cylinder): SequenceItem => {
								const symbolId = data.symbols[cylinder.id];
								const symbol = SYMBOLS.find((s) => s.id === symbolId);

								return {
									id: cylinder.id,
									order: CYLINDERS.indexOf(cylinder) + 1,
									value: symbol ? symbol.name.toUpperCase() : "?",
									metadata: {
										color: cylinder.name,
									},
									status: symbolId ? "complete" : "pending",
								};
							})}
							colorScheme="success"
							progressMode="badge"
							progress={progress}
						/>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default AlastairFollySection;

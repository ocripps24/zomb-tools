import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { SymbolPicker } from "@/components/content";
import type { Symbol } from "@/components/content/SymbolPicker";
import { BeamSymbols, SYMBOL_DATA, getSymbolValue } from "./BeamSymbols";

interface SymbolLocation {
	id: string;
	name: string;
	description: string;
}

interface BeamCodeData {
	[key: string]: string;
}

const SYMBOL_LOCATIONS: SymbolLocation[] = [
	{ id: "x", name: "X", description: "Laptop with X sticker" },
	{ id: "y", name: "Y", description: "Laptop with Y sticker" },
	{ id: "z", name: "Z", description: "Laptop with Z sticker" },
];

function BeamCodeSection(props: BaseSectionProps<BeamCodeData>) {
	return (
		<BaseSection
			config={{
				storageKey: "terminus-beam-code-data",
				defaultValue: {},
				title: "Beam Code",
				description:
					"Find the 3 laptops with X, Y, Z stickers and record the symbols they display.",
				resetButtonText: "Reset Beam Code",
			}}
			getProgress={(data: BeamCodeData) => {
				const completedCount = SYMBOL_LOCATIONS.filter(
					(location) => data[location.id]
				).length;
				return {
					completed: completedCount,
					total: SYMBOL_LOCATIONS.length,
					isComplete: completedCount === SYMBOL_LOCATIONS.length,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const handleSymbolSelect = (locationId: string, symbolId: string) => {
					setData((prevData: BeamCodeData) => ({
						...prevData,
						[locationId]: symbolId,
					}));
				};

				// Convert SYMBOL_DATA to format expected by SymbolPicker
				const getSymbolsForPicker = (): Symbol[] => {
					return SYMBOL_DATA.map((symbol) => ({
						id: symbol.id,
						component: BeamSymbols[symbol.id as keyof typeof BeamSymbols],
						name: symbol.name,
						value: symbol.value,
					}));
				};

				// Calculate equation results
				const calculateEquations = () => {
					const x = getSymbolValue(data.x);
					const y = getSymbolValue(data.y);
					const z = getSymbolValue(data.z);

					if (x === null || y === null || z === null) return null;

					const equation1 = 2 * x + 11; // 2(X) + 11
					const equation2 = 2 * z + y - 5; // (2Z + Y) - 5
					const equation3 = Math.abs(y + z - x); // |(Y + Z) - X|

					return {
						equation1,
						equation2,
						equation3,
						x,
						y,
						z,
					};
				};

				const results = calculateEquations();
				const usedSymbols: string[] = Object.values(data).filter(Boolean);

				return (
					<div className="beam-code-section">
						<div className="symbol-selection">
							{SYMBOL_LOCATIONS.map((location) => (
								<div key={location.id} className="symbol-input-group">
									<div className="input-label">
										<h3>{location.name}</h3>
									</div>

									<SymbolPicker
										symbols={getSymbolsForPicker()}
										selectedSymbol={data[location.id] || ""}
										onSymbolChange={handleSymbolSelect}
										usedSymbols={usedSymbols}
										locationId={location.id}
										className="symbol-picker--terminus"
										gridConfig={{ columns: 3, rows: 2 }}
										allowDeselect={true}
										greyOutUnselected={true}
									/>
								</div>
							))}
						</div>

						{results && (
							<div className="equation-results">
								<h3>Terminal Sequence</h3>
								<div className="results-grid">
									<div className="result-item">
										<span className="result-number">{results.equation1}</span>
										<span className="result-label">First Number</span>
									</div>
									<div className="result-item">
										<span className="result-number">{results.equation2}</span>
										<span className="result-label">Second Number</span>
									</div>
									<div className="result-item">
										<span className="result-number">{results.equation3}</span>
										<span className="result-label">Third Number</span>
									</div>
								</div>
							</div>
						)}

						<div className="section-tips">
							<h3>How to Use</h3>
							<ul>
								<li>
									<strong>Step 1:</strong> Find 3 laptops around the map with X,
									Y, Z stickers
								</li>
								<li>
									<strong>Step 2:</strong> Turn on each laptop to reveal a
									symbol
								</li>
								<li>
									<strong>Step 3:</strong> Click the matching symbol above for
									each laptop
								</li>
								<li>
									<strong>Step 4:</strong> Enter the calculated numbers into the
									terminal in order
								</li>
							</ul>
						</div>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default BeamCodeSection;

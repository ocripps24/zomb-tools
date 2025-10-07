import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { SymbolPicker, ResultsDisplay } from "@/components/ui";
import type { Symbol } from "@/components/ui/SymbolPicker";
import type { ResultItem } from "@/components/ui/ResultsDisplay";
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
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Steps",
							text: "Turn on 3 laptops around the map with X, Y, Z stickers. Enter the sequence into the terminal in the Weapons Lab.",
						},
						{
							label: "X Laptop",
							text: "Flopper",
						},
						{
							label: "Y Laptop",
							text: "Quick Revive",
						},
						{
							label: "Z Laptop",
							text: "Stamina Up",
						},
						{
							label: "Note",
							text: "The black/sketched/full part of the symbols are represented as solid white above",
						},
					],
				},
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
			{({ data, setData, progress }) => {
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

				// Format results for ResultsDisplay
				const resultItems: ResultItem[] | undefined = results
					? [
							{
								id: "eq1",
								value: results.equation1,
								label: "First Number",
								status: "complete" as const,
							},
							{
								id: "eq2",
								value: results.equation2,
								label: "Second Number",
								status: "complete" as const,
							},
							{
								id: "eq3",
								value: results.equation3,
								label: "Third Number",
								status: "complete" as const,
							},
					  ]
					: undefined;

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

						<ResultsDisplay
							variant="grid"
							title="Terminal Sequence"
							results={resultItems || []}
							gridColumns={3}
							colorScheme="success"
							progressMode="replace"
							progress={progress}
						/>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default BeamCodeSection;

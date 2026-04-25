import React from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import MultiSelectSymbolPicker from "@/components/ui/MultiSelectSymbolPicker";
import type { MultiSelectSymbol } from "@/components/ui/MultiSelectSymbolPicker";
import { ReferenceImages } from "@/components/ui/ReferenceImages";
import CheatSheet from "@/assets/maps/iw/beast-from-beyond/bfb-cheat-sheet.jpg";

import Symbol1 from "@/assets/maps/iw/beast-from-beyond/beast-from-beyond-symbol-1.svg";
import Symbol2 from "@/assets/maps/iw/beast-from-beyond/beast-from-beyond-symbol-2.svg";
import Symbol3 from "@/assets/maps/iw/beast-from-beyond/beast-from-beyond-symbol-3.svg";
import Symbol4 from "@/assets/maps/iw/beast-from-beyond/beast-from-beyond-symbol-4.svg";
import Symbol5 from "@/assets/maps/iw/beast-from-beyond/beast-from-beyond-symbol-5.svg";
import Symbol6 from "@/assets/maps/iw/beast-from-beyond/beast-from-beyond-symbol-6.svg";
import Symbol7 from "@/assets/maps/iw/beast-from-beyond/beast-from-beyond-symbol-7.svg";
import Symbol8 from "@/assets/maps/iw/beast-from-beyond/beast-from-beyond-symbol-8.svg";
import Symbol9 from "@/assets/maps/iw/beast-from-beyond/beast-from-beyond-symbol-9.svg";
import Symbol10 from "@/assets/maps/iw/beast-from-beyond/beast-from-beyond-symbol-10.svg";
import Symbol11 from "@/assets/maps/iw/beast-from-beyond/beast-from-beyond-symbol-11.svg";
import Symbol12 from "@/assets/maps/iw/beast-from-beyond/beast-from-beyond-symbol-12.svg";

type SymbolSVG = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const SYMBOL_COMPONENTS: Record<string, SymbolSVG> = {
	"1": Symbol1 as unknown as SymbolSVG,
	"2": Symbol2 as unknown as SymbolSVG,
	"3": Symbol3 as unknown as SymbolSVG,
	"4": Symbol4 as unknown as SymbolSVG,
	"5": Symbol5 as unknown as SymbolSVG,
	"6": Symbol6 as unknown as SymbolSVG,
	"7": Symbol7 as unknown as SymbolSVG,
	"8": Symbol8 as unknown as SymbolSVG,
	"9": Symbol9 as unknown as SymbolSVG,
	"10": Symbol10 as unknown as SymbolSVG,
	"11": Symbol11 as unknown as SymbolSVG,
	"12": Symbol12 as unknown as SymbolSVG,
};

const ALL_SYMBOL_IDS = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"11",
	"12",
];

// Each set lists 6 symbols in the order they must be placed in the terminal
const DISK_SETS = [
	{ id: 1, symbols: ["1", "2", "3", "4", "5", "6"] },
	{ id: 2, symbols: ["7", "6", "8", "9", "10", "1"] },
	{ id: 3, symbols: ["9", "11", "10", "8", "7", "1"] },
	{ id: 4, symbols: ["9", "4", "3", "5", "6", "2"] },
	{ id: 5, symbols: ["1", "12", "3", "2", "5", "6"] },
	{ id: 6, symbols: ["4", "12", "5", "2", "6", "8"] },
];

const MAX_SELECTIONS = 4;

interface DisksData {
	selectedSymbols: string[];
}

const DEFAULT_DATA: DisksData = {
	selectedSymbols: [],
};

function getPossibleSets(selectedIds: string[]) {
	if (selectedIds.length === 0) return [];
	return DISK_SETS.filter((set) =>
		selectedIds.every((id) => set.symbols.includes(id)),
	);
}

// Determine which of the 4 disk slots we can confirm given the identified set and selected symbols.
// A slot is confirmed when its symbol's relative rank within the 4 selected is fixed regardless of
// which of the remaining set symbols the player hasn't found yet.
function computeSlots(
	setSymbols: string[],
	selectedIds: string[],
): (string | null)[] {
	const slots: (string | null)[] = [null, null, null, null];

	if (selectedIds.length === 0) return slots;

	const selectedWithPos = selectedIds
		.map((id) => ({ id, pos: setSymbols.indexOf(id) }))
		.sort((a, b) => a.pos - b.pos);

	if (selectedIds.length === 4) {
		selectedWithPos.forEach(({ id }, rank) => {
			slots[rank] = id;
		});
		return slots;
	}

	// Positions (0-based index in the set) of the symbols the player hasn't picked up yet
	const remainingPositions = setSymbols
		.map((sym, i) => ({ sym, pos: i }))
		.filter(({ sym }) => !selectedIds.includes(sym))
		.map(({ pos }) => pos);

	selectedWithPos.forEach(({ id, pos }) => {
		const beforeCount = selectedWithPos.filter(
			(x) => x.id !== id && x.pos < pos,
		).length;

		const allRemainingAfter = remainingPositions.every((rp) => rp > pos);
		const allRemainingBefore = remainingPositions.every((rp) => rp < pos);

		if (allRemainingAfter) {
			// The 4th disk will always slot after this symbol, so this symbol's rank is fixed
			slots[beforeCount] = id;
		} else if (allRemainingBefore) {
			// The 4th disk will always slot before this symbol, pushing it one rank higher
			slots[beforeCount + 1] = id;
		}
		// Otherwise rank is ambiguous — leave as null until more symbols are selected
	});

	return slots;
}

function DisksSection(props: BaseSectionProps<DisksData>) {
	return (
		<BaseSection<DisksData>
			config={{
				storageKey: "beast-from-beyond-disks-data",
				defaultValue: DEFAULT_DATA,
				title: "Disks",
				description:
					"Find 4 floppy disks around the map. Select each symbol you find to identify your set and the correct terminal slot order.",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Find Disks",
							text: "Collect 4 floppy disks and identify their unique symbols.",
						},
						{
							label: "Terminal",
							text: "Insert each disk into the computer terminal in the order shown — Slot 1 first, through to Slot 4.",
						},
						{
							label: "Disk Locations:",
							nested: [
								{
									text: "Use the Entangler to move a disk into the vent system and collect from a nearby vent",
								},
								{
									text: "In medical on the table of the room opened by smashing the screens with a space helmet with the Entangler",
								},
								{
									text: "On the floor next to the tower to the left of the Pack-a-Punch portal",
								},
								{
									text: "Obtained by killing the Phantom that spawns ~15s after returning from Pack-a-Punch the first time",
								},
							],
						},
					],
				},
			}}
			getProgress={(data: DisksData) => ({
				completed: data.selectedSymbols.length,
				total: MAX_SELECTIONS,
				isComplete: data.selectedSymbols.length === MAX_SELECTIONS,
			})}
			{...props}
		>
			{({ data, setData }) => {
				const { selectedSymbols } = data;

				const handleSymbolClick = (symbolId: string) => {
					setData((prev) => {
						const isSelected = prev.selectedSymbols.includes(symbolId);
						if (isSelected) {
							return {
								...prev,
								selectedSymbols: prev.selectedSymbols.filter(
									(s) => s !== symbolId,
								),
							};
						}
						if (prev.selectedSymbols.length < MAX_SELECTIONS) {
							return {
								...prev,
								selectedSymbols: [...prev.selectedSymbols, symbolId],
							};
						}
						return prev;
					});
				};

				const possibleSets = getPossibleSets(selectedSymbols);
				const identifiedSet =
					possibleSets.length === 1 ? possibleSets[0] : null;
				const slots = identifiedSet
					? computeSlots(identifiedSet.symbols, selectedSymbols)
					: [null, null, null, null];

				const atMax = selectedSymbols.length >= MAX_SELECTIONS;

				const symbols: MultiSelectSymbol[] = ALL_SYMBOL_IDS.map((id) => {
					const isSelected = selectedSymbols.includes(id);
					const inIdentifiedSet =
						!identifiedSet || identifiedSet.symbols.includes(id);
					return {
						id,
						component: SYMBOL_COMPONENTS[id],
						label: `Symbol ${id}`,
						disabled: !isSelected && (!inIdentifiedSet || atMax),
					};
				});

				let setLabel: string;
				let setStatus: "empty" | "narrowing" | "identified" | "no-match";
				if (selectedSymbols.length === 0) {
					setLabel = "—";
					setStatus = "empty";
				} else if (identifiedSet) {
					setLabel = `Set ${identifiedSet.id}`;
					setStatus = "identified";
				} else if (possibleSets.length > 0) {
					setLabel = possibleSets.map((s) => `Set ${s.id}`).join(", ");
					setStatus = "narrowing";
				} else {
					setLabel = "No match";
					setStatus = "no-match";
				}

				return (
					<div className="bfb-disks">
						<MultiSelectSymbolPicker
							symbols={symbols}
							selectedSymbols={selectedSymbols}
							onSymbolClick={handleSymbolClick}
							className="bfb-disks__picker"
						/>

						<div className="bfb-disks__results">
							<div
								className={`bfb-disks__box bfb-disks__box--set bfb-disks__box--${setStatus}`}
							>
								<span className="bfb-disks__box-label">Set</span>
								<span className="bfb-disks__set-value">{setLabel}</span>
							</div>

							{[0, 1, 2, 3].map((slotIndex) => {
								const symbolId = slots[slotIndex];
								const SymbolComponent = symbolId
									? SYMBOL_COMPONENTS[symbolId]
									: null;
								return (
									<div
										key={slotIndex}
										className={`bfb-disks__box bfb-disks__box--slot${symbolId ? " bfb-disks__box--filled" : ""}`}
									>
										<span className="bfb-disks__box-label">
											Slot {slotIndex + 1}
										</span>
										{SymbolComponent ? (
											<SymbolComponent className="bfb-disks__symbol-icon" />
										) : (
											<span className="bfb-disks__empty">—</span>
										)}
									</div>
								);
							})}
						</div>

						<ReferenceImages
							images={[
								{ src: CheatSheet, alt: "Floppy disk sets cheat sheet" },
							]}
						/>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default DisksSection;

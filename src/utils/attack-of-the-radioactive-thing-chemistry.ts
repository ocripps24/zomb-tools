export type Color = "red" | "green" | "blue" | "";

export interface ChemistryTVData {
	mNumber: number | "";
	tvTop: { color: Color; value: number | "" };
	tvMiddle: { color: Color };
	tvBottom: { color: Color; value: number | "" };
	oNumberColorConfirm: Color;
}

export const O_NUMBERS = [2, 4, 6, 8, 9, 11, 15] as const;

export function roundToNearest(value: number, options: readonly number[]): number {
	return options.reduce((prev, curr) =>
		Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev,
	);
}

// Returns the option immediately below and above `value`. When `value`
// lands exactly on (or outside the range of) an option, both entries match.
function boundingCandidates(
	value: number,
	options: readonly number[],
): [number, number] {
	const sorted = [...options].sort((a, b) => a - b);
	let lower = sorted[0];
	let upper = sorted[sorted.length - 1];
	for (const o of sorted) if (o <= value) lower = o;
	for (let i = sorted.length - 1; i >= 0; i--) if (sorted[i] >= value) upper = sorted[i];
	return [lower, upper];
}

export interface ChemistryDerivedResult {
	oNumber: number | null;
	gameColor: Color;
	ambiguous: boolean;
	candidates: Array<{ oNumber: number; color: Color }>;
}

// With an M-Number of 1 or 2, the bottom TV value alone isn't precise enough
// to pick a single O-Number — two candidates can both round plausibly. In
// that case we surface both and let the user confirm via the Game Color
// their Acetaldehyde set actually showed up under.
export function computeChemistryDerived(
	data: ChemistryTVData,
): ChemistryDerivedResult {
	const mNum = typeof data.mNumber === "number" ? data.mNumber : null;
	const topVal = typeof data.tvTop.value === "number" ? data.tvTop.value : null;
	const bottomVal =
		typeof data.tvBottom.value === "number" ? data.tvBottom.value : null;

	if (mNum === null || mNum <= 0 || bottomVal === null) {
		return { oNumber: null, gameColor: "", ambiguous: false, candidates: [] };
	}

	const resolveColor = (oNum: number): Color => {
		const product = mNum * oNum;
		if (topVal !== null && product <= topVal && data.tvTop.color)
			return data.tvTop.color;
		if (
			topVal !== null &&
			product >= topVal &&
			product <= bottomVal &&
			data.tvMiddle.color
		)
			return data.tvMiddle.color;
		if (product >= bottomVal && data.tvBottom.color) return data.tvBottom.color;
		return "";
	};

	if (mNum < 3 && topVal !== null) {
		const median = (topVal + bottomVal) / 2;
		const [lowO, highO] = boundingCandidates(median / mNum, O_NUMBERS);
		if (lowO !== highO) {
			const candidates = [
				{ oNumber: lowO, color: resolveColor(lowO) },
				{ oNumber: highO, color: resolveColor(highO) },
			];
			if (
				candidates[0].color &&
				candidates[1].color &&
				candidates[0].color !== candidates[1].color
			) {
				const confirmed = data.oNumberColorConfirm
					? candidates.find((c) => c.color === data.oNumberColorConfirm)
					: undefined;
				if (confirmed) {
					return {
						oNumber: confirmed.oNumber,
						gameColor: confirmed.color,
						ambiguous: false,
						candidates,
					};
				}
				return { oNumber: null, gameColor: "", ambiguous: true, candidates };
			}
		}
	}

	const oNumber = roundToNearest(bottomVal / mNum, O_NUMBERS);
	return {
		oNumber,
		gameColor: resolveColor(oNumber),
		ambiguous: false,
		candidates: [],
	};
}

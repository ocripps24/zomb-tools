import { useState } from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// Morse code per digit (0–9).
const DIGIT: Record<number, ("." | "-")[]> = {
	0: ["-", "-", "-", "-", "-"],
	1: [".", "-", "-", "-", "-"],
	2: [".", ".", "-", "-", "-"],
	3: [".", ".", ".", "-", "-"],
	4: [".", ".", ".", ".", "-"],
	5: [".", ".", ".", ".", "."],
	6: ["-", ".", ".", ".", "."],
	7: ["-", "-", ".", ".", "."],
	8: ["-", "-", "-", ".", "."],
	9: ["-", "-", "-", "-", "."],
};

// Full morse sequence for numbers 0–27.
// Single-digit (0–9): 5 chars. Two-digit (10–27): 10 chars (digit1 ++ digit2).
function buildMorse(n: number): ("." | "-")[] {
	if (n < 10) return [...DIGIT[n]];
	return [...DIGIT[Math.floor(n / 10)], ...DIGIT[n % 10]];
}

const RANGE = Array.from({ length: 25 }, (_, i) => i + 3); // 3–27 (0 only valid as second digit)
const MORSE: Record<number, ("." | "-")[]> = Object.fromEntries(
	RANGE.map((n) => [n, buildMorse(n)]),
);

// Individual buoy values are single digits 1–9.
const BUOY_RANGE = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Numbers that are still consistent with the confirmed character prefix.
function getPossibleNumbers(
	confirmed: ("." | "-")[],
	range: number[] = RANGE,
): number[] {
	return range.filter((n) => confirmed.every((ch, i) => MORSE[n][i] === ch));
}

// Suggest the next character to enter. Picks the char held by the most possible
// numbers at the current position (maximises options kept open on no-laugh).
// Ties broken in favour of '.'.
function getNextSuggestion(
	confirmed: ("." | "-")[],
	possible: number[],
): "." | "-" {
	const pos = confirmed.length;
	const dots = possible.filter((n) => MORSE[n][pos] === ".").length;
	const dashes = possible.filter((n) => MORSE[n][pos] === "-").length;
	return dots >= dashes ? "." : "-";
}

interface BuoyEntry {
	chars: ("." | "-")[];
}

interface MorseCodeData {
	confirmedChars: ("." | "-")[];
	awaitingRestart: boolean;
	error: boolean;
	buoyMappings: BuoyEntry[];
}

const DEFAULT_BUOY: BuoyEntry = { chars: [] };

const DEFAULT_DATA: MorseCodeData = {
	confirmedChars: [],
	awaitingRestart: false,
	error: false,
	buoyMappings: [{ ...DEFAULT_BUOY }, { ...DEFAULT_BUOY }, { ...DEFAULT_BUOY }],
};

// Returns possible single-digit values (1–9) still consistent with a buoy's entered chars.
function getBuoyPossible(chars: ("." | "-")[]): number[] {
	return BUOY_RANGE.filter((n) => chars.every((ch, i) => DIGIT[n][i] === ch));
}

// Returns the resolved digit for a buoy entry once chars uniquely identify a number.
function getBuoyNumber(entry: BuoyEntry): number | null {
	const possible = getBuoyPossible(entry.chars);
	const exact = possible.filter((n) => entry.chars.length === DIGIT[n].length);
	return exact.length === 1 ? exact[0] : null;
}

// Narrows the brute-force range based on known/partial buoy values.
// Each buoy contributes its known value, or [1–9] if unknown.
function getEffectiveRange(buoyMappings: BuoyEntry[]): number[] {
	const resolved = buoyMappings.map(getBuoyNumber);
	const allResolved = resolved.every((n) => n !== null);
	if (allResolved) {
		const total = (resolved as number[]).reduce((s, n) => s + n, 0);
		return RANGE.includes(total) ? [total] : [];
	}
	const minTotal = resolved.reduce(
		(s, n) => (s as number) + (n ?? 1),
		0,
	) as number;
	const maxTotal = resolved.reduce(
		(s, n) => (s as number) + (n ?? 9),
		0,
	) as number;
	return RANGE.filter((n) => n >= minTotal && n <= maxTotal);
}

// Central response handler. Given the current state, the suggested char, and whether
// a laugh was heard, returns the next state. Handles auto-complete and error detection.
function applyResponse(
	prev: MorseCodeData,
	suggestion: "." | "-",
	wasLaugh: boolean,
): MorseCodeData {
	const actual: "." | "-" = wasLaugh
		? suggestion === "."
			? "-"
			: "."
		: suggestion;
	const newChars: ("." | "-")[] = [...prev.confirmedChars, actual];
	const range = getEffectiveRange(
		prev.buoyMappings ?? DEFAULT_DATA.buoyMappings,
	);
	const newPossible = getPossibleNumbers(newChars, range);

	if (newPossible.length === 0) {
		return {
			...prev,
			confirmedChars: newChars,
			awaitingRestart: false,
			error: true,
		};
	}
	if (newPossible.length === 1) {
		// Number determined — fill in the full known code immediately.
		return {
			...prev,
			confirmedChars: [...MORSE[newPossible[0]]],
			awaitingRestart: false,
			error: false,
		};
	}
	return {
		...prev,
		confirmedChars: newChars,
		awaitingRestart: wasLaugh,
		error: false,
	};
}

function MorseCodeSection(props: BaseSectionProps<MorseCodeData>) {
	const [isBuoyOpen, setIsBuoyOpen] = useState(false);

	return (
		<BaseSection
			config={{
				storageKey: "blood-of-the-dead-morse-code-data",
				defaultValue: DEFAULT_DATA,
				title: "Morse Code",
				description:
					"Brute-force the code by entering the most efficient sequence. Optionally, players can narrow the possible range by inspecting the buoys and recording their sequences.",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Laugh = wrong entry",
							text: "A laugh from Brutus means the symbol you just entered was incorrect for that position — you must restart the sequence from the beginning.",
						},
						{
							label: "Range",
							text: "The combination is believed to fall somewhere in the range 3–27. Single-digit numbers (3–9) use 5 symbols; two-digit numbers (10–27) use 10.",
						},
						{
							label: "Strategy",
							text: "Follow the tool's suggestions exactly. Each entry is chosen to eliminate the most possibilities, so you'll identify the number in as few attempts as possible.",
						},
						{
							label: "Buoy Locations:",
							nested: [
								{
									label: "Top of Gondola",
									text: "Other end of the platform from Up-and-Atoms",
								},
								{
									label: "Swordfish Wallbuy",
									text: "Inbetween the Dojo and the Barbershop",
								},
								{
									label: "Spawn",
									text: "On the right of the rooftop before crossing the bridge to Racing Stripes",
								},
							],
						},
					],
				},
			}}
			getProgress={(data: MorseCodeData) => {
				const possible = getPossibleNumbers(data.confirmedChars);
				const isComplete =
					possible.length === 1 &&
					data.confirmedChars.length === MORSE[possible[0]].length;
				return { completed: isComplete ? 1 : 0, total: 1, isComplete };
			}}
			{...props}
		>
			{({ data, setData }) => {
				const { confirmedChars, awaitingRestart } = data;
				const buoyMappings = data.buoyMappings ?? DEFAULT_DATA.buoyMappings;
				const effectiveRange = getEffectiveRange(buoyMappings);
				const possible = getPossibleNumbers(confirmedChars, effectiveRange);

				const reset = () => setData(DEFAULT_DATA);

				const updateBuoy = (index: number, patch: Partial<BuoyEntry>) =>
					setData((prev: MorseCodeData) => ({
						...prev,
						buoyMappings: (prev.buoyMappings ?? DEFAULT_DATA.buoyMappings).map(
							(b, i) => (i === index ? { ...b, ...patch } : b),
						),
					}));

				const buoyPanel = (
					<div className="botd-buoy-mapping">
						<button
							className="botd-buoy-mapping__toggle"
							onClick={() => setIsBuoyOpen((v) => !v)}
							type="button"
						>
							<span>Map Buoy Numbers</span>
							<span className="botd-buoy-mapping__badge">Optional</span>
							<span className="botd-buoy-mapping__chevron">
								{isBuoyOpen ? "▲" : "▼"}
							</span>
						</button>

						{isBuoyOpen && (
							<div className="botd-buoy-mapping__body">
								<p className="botd-buoy-mapping__hint">
									Note the morse code or number shown on each buoy at the start
									of the game. Once the combination is found the tool will tell
									you which buoy to go to.
								</p>
								<div className="botd-buoy-mapping__rows">
									{buoyMappings.map((entry, i) => {
										const possible = getBuoyPossible(entry.chars);
										const resolved = getBuoyNumber(entry);
										return (
											<div key={i} className="botd-buoy-row">
												<span className="botd-buoy-row__label">
													Buoy {i + 1}
												</span>
												<div className="botd-buoy-row__btns">
													<button
														className="botd-buoy-row__btn"
														onClick={() =>
															updateBuoy(i, {
																chars: [...entry.chars, "."],
															})
														}
														disabled={entry.chars.length >= 5}
														type="button"
													>
														·
													</button>
													<button
														className="botd-buoy-row__btn"
														onClick={() =>
															updateBuoy(i, {
																chars: [...entry.chars, "-"],
															})
														}
														disabled={entry.chars.length >= 5}
														type="button"
													>
														–
													</button>
													<button
														className="botd-buoy-row__btn botd-buoy-row__btn--back"
														onClick={() =>
															updateBuoy(i, {
																chars: entry.chars.slice(0, -1),
															})
														}
														disabled={entry.chars.length === 0}
														type="button"
													>
														⌫
													</button>
												</div>
												<div className="botd-buoy-row__seq">
													{entry.chars.map((ch, j) => (
														<span
															key={j}
															className={`botd-morse__symbol botd-morse__symbol--${ch === "." ? "dot" : "dash"}`}
														>
															{ch}
														</span>
													))}
												</div>
												<div className="botd-buoy-row__result">
													{resolved !== null ? (
														<span className="botd-buoy-row__number">
															{resolved}
														</span>
													) : entry.chars.length > 0 ? (
														<span
															className={`botd-buoy-row__possible${possible.length === 0 ? " botd-buoy-row__possible--error" : ""}`}
														>
															{possible.length === 0
																? "Invalid"
																: `${possible.length} possible`}
														</span>
													) : null}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
				);

				// ── All buoys resolved — direct answer ─────────────────────────
				const allBuoysResolved = buoyMappings.every(
					(b) => getBuoyNumber(b) !== null,
				);
				if (allBuoysResolved) {
					const total = buoyMappings.reduce((s, b) => s + getBuoyNumber(b)!, 0);
					const inRange = RANGE.includes(total);
					const code = inRange ? MORSE[total] : null;
					const isTwoDigit = code && code.length === 10;
					return (
						<div className="botd-morse">
							{buoyPanel}
							{inRange && code ? (
								<>
									<div className="botd-morse__result">
										<span className="botd-morse__result-label">
											Combination:
										</span>
										<span className="botd-morse__result-number">{total}</span>
									</div>
									<div className="botd-morse__final-code">
										<p className="botd-morse__final-label">
											{isTwoDigit
												? "Enter this sequence (digit 1 then digit 2):"
												: "Enter this sequence:"}
										</p>
										<div className="botd-morse__digits">
											{isTwoDigit ? (
												<>
													<div className="botd-morse__digit-group">
														<span className="botd-morse__digit-label">
															Digit 1
														</span>
														<div className="botd-morse__symbols">
															{code.slice(0, 5).map((ch, i) => (
																<span
																	key={i}
																	className={`botd-morse__symbol botd-morse__symbol--${ch === "." ? "dot" : "dash"}`}
																>
																	{ch}
																</span>
															))}
														</div>
													</div>
													<div className="botd-morse__digit-group">
														<span className="botd-morse__digit-label">
															Digit 2
														</span>
														<div className="botd-morse__symbols">
															{code.slice(5).map((ch, i) => (
																<span
																	key={i}
																	className={`botd-morse__symbol botd-morse__symbol--${ch === "." ? "dot" : "dash"}`}
																>
																	{ch}
																</span>
															))}
														</div>
													</div>
												</>
											) : (
												<div className="botd-morse__digit-group">
													<div className="botd-morse__symbols">
														{code.map((ch, i) => (
															<span
																key={i}
																className={`botd-morse__symbol botd-morse__symbol--${ch === "." ? "dot" : "dash"}`}
															>
																{ch}
															</span>
														))}
													</div>
												</div>
											)}
										</div>
									</div>
								</>
							) : (
								<div className="botd-morse__error">
									<p className="botd-morse__error-title">Invalid total</p>
									<p className="botd-morse__error-hint">
										The buoy values add up to {total}, which is outside the
										valid range (3–27). Please check your entries.
									</p>
								</div>
							)}
							<button
								className="botd-morse__reset"
								onClick={reset}
								type="button"
							>
								Start Over
							</button>
						</div>
					);
				}

				// ── Error ───────────────────────────────────────────────────────
				if (data.error) {
					return (
						<div className="botd-morse">
							{buoyPanel}
							<div className="botd-morse__error">
								<p className="botd-morse__error-title">Impossible sequence</p>
								<p className="botd-morse__error-hint">
									The entries recorded don't match any valid combination in the
									range 3–27. This usually means a response was logged
									incorrectly. Please reset and try again.
								</p>
							</div>
							<button
								className="botd-morse__reset"
								onClick={reset}
								type="button"
							>
								Reset
							</button>
						</div>
					);
				}

				// ── Complete ────────────────────────────────────────────────────
				const isComplete =
					possible.length === 1 &&
					confirmedChars.length === MORSE[possible[0]].length;

				if (isComplete) {
					const number = possible[0];
					const code = MORSE[number];
					const isTwoDigit = code.length === 10;
					const matchingBuoyIndex = buoyMappings.findIndex(
						(b) => getBuoyNumber(b) === number,
					);
					return (
						<div className="botd-morse">
							{buoyPanel}
							{matchingBuoyIndex !== -1 && (
								<p className="botd-buoy-mapping__match">
									Go to Buoy {matchingBuoyIndex + 1}
								</p>
							)}
							<div className="botd-morse__result">
								<span className="botd-morse__result-label">Combination:</span>
								<span className="botd-morse__result-number">{number}</span>
							</div>
							<div className="botd-morse__final-code">
								<p className="botd-morse__final-label">
									{isTwoDigit
										? "Enter this sequence (digit 1 then digit 2):"
										: "Enter this sequence:"}
								</p>
								<div className="botd-morse__digits">
									{isTwoDigit ? (
										<>
											<div className="botd-morse__digit-group">
												<span className="botd-morse__digit-label">Digit 1</span>
												<div className="botd-morse__symbols">
													{code.slice(0, 5).map((ch, i) => (
														<span
															key={i}
															className={`botd-morse__symbol botd-morse__symbol--${ch === "." ? "dot" : "dash"}`}
														>
															{ch}
														</span>
													))}
												</div>
											</div>
											<div className="botd-morse__digit-group">
												<span className="botd-morse__digit-label">Digit 2</span>
												<div className="botd-morse__symbols">
													{code.slice(5).map((ch, i) => (
														<span
															key={i}
															className={`botd-morse__symbol botd-morse__symbol--${ch === "." ? "dot" : "dash"}`}
														>
															{ch}
														</span>
													))}
												</div>
											</div>
										</>
									) : (
										<div className="botd-morse__digit-group">
											<div className="botd-morse__symbols">
												{code.map((ch, i) => (
													<span
														key={i}
														className={`botd-morse__symbol botd-morse__symbol--${ch === "." ? "dot" : "dash"}`}
													>
														{ch}
													</span>
												))}
											</div>
										</div>
									)}
								</div>
							</div>
							<button
								className="botd-morse__reset"
								onClick={reset}
								type="button"
							>
								Start Over
							</button>
						</div>
					);
				}

				// ── Awaiting restart ────────────────────────────────────────────
				if (awaitingRestart) {
					const reEntrySeq = confirmedChars;
					const nextSuggestion = getNextSuggestion(confirmedChars, possible);
					return (
						<div className="botd-morse">
							{buoyPanel}
							<div className="botd-morse__candidates">
								<span className="botd-morse__candidates-label">
									Possible numbers:
								</span>
								<div className="botd-morse__candidate-list">
									{possible.map((n) => (
										<span key={n} className="botd-morse__candidate">
											{n}
										</span>
									))}
								</div>
							</div>
							<div className="botd-morse__restart-box">
								<p className="botd-morse__restart-title">Restart required</p>
								<p className="botd-morse__restart-hint">
									Re-enter this known sequence from the beginning, then enter
									the next symbol below when prompted.
								</p>
								<div className="botd-morse__restart-seq">
									{reEntrySeq.map((ch, i) => (
										<span
											key={i}
											className={`botd-morse__symbol botd-morse__symbol--${ch === "." ? "dot" : "dash"}`}
										>
											{ch}
										</span>
									))}
								</div>
								<p className="botd-morse__restart-next">
									Then enter:{" "}
									<strong>
										{nextSuggestion === "." ? "dot (·)" : "dash (–)"}
									</strong>
								</p>
							</div>
							<div className="botd-morse__actions">
								<button
									className="botd-morse__btn botd-morse__btn--no-laugh"
									onClick={() =>
										setData((prev: MorseCodeData) =>
											applyResponse(prev, nextSuggestion, false),
										)
									}
									type="button"
								>
									No Laugh
								</button>
								<button
									className="botd-morse__btn botd-morse__btn--laugh"
									onClick={() =>
										setData((prev: MorseCodeData) =>
											applyResponse(prev, nextSuggestion, true),
										)
									}
									type="button"
								>
									Laugh
								</button>
							</div>
							<button
								className="botd-morse__reset"
								onClick={reset}
								type="button"
							>
								Reset
							</button>
						</div>
					);
				}

				// ── Active probing ──────────────────────────────────────────────
				const suggestion = getNextSuggestion(confirmedChars, possible);
				const totalLength =
					possible.length === 1 ? MORSE[possible[0]].length : null;

				const handleNoLaugh = () =>
					setData((prev: MorseCodeData) =>
						applyResponse(prev, suggestion, false),
					);

				const handleLaugh = () =>
					setData((prev: MorseCodeData) =>
						applyResponse(prev, suggestion, true),
					);

				return (
					<div className="botd-morse">
						{buoyPanel}
						{confirmedChars.length > 0 && (
							<div className="botd-morse__progress">
								<div className="botd-morse__progress-seq">
									{confirmedChars.map((ch, i) => (
										<span
											key={i}
											className={`botd-morse__symbol botd-morse__symbol--${ch === "." ? "dot" : "dash"} botd-morse__symbol--confirmed`}
										>
											{ch}
										</span>
									))}
									{totalLength &&
										Array.from({
											length: totalLength - confirmedChars.length,
										}).map((_, i) => (
											<span
												key={`empty-${i}`}
												className="botd-morse__symbol botd-morse__symbol--empty"
											>
												·
											</span>
										))}
								</div>
								<div className="botd-morse__candidates">
									<span className="botd-morse__candidates-label">
										Possible:
									</span>
									<div className="botd-morse__candidate-list">
										{possible.map((n) => (
											<span key={n} className="botd-morse__candidate">
												{n}
											</span>
										))}
									</div>
								</div>
							</div>
						)}

						<div className="botd-morse__probe">
							<p className="botd-morse__probe-label">Enter in game:</p>
							<div
								className={`botd-morse__probe-symbol botd-morse__probe-symbol--${suggestion === "." ? "dot" : "dash"}`}
							>
								<span className="botd-morse__probe-char">{suggestion}</span>
								<span className="botd-morse__probe-name">
									{suggestion === "." ? "dot" : "dash"}
								</span>
							</div>
						</div>

						<div className="botd-morse__actions">
							<button
								className="botd-morse__btn botd-morse__btn--no-laugh"
								onClick={handleNoLaugh}
								type="button"
							>
								No Laugh
							</button>
							<button
								className="botd-morse__btn botd-morse__btn--laugh"
								onClick={handleLaugh}
								type="button"
							>
								Laugh
							</button>
						</div>

						{confirmedChars.length > 0 && (
							<button
								className="botd-morse__reset"
								onClick={reset}
								type="button"
							>
								Reset
							</button>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default MorseCodeSection;

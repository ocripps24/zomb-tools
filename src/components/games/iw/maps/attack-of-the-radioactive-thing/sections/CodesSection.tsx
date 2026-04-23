import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

interface CodesSectionData {
	reelNumbers: [number | "", number | "", number | ""];
	valveDigits: number[];
	nukeDigits: number[];
}

const DEFAULT_DATA: CodesSectionData = {
	reelNumbers: ["", "", ""],
	valveDigits: [],
	nukeDigits: [],
};

const REEL_DIGITS = [3, 4, 5, 6] as const;

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const VALVE_LOCATIONS = [
	"Power station by Blue Bolts",
	"Drive-in near Quickies",
	"Motel utility room (crowbar spawn)",
	"Behind the gas station / chemical lab",
];

function CodesSection(props: BaseSectionProps<CodesSectionData>) {
	return (
		<BaseSection<CodesSectionData>
			config={{
				storageKey: "radioactive-thing-codes-data",
				defaultValue: DEFAULT_DATA,
				title: "Codes",
				description:
					"Collect and record the key codes needed to progress the easter egg.",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Reel Code",
							text: "Look at the 5 film reels in Elvira's studio. Reels 1–4 show a combination of 3, 4, 5 and 6 (each once). Reel 5 is always 8. Enter the first 3 reel numbers and the 4th is solved automatically. The code is used twice — the second time in reverse.",
						},
						{
							label: "Valve Code",
							text: "Found under the desk next to the freezer trap. It's a 4-digit code — enter one digit into each of the 4 valves around the map in any order. Hit the gauge with the crowbar as the needle oscillates over your number.",
						},
						{
							label: "Valve Locations:",
							nested: [...VALVE_LOCATIONS.map((loc) => ({ text: loc }))],
						},
						{
							label: "Nuke Code",
							text: "After entering all valve digits correctly, pick up the punch card from the safe next to the freezer. The 5-digit nuke code will appear in your HUD.",
						},
					],
				},
			}}
			getProgress={(data: CodesSectionData) => {
				const reelDone = data.reelNumbers.filter((n) => n !== "").length === 3;
				const valveDone = (data.valveDigits ?? []).length === 4;
				const nukeDone = (data.nukeDigits ?? []).length === 5;
				const completed = [reelDone, valveDone, nukeDone].filter(Boolean).length;
				return { completed, total: 3, isComplete: completed === 3 };
			}}
			{...props}
		>
			{({ data, setData }) => {
				const validReels = data.reelNumbers.filter(
					(n): n is number =>
						typeof n === "number" &&
						(REEL_DIGITS as readonly number[]).includes(n),
				);
				const reel4 =
					validReels.length >= 3
						? (REEL_DIGITS.find((n) => !validReels.includes(n)) ?? null)
						: null;
				const isComplete = validReels.length === 3 && reel4 !== null;
				const fmt = (v: number | "") => (v !== "" ? String(v) : "?");
				const displayForward = [
					fmt(data.reelNumbers[0]),
					fmt(data.reelNumbers[1]),
					fmt(data.reelNumbers[2]),
					reel4 !== null ? reel4 : "?",
					8,
				].join("-");
				const displayReversed = displayForward.split("-").reverse().join("-");

				const updateReel = (index: number, value: number | "") =>
					setData((prev) => {
						const reels = [...prev.reelNumbers] as [
							number | "",
							number | "",
							number | "",
						];
						reels[index] = value;
						return { ...prev, reelNumbers: reels };
					});

				return (
					<div className="radioactive-data">
						{/* Reel Code */}
						<div className="radioactive-data__group">
							<label className="radioactive-data__label">Reel Code</label>
							<div className="radioactive-data__body">
								<p className="radioactive-data__hint">
									Click the numbers in the order they appear on reels 1–3. Reel 4
									auto-resolves. Reel 5 is always 8.
								</p>
								<div className="radioactive-reel-picker">
									{REEL_DIGITS.map((n) => {
										const isUsed =
											(data.reelNumbers as (number | "")[]).includes(n) ||
											reel4 === n;
										return (
											<button
												key={n}
												className={`radioactive-reel-picker__btn${isUsed ? " radioactive-reel-picker__btn--used" : ""}`}
												onClick={() => {
													const nextEmpty = data.reelNumbers.findIndex(
														(r) => r === "",
													);
													if (nextEmpty === -1) return;
													updateReel(nextEmpty, n);
												}}
												disabled={isUsed}
											>
												{n}
											</button>
										);
									})}
								</div>
								<div
									className={`radioactive-result${isComplete ? " radioactive-result--complete" : ""}`}
								>
									<div className="radioactive-result__col">
										<span className="radioactive-result__label">1st use</span>
										<span className="radioactive-result__value">
											{displayForward}
										</span>
									</div>
									<div className="radioactive-result__divider" />
									<div className="radioactive-result__col">
										<span className="radioactive-result__label">
											2nd use (reversed)
										</span>
										<span className="radioactive-result__value">
											{displayReversed}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Valve Code */}
						<div className="radioactive-data__group">
							<label className="radioactive-data__label">Valve Code</label>
							<div className="radioactive-data__body">
								<p className="radioactive-data__hint">
									Found under the desk next to the freezer trap. Enter one digit
									from this code into each valve — any order is fine. Repeats allowed.
								</p>
								<div className="radioactive-digit-picker">
									{DIGITS.map((n) => {
										const valveDigits = data.valveDigits ?? [];
										const isFull = valveDigits.length >= 4;
										return (
											<button
												key={n}
												className={`radioactive-digit-picker__btn${isFull ? " radioactive-digit-picker__btn--disabled" : ""}`}
												onClick={() => {
													if (isFull) return;
													setData((prev) => ({ ...prev, valveDigits: [...(prev.valveDigits ?? []), n] }));
												}}
												disabled={isFull}
											>
												{n}
											</button>
										);
									})}
									<button
										className="radioactive-digit-picker__back"
										onClick={() => setData((prev) => ({ ...prev, valveDigits: (prev.valveDigits ?? []).slice(0, -1) }))}
										disabled={(data.valveDigits ?? []).length === 0}
									>
										⌫
									</button>
								</div>
								<div className={`radioactive-result${(data.valveDigits ?? []).length === 4 ? " radioactive-result--complete" : ""}`}>
									<div className="radioactive-result__col">
										<span className="radioactive-result__label">Valve Code</span>
										<span className="radioactive-result__value">
											{Array.from({ length: 4 }, (_, i) =>
												(data.valveDigits ?? [])[i] !== undefined ? (data.valveDigits ?? [])[i] : "?"
											).join("-")}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Nuke Code */}
						<div className="radioactive-data__group">
							<label className="radioactive-data__label">Nuke Code</label>
							<div className="radioactive-data__body">
								<p className="radioactive-data__hint">
									Pick up the punch card from the safe next to the freezer after
									entering all valve digits. The 5-digit code appears in your HUD.
								</p>
								<div className="radioactive-digit-picker">
									{DIGITS.map((n) => {
										const nukeDigits = data.nukeDigits ?? [];
										const isUsed = nukeDigits.includes(n);
										const isFull = nukeDigits.length >= 5;
										return (
											<button
												key={n}
												className={`radioactive-digit-picker__btn${isUsed || isFull ? " radioactive-digit-picker__btn--disabled" : ""}`}
												onClick={() => {
													if (isUsed || isFull) return;
													setData((prev) => ({ ...prev, nukeDigits: [...(prev.nukeDigits ?? []), n] }));
												}}
												disabled={isUsed || isFull}
											>
												{n}
											</button>
										);
									})}
									<button
										className="radioactive-digit-picker__back"
										onClick={() => setData((prev) => ({ ...prev, nukeDigits: (prev.nukeDigits ?? []).slice(0, -1) }))}
										disabled={(data.nukeDigits ?? []).length === 0}
									>
										⌫
									</button>
								</div>
								<div className={`radioactive-result${(data.nukeDigits ?? []).length === 5 ? " radioactive-result--complete" : ""}`}>
									<div className="radioactive-result__col">
										<span className="radioactive-result__label">Nuke Code</span>
										<span className="radioactive-result__value">
											{Array.from({ length: 5 }, (_, i) =>
												(data.nukeDigits ?? [])[i] !== undefined ? (data.nukeDigits ?? [])[i] : "?"
											).join("-")}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default CodesSection;

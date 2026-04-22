import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

interface CodesSectionData {
	reelNumbers: [number | "", number | "", number | ""];
	valveCode: string;
	nukeCode: string;
}

const DEFAULT_DATA: CodesSectionData = {
	reelNumbers: ["", "", ""],
	valveCode: "",
	nukeCode: "",
};

const REEL_DIGITS = [3, 4, 5, 6] as const;

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
							label: "Nuke Code",
							text: "After entering all valve digits correctly, pick up the punch card from the safe next to the freezer. The 5-digit nuke code will appear in your HUD.",
						},
					],
				},
			}}
			getProgress={(data: CodesSectionData) => {
				const reelDone =
					data.reelNumbers.filter((n) => n !== "").length === 3;
				const valveDone = data.valveCode.length === 4;
				const nukeDone = data.nukeCode.trim().length > 0;
				const completed = [reelDone, valveDone, nukeDone].filter(
					Boolean
				).length;
				return { completed, total: 3, isComplete: completed === 3 };
			}}
			{...props}
		>
			{({ data, setData }) => {
				const validReels = data.reelNumbers.filter(
					(n): n is number =>
						typeof n === "number" &&
						(REEL_DIGITS as readonly number[]).includes(n)
				);
				const reel4 =
					validReels.length >= 3
						? REEL_DIGITS.find((n) => !validReels.includes(n)) ??
							null
						: null;
				const reelCode =
					validReels.length === 3 && reel4 !== null
						? `${data.reelNumbers[0]}${data.reelNumbers[1]}${data.reelNumbers[2]}${reel4}8`
						: null;

				const updateReel = (index: number, value: number | "") =>
					setData((prev) => {
						const reels = [
							...prev.reelNumbers,
						] as [number | "", number | "", number | ""];
						reels[index] = value;
						return { ...prev, reelNumbers: reels };
					});

				return (
					<div className="radioactive-data">
						{/* Reel Code */}
						<div className="radioactive-data__group">
							<label className="radioactive-data__label">
								Reel Code
							</label>
							<p className="radioactive-data__hint">
								Film reels in Elvira's studio. Enter the
								numbers on reels 1–3 (each shows one of 3, 4,
								5, or 6). Reel 4 is solved automatically. Reel
								5 is always 8.
							</p>
							<div className="radioactive-reels">
								{([0, 1, 2] as const).map((i) => (
									<div key={i} className="radioactive-reel">
										<span className="radioactive-reel__num">
											{i + 1}
										</span>
										<select
											className="radioactive-reel__select"
											value={
												data.reelNumbers[i] === ""
													? ""
													: String(
															data.reelNumbers[i]
														)
											}
											onChange={(e) =>
												updateReel(
													i,
													e.target.value === ""
														? ""
														: parseInt(
																e.target.value,
																10
															)
												)
											}
										>
											<option value="">–</option>
											{REEL_DIGITS.map((n) => (
												<option key={n} value={n}>
													{n}
												</option>
											))}
										</select>
									</div>
								))}
								<div
									className={`radioactive-reel radioactive-reel--derived${reel4 !== null ? " radioactive-reel--solved" : ""}`}
								>
									<span className="radioactive-reel__num">
										4
									</span>
									<div className="radioactive-reel__display">
										{reel4 !== null ? reel4 : "?"}
									</div>
								</div>
								<div className="radioactive-reel radioactive-reel--fixed">
									<span className="radioactive-reel__num">
										5
									</span>
									<div className="radioactive-reel__display radioactive-reel__display--fixed">
										8
									</div>
								</div>
							</div>
							{reelCode && (
								<div className="radioactive-result">
									<div className="radioactive-result__col">
										<span className="radioactive-result__label">
											1st use
										</span>
										<span className="radioactive-result__value">
											{reelCode}
										</span>
									</div>
									<div className="radioactive-result__divider" />
									<div className="radioactive-result__col">
										<span className="radioactive-result__label">
											2nd use (reversed)
										</span>
										<span className="radioactive-result__value">
											{reelCode
												.split("")
												.reverse()
												.join("")}
										</span>
									</div>
								</div>
							)}
						</div>

						{/* Valve Code */}
						<div className="radioactive-data__group">
							<label className="radioactive-data__label">
								Valve Code
							</label>
							<p className="radioactive-data__hint">
								Found under the desk next to the freezer trap.
								Enter one digit from this code into each valve
								— any order is fine.
							</p>
							<input
								type="text"
								className="radioactive-data__input"
								value={data.valveCode}
								onChange={(e) =>
									setData((prev) => ({
										...prev,
										valveCode: e.target.value
											.replace(/\D/g, "")
											.slice(0, 4),
									}))
								}
								placeholder="e.g. 1234"
								maxLength={4}
							/>
							<ol className="radioactive-valve-locs">
								{VALVE_LOCATIONS.map((loc, i) => (
									<li key={i}>
										<strong>{i + 1}.</strong> {loc}
									</li>
								))}
							</ol>
						</div>

						{/* Nuke Code */}
						<div className="radioactive-data__group">
							<label className="radioactive-data__label">
								Nuke Code
							</label>
							<p className="radioactive-data__hint">
								Pick up the punch card from the safe next to
								the freezer after entering all valve digits.
								The 5-digit code appears in your HUD.
							</p>
							<input
								type="text"
								className="radioactive-data__input"
								value={data.nukeCode}
								onChange={(e) =>
									setData((prev) => ({
										...prev,
										nukeCode: e.target.value.slice(0, 5),
									}))
								}
								placeholder="Enter nuke code"
								maxLength={5}
							/>
						</div>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default CodesSection;

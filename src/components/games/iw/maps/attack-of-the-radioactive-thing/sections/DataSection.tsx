import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

type Color = "red" | "green" | "blue" | "";

interface DataSectionData {
	mNumber: number | "";
	tvTop: { color: Color; value: number | "" };
	tvMiddle: { color: Color; min: number | ""; max: number | "" };
	tvBottom: { color: Color; value: number | "" };
	targetChemical: string;
	acetaldehydeSet: number | null;
}

const DEFAULT_DATA: DataSectionData = {
	mNumber: "",
	tvTop: { color: "", value: "" },
	tvMiddle: { color: "", min: "", max: "" },
	tvBottom: { color: "", value: "" },
	targetChemical: "",
	acetaldehydeSet: null,
};

const O_NUMBERS = [2, 4, 6, 8, 9, 11, 15] as const;

const CHEMICALS = [
	"3,4-di-nitroxy-methyl-propane",
	"1,3,5-tera-nitra-phenol",
	"octa-hydro-2,5-nitro-3,4,7-parazokine",
	"3-methyl-2,4-dinitrobenzene",
] as const;

const ACETALDEHYDE_SETS = [
	{ set: 1, top: 8, left: 1 },
	{ set: 2, top: 1, left: 7 },
	{ set: 3, top: 3, left: 9 },
	{ set: 4, top: 6, left: 6 },
	{ set: 5, top: 8, left: 4 },
	{ set: 6, top: 4, left: 5 },
] as const;

const COLORS: Array<{ value: Exclude<Color, "">; label: string }> = [
	{ value: "red", label: "Red" },
	{ value: "green", label: "Green" },
	{ value: "blue", label: "Blue" },
];

function roundToNearest(value: number, options: readonly number[]): number {
	return options.reduce((prev, curr) =>
		Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev,
	);
}

function DataSection(props: BaseSectionProps<DataSectionData>) {
	return (
		<BaseSection<DataSectionData>
			config={{
				storageKey: "radioactive-thing-data-data",
				defaultValue: DEFAULT_DATA,
				title: "Chemistry - Data",
				description:
					"Record and calculate the values needed to identify your target chemical.",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "M-Number",
							text: "Found on the wall of the motel reception.",
						},
						{
							label: "Elvira's TV",
							text: "The TV next to Elvira shows 3 rows of colored numbers. Each row has a color (Red, Green, or Blue) and a number or range. Enter all 3 rows to auto-calculate your O-Number and Game Color.",
						},
						{
							label: "O-Number",
							text: "Calculated by dividing the bottom TV row number by the M-Number and rounding to the nearest value in: 2, 4, 6, 8, 9, 11, 15.",
						},
						{
							label: "Game Color",
							text: "Calculated by multiplying M-Number × O-Number. The result falls into one of the 3 TV rows — that row's color is your Game Color.",
						},
						{
							label: "Target Chemical",
							text: "Get a battery by melee killing zombies (chance drop from backpack). Place it in the motel reception radio or the power station radio. Listen for the quote that identifies your chemical.",
						},
						{
							label: "Acetaldehyde Set",
							text: "With your Game Color filter active, look at the board outside Elvira's studio. Find the Acetaldehyde diamond and match the top and left numbers to one of the 6 sets below.",
						},
					],
				},
			}}
			getProgress={(data: DataSectionData) => {
				const mDone = data.mNumber !== "";
				const tvDone =
					data.tvTop.color !== "" &&
					data.tvTop.value !== "" &&
					data.tvMiddle.color !== "" &&
					data.tvMiddle.min !== "" &&
					data.tvMiddle.max !== "" &&
					data.tvBottom.color !== "" &&
					data.tvBottom.value !== "";
				const chemDone = data.targetChemical !== "";
				const setDone = data.acetaldehydeSet !== null;
				const completed = [mDone, tvDone, chemDone, setDone].filter(
					Boolean,
				).length;
				return { completed, total: 4, isComplete: completed === 4 };
			}}
			{...props}
		>
			{({ data, setData }) => {
				const mNum = typeof data.mNumber === "number" ? data.mNumber : null;
				const bottomVal =
					typeof data.tvBottom.value === "number" ? data.tvBottom.value : null;

				const rawO =
					mNum !== null && mNum > 0 && bottomVal !== null
						? bottomVal / mNum
						: null;
				const oNumber = rawO !== null ? roundToNearest(rawO, O_NUMBERS) : null;

				const product =
					mNum !== null && oNumber !== null ? mNum * oNumber : null;

				let gameColor: Color = "";
				if (product !== null) {
					const topVal =
						typeof data.tvTop.value === "number" ? data.tvTop.value : null;
					const midMin =
						typeof data.tvMiddle.min === "number" ? data.tvMiddle.min : null;
					const midMax =
						typeof data.tvMiddle.max === "number" ? data.tvMiddle.max : null;
					const botVal =
						typeof data.tvBottom.value === "number"
							? data.tvBottom.value
							: null;

					if (topVal !== null && product <= topVal && data.tvTop.color)
						gameColor = data.tvTop.color;
					else if (
						midMin !== null &&
						midMax !== null &&
						product >= midMin &&
						product <= midMax &&
						data.tvMiddle.color
					)
						gameColor = data.tvMiddle.color;
					else if (botVal !== null && product >= botVal && data.tvBottom.color)
						gameColor = data.tvBottom.color;
				}

				const ALL_COLORS: Array<Exclude<Color, "">> = ["red", "green", "blue"];

				const handleColorClick = (
					rowKey: "tvTop" | "tvMiddle" | "tvBottom",
					color: Exclude<Color, "">,
				) => {
					setData((prev) => {
						// Toggle off if already selected
						if (prev[rowKey].color === color) {
							return {
								...prev,
								[rowKey]: { ...prev[rowKey], color: "" },
							};
						}

						const next: DataSectionData = {
							...prev,
							[rowKey]: { ...prev[rowKey], color },
						};

						// Auto-complete the remaining row when 2 are set
						const topC = next.tvTop.color;
						const midC = next.tvMiddle.color;
						const botC = next.tvBottom.color;
						const setColors = [topC, midC, botC].filter(Boolean);

						if (setColors.length === 2) {
							const remaining = ALL_COLORS.find((c) => !setColors.includes(c))!;
							if (!topC)
								next.tvTop = {
									...next.tvTop,
									color: remaining,
								};
							if (!midC)
								next.tvMiddle = {
									...next.tvMiddle,
									color: remaining,
								};
							if (!botC)
								next.tvBottom = {
									...next.tvBottom,
									color: remaining,
								};
						}

						return next;
					});
				};

				const isColorDisabled = (
					rowKey: "tvTop" | "tvMiddle" | "tvBottom",
					color: Exclude<Color, "">,
				) => {
					const rows = ["tvTop", "tvMiddle", "tvBottom"] as const;
					return rows.some((r) => r !== rowKey && data[r].color === color);
				};

				return (
					<div className="radioactive-data">
						{/* M-Number */}
						<div className="radioactive-data__group">
							<label className="radioactive-data__label">M-Number</label>
							<p className="radioactive-data__hint">
								Found on the wall of the motel reception.
							</p>
							<input
								type="number"
								className="radioactive-data__input"
								value={data.mNumber === "" ? "" : data.mNumber}
								onChange={(e) => {
									const v = e.target.value;
									setData((prev) => ({
										...prev,
										mNumber: v === "" ? "" : parseInt(v, 10),
									}));
								}}
								min={1}
								placeholder="—"
							/>
						</div>

						{/* Elvira's TV */}
						<div className="radioactive-data__group">
							<label className="radioactive-data__label">Elvira's TV</label>
							<p className="radioactive-data__hint">
								Select the color and enter the number(s) for each row
							</p>
							<div className="radioactive-tv">
								{/* Top row */}
								<div className="radioactive-tv__row">
									<div className="radioactive-tv__values">
										<span className="radioactive-tv__sym">&lt;</span>
										<input
											type="number"
											className="radioactive-data__input radioactive-data__input--sm"
											value={data.tvTop.value === "" ? "" : data.tvTop.value}
											onChange={(e) =>
												setData((prev) => ({
													...prev,
													tvTop: {
														...prev.tvTop,
														value:
															e.target.value === ""
																? ""
																: parseInt(e.target.value, 10),
													},
												}))
											}
											placeholder="—"
										/>
									</div>
									<div className="radioactive-tv__colors">
										{COLORS.map((c) => (
											<button
												key={c.value}
												className={`radioactive-tv__color radioactive-tv__color--${c.value}${data.tvTop.color === c.value ? " radioactive-tv__color--active" : ""}${isColorDisabled("tvTop", c.value) ? " radioactive-tv__color--disabled" : ""}`}
												onClick={() => handleColorClick("tvTop", c.value)}
												disabled={isColorDisabled("tvTop", c.value)}
											>
												{c.label}
											</button>
										))}
									</div>
								</div>

								{/* Middle row */}
								<div className="radioactive-tv__row">
									<div className="radioactive-tv__values">
										<input
											type="number"
											className="radioactive-data__input radioactive-data__input--sm"
											value={data.tvMiddle.min === "" ? "" : data.tvMiddle.min}
											onChange={(e) =>
												setData((prev) => ({
													...prev,
													tvMiddle: {
														...prev.tvMiddle,
														min:
															e.target.value === ""
																? ""
																: parseInt(e.target.value, 10),
													},
												}))
											}
											placeholder="—"
										/>
										<span className="radioactive-tv__sym">–</span>
										<input
											type="number"
											className="radioactive-data__input radioactive-data__input--sm"
											value={data.tvMiddle.max === "" ? "" : data.tvMiddle.max}
											onChange={(e) =>
												setData((prev) => ({
													...prev,
													tvMiddle: {
														...prev.tvMiddle,
														max:
															e.target.value === ""
																? ""
																: parseInt(e.target.value, 10),
													},
												}))
											}
											placeholder="—"
										/>
									</div>
									<div className="radioactive-tv__colors">
										{COLORS.map((c) => (
											<button
												key={c.value}
												className={`radioactive-tv__color radioactive-tv__color--${c.value}${data.tvMiddle.color === c.value ? " radioactive-tv__color--active" : ""}${isColorDisabled("tvMiddle", c.value) ? " radioactive-tv__color--disabled" : ""}`}
												onClick={() => handleColorClick("tvMiddle", c.value)}
												disabled={isColorDisabled("tvMiddle", c.value)}
											>
												{c.label}
											</button>
										))}
									</div>
								</div>

								{/* Bottom row */}
								<div className="radioactive-tv__row">
									<div className="radioactive-tv__values">
										<span className="radioactive-tv__sym">&gt;</span>
										<input
											type="number"
											className="radioactive-data__input radioactive-data__input--sm"
											value={
												data.tvBottom.value === "" ? "" : data.tvBottom.value
											}
											onChange={(e) =>
												setData((prev) => ({
													...prev,
													tvBottom: {
														...prev.tvBottom,
														value:
															e.target.value === ""
																? ""
																: parseInt(e.target.value, 10),
													},
												}))
											}
											placeholder="—"
										/>
									</div>
									<div className="radioactive-tv__colors">
										{COLORS.map((c) => (
											<button
												key={c.value}
												className={`radioactive-tv__color radioactive-tv__color--${c.value}${data.tvBottom.color === c.value ? " radioactive-tv__color--active" : ""}${isColorDisabled("tvBottom", c.value) ? " radioactive-tv__color--disabled" : ""}`}
												onClick={() => handleColorClick("tvBottom", c.value)}
												disabled={isColorDisabled("tvBottom", c.value)}
											>
												{c.label}
											</button>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* Calculated: O-Number and Game Color */}
						{(oNumber !== null || gameColor !== "") && (
							<div className="radioactive-derived">
								{oNumber !== null && (
									<div className="radioactive-derived__item">
										<span className="radioactive-derived__label">O-Number</span>
										<span className="radioactive-derived__value">
											{oNumber}
										</span>
									</div>
								)}
								{gameColor !== "" && (
									<div className="radioactive-derived__item">
										<span className="radioactive-derived__label">
											Game Color
										</span>
										<span
											className={`radioactive-derived__value radioactive-derived__value--${gameColor}`}
										>
											{gameColor.charAt(0).toUpperCase() + gameColor.slice(1)}
										</span>
									</div>
								)}
							</div>
						)}

						{/* Target Chemical */}
						<div className="radioactive-data__group">
							<label className="radioactive-data__label">Target Chemical</label>
							<p className="radioactive-data__hint">
								Get a battery by melee killing zombies (chance drop from
								backpack). Place it in the motel office radio or the power
								station radio, then listen for the quote identifying your
								chemical.
							</p>
							<div className="radioactive-chemicals">
								{CHEMICALS.map((chem) => (
									<button
										key={chem}
										className={`radioactive-chemical${data.targetChemical === chem ? " radioactive-chemical--selected" : ""}`}
										onClick={() =>
											setData((prev) => ({
												...prev,
												targetChemical:
													prev.targetChemical === chem ? "" : chem,
											}))
										}
									>
										{chem}
									</button>
								))}
							</div>
						</div>

						{/* Acetaldehyde Set */}
						<div className="radioactive-data__group">
							<label className="radioactive-data__label">
								Acetaldehyde Set
							</label>
							<p className="radioactive-data__hint">
								With your Game Color filter active, look at the board outside
								Elvira's studio. Match the top and left numbers in the
								Acetaldehyde diamond to one of the 6 sets below. If your numbers
								don't match any set then you can be sure that your game color is
								wrong. This can happen if you're M-number is 1 or 2 and can be
								resolved by changing your game color until you find a match with
								a set.
							</p>
							<div className="radioactive-sets">
								{ACETALDEHYDE_SETS.map(({ set, top, left }) => (
									<button
										key={set}
										className={`radioactive-set${data.acetaldehydeSet === set ? " radioactive-set--selected" : ""}`}
										onClick={() =>
											setData((prev) => ({
												...prev,
												acetaldehydeSet:
													prev.acetaldehydeSet === set ? null : set,
											}))
										}
									>
										<div className="radioactive-set__diamond-wrap">
											<div className="radioactive-set__diamond">
												<span className="radioactive-set__num radioactive-set__num--top">
													{top}
												</span>
												<span className="radioactive-set__num radioactive-set__num--right" />
												<span className="radioactive-set__num radioactive-set__num--bottom" />
												<span className="radioactive-set__num radioactive-set__num--left">
													{left}
												</span>
											</div>
										</div>
										<span className="radioactive-set__label">Set {set}</span>
									</button>
								))}
							</div>
						</div>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default DataSection;

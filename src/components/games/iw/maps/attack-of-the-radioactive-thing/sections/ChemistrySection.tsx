import { useState } from "react";
import { usePersistedState } from "@/hooks/usePersistedState";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { ReferenceImages } from "@/components/ui/ReferenceImages";
import {
	computeChemistryDerived,
	type ChemistryTVData,
} from "@/utils/attack-of-the-radioactive-thing-chemistry";

import imgBakingSoda from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-baking-soda.jpg";
import imgBleach from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-bleach.jpg";
import imgDetergent from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-detergent.jpg";
import imgDrainOpener from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-drain-opener.jpg";
import imgFat from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-fat.jpg";
import imgFoodColoring from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-food-coloring.jpg";
import imgGlassCleaner from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-glass-cleaner.jpg";
import imgIce from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-ice.jpg";
import imgInsectRepellent from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-insect-repellent.jpg";
import imgMotorOil from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-motor-oil.jpg";
import imgNailPolishRemover from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-nail-polish-remover.jpg";
import imgPaint from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-paint.jpg";
import imgPennies from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-pennies.jpg";
import imgPlantFood from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-plant-food.jpg";
import imgPoolCleaner from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-pool-cleaner.jpg";
import imgPowderedMilk from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-powdered-milk.jpg";
import imgQuarters from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-quarters.jpg";
import imgRacingFuel from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-racing-fuel.jpg";
import imgTableSalt from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-table-salt.jpg";
import imgVinegar from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-vinegar.jpg";
import imgVodka from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-vodka.jpg";
import imgWheelCleaner from "@/assets/maps/iw/attack-of-the-radioactive-thing/aotrt-ingredient-wheel-cleaner.jpg";

// ── Cross-section types (mirrors DataSectionData) ─────────────────────────────

interface SourceData extends ChemistryTVData {
	targetChemical: string;
	acetaldehydeSet: number | null;
}

// ── This section's own persisted data ────────────────────────────────────────

interface CraftingData {
	completedByChemical: Record<string, number[]>;
}

// ── Recipe types ──────────────────────────────────────────────────────────────

type SetNumbers = { [K in 1 | 2 | 3 | 4 | 5 | 6]: number };

interface MixStep {
	name: string;
	result: string;
	ingredients: string[];
	setNumbers: SetNumbers;
}

interface Recipe {
	steps: MixStep[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_SOURCE: SourceData = {
	mNumber: "",
	tvTop: { color: "", value: "" },
	tvMiddle: { color: "" },
	tvBottom: { color: "", value: "" },
	targetChemical: "",
	acetaldehydeSet: null,
	oNumberColorConfirm: "",
};

const DEFAULT_CRAFTING: CraftingData = {
	completedByChemical: {},
};

const ITEM_LOCATIONS: Record<string, string> = {
	"Insect Repellent": "Central tunnel of the spawn tents",
	"Racing Fuel": "In front of the gas station",
	Vodka: "Alcohol section of the market",
	"Baking Soda": "On a shelf in the market",
	Detergent: "On a shelf in the market",
	"Food Coloring": "On a shelf in the market",
	Bleach: "On the floor in spawn",
	Ice: "Crowbar melee the ice machine in the market",
	"Powdered Milk": "On a shelf in the market",
	Vinegar: "On a table at the power station side of the market",
	"Plant Food": "Outside the Snack Shack",
	Paint: "Behind the shack next to Racing Stripes",
	"Motor Oil": "On the floor inside the gas station",
	"Wheel Cleaner": "On a shelf in the market",
	Fat: "Cleaver melee the meat in the market",
	"Table Salt": "In the freezer in the market",
	Pennies: "Crowbar melee the blue cash register in the market",
	"Nail Polish Remover": "In the Motel Reception",
	"Pool Cleaner": "On the side of the Motel pool",
	"Drain Opener": "On a toilet in the RV park",
	Quarters: "Crowbar melee the payphones around the gas station",
	"Glass Cleaner": "On a shelf in the market",
};

const INGREDIENT_IMAGES: Record<string, string> = {
	"Insect Repellent": imgInsectRepellent,
	"Racing Fuel": imgRacingFuel,
	Vodka: imgVodka,
	"Baking Soda": imgBakingSoda,
	Detergent: imgDetergent,
	"Food Coloring": imgFoodColoring,
	Bleach: imgBleach,
	Ice: imgIce,
	"Powdered Milk": imgPowderedMilk,
	Vinegar: imgVinegar,
	"Plant Food": imgPlantFood,
	Paint: imgPaint,
	"Motor Oil": imgMotorOil,
	"Wheel Cleaner": imgWheelCleaner,
	Fat: imgFat,
	"Table Salt": imgTableSalt,
	Pennies: imgPennies,
	"Nail Polish Remover": imgNailPolishRemover,
	"Pool Cleaner": imgPoolCleaner,
	"Drain Opener": imgDrainOpener,
	Quarters: imgQuarters,
	"Glass Cleaner": imgGlassCleaner,
};

const REFERENCE_IMAGES = Object.keys(INGREDIENT_IMAGES).map((name) => ({
	src: INGREDIENT_IMAGES[name],
	alt: name,
	label: `${name} — ${ITEM_LOCATIONS[name]}`,
}));

const INGREDIENT_IMAGE_INDEX: Record<string, number> = Object.fromEntries(
	Object.keys(INGREDIENT_IMAGES).map((name, i) => [name, i]),
);

const RECIPES: Record<string, Recipe> = {
	"1,3,5-tera-nitra-phenol": {
		steps: [
			{
				name: "Crafting Phenol",
				result: "Phenol",
				ingredients: ["Insect Repellent", "Wheel Cleaner", "Motor Oil"],
				setNumbers: { 1: 21, 2: 28, 3: 29, 4: 31, 5: 36, 6: 43 },
			},
			{
				name: "Crafting Phenolsulfonic acid",
				result: "Phenolsulfonic acid",
				ingredients: ["Drain Opener", "Phenol"],
				setNumbers: { 1: 20, 2: 26, 3: 18, 4: 24, 5: 16, 6: 22 },
			},
			{
				name: "Crafting 1,3,5-tera-nitra-phenol",
				result: "1,3,5-tera-nitra-phenol",
				ingredients: ["Detergent", "Phenolsulfonic acid"],
				setNumbers: { 1: 18, 2: 19, 3: 26, 4: 21, 5: 25, 6: 17 },
			},
		],
	},
	"3,4-di-nitroxy-methyl-propane": {
		steps: [
			{
				name: "Crafting Formaldehyde",
				result: "Formaldehyde",
				ingredients: ["Quarters", "Racing Fuel"],
				setNumbers: { 1: 24, 2: 26, 3: 20, 4: 21, 5: 19, 6: 18 },
			},
			{
				name: "Crafting Acetaldehyde",
				result: "Acetaldehyde",
				ingredients: ["Vodka", "Pennies"],
				setNumbers: { 1: 25, 2: 23, 3: 30, 4: 17, 5: 22, 6: 16 },
			},
			{
				name: "Crafting Aldehyde Sludge",
				result: "Aldehyde Sludge",
				ingredients: ["Detergent", "Acetaldehyde", "Formaldehyde"],
				setNumbers: { 1: 29, 2: 28, 3: 41, 4: 37, 5: 33, 6: 35 },
			},
			{
				name: "Crafting 3,4-di-nitroxy-methyl-propane",
				result: "3,4-di-nitroxy-methyl-propane",
				ingredients: ["Nail Polish Remover", "Aldehyde Sludge"],
				setNumbers: { 1: 19, 2: 16, 3: 25, 4: 22, 5: 16, 6: 24 },
			},
		],
	},
	"octa-hydro-2,5-nitro-3,4,7-parazokine": {
		steps: [
			{
				name: "Crafting Formaldehyde",
				result: "Formaldehyde",
				ingredients: ["Quarters", "Racing Fuel"],
				setNumbers: { 1: 24, 2: 26, 3: 20, 4: 21, 5: 19, 6: 18 },
			},
			{
				name: "Crafting Hexamine",
				result: "Hexamine",
				ingredients: ["Glass Cleaner", "Formaldehyde"],
				setNumbers: { 1: 18, 2: 30, 3: 21, 4: 30, 5: 23, 6: 23 },
			},
			{
				name: "Crafting Octa-hydro-2,5-nitro-3,4,7-parazokine",
				result: "octa-hydro-2,5-nitro-3,4,7-parazokine",
				ingredients: ["Vinegar", "Plant Food", "Detergent", "Hexamine"],
				setNumbers: { 1: 44, 2: 27, 3: 51, 4: 41, 5: 38, 6: 42 },
			},
		],
	},
	"3-methyl-2,4-dinitrobenzene": {
		steps: [
			{
				name: "Crafting Methylybenzene",
				result: "Methylybenzene",
				ingredients: ["Paint", "Detergent", "Drain Opener"],
				setNumbers: { 1: 30, 2: 27, 3: 38, 4: 34, 5: 23, 6: 36 },
			},
			{
				name: "Crafting Dinitro",
				result: "Dinitro",
				ingredients: ["Detergent", "Vinegar", "Baking Soda", "Methylybenzene"],
				setNumbers: { 1: 40, 2: 31, 3: 45, 4: 39, 5: 33, 6: 48 },
			},
			{
				name: "Crafting 3-methyl-2,4-dinitrobenzene",
				result: "3-methyl-2,4-dinitrobenzene",
				ingredients: ["Dinitro", "Racing Fuel"],
				setNumbers: { 1: 28, 2: 21, 3: 20, 4: 17, 5: 29, 6: 19 },
			},
		],
	},
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSourceStep(
	ingredient: string,
	stepIndex: number,
	steps: MixStep[],
): number | null {
	for (let i = 0; i < stepIndex; i++) {
		if (steps[i].result === ingredient) return i + 1;
	}
	return null;
}

// ── Component ─────────────────────────────────────────────────────────────────

function ChemistrySection(props: BaseSectionProps<CraftingData>) {
	const { data: sourceData } = usePersistedState<SourceData>({
		storageKey: "radioactive-thing-data-data",
		defaultValue: DEFAULT_SOURCE,
	});
	const [activeImageIndex, setActiveImageIndex] = useState<number | undefined>(
		undefined,
	);

	const oNumber = computeChemistryDerived(sourceData).oNumber;
	const { targetChemical, acetaldehydeSet } = sourceData;
	const recipe = targetChemical ? (RECIPES[targetChemical] ?? null) : null;
	const hasAllData =
		targetChemical !== "" && oNumber !== null && acetaldehydeSet !== null;

	return (
		<BaseSection<CraftingData>
			config={{
				storageKey: "radioactive-thing-crafting-data",
				defaultValue: DEFAULT_CRAFTING,
				title: "Chemistry - Crafting",
				description:
					"Use the values from Chemistry — Data to calculate and craft the correct chemical mixture. Clicking on ingredients will scroll the image gallery to the associated location. Shoutout to Mennobot for making this possible.",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Mix Number",
							text: "Each step shows a set total and your O-Number. Subtract the O-Number from the set total to get the Mix Number to enter at the crafting bench.",
						},
						{
							label: "Crafted ingredients",
							text: "Ingredients shown in blue are produced by an earlier step in the same recipe — craft them first before moving on.",
						},
					],
				},
			}}
			getProgress={(data: CraftingData) => {
				if (!recipe) return { completed: 0, total: 0, isComplete: false };
				const total = recipe.steps.length;
				const completed = (
					(data.completedByChemical ?? {})[targetChemical] ?? []
				).length;
				return { completed, total, isComplete: completed === total };
			}}
			{...props}
		>
			{({ data, setData }) => {
				const toggleStep = (stepIndex: number) => {
					setData((prev) => {
						const current =
							(prev.completedByChemical ?? {})[targetChemical] ?? [];
						const updated = current.includes(stepIndex)
							? current.filter((i) => i !== stepIndex)
							: [...current, stepIndex];
						return {
							...prev,
							completedByChemical: {
								...prev.completedByChemical,
								[targetChemical]: updated,
							},
						};
					});
				};

				const summaryItems = [
					{ label: "Target Chemical", value: targetChemical || null },
					{
						label: "O-Number",
						value: oNumber !== null ? String(oNumber) : null,
					},
					{
						label: "Acetaldehyde Set",
						value: acetaldehydeSet !== null ? `Set ${acetaldehydeSet}` : null,
					},
				];

				return (
					<div className="radioactive-crafting">
						<div className="radioactive-crafting__summary">
							{summaryItems.map(({ label, value }) => (
								<div
									key={label}
									className={`radioactive-crafting__summary-item${!value ? " radioactive-crafting__summary-item--unset" : ""}`}
								>
									<span className="radioactive-crafting__summary-label">
										{label}
									</span>
									<span
										className={`radioactive-crafting__summary-value${!value ? " radioactive-crafting__summary-value--empty" : ""}`}
									>
										{value ?? "—"}
									</span>
								</div>
							))}
						</div>

						{!hasAllData && (
							<p className="radioactive-crafting__locked">
								Complete all fields in Chemistry — Data to unlock the mixing
								steps.
							</p>
						)}

						{hasAllData && recipe && (
							<div className="radioactive-crafting__steps">
								{recipe.steps.map((step, i) => {
									const completed =
										(data.completedByChemical ?? {})[targetChemical] ?? [];
									const isComplete = completed.includes(i);
									const setMixNum =
										step.setNumbers[acetaldehydeSet as 1 | 2 | 3 | 4 | 5 | 6];
									const mixNum = setMixNum - (oNumber as number);

									return (
										<div
											key={i}
											className={`radioactive-step${isComplete ? " radioactive-step--complete" : ""}`}
										>
											<div className="radioactive-step__header">
												<span className="radioactive-step__num">
													Step {i + 1}
												</span>
												<span className="radioactive-step__name">
													{step.name}
												</span>
												{isComplete && (
													<span className="radioactive-step__done-badge">
														✓ Done
													</span>
												)}
											</div>
											<div className="radioactive-step__body">
												<div className="radioactive-step__ingredients">
													<span className="radioactive-ingredients-label">
														Ingredients
													</span>
													{step.ingredients.map((ing) => {
														const location = ITEM_LOCATIONS[ing];
														const fromStep = !location
															? getSourceStep(ing, i, recipe.steps)
															: null;
														const imgIndex = INGREDIENT_IMAGE_INDEX[ing];
														const hasImage = imgIndex !== undefined;
														return (
															<div
																key={ing}
																className={`radioactive-ingredient${!location ? " radioactive-ingredient--crafted" : ""}${hasImage ? " radioactive-ingredient--has-image" : ""}`}
																onClick={
																	hasImage
																		? () => setActiveImageIndex(imgIndex)
																		: undefined
																}
																role={hasImage ? "button" : undefined}
																tabIndex={hasImage ? 0 : undefined}
																onKeyDown={
																	hasImage
																		? (e) =>
																				e.key === "Enter" &&
																				setActiveImageIndex(imgIndex)
																		: undefined
																}
															>
																<span className="radioactive-ingredient__name">
																	{ing}
																</span>
																{location && (
																	<span className="radioactive-ingredient__location">
																		{location}
																	</span>
																)}
																{fromStep !== null && (
																	<span className="radioactive-ingredient__crafted-from">
																		Crafted in Step {fromStep}
																	</span>
																)}
															</div>
														);
													})}
												</div>
												<div className="radioactive-step__mix-area">
													<div className="radioactive-step__mix">
														<span className="radioactive-step__mix-label">
															Mix Number
														</span>
														<span className="radioactive-step__mix-result">
															{mixNum}
														</span>
														<div className="radioactive-step__mix-calc">
															<span>{setMixNum}</span>
															<span>−</span>
															<span>{oNumber}</span>
														</div>
													</div>
													<button
														className="radioactive-step__complete-btn"
														onClick={() => toggleStep(i)}
													>
														{isComplete ? "Mark Incomplete" : "Mark Complete"}
													</button>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
						<ReferenceImages
							images={REFERENCE_IMAGES}
							scrollToIndex={activeImageIndex}
						/>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default ChemistrySection;

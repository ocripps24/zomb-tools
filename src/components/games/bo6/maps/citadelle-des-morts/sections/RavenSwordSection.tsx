import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// Import symbols as React components
import FireSymbol from "@/assets/symbols/triangle-up.svg";
import WaterSymbol from "@/assets/symbols/triangle-down.svg";
import AirSymbol from "@/assets/symbols/triangle-up-dash.svg";
import EarthSymbol from "@/assets/symbols/triangle-down-dash.svg";

import AriesSymbol from "@/assets/symbols/zodiac-aries.svg";
import GeminiSymbol from "@/assets/symbols/zodiac-gemini.svg";
import LeoSymbol from "@/assets/symbols/zodiac-leo.svg";
import ScorpioSymbol from "@/assets/symbols/zodiac-scorpio.svg";
import PiscesSymbol from "@/assets/symbols/zodiac-pisces.svg";

// Antiquity data with their corresponding symbol combinations
const ANTIQUITIES = [
	{
		id: "horn",
		name: "Horn",
		description: "Goat horn containing ancient remains",
		innerSymbol: "fire",
		outerSymbol: "aries",
	},
	{
		id: "skulls",
		name: "Skulls",
		description: "Bird skulls with mystical properties",
		innerSymbol: "air",
		outerSymbol: "gemini",
	},
	{
		id: "jaw",
		name: "Jaw",
		description: "Jaw bone from an ancient creature",
		innerSymbol: "fire",
		outerSymbol: "leo",
	},
	{
		id: "scorpion",
		name: "Scorpion",
		description: "Preserved scorpion remains",
		innerSymbol: "water",
		outerSymbol: "scorpio",
	},
	{
		id: "fish",
		name: "Fish",
		description: "Fish bones from ancient waters",
		innerSymbol: "water",
		outerSymbol: "pisces",
	},
];

// Symbol mappings
const ELEMENTAL_SYMBOLS = {
	fire: {
		name: "Fire",
		component: FireSymbol,
		description: "Triangle (Fire)",
	},
	air: {
		name: "Air",
		component: AirSymbol,
		description: "Triangle with Line (Air)",
	},
	water: {
		name: "Water",
		component: WaterSymbol,
		description: "Upside-Down Triangle (Water)",
	},
	earth: {
		name: "Earth",
		component: EarthSymbol,
		description: "Upside-Down Triangle with Line (Earth)",
	},
};

const ZODIAC_SYMBOLS = {
	aries: { name: "Aries", component: AriesSymbol },
	gemini: { name: "Gemini", component: GeminiSymbol },
	leo: { name: "Leo", component: LeoSymbol },
	scorpio: { name: "Scorpio", component: ScorpioSymbol },
	pisces: { name: "Pisces", component: PiscesSymbol },
};

// Data interface for this section
interface RavenSwordData {
	selectedAntiquity: string;
}

function RavenSwordSection(props: BaseSectionProps<RavenSwordData>) {
	return (
		<BaseSection
			config={{
				storageKey: "citadelle-des-morts-raven-sword-data",
				defaultValue: {
					selectedAntiquity: "",
				},
				title: "Raven Sword",
				description:
					"Select the antiquity you picked up in-game to see the correct dial combination.",
				resetButtonText: "Reset Raven Sword",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Antiquity Location",
							text: "The antiquity is found on a pedestal in the ritual room",
						},
						{
							label: "Dial Location",
							text: "The dual-ring dial is located on the wall near the Raven Sword",
						},
						{
							label: "Ring Rotation",
							text: "Each ring can be rotated independently - inner ring first, then outer ring",
						},
						{
							label: "Confirmation",
							text: "When set correctly, the dial will emit a sound and the Raven Sword will activate",
						},
					],
				},
			}}
			getProgress={(data: RavenSwordData) => {
				const hasSelection = Boolean(data.selectedAntiquity);
				return {
					completed: hasSelection ? 1 : 0,
					total: 1,
					isComplete: hasSelection,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const handleAntiquitySelect = (antiquityId: string) => {
					setData((prev: RavenSwordData) => ({
						...prev,
						selectedAntiquity: antiquityId,
					}));
				};

				const selectedAntiquity = ANTIQUITIES.find(
					(a) => a.id === data.selectedAntiquity
				);

				return (
					<div className="raven-sword-section">
						{/* Antiquity Selection */}
						<div className="antiquity-selection">
							<div className="antiquity-grid">
								{ANTIQUITIES.map((antiquity) => (
									<div
										key={antiquity.id}
										className={`antiquity-option ${
											data.selectedAntiquity === antiquity.id
												? "antiquity-option--selected"
												: ""
										}`}
										onClick={() => handleAntiquitySelect(antiquity.id)}
									>
										<div className="antiquity-info">
											<h4>{antiquity.name}</h4>
											<p>{antiquity.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Dial Combination Display */}
						{selectedAntiquity && (
							<div className="dial-combination">
								<h3>Dial Combination</h3>
								<p className="combination-description">
									Set the dial rings to these symbols to activate the Raven
									Sword.
								</p>

								<div className="dial-rings">
									<div className="dial-ring inner-ring">
										<h4>Inner Ring (Elemental)</h4>
										<div className="symbol-display">
											{(() => {
												const ElementalComponent = ELEMENTAL_SYMBOLS[
													selectedAntiquity.innerSymbol as keyof typeof ELEMENTAL_SYMBOLS
												].component as unknown as React.ComponentType<
													React.SVGProps<SVGSVGElement>
												>;
												return <ElementalComponent className="symbol-icon" />;
											})()}
											<span className="symbol-name">
												{
													ELEMENTAL_SYMBOLS[
														selectedAntiquity.innerSymbol as keyof typeof ELEMENTAL_SYMBOLS
													].description
												}
											</span>
										</div>
									</div>

									<div className="dial-ring outer-ring">
										<h4>Outer Ring (Zodiac)</h4>
										<div className="symbol-display">
											{(() => {
												const ZodiacComponent = ZODIAC_SYMBOLS[
													selectedAntiquity.outerSymbol as keyof typeof ZODIAC_SYMBOLS
												].component as unknown as React.ComponentType<
													React.SVGProps<SVGSVGElement>
												>;
												return <ZodiacComponent className="symbol-icon" />;
											})()}
											<span className="symbol-name">
												{
													ZODIAC_SYMBOLS[
														selectedAntiquity.outerSymbol as keyof typeof ZODIAC_SYMBOLS
													].name
												}
											</span>
										</div>
									</div>
								</div>

								<div className="combination-note">
									<p>
										<strong>Instructions:</strong> Face the dial and rotate the
										inner ring to the{" "}
										{
											ELEMENTAL_SYMBOLS[
												selectedAntiquity.innerSymbol as keyof typeof ELEMENTAL_SYMBOLS
											].name
										}{" "}
										symbol, then rotate the outer ring to the{" "}
										{
											ZODIAC_SYMBOLS[
												selectedAntiquity.outerSymbol as keyof typeof ZODIAC_SYMBOLS
											].name
										}{" "}
										symbol.
									</p>
								</div>
							</div>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default RavenSwordSection;

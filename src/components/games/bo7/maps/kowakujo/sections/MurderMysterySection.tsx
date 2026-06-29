import { useEffect, useRef } from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { ResultsDisplay } from "@/components/ui";
import type { ResultItem } from "@/components/ui/ResultsDisplay";
import { useSectionSettings } from "@/hooks/useSectionSettings";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MurderMysteryData {
	accomplice: string;
	causeOfDeath: string;
	painting: string;
	timeOfDeath: string;
	actionTime: string;
	actionTimePattern: string;
}

const DEFAULT_VALUE: MurderMysteryData = {
	accomplice: "",
	causeOfDeath: "",
	painting: "",
	timeOfDeath: "",
	actionTime: "",
	actionTimePattern: "",
};

type InputStyle = "buttons" | "dropdown";
type ActionTimeMode = "specific" | "pattern";

interface ChoiceOption {
	value: string;
	label: string;
	sublabel?: string;
}

// ─── Evidence lookups ─────────────────────────────────────────────────────────

const ACCOMPLICE_OPTIONS: ChoiceOption[] = [
	{ value: "nobleman", label: "Nobleman", sublabel: "Noble's Hat" },
	{ value: "gardener", label: "Gardener", sublabel: "Shears" },
	{ value: "merchant", label: "Merchant", sublabel: "Abacus" },
];

const ACCOMPLICE_ITEMS: Record<string, string> = {
	nobleman: "Noble's Hat",
	gardener: "Shears",
	merchant: "Abacus",
};

const CAUSE_OF_DEATH_OPTIONS: ChoiceOption[] = [
	{ value: "emesis", label: "Emesis", sublabel: "Noxious food" },
	{ value: "noxious-plant", label: "Noxious Plant", sublabel: "Plant ingestion" },
	{ value: "paralysis", label: "Paralysis", sublabel: "Evidence of paralysis" },
];

// Only 6 of the 9 accomplice/cause-of-death pairings occur in-game - the rest
// are never generated, so no fallback handling is needed beyond the dash shown
// while a result is still pending.
const TOXIN_LOOKUP: Record<string, string> = {
	"nobleman|emesis": "Pufferfish",
	"nobleman|noxious-plant": "Monkshood Flower",
	"gardener|emesis": "Plum Pit",
	"gardener|paralysis": "Monkshood Flower",
	"merchant|noxious-plant": "Plum Pit",
	"merchant|paralysis": "Pufferfish",
};

const PAINTING_OPTIONS: ChoiceOption[] = [
	{ value: "bird", label: "Bird", sublabel: "Painter's Brush" },
	{ value: "fish", label: "Fish", sublabel: "Tea Whisk" },
	{ value: "mountain", label: "Mountain", sublabel: "Horse Statuette" },
];

const PAINTING_ITEMS: Record<string, string> = {
	bird: "Painter's Brush",
	fish: "Tea Whisk",
	mountain: "Horse Statuette",
};

const ACTION_TIME_OPTIONS: ChoiceOption[] = [1, 2, 3, 4, 5].map((n) => ({
	value: String(n),
	label: String(n),
}));

// Observed action-time sets - every toxin's time shifts together as a group,
// so picking the pattern you're seeing is quicker than reading the specific
// number for whichever toxin was deduced. Add a new key here if a third
// variant is ever confirmed.
const ACTION_TIME_PATTERNS: Record<string, Record<string, string>> = {
	"1-2-1": { Pufferfish: "1", "Plum Pit": "2", "Monkshood Flower": "1" },
	"2-3-2": { Pufferfish: "2", "Plum Pit": "3", "Monkshood Flower": "2" },
};

const ACTION_TIME_PATTERN_OPTIONS: ChoiceOption[] = Object.entries(ACTION_TIME_PATTERNS).map(
	([pattern, times]) => ({
		value: pattern,
		label: pattern,
		sublabel: Object.entries(times)
			.map(([toxinName, hours]) => `${toxinName} ${hours}h`)
			.join(" · "),
	}),
);

const ZODIAC_ORDER = [
	"rat",
	"ox",
	"tiger",
	"rabbit",
	"dragon",
	"snake",
	"horse",
	"goat",
	"monkey",
	"rooster",
	"dog",
	"pig",
];

const ZODIAC_LABELS: Record<string, string> = {
	rat: "Rat",
	ox: "Ox",
	tiger: "Tiger",
	rabbit: "Rabbit",
	dragon: "Dragon",
	snake: "Snake",
	horse: "Horse",
	goat: "Goat",
	monkey: "Monkey",
	rooster: "Rooster",
	dog: "Dog",
	pig: "Pig",
};

const ZODIAC_OPTIONS: ChoiceOption[] = ZODIAC_ORDER.map((id) => ({
	value: id,
	label: ZODIAC_LABELS[id],
}));

// Displayed alphabetically for faster scanning - ZODIAC_ORDER (cycle order)
// is kept separate since computeZodiacTarget relies on its specific sequence.
const ZODIAC_OPTIONS_ALPHABETICAL: ChoiceOption[] = [...ZODIAC_OPTIONS].sort((a, b) =>
	a.label.localeCompare(b.label),
);

// The dial needs to be set back `actionTime` hours from the hour of death,
// wrapping around the 12-animal cycle.
function computeZodiacTarget(timeOfDeath: string, actionTime: number): string {
	const deathIndex = ZODIAC_ORDER.indexOf(timeOfDeath);
	const targetIndex = ((deathIndex - actionTime) % 12 + 12) % 12;
	return ZODIAC_ORDER[targetIndex];
}

// ─── Choice field ─────────────────────────────────────────────────────────────

interface ChoiceFieldProps {
	label: string;
	options: ChoiceOption[];
	value: string;
	onChange: (value: string) => void;
	inputStyle: InputStyle;
	columns: number;
	/** Adds a `murder-mystery-choices--{variant}` modifier class for CSS targeting.
	 * "zodiac" also skips the inline column style so compact-mode CSS can
	 * override the column count responsively (inline styles can't otherwise
	 * be beaten by a stylesheet rule without `!important`). */
	gridVariant?: string;
}

function ChoiceField({
	label,
	options,
	value,
	onChange,
	inputStyle,
	columns,
	gridVariant,
}: ChoiceFieldProps) {
	const skipInlineColumns = gridVariant === "zodiac";

	return (
		<div className="murder-mystery-field">
			<span className="murder-mystery-field__label">{label}</span>
			{inputStyle === "dropdown" ? (
				<select
					className="murder-mystery-select"
					value={value}
					onChange={(e) => onChange(e.target.value)}
				>
					<option value="" disabled>
						Select...
					</option>
					{options.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
							{opt.sublabel ? ` - ${opt.sublabel}` : ""}
						</option>
					))}
				</select>
			) : (
				<div
					className={`murder-mystery-choices ${
						gridVariant ? `murder-mystery-choices--${gridVariant}` : ""
					}`.trim()}
					style={skipInlineColumns ? undefined : { gridTemplateColumns: `repeat(${columns}, 1fr)` }}
				>
					{options.map((opt) => (
						<button
							key={opt.value}
							type="button"
							className={`murder-mystery-choice ${
								value === opt.value ? "murder-mystery-choice--selected" : ""
							}`.trim()}
							onClick={() => onChange(opt.value)}
						>
							<span className="murder-mystery-choice__label">{opt.label}</span>
							{opt.sublabel && (
								<span className="murder-mystery-choice__sublabel">{opt.sublabel}</span>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

// ─── Section ──────────────────────────────────────────────────────────────────

function MurderMysterySection(props: BaseSectionProps<MurderMysteryData>) {
	const { isCompact } = useGlobalSettings();
	// Compact mode favours fewer/quicker clicks, so default the action-time
	// question to the pattern picker there. Covers the case of landing on this
	// section while already in compact mode; the live toggle-transition case
	// is handled separately below since this fallback alone wouldn't override
	// an existing explicit choice.
	const actionTimeModeDefault: ActionTimeMode = isCompact ? "pattern" : "specific";

	const { getSetting, updateSetting } = useSectionSettings({
		mapId: "kowakujo",
		sectionId: "murder-mystery",
		sectionName: "Murder Mystery",
		settings: [
			{
				id: "input-style",
				label: "Input Style",
				defaultValue: "buttons",
				options: [
					{ value: "buttons", label: "Buttons" },
					{ value: "dropdown", label: "Dropdown" },
				],
				note: "Choose how to answer each question below",
			},
			{
				id: "action-time-mode",
				label: "Action Time Question",
				defaultValue: actionTimeModeDefault,
				options: [
					{ value: "specific", label: "Specific Time (1-5)" },
					{ value: "pattern", label: "Timing Pattern" },
				],
				note: "Pick the exact hours, or pick the overall timing pattern you're seeing",
			},
		],
	});
	const inputStyle = getSetting("input-style", "buttons") as InputStyle;
	const actionTimeMode = getSetting("action-time-mode", actionTimeModeDefault) as ActionTimeMode;

	// Force-switch to the pattern picker the moment compact mode is turned on,
	// even if the player had previously picked "specific" manually - but only
	// on that transition, so a manual choice made afterwards still sticks.
	const wasCompactRef = useRef(isCompact);
	useEffect(() => {
		if (isCompact && !wasCompactRef.current) {
			updateSetting("action-time-mode", "pattern");
		}
		wasCompactRef.current = isCompact;
	}, [isCompact, updateSetting]);

	return (
		<BaseSection
			config={{
				storageKey: "kowakujo-murder-mystery-data",
				defaultValue: DEFAULT_VALUE,
				title: "Murder Mystery",
				description:
					"Answer the questions below to work out which item belongs on each poster panel, and where to set the zodiac dial.",
				resetButtonText: "Reset Evidence",
				tipsConfig: {
					show: true,
					items: [
						{ label: "Panel 1", text: "Always Mitsuhime's Comb." },
						{
							label: "Panel 2",
							text: "Use the Ghost Rifle traps until a ghostly rifleman identifies the accomplice.",
						},
						{
							label: "Panel 3",
							text: "Match the death certificate's cause of death against the accomplice to find the poison.",
						},
						{
							label: "Panel 4",
							text: "Match the poster shown in the panel to its corresponding item.",
						},
						{ label: "Panel 5", text: "Always the Crest Medallion." },
						{
							label: "Zodiac Dial",
							text: "Set the dial to the animal that is the poison's action time in hours before the time of death.",
						},
						{
							label: "Timing Patterns",
							text: "Further timing patterns will be added as discovered.",
						},
					],
				},
			}}
			getProgress={(data: MurderMysteryData) => {
				const fields = [
					data.accomplice,
					data.causeOfDeath,
					data.painting,
					data.timeOfDeath,
					actionTimeMode === "pattern" ? data.actionTimePattern : data.actionTime,
				];
				const completed = fields.filter(Boolean).length;
				return { completed, total: fields.length, isComplete: completed === fields.length };
			}}
			{...props}
		>
			{({ data, setData }) => {
				const setField = (field: keyof MurderMysteryData) => (value: string) => {
					setData((prev) => ({ ...prev, [field]: value }));
				};

				const toxin =
					data.accomplice && data.causeOfDeath
						? TOXIN_LOOKUP[`${data.accomplice}|${data.causeOfDeath}`]
						: undefined;

				const effectiveActionTime =
					actionTimeMode === "pattern"
						? toxin && data.actionTimePattern
							? ACTION_TIME_PATTERNS[data.actionTimePattern]?.[toxin]
							: undefined
						: data.actionTime;

				const zodiacTarget =
					data.timeOfDeath && effectiveActionTime
						? ZODIAC_LABELS[computeZodiacTarget(data.timeOfDeath, Number(effectiveActionTime))]
						: null;

				const results: ResultItem[] = [
					{ id: "panel-1", value: "Comb", label: "Panel 1" },
					{
						id: "panel-2",
						value: data.accomplice ? ACCOMPLICE_ITEMS[data.accomplice] : "----",
						label: "Panel 2",
						status: data.accomplice ? "complete" : "pending",
					},
					{
						id: "panel-3",
						value: toxin ?? "----",
						label: "Panel 3",
						status: toxin ? "complete" : "pending",
					},
					{
						id: "panel-4",
						value: data.painting ? PAINTING_ITEMS[data.painting] : "----",
						label: "Panel 4",
						status: data.painting ? "complete" : "pending",
					},
					{ id: "panel-5", value: "Crest Medallion", label: "Panel 5" },
				];

				return (
					<div className="murder-mystery-section">
						<div className="murder-mystery-section__questions">
							<ChoiceField
								label="Who did the ghostly rifleman identify?"
								options={ACCOMPLICE_OPTIONS}
								value={data.accomplice}
								onChange={setField("accomplice")}
								inputStyle={inputStyle}
								columns={3}
							/>
							<ChoiceField
								label="What did the death certificate show?"
								options={CAUSE_OF_DEATH_OPTIONS}
								value={data.causeOfDeath}
								onChange={setField("causeOfDeath")}
								inputStyle={inputStyle}
								columns={3}
							/>
							<ChoiceField
								label="Which poster appears in the 4th panel?"
								options={PAINTING_OPTIONS}
								value={data.painting}
								onChange={setField("painting")}
								inputStyle={inputStyle}
								columns={3}
							/>
							<ChoiceField
								label="Time of death"
								options={ZODIAC_OPTIONS_ALPHABETICAL}
								value={data.timeOfDeath}
								onChange={setField("timeOfDeath")}
								inputStyle={inputStyle}
								columns={6}
								gridVariant="zodiac"
							/>
							{actionTimeMode === "pattern" ? (
								<ChoiceField
									label="Which timing pattern is this?"
									options={ACTION_TIME_PATTERN_OPTIONS}
									value={data.actionTimePattern}
									onChange={setField("actionTimePattern")}
									inputStyle={inputStyle}
									columns={ACTION_TIME_PATTERN_OPTIONS.length}
									gridVariant="pattern"
								/>
							) : (
								<ChoiceField
									label="How many hours does the poison take to act?"
									options={ACTION_TIME_OPTIONS}
									value={data.actionTime}
									onChange={setField("actionTime")}
									inputStyle={inputStyle}
									columns={5}
								/>
							)}
						</div>

						<ResultsDisplay
							variant="grid"
							title="Evidence Board"
							description="Place these items in front of each panel:"
							results={results}
							gridColumns={5}
							colorScheme="accent"
							note={
								zodiacTarget ? (
									<span>
										Set the zodiac dial to <strong>{zodiacTarget}</strong>.
									</span>
								) : (
									"Select the time of death and poison action time to calculate the zodiac dial position."
								)
							}
						/>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default MurderMysterySection;

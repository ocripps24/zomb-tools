import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";
import SymbolA from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-a.svg";
import SymbolB from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-b.svg";
import SymbolC from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-c.svg";
import SymbolD from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-d.svg";
import SymbolE from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-e.svg";
import SymbolF from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-f.svg";
import SymbolG from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-g.svg";
import SymbolH from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-h.svg";
import SymbolI from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-i.svg";
import SymbolJ from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-j.svg";
import SymbolK from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-k.svg";
import SymbolL from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-l.svg";
import SymbolM from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-m.svg";
import SymbolN from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-n.svg";
import SymbolO from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-o.svg";
import SymbolP from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-p.svg";
import SymbolQ from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-q.svg";
import SymbolR from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-r.svg";
import SymbolS from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-s.svg";
import SymbolT from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-t.svg";
import SymbolU from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-u.svg";
import SymbolV from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-v.svg";
import SymbolW from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-w.svg";
import SymbolX from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-x.svg";
import SymbolY from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-y.svg";
import SymbolZ from "@/assets/maps/iw/shaolin-shuffle/shaolin-shuffle-alphabet-z.svg";

type SymbolComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const SYMBOLS: Record<string, SymbolComponent> = {
	a: SymbolA as unknown as SymbolComponent,
	b: SymbolB as unknown as SymbolComponent,
	c: SymbolC as unknown as SymbolComponent,
	d: SymbolD as unknown as SymbolComponent,
	e: SymbolE as unknown as SymbolComponent,
	f: SymbolF as unknown as SymbolComponent,
	g: SymbolG as unknown as SymbolComponent,
	h: SymbolH as unknown as SymbolComponent,
	i: SymbolI as unknown as SymbolComponent,
	j: SymbolJ as unknown as SymbolComponent,
	k: SymbolK as unknown as SymbolComponent,
	l: SymbolL as unknown as SymbolComponent,
	m: SymbolM as unknown as SymbolComponent,
	n: SymbolN as unknown as SymbolComponent,
	o: SymbolO as unknown as SymbolComponent,
	p: SymbolP as unknown as SymbolComponent,
	q: SymbolQ as unknown as SymbolComponent,
	r: SymbolR as unknown as SymbolComponent,
	s: SymbolS as unknown as SymbolComponent,
	t: SymbolT as unknown as SymbolComponent,
	u: SymbolU as unknown as SymbolComponent,
	v: SymbolV as unknown as SymbolComponent,
	w: SymbolW as unknown as SymbolComponent,
	x: SymbolX as unknown as SymbolComponent,
	y: SymbolY as unknown as SymbolComponent,
	z: SymbolZ as unknown as SymbolComponent,
};

const WORDS = [
	"actors",
	"afterlife",
	"ancestor",
	"arcade",
	"arthur",
	"audition",
	"basement",
	"beverlyhills",
	"blackcat",
	"boat",
	"breeder",
	"broadway",
	"brute",
	"bumpercars",
	"charms",
	"comicbooks",
	"crane",
	"cryptid",
	"dance",
	"davidarcher",
	"death",
	"director",
	"disco",
	"dragon",
	"drcross",
	"fairies",
	"forgefreeze",
	"geyser",
	"ghetto",
	"harpoon",
	"hives",
	"inferno",
	"katana",
	"kevinsmith",
	"kraken",
	"kungfu",
	"losangeles",
	"mcintosh",
	"memories",
	"mephistopheles",
	"newyork",
	"nightfall",
	"nunchucks",
	"obelisk",
	"octonian",
	"pamgrier",
	"pinkcat",
	"punks",
	"ratking",
	"realitytv",
	"redwoods",
	"rollercoaster",
	"rollerskates",
	"samantha",
	"shaolin",
	"shield",
	"shuffle",
	"slasher",
	"slide",
	"snake",
	"spaceland",
	"staff",
	"subway",
	"tiger",
	"trees",
	"werewolfpoets",
	"winonawyler",
	"yetieyes",
	"zappers",
].sort();

const VALID_FIRST_LETTERS = [...new Set(WORDS.map((w) => w[0]))].sort();

interface NextLetterOption {
	letter: string;
	words: string[];
}

function getCandidates(firstLetter: string, shotLetters: string[]): string[] {
	const prefix = firstLetter + shotLetters.join("");
	return WORDS.filter((w) => w.startsWith(prefix));
}

function getNextLetterOptions(
	candidates: string[],
	shotCount: number,
): NextLetterOption[] {
	const nextIndex = shotCount + 1;
	const map = new Map<string, string[]>();
	for (const word of candidates) {
		if (word.length > nextIndex) {
			const letter = word[nextIndex];
			if (!map.has(letter)) map.set(letter, []);
			map.get(letter)!.push(word);
		}
	}
	return [...map.entries()]
		.map(([letter, words]) => ({ letter, words }))
		.sort((a, b) => a.letter.localeCompare(b.letter));
}

interface RooftopSymbolsData {
	firstLetter: string | null;
	shotLetters: string[];
}

const DEFAULT_DATA: RooftopSymbolsData = {
	firstLetter: null,
	shotLetters: [],
};

function SymbolIcon({
	letter,
	className,
}: {
	letter: string;
	className?: string;
}) {
	const Component = SYMBOLS[letter.toLowerCase()];
	if (!Component) return null;
	return (
		<Component
			className={className}
			aria-label={`Symbol for ${letter.toUpperCase()}`}
		/>
	);
}

function RooftopSymbolsSection(props: BaseSectionProps<RooftopSymbolsData>) {
	const { settings, updateSetting } = useGlobalSettings();

	return (
		<BaseSection
			config={{
				storageKey: "shaolin-shuffle-rooftop-symbols-data",
				defaultValue: DEFAULT_DATA,
				title: "Rooftop Symbols",
				description:
					"Place your poster on the searchlight at Inferno's rooftop, shoot the X board to reveal the puzzle, then identify the letter on the wall and shoot the matching symbols to spell a valid word.",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Setup",
							text: "Place the poster on the searchlight, then shoot the X board on the window with explosive weapons to reveal the rooftop symbols.",
						},
						{
							label: "First Letter",
							text: "A letter appears on the wall facing the strip — this is your starting letter. You don't shoot this one.",
						},
						{
							label: "Shooting",
							text: "Shoot the rooftop symbols to spell the word in order. Each correct shot makes that letter appear on the wall. A wrong shot resets the puzzle with a new starting letter.",
						},
					],
				},
				settingsConfig: {
					show: true,
					title: "Display Settings",
					settings: [
						{
							id: "ui-size",
							label: "UI Density",
							value: settings.uiSize,
							options: [
								{ value: "standard", label: "Standard" },
								{ value: "compact", label: "Compact (Speedrun)" },
							],
							note: "Compact mode shows all remaining symbols at once for faster play.",
							onChange: (value) =>
								updateSetting("uiSize", value as "standard" | "compact"),
						},
					],
				},
			}}
			getProgress={(data: RooftopSymbolsData) => {
				if (!data.firstLetter)
					return { completed: 0, total: 1, isComplete: false };
				const candidates = getCandidates(data.firstLetter, data.shotLetters);
				if (candidates.length !== 1)
					return { completed: 0, total: 1, isComplete: false };
				const word = candidates[0];
				const total = word.length - 1;
				const completed = data.shotLetters.length;
				return { completed, total, isComplete: completed === total };
			}}
			{...props}
		>
			{({ data, setData }) => {
				const { firstLetter, shotLetters } = data;

				const reset = () => setData(DEFAULT_DATA);

				const selectFirstLetter = (letter: string) =>
					setData({ firstLetter: letter, shotLetters: [] });

				const shootLetter = (letter: string) =>
					setData((prev: RooftopSymbolsData) => ({
						...prev,
						shotLetters: [...prev.shotLetters, letter],
					}));

				const undoLastShot = () =>
					setData((prev: RooftopSymbolsData) => ({
						...prev,
						shotLetters: prev.shotLetters.slice(0, -1),
					}));

				// ── Phase 1: pick first letter ──────────────────────────────────
				if (!firstLetter) {
					return (
						<div className="rooftop-symbols">
							<p className="rooftop-symbols__prompt">
								Select the letter shown on the wall:
							</p>
							<div className="rooftop-first-letter">
								{VALID_FIRST_LETTERS.map((letter) => (
									<button
										key={letter}
										className="rooftop-first-letter__btn"
										onClick={() => selectFirstLetter(letter)}
										type="button"
									>
										{letter.toUpperCase()}
									</button>
								))}
							</div>
						</div>
					);
				}

				const candidates = getCandidates(firstLetter, shotLetters);
				const isConfirmed = candidates.length === 1;
				const confirmedWord = isConfirmed ? candidates[0] : null;
				const isComplete =
					confirmedWord !== null &&
					shotLetters.length === confirmedWord.length - 1;

				// ── Phase 4: complete ────────────────────────────────────────────
				if (isComplete && confirmedWord) {
					return (
						<div className="rooftop-symbols">
							<WordProgress
								word={confirmedWord}
								shotCount={shotLetters.length}
							/>
							<div className="rooftop-complete">
								<p className="rooftop-complete__message">
									Word spelled — puzzle complete!
								</p>
							</div>
							<div className="rooftop-actions">
								<button className="rooftop-undo" onClick={undoLastShot} type="button">
									Undo
								</button>
								<button className="rooftop-reset" onClick={reset} type="button">
									Start Over
								</button>
							</div>
						</div>
					);
				}

				// ── Phase 3: confirmed word, shoot remaining ─────────────────────
				if (confirmedWord) {
					const currentLetter = confirmedWord[1 + shotLetters.length];
					const isCompact = settings.uiSize === "compact";

					if (isCompact) {
						const remainingLetters = confirmedWord
							.slice(1 + shotLetters.length)
							.split("");
						return (
							<div className="rooftop-symbols">
								<WordProgress
									word={confirmedWord}
									shotCount={shotLetters.length}
								/>
								<div className="rooftop-compact-sequence">
									{remainingLetters.map((letter, i) => (
										<button
											key={i}
											className={`rooftop-compact-card${i === 0 ? " rooftop-compact-card--current" : ""}`}
											onClick={() => shootLetter(currentLetter)}
											type="button"
										>
											<div className="rooftop-compact-card__symbol">
												<SymbolIcon letter={letter} />
											</div>
											<span className="rooftop-compact-card__letter">
												{letter.toUpperCase()}
											</span>
										</button>
									))}
								</div>
								<div className="rooftop-actions">
									<button className="rooftop-undo" onClick={undoLastShot} type="button">
										Undo
									</button>
									<button className="rooftop-reset" onClick={reset} type="button">
										Reset
									</button>
								</div>
							</div>
						);
					}

					return (
						<div className="rooftop-symbols">
							<WordProgress
								word={confirmedWord}
								shotCount={shotLetters.length}
							/>
							<div className="rooftop-confirmed">
								<p className="rooftop-confirmed__label">
									Shoot this symbol next:
								</p>
								<div className="rooftop-confirmed__symbol">
									<SymbolIcon
										letter={currentLetter}
										className="rooftop-confirmed__icon"
									/>
									<span className="rooftop-confirmed__letter">
										{currentLetter.toUpperCase()}
									</span>
								</div>
								<button
									className="rooftop-confirmed__shot-btn"
									onClick={() => shootLetter(currentLetter)}
									type="button"
								>
									Mark as Shot
								</button>
							</div>
							<div className="rooftop-actions">
								<button className="rooftop-undo" onClick={undoLastShot} type="button">
									Undo
								</button>
								<button className="rooftop-reset" onClick={reset} type="button">
									Reset
								</button>
							</div>
						</div>
					);
				}

				// ── Phase 2: multiple candidates, show next options ──────────────
				const nextOptions = getNextLetterOptions(
					candidates,
					shotLetters.length,
				);

				return (
					<div className="rooftop-symbols">
						<div className="rooftop-progress-header">
							<span className="rooftop-progress-header__known">
								{(firstLetter + shotLetters.join("")).toUpperCase()}
								<span className="rooftop-progress-header__ellipsis">…</span>
							</span>
							<span className="rooftop-progress-header__count">
								{candidates.length} possible word
								{candidates.length !== 1 ? "s" : ""}
							</span>
						</div>
						<p className="rooftop-symbols__prompt">
							Find one of these symbols on the rooftop and select it:
						</p>
						<div className="rooftop-candidates">
							{nextOptions.map((option) => (
								<button
									key={option.letter}
									className="rooftop-candidate-card"
									onClick={() => shootLetter(option.letter)}
									type="button"
								>
									<div className="rooftop-candidate-card__symbol">
										<SymbolIcon letter={option.letter} />
									</div>
									<span className="rooftop-candidate-card__letter">
										{option.letter.toUpperCase()}
									</span>
									<ul className="rooftop-candidate-card__words">
										{option.words.map((w) => (
											<li key={w}>{w.toUpperCase()}</li>
										))}
									</ul>
								</button>
							))}
						</div>
						<button className="rooftop-reset" onClick={reset} type="button">
							Reset
						</button>
					</div>
				);
			}}
		</BaseSection>
	);
}

function WordProgress({
	word,
	shotCount,
}: {
	word: string;
	shotCount: number;
}) {
	return (
		<div className="rooftop-word-progress">
			{word.split("").map((letter, i) => {
				let state: "first" | "shot" | "current" | "remaining";
				if (i === 0) state = "first";
				else if (i <= shotCount) state = "shot";
				else if (i === shotCount + 1) state = "current";
				else state = "remaining";

				return (
					<span
						key={i}
						className={`rooftop-word-progress__letter rooftop-word-progress__letter--${state}`}
					>
						{letter.toUpperCase()}
					</span>
				);
			})}
		</div>
	);
}

export default RooftopSymbolsSection;

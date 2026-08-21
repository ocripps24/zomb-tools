import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { ResultsDisplay } from "@/components/ui";
import type { ResultItem } from "@/components/ui/ResultsDisplay";

interface WWForgeData {
	quote: string;
}

const DEFAULT_VALUE: WWForgeData = {
	quote: "",
};

interface QuoteSolution {
	id: string;
	text: string;
	highlight: string;
	left: number;
	middle: number;
	right: number;
}

// As read from the blue scripture in Dravakar's Sanctuary. Pillars are turned
// with the scripture directly behind the player: far left = Galaxy, near left
// = Runner/Meteor, near right = Star, far right = Moon.
const QUOTES: QuoteSolution[] = [
	{
		id: "1",
		text: "I remember the runner that travels to stars, while moons and galaxies stay true",
		highlight: "remember the runner",
		left: 0,
		middle: 2,
		right: 3,
	},
	{
		id: "4",
		text: "I remember galaxies that drift to moons, who borrow the runner that travels the stars",
		highlight: "remember galaxies",
		left: 2,
		middle: 0,
		right: 2,
	},
	{
		id: "3",
		text: "I drift to stars that remember moons, who borrow the runner that travels the galaxy",
		highlight: "drift to stars",
		left: 1,
		middle: 2,
		right: 2,
	},
	{
		id: "2",
		text: "I drift to the runner that travels moon, who borrow from galaxies when stars stay true",
		highlight: "drift to the runner",
		left: 3,
		middle: 2,
		right: 1,
	},
];

function renderQuoteText(text: string, highlight: string) {
	const idx = text.indexOf(highlight);
	if (idx === -1) return `"${text}"`;
	return (
		<>
			&ldquo;{text.slice(0, idx)}
			<strong>{highlight}</strong>
			{text.slice(idx + highlight.length)}&rdquo;
		</>
	);
}

function WWForgeSection(props: BaseSectionProps<WWForgeData>) {
	return (
		<BaseSection
			config={{
				storageKey: "rex-infernus-ww-forge-data",
				defaultValue: DEFAULT_VALUE,
				title: "WW Forge",
				description:
					"Interact with the blue scripture on the wall in Dravakar's Sanctuary to receive a quote, then select it below to see how many times to pull each lever.",
				resetButtonText: "Clear",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Pillars",
							text: "With the scripture directly behind you: far left = Galaxy, near left = Runner/Meteor, near right = Star, far right = Moon.",
						},
						{
							label: "Left Lever",
							text: "Rotates the Galaxy and Runner/Meteor pillars.",
						},
						{
							label: "Middle Lever",
							text: "Rotates the Runner/Meteor and Star pillars.",
						},
						{
							label: "Right Lever",
							text: "Rotates the Moon and Star pillars.",
						},
						{
							label: "Confirm",
							text: "Once the pillars are set, interact with the handle on the central pillar in the middle of the square to confirm.",
						},
					],
				},
			}}
			getProgress={(data: WWForgeData) => ({
				completed: data.quote ? 1 : 0,
				total: 1,
				isComplete: Boolean(data.quote),
			})}
			{...props}
		>
			{({ data, setData }) => {
				const selected = QUOTES.find((q) => q.id === data.quote);

				const results: ResultItem[] = [
					{
						id: "left",
						value: selected ? `${selected.left}x` : "----",
						label: "Left Lever",
						status: selected ? "complete" : "pending",
					},
					{
						id: "middle",
						value: selected ? `${selected.middle}x` : "----",
						label: "Middle Lever",
						status: selected ? "complete" : "pending",
					},
					{
						id: "right",
						value: selected ? `${selected.right}x` : "----",
						label: "Right Lever",
						status: selected ? "complete" : "pending",
					},
				];

				return (
					<div className="ww-forge-section">
						<div className="quote-picker">
							<h3 className="quote-picker__title">Select Your Quote</h3>
							<p className="quote-picker__hint">
								Interact with the <strong>blue scripture</strong> in
								Dravakar's Sanctuary and select the matching quote below.
							</p>
							<div className="quote-picker__cards">
								{QUOTES.map((quote) => (
									<button
										key={quote.id}
										type="button"
										className={[
											"quote-card",
											data.quote === quote.id ? "quote-card--selected" : "",
										]
											.filter(Boolean)
											.join(" ")}
										onClick={() => setData({ quote: quote.id })}
									>
										<div className="quote-card__header">
											<span className="quote-card__label">
												Quote {quote.id}
											</span>
											<span className="quote-card__keyword">
												{quote.highlight}
											</span>
										</div>
										<span className="quote-card__text">
											{renderQuoteText(quote.text, quote.highlight)}
										</span>
									</button>
								))}
							</div>
						</div>

						<ResultsDisplay
							variant="grid"
							title="Lever Solution"
							description="Pull each lever this many times, then confirm on the central pillar:"
							results={results}
							gridColumns={3}
							colorScheme="accent"
						/>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default WWForgeSection;

import React from "react";
import { FloatingCard } from "@/components/content";
import { BaseSection } from "@/components/core";
import { LocationCard } from "@/components/content";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// Game mechanics constants
const GAME_CONFIG = {
	maxQuotesInGame: 3, // Players receive 3 quotes during actual gameplay
	totalQuotesAvailable: 20, // Total quotes in our database
};

const QUOTES = [
	{
		id: "quote-1",
		text: "Where Lungs Close",
		location: "Docks: The underwater passage.",
		found: false,
	},
	{
		id: "quote-2",
		text: "Where Preservation Freezes",
		location: "Forecastle: On a life preserver.",
		found: false,
	},
	{
		id: "quote-3",
		text: "Where North Is Found",
		location: "Bridge: Across from the boat power switch.",
		found: false,
	},
	{
		id: "quote-4",
		text: "Where Lightning Aims",
		location: "Mountain Base Facility Lobby: Near the Wunderwaffe DG schematic.",
		found: false,
	},
	{
		id: "quote-5",
		text: "Where Falls Freeze",
		location: "Cargo Hold: Near the stairs.",
		found: false,
	},
	{
		id: "quote-6",
		text: "Where Feet Slip",
		location: "On the Ice Slide in the cave behind the Boathouse.",
		found: false,
	},
	{
		id: "quote-7",
		text: "Where One Mysteries",
		location: "Lighthouse Level 1: Next to the Mystery Box spawn.",
		found: false,
	},
	{
		id: "quote-8",
		text: "Where Thirst Dawns",
		location: "Forecastle: Next to the Perk Soda machine.",
		found: false,
	},
	{
		id: "quote-9",
		text: "Where Earth Crumbles",
		location: "Geological Processing: In the minecart room.",
		found: false,
	},
	{
		id: "quote-10",
		text: "Where Filth Cleanses",
		location: "Decontamination Room: Inside the mountain facility.",
		found: false,
	},
	{
		id: "quote-11",
		text: "Where Fire Sinks",
		location: "Sunken Valley: By the burning fire.",
		found: false,
	},
	{
		id: "quote-12",
		text: "Where Lines Berth",
		location: "Docks: Near the zipline to the Lighthouse.",
		found: false,
	},
	{
		id: "quote-13",
		text: "Where Madness Sleeps",
		location: "In the Prison Cell area of the Mountain Base.",
		found: false,
	},
	{
		id: "quote-14",
		text: "Where Power Ends",
		location: "Human Transfusion: Near the Power switch.",
		found: false,
	},
	{
		id: "quote-15",
		text: "Where The Hidden Burns",
		location: "Cargo Hold: On a passage down from the burning fire. You might not realize the path is there.",
		found: false,
	},
	{
		id: "quote-16",
		text: "Where Bounded Sleep",
		location: "Stern: Near the Soup perk machine.",
		found: false,
	},
	{
		id: "quote-17",
		text: "Where Crows Roost",
		location: "Forecastle: On the barrels opposite the pot.",
		found: false,
	},
	{
		id: "quote-18",
		text: "Where Mountains Throw",
		location: "Outer Walkway: Near the launcher on the exterior walkway of the mountain base.",
		found: false,
	},
	{
		id: "quote-19",
		text: "Where Helixes Peak",
		location: "Lighthouse Level 4: At the top of the lighthouse.",
		found: false,
	},
	{
		id: "quote-20",
		text: "Where bread breaks",
		location: "Gangway - Island countertop",
		found: false,
	},
];

// Data interface for this section
interface ApothicanData {
	quotes: Array<{
		id: string;
		text: string;
		location: string;
		found: boolean;
	}>;
}

function ApothicanOfferingsSection(props: BaseSectionProps<ApothicanData>) {
	return (
		<BaseSection
			config={{
				storageKey: "tag-der-toten-apothican-offerings-data",
				defaultValue: { quotes: [...QUOTES] },
				title: "Apothican Offerings",
				description: "Listen for the quote in-game, then click on the matching quote below to reveal its location. You will receive 3 quotes during the game.",
				resetButtonText: "Reset All Quotes"
			}}
			getProgress={(data: ApothicanData) => {
				const foundCount = data.quotes?.filter((quote) => quote.found).length || 0;
				return {
					completed: foundCount,
					total: GAME_CONFIG.maxQuotesInGame,
					isComplete: foundCount === GAME_CONFIG.maxQuotesInGame
				};
			}}
			{...props}
		>
			{({ data, setData, progress }) => {
				const foundCount = progress.completed;

				const toggleQuoteFound = (quoteId: string) => {
					setData((prev: ApothicanData) => ({
						...prev,
						quotes: prev.quotes.map((quote) =>
							quote.id === quoteId ? { ...quote, found: !quote.found } : quote
						),
					}));
				};

				return (
					<div className="apothican-section-content">
						<div className="location-grid location-grid--quotes">
							{data.quotes?.map((quote) => {
								// Disable quotes if max quotes are already found and this one isn't found
								const isDisabled = foundCount >= GAME_CONFIG.maxQuotesInGame && !quote.found;
								
								return (
									<LocationCard
										key={quote.id}
										primaryText={quote.text}
										secondaryText={quote.location}
										isCompleted={quote.found}
										onToggle={() => toggleQuoteFound(quote.id)}
										showSecondaryOnlyWhenCompleted={true}
										disabled={isDisabled}
										variant="quote"
									/>
								);
							})}
						</div>

						{progress.isComplete && (
							<div className="section-completion">
								<FloatingCard className="completion-card">
									<h4>🎉 All Quotes Found!</h4>
									<p>
										You've completed the Apothican Offerings step. You can now proceed to the Seal of Duality.
									</p>
								</FloatingCard>
							</div>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default ApothicanOfferingsSection;
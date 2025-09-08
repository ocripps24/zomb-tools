import React from "react";
import { FloatingCard } from "@/components/ui";
import { BaseSection } from "@/components/core";
import { LocationCard } from "@/components/ui";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// Game mechanics constants
const GAME_CONFIG = {
	maxQuotesInGame: 1, // Players receive 1 quote during actual gameplay
	totalQuotesAvailable: 4, // Total quotes in our database
};

const QUOTES = [
	{
		id: "quote-1",
		text: "Where humans suffer",
		location: "Locate and melee the bulletin board found on the wall in Specimen Storage. Open the safe by building and placing a Dynamite Bomb on it",
		found: false,
	},
	{
		id: "quote-2",
		text: "Inside an icy hall",
		location: "Locate and melee the wooden board found in Ice Grotto. Open the safe by building and placing a Dynamite Bomb on it",
		found: false,
	},
	{
		id: "quote-3",
		text: "Where Aether was gathered",
		location: "Locate and melee the bulletin board found in Geological Processing. Open the safe by building and placing a Dynamite Bomb on it",
		found: false,
	},
	{
		id: "quote-4",
		text: "Where cages hang",
		location: "Locate and melee the framed map found in the Boathouse. Open the safe by building and placing a Dynamite Bomb on it",
		found: false,
	},
];

// Data interface for this section
interface SealData {
	quotes: Array<{
		id: string;
		text: string;
		location: string;
		found: boolean;
	}>;
}

function SealOfDualitySection(props: BaseSectionProps<SealData>) {
	return (
		<BaseSection
			config={{
				storageKey: "tag-der-toten-seal-of-duality-data",
				defaultValue: { quotes: [...QUOTES] },
				title: "Seal of Duality",
				description: "Listen for the quote in-game, then click on the matching quote below to reveal its location.",
				resetButtonText: "Reset All Quotes"
			}}
			getProgress={(data: SealData) => {
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
					setData((prev: SealData) => ({
						...prev,
						quotes: prev.quotes.map((quote) =>
							quote.id === quoteId ? { ...quote, found: !quote.found } : quote
						),
					}));
				};

				return (
					<div className="seal-section-content">
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
										You've completed the Seal of Duality step. You can now proceed to the Orb Locations.
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

export default SealOfDualitySection;

import { useState, useEffect } from "react";
import FloatingCard from "../../../../../common/FloatingCard";
import SectionHeader from "../../../../../common/SectionHeader";
import LocationCard from "../../../../../common/LocationCard";

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

function SealOfDualitySection({ data, onChange }) {
	const [localData, setLocalData] = useState(
		(data && data.quotes) ? data : { quotes: [...QUOTES] }
	);

	useEffect(() => {
		const saved = localStorage.getItem("tag-der-toten-seal-data");
		if (saved) {
			try {
				const parsedData = JSON.parse(saved);
				setLocalData(parsedData);
			} catch (e) {
				console.error("Failed to parse seal data:", e);
				setLocalData({ quotes: [...QUOTES] });
			}
		} else {
			// Set default data if no saved data exists
			setLocalData({ quotes: [...QUOTES] });
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("tag-der-toten-seal-data", JSON.stringify(localData));
		onChange?.(localData);
	}, [localData, onChange]);

	const toggleQuoteFound = (quoteId) => {
		setLocalData((prev) => ({
			...prev,
			quotes: prev.quotes.map((quote) =>
				quote.id === quoteId ? { ...quote, found: !quote.found } : quote
			),
		}));
	};

	const resetAll = () => {
		setLocalData({ quotes: [...QUOTES] });
	};

	const foundCount =
		localData.quotes?.filter((quote) => quote.found).length || 0;
	const totalCount = localData.quotes?.length || 0;

	return (
		<div className="seal-section">
			<SectionHeader
				title="Seal of Duality"
				progress={`${foundCount}/${GAME_CONFIG.maxQuotesInGame}`}
				description="Listen for the quote in-game, then click on the matching quote below to reveal its location."
				onReset={resetAll}
				resetButtonText="Reset All"
			/>

			<div className="location-grid location-grid--quotes">
				{localData.quotes?.map((quote, index) => {
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

			{foundCount === totalCount && (
				<div className="section-completion">
					<FloatingCard className="completion-card">
						<h4>🎉 All Quotes Found!</h4>
						<p>
							You've completed the Seal of Duality step. You can now proceed to the next step.
						</p>
					</FloatingCard>
				</div>
			)}
		</div>
	);
}

export default SealOfDualitySection;

import { useState, useEffect } from "react";
import { FloatingCard } from "../../../../../content/index.js";
import { SectionHeader } from "../../../../../core/index.js";
import { LocationCard } from "../../../../../content/index.js";

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

function ApothicanOfferingsSection({ data, onChange }) {
	const [localData, setLocalData] = useState(
		(data && data.quotes) ? data : { quotes: [...QUOTES] }
	);
	

	// Load from localStorage on mount or when parent data changes (reset)
	useEffect(() => {
		// Check if parent data is empty (indicating a reset)
		const isParentDataEmpty = !data || Object.keys(data).length === 0;

		if (isParentDataEmpty) {
			// Parent has been reset, check localStorage or use initial data
			const saved = localStorage.getItem("tag-der-toten-apothican-data");
			if (saved) {
				try {
					const parsedData = JSON.parse(saved);
					setLocalData(parsedData);
				} catch (e) {
					console.error("Failed to parse apothican data:", e);
					setLocalData({ quotes: [...QUOTES] });
				}
			} else {
				// Set default data if no saved data exists
				setLocalData({ quotes: [...QUOTES] });
			}
		}
	}, [data]);

	useEffect(() => {
		localStorage.setItem("tag-der-toten-apothican-data", JSON.stringify(localData));
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
		<div className="apothican-section">
			<SectionHeader
				title="Apothican Offerings"
				progress={`${foundCount}/${GAME_CONFIG.maxQuotesInGame}`}
				description="Listen for the quote in-game, then click on the matching quote below to reveal its location. You will receive 3 quotes during the game."
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
							You've completed the Apothican Offerings step. You can now proceed to the Seal of Duality.
						</p>
					</FloatingCard>
				</div>
			)}
		</div>
	);
}

export default ApothicanOfferingsSection;
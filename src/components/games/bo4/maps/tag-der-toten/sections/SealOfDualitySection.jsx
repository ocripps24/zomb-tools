import { useState, useEffect } from "react";
import FloatingCard from "../../../../../common/FloatingCard";
import Button from "../../../../../common/Button";

// Placeholder data - replace with actual quotes and locations
const QUOTES = [
	{
		id: "quote-1",
		text: "Quote text here",
		location: "Location description here",
		found: false,
	},
	{
		id: "quote-2",
		text: "Quote text here",
		location: "Location description here",
		found: false,
	},
	{
		id: "quote-3",
		text: "Quote text here",
		location: "Location description here",
		found: false,
	},
	{
		id: "quote-4",
		text: "Quote text here",
		location: "Location description here",
		found: false,
	},
];

function SealOfDualitySection({ data, onChange }) {
	const [localData, setLocalData] = useState(data || { quotes: [...QUOTES] });

	// Load from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem("tag-seal-data");
		if (saved) {
			try {
				const parsedData = JSON.parse(saved);
				setLocalData(parsedData);
			} catch (e) {
				console.error("Failed to parse seal data:", e);
				setLocalData({ quotes: [...QUOTES] });
			}
		}
	}, []);

	// Save to localStorage and update parent when data changes
	useEffect(() => {
		localStorage.setItem("tag-seal-data", JSON.stringify(localData));
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
			<FloatingCard>
				<div className="seal-section__header">
					<h3>
						Seal of Duality Quotes ({foundCount}/{totalCount})
					</h3>
					<p>
						Find all quotes for the Seal of Duality step. Check off each quote
						as you find it.
					</p>
					<Button variantType="secondary" onClick={resetAll}>
						Reset All
					</Button>
				</div>

				<div className="seal-section__list">
					{localData.quotes?.map((quote, index) => (
						<FloatingCard
							key={quote.id}
							className={`quote-card ${quote.found ? "quote-card--found" : ""}`}
							interactive
							onClick={() => toggleQuoteFound(quote.id)}
						>
							<div className="quote-card__header">
								<span className="quote-card__number">#{index + 1}</span>
								<span className="quote-card__status">
									{quote.found ? "✅" : "🔍"}
								</span>
							</div>
							<div className="quote-card__content">
								<div className="quote-card__text">
									<strong>Quote:</strong> "{quote.text}"
								</div>
								<div className="quote-card__location">
									<strong>Location:</strong> {quote.location}
								</div>
							</div>
						</FloatingCard>
					))}
				</div>

				{foundCount === totalCount && (
					<div className="seal-section__completion">
						<FloatingCard className="completion-card">
							<h4>🎉 All Quotes Found!</h4>
							<p>
								The Seal of Duality is ready. You can now proceed to the next
								step.
							</p>
						</FloatingCard>
					</div>
				)}
			</FloatingCard>
		</div>
	);
}

export default SealOfDualitySection;

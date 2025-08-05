import { useState, useEffect } from "react";
import FloatingCard from "../../../../../common/FloatingCard";
import Button from "../../../../../common/Button";

// Placeholder data - replace with actual totem information
const TOTEMS = [
	{
		id: "totem-1",
		name: "Totem 1",
		location: "Location description here",
		challenge: "Challenge description here",
		completed: false,
	},
	{
		id: "totem-2",
		name: "Totem 2",
		location: "Location description here",
		challenge: "Challenge description here",
		completed: false,
	},
	{
		id: "totem-3",
		name: "Totem 3",
		location: "Location description here",
		challenge: "Challenge description here",
		completed: false,
	},
	{
		id: "totem-4",
		name: "Totem 4",
		location: "Location description here",
		challenge: "Challenge description here",
		completed: false,
	},
	{
		id: "totem-5",
		name: "Totem 5",
		location: "Location description here",
		challenge: "Challenge description here",
		completed: false,
	},
];

function TotemsSection({ data, onChange }) {
	const [localData, setLocalData] = useState(data || { totems: [...TOTEMS] });

	// Load from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem("tag-totems-data");
		if (saved) {
			try {
				const parsedData = JSON.parse(saved);
				setLocalData(parsedData);
			} catch (e) {
				console.error("Failed to parse totems data:", e);
				setLocalData({ totems: [...TOTEMS] });
			}
		}
	}, []);

	// Save to localStorage and update parent when data changes
	useEffect(() => {
		localStorage.setItem("tag-totems-data", JSON.stringify(localData));
		onChange?.(localData);
	}, [localData, onChange]);

	const toggleTotemCompleted = (totemId) => {
		setLocalData((prev) => ({
			...prev,
			totems: prev.totems.map((totem) =>
				totem.id === totemId ? { ...totem, completed: !totem.completed } : totem
			),
		}));
	};

	const resetAll = () => {
		setLocalData({ totems: [...TOTEMS] });
	};

	const completedCount =
		localData.totems?.filter((totem) => totem.completed).length || 0;
	const totalCount = localData.totems?.length || 0;

	return (
		<div className="totems-section">
			<FloatingCard>
				<div className="totems-section__header">
					<h3>
						Totems ({completedCount}/{totalCount})
					</h3>
					<p>
						Complete all 5 totems to progress the Easter Egg. Check off each
						totem as you complete it.
					</p>
					<Button variantType="secondary" onClick={resetAll}>
						Reset All
					</Button>
				</div>

				<div className="totems-section__grid">
					{localData.totems?.map((totem) => (
						<FloatingCard
							key={totem.id}
							className={`totem-card ${
								totem.completed ? "totem-card--completed" : ""
							}`}
							interactive
							onClick={() => toggleTotemCompleted(totem.id)}
						>
							<div className="totem-card__header">
								<h4>{totem.name}</h4>
								<span className="totem-card__status">
									{totem.completed ? "✅" : "⭕"}
								</span>
							</div>
							<div className="totem-card__content">
								<div className="totem-card__location">
									<strong>Location:</strong> {totem.location}
								</div>
								<div className="totem-card__challenge">
									<strong>Challenge:</strong> {totem.challenge}
								</div>
							</div>
						</FloatingCard>
					))}
				</div>

				{completedCount === totalCount && (
					<div className="totems-section__completion">
						<FloatingCard className="completion-card">
							<h4>🎉 All Totems Complete!</h4>
							<p>You can now proceed to the next step.</p>
						</FloatingCard>
					</div>
				)}
			</FloatingCard>
		</div>
	);
}

export default TotemsSection;

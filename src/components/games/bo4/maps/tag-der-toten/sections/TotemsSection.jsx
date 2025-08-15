import { useState, useEffect } from "react";
import FloatingCard from "../../../../../common/FloatingCard";
import Button from "../../../../../common/Button";

// Real challenge totem data from the documentation
const CHALLENGE_TOTEMS = [
	{
		id: "lighthouse-station",
		name: "Lighthouse Station",
		reward: "Carpenter, Full Power, Self Revives",
		challenges: [
			"Kill enemies with headshots and collect brains (Reward: Carpenter Powerup)",
			"Kill enemies with a Shield bash (Reward: Full Power Powerup)",
			"Pick up pee jars in Lighthouse Level 4 and empty them in the Beach water (Reward: Self Revives)",
		],
		completed: false,
	},
	{
		id: "forecastle",
		name: "Forecastle",
		reward: "Carpenter, Fire Sale, Armor",
		challenges: [
			"Kill enemies while standing still (Reward: Carpenter Powerup)",
			"Kill enemies with melee attacks (Reward: Fire Sale Powerup)",
			"Find soup ingredients, add them to the cooking pot, and add water (Reward: Armor Powerup)",
		],
		completed: false,
	},
	{
		id: "facility",
		name: "Facility",
		reward: "Insta-kill, Team Full Power, Half-price Traps",
		challenges: [
			"Fling zombies (Reward: Insta-kill)",
			"Kill zombies while riding a zipline (Reward: Team Full Power)",
			"Complete the Wack-a-mole station using only snowballs (Reward: Traps are half-price)",
		],
		completed: false,
	},
	{
		id: "beach",
		name: "Beach",
		reward: "Bonus Points, Insta-kill, Break Ice faster",
		challenges: [
			"Kill enemies with snowballs (Reward: Bonus Points)",
			"Kill enemies using the Lighthouse trap (Reward: Insta-kill)",
			"Complete 3 SOS messages (Lighthouse, boat entrance at Beach, boat entrance at Sunken Path) with snowballs (Reward: Break Ice faster)",
		],
		completed: false,
	},
	{
		id: "frozen-crevasse",
		name: "Frozen Crevasse",
		reward: "Increased snowball storage",
		challenges: [
			"Kill enemies while standing in freezing water",
			"Shatter frozen zombies",
			"Play the Hermit's favourite tune on the bells in Docks (Reward: Increased snowball storage, from 6 to 10)",
		],
		completed: false,
	},
];

function TotemsSection({ data, onChange }) {
	// Ensure we always have the correct data structure
	const initialData =
		data && data.totems ? data : { totems: [...CHALLENGE_TOTEMS] };
	const [localData, setLocalData] = useState(initialData);
	const [selectedTotem, setSelectedTotem] = useState(CHALLENGE_TOTEMS[0].id);

	console.log("TotemsSection props:", { data, initialData });

	// Load from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem("tag-der-toten-totems-data");
		console.log("Loading from localStorage:", { saved });
		if (saved) {
			try {
				const parsedData = JSON.parse(saved);
				console.log("Parsed localStorage data:", parsedData);
				setLocalData(parsedData);
			} catch (e) {
				console.error("Failed to parse totems data:", e);
				setLocalData({ totems: [...CHALLENGE_TOTEMS] });
			}
		} else {
			console.log("No localStorage data found, using initial data");
			// Ensure we have initial data if nothing in localStorage
			setLocalData({ totems: [...CHALLENGE_TOTEMS] });
		}
	}, []);

	// Save to localStorage and update parent when data changes
	useEffect(() => {
		localStorage.setItem(
			"tag-der-toten-totems-data",
			JSON.stringify(localData)
		);
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
		setLocalData({ totems: [...CHALLENGE_TOTEMS] });
		setSelectedTotem(CHALLENGE_TOTEMS[0].id);
	};

	const completedCount =
		localData.totems?.filter((totem) => totem.completed).length || 0;
	const totalCount = localData.totems?.length || 0;
	const currentTotem =
		localData.totems?.find((totem) => totem.id === selectedTotem) ||
		CHALLENGE_TOTEMS[0];

	// Debug logging
	console.log("TotemsSection render:", {
		localData,
		"localData.totems": localData.totems,
		"localData.totems length": localData.totems?.length,
		selectedTotem,
		currentTotem,
	});

	return (
		<div className="totems-section">
			{/* Totems Header */}
			<div className="totems-header">
				<h3>
					Challenge Totems ({completedCount}/{totalCount})
				</h3>
				<p>
					Complete all 5 challenge totems to progress the Easter Egg. Each
					location has 3 challenges to complete.
				</p>
				<div className="totems-progress">
					<div className="progress-bar">
						<div
							className="progress-fill"
							style={{ width: `${(completedCount / totalCount) * 100}%` }}
						></div>
					</div>
					<span className="progress-text">
						{completedCount} of {totalCount} completed
					</span>
				</div>
				<Button variantType="secondary" onClick={resetAll}>
					Reset All Totems
				</Button>
			</div>

			{/* Totems Locations */}
			<div className="totems-locations">
				<h4>Select a Totem Location:</h4>
				<div className="location-grid">
					{localData.totems && localData.totems.length > 0 ? (
						localData.totems.map((totem) => (
							<div
								key={totem.id}
								className={`location-card ${
									selectedTotem === totem.id ? "location-card--selected" : ""
								} ${totem.completed ? "location-card--completed" : ""}`}
								onClick={() => setSelectedTotem(totem.id)}
								style={{
									border: "1px solid #ccc",
									padding: "1rem",
									margin: "0.5rem",
									cursor: "pointer",
								}}
							>
								<div className="location-card__header">
									<h5>{totem.name}</h5>
									<span className="location-card__reward">{totem.reward}</span>
								</div>
								<div className="location-card__status">
									<button
										className={`status-button ${
											totem.completed ? "completed" : ""
										}`}
										onClick={(e) => {
											e.stopPropagation();
											toggleTotemCompleted(totem.id);
										}}
									>
										{totem.completed ? "✅ Complete" : "⭕ Incomplete"}
									</button>
								</div>
							</div>
						))
					) : (
						<div>No totems found</div>
					)}
				</div>
			</div>

			{/* Totems Challenges */}
			<div className="totems-challenges">
				<h4>Challenges for {currentTotem?.name || "No totem selected"}:</h4>
				<div className="challenges-list">
					{currentTotem?.challenges?.map((challenge, index) => (
						<div key={index} className="challenge-item">
							<span className="challenge-number">{index + 1}.</span>
							<span className="challenge-text">{challenge}</span>
						</div>
					))}
				</div>
				{currentTotem?.completed && (
					<div className="completion-message">
						<span className="completion-icon">🎉</span>
						<span className="completion-text">Location completed!</span>
					</div>
				)}
			</div>

			{/* Overall Completion - Only show when all totems are complete */}
			{completedCount === totalCount && completedCount > 0 && (
				<div className="totems-completion">
					<div className="completion-card">
						<h4>🎉 All Challenge Totems Complete!</h4>
						<p>You can now proceed to the next step of the Easter Egg.</p>
					</div>
				</div>
			)}
		</div>
	);
}

export default TotemsSection;

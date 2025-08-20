import { useState, useEffect } from "react";
import { FloatingCard } from "../../../../../content/index.js";
import { SectionHeader } from "../../../../../core/index.js";
import { LocationCard } from "../../../../../content/index.js";

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
	const [selectedTotems, setSelectedTotems] = useState(
		new Set([CHALLENGE_TOTEMS[0].id])
	);

	// Load from localStorage on mount or when parent data changes (reset)
	useEffect(() => {
		// Check if parent data is empty (indicating a reset)
		const isParentDataEmpty = !data || Object.keys(data).length === 0;

		if (isParentDataEmpty) {
			// Parent has been reset, check localStorage or use initial data
			const saved = localStorage.getItem("tag-der-toten-totems-data");
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
			// Also reset the selectedTotems state when parent resets
			setSelectedTotems(new Set([CHALLENGE_TOTEMS[0].id]));
		}
	}, [data]);

	// Save to localStorage and update parent when data changes
	useEffect(() => {
		localStorage.setItem(
			"tag-der-toten-totems-data",
			JSON.stringify(localData)
		);
		onChange?.(localData);
	}, [localData, onChange]);

	const toggleTotemCompleted = (totemId) => {
		setLocalData((prev) => {
			const updatedTotems = prev.totems.map((totem) =>
				totem.id === totemId ? { ...totem, completed: !totem.completed } : totem
			);

			// If marking as completed, ensure it's selected
			const updatedTotem = updatedTotems.find((t) => t.id === totemId);
			if (updatedTotem?.completed) {
				setSelectedTotems(
					(prevSelected) => new Set([...prevSelected, totemId])
				);
			}

			return {
				...prev,
				totems: updatedTotems,
			};
		});
	};

	const resetAll = () => {
		setLocalData({ totems: [...CHALLENGE_TOTEMS] });
		setSelectedTotems(new Set([CHALLENGE_TOTEMS[0].id]));
	};

	const completedCount =
		localData.totems?.filter((totem) => totem.completed).length || 0;
	const totalCount = localData.totems?.length || 0;
	const toggleTotemSelection = (totemId) => {
		// Check if the totem is completed
		const totem = localData.totems?.find((t) => t.id === totemId);
		if (totem?.completed) {
			// Don't allow unselecting completed totems
			return;
		}

		setSelectedTotems((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(totemId)) {
				newSet.delete(totemId);
			} else {
				newSet.add(totemId);
			}
			// Ensure at least one totem is always selected
			return newSet.size === 0 ? new Set([CHALLENGE_TOTEMS[0].id]) : newSet;
		});
	};

	return (
		<div className="totems-section">
			<SectionHeader
				title="Challenge Totems"
				progress={{ completed: completedCount, total: totalCount }}
				description="Complete 2 challenge totems to progress the Easter Egg or 5 to access the Tundra Wonder Weapon. Each location has 3 challenges to complete."
				onReset={resetAll}
				resetButtonText="Reset All Totems"
			/>

			{/* Totems Locations */}
			<div className="totems-locations">
				<h4>Select Totem Locations (click to add/remove):</h4>
				<div className="location-grid location-grid--totems">
					{localData.totems && localData.totems.length > 0 ? (
						localData.totems.map((totem) => (
							<LocationCard
								key={totem.id}
								primaryText={totem.name}
								secondaryText={totem.reward}
								isCompleted={totem.completed}
								selectable={true}
								isSelected={selectedTotems.has(totem.id)}
								onSelect={() => toggleTotemSelection(totem.id)}
								onToggleComplete={() => toggleTotemCompleted(totem.id)}
								showSecondaryAlways={true}
								variant="totem"
							/>
						))
					) : (
						<div>No totems found</div>
					)}
				</div>
			</div>

			{/* Totems Challenges */}
			<div className="totems-challenges">
				{localData.totems && localData.totems.length > 0 ? (
					localData.totems
						.filter((totem) => selectedTotems.has(totem.id))
						.map((totem) => (
							<div
								key={totem.id}
								className="totem-challenge-section"
								style={{ marginBottom: "2rem" }}
							>
								{totem.completed ? (
									<div className="completion-message">
										<h4>{totem.name} - Complete! 🎉</h4>
										<p>All challenges for this totem have been completed.</p>
									</div>
								) : (
									<>
										<h4>Challenges for {totem.name}:</h4>
										<div className="challenges-list">
											{totem.challenges?.map((challenge, index) => (
												<div key={index} className="challenge-item">
													<span className="challenge-number">{index + 1}.</span>
													<span className="challenge-text">{challenge}</span>
												</div>
											))}
										</div>
									</>
								)}
							</div>
						))
				) : (
					<div>No totems selected</div>
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

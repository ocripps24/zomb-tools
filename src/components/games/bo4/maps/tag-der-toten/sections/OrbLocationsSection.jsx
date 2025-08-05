import { useState, useEffect } from "react";
import FloatingCard from "../../../../../common/FloatingCard";
import Button from "../../../../../common/Button";

// Placeholder data - replace with actual orb locations
const ORB_LOCATIONS = [
	{
		id: "location-1",
		area: "Area 1",
		description: "Location description here",
		coordinates: "X: 0, Y: 0, Z: 0",
		notes: "Additional notes here",
		visited: false,
	},
	{
		id: "location-2",
		area: "Area 2",
		description: "Location description here",
		coordinates: "X: 0, Y: 0, Z: 0",
		notes: "Additional notes here",
		visited: false,
	},
	{
		id: "location-3",
		area: "Area 3",
		description: "Location description here",
		coordinates: "X: 0, Y: 0, Z: 0",
		notes: "Additional notes here",
		visited: false,
	},
	{
		id: "location-4",
		area: "Area 4",
		description: "Location description here",
		coordinates: "X: 0, Y: 0, Z: 0",
		notes: "Additional notes here",
		visited: false,
	},
	{
		id: "location-5",
		area: "Area 5",
		description: "Location description here",
		coordinates: "X: 0, Y: 0, Z: 0",
		notes: "Additional notes here",
		visited: false,
	},
];

function OrbLocationsSection({ data, onChange }) {
	const [localData, setLocalData] = useState(
		data || { locations: [...ORB_LOCATIONS] }
	);

	// Load from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem("tag-orb-data");
		if (saved) {
			try {
				const parsedData = JSON.parse(saved);
				setLocalData(parsedData);
			} catch (e) {
				console.error("Failed to parse orb data:", e);
				setLocalData({ locations: [...ORB_LOCATIONS] });
			}
		}
	}, []);

	// Save to localStorage and update parent when data changes
	useEffect(() => {
		localStorage.setItem("tag-orb-data", JSON.stringify(localData));
		onChange?.(localData);
	}, [localData, onChange]);

	const toggleLocationVisited = (locationId) => {
		setLocalData((prev) => ({
			...prev,
			locations: prev.locations.map((location) =>
				location.id === locationId
					? { ...location, visited: !location.visited }
					: location
			),
		}));
	};

	const resetAll = () => {
		setLocalData({ locations: [...ORB_LOCATIONS] });
	};

	const visitedCount =
		localData.locations?.filter((location) => location.visited).length || 0;
	const totalCount = localData.locations?.length || 0;

	return (
		<div className="orb-section">
			<FloatingCard>
				<div className="orb-section__header">
					<h3>
						Orb Locations Chart ({visitedCount}/{totalCount})
					</h3>
					<p>
						Track your progress through the orb locations. Check off each
						location as you visit it.
					</p>
					<Button variantType="secondary" onClick={resetAll}>
						Reset All
					</Button>
				</div>

				<div className="orb-section__table">
					<div className="orb-table">
						<div className="orb-table__header">
							<div className="orb-table__cell orb-table__cell--header">
								Status
							</div>
							<div className="orb-table__cell orb-table__cell--header">
								Area
							</div>
							<div className="orb-table__cell orb-table__cell--header">
								Description
							</div>
							<div className="orb-table__cell orb-table__cell--header">
								Coordinates
							</div>
							<div className="orb-table__cell orb-table__cell--header">
								Notes
							</div>
						</div>

						{localData.locations?.map((location) => (
							<div
								key={location.id}
								className={`orb-table__row ${
									location.visited ? "orb-table__row--visited" : ""
								}`}
								onClick={() => toggleLocationVisited(location.id)}
							>
								<div className="orb-table__cell orb-table__cell--status">
									{location.visited ? "✅" : "📍"}
								</div>
								<div className="orb-table__cell">
									<strong>{location.area}</strong>
								</div>
								<div className="orb-table__cell">{location.description}</div>
								<div className="orb-table__cell orb-table__cell--coordinates">
									{location.coordinates}
								</div>
								<div className="orb-table__cell orb-table__cell--notes">
									{location.notes}
								</div>
							</div>
						))}
					</div>
				</div>

				{visitedCount === totalCount && (
					<div className="orb-section__completion">
						<FloatingCard className="completion-card">
							<h4>🎉 All Locations Visited!</h4>
							<p>
								You have checked all orb locations. The Easter Egg should be
								ready to complete!
							</p>
						</FloatingCard>
					</div>
				)}
			</FloatingCard>
		</div>
	);
}

export default OrbLocationsSection;

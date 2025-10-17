import { useState, useEffect } from "react";

interface MovementButtonsProps {
	locationId: string;
	label: string;
	type?: string;
	movement: number;
	limits?: { min: number; max: number };
	displayFormat?: "time" | "movements";
	movementToTime: (movement: number, type?: string) => string;
	onChange: (locationId: string, movement: number, type?: string) => void;
}

function MovementButtons({
	locationId,
	label,
	type,
	movement,
	limits = { min: -5, max: 5 },
	displayFormat = "time",
	movementToTime,
	onChange,
}: MovementButtonsProps) {
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Get short label for mobile (first letter + colon)
	const shortLabel = label.charAt(0).toUpperCase() + ":";

	// Generate buttons for the movement range
	const generateButtons = () => {
		const buttons = [];
		for (let mov = limits.min; mov <= limits.max; mov++) {
			const timeValue = movementToTime(mov, type);
			const isSelected = movement === mov;

			buttons.push(
				<button
					key={mov}
					onClick={() => onChange(locationId, mov, type)}
					className={`movement-btn ${
						isSelected ? "movement-btn--selected" : ""
					}`}
					title={`${mov >= 0 ? "+" : ""}${mov} = ${timeValue}`}
				>
					{displayFormat === "movements"
						? `${mov >= 0 ? "+" : ""}${mov}`
						: timeValue}
				</button>
			);
		}
		return buttons;
	};

	return (
		<div className="movement-buttons">
			<div className="movement-buttons-section">
				<span className="movement-label">
					{isMobile ? shortLabel : `${label}:`}
				</span>
				<div className="movement-buttons-grid">{generateButtons()}</div>
			</div>
		</div>
	);
}

export default MovementButtons;
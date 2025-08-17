import { useState, useEffect } from "react";

function MovementButtons({
	locationId,
	symbol,
	hourMovement,
	minuteMovement,
	limits = { min: -5, max: 5 },
	displayFormat = "time",
	movementToTime,
	onChange,
}) {
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Generate buttons for the movement range
	const generateButtons = (currentMovement, type) => {
		const buttons = [];
		for (let movement = limits.min; movement <= limits.max; movement++) {
			const timeValue = movementToTime(movement, type);
			const isSelected = currentMovement === movement;

			buttons.push(
				<button
					key={movement}
					onClick={() => onChange(locationId, movement, type)}
					className={`movement-btn ${
						isSelected ? "movement-btn--selected" : ""
					}`}
					title={`${movement >= 0 ? "+" : ""}${movement} = ${timeValue}`}
				>
					{displayFormat === "movements"
						? `${movement >= 0 ? "+" : ""}${movement}`
						: timeValue}
				</button>
			);
		}
		return buttons;
	};

	// Both mobile and desktop: Show both hour and minute buttons
	return (
		<div className="movement-buttons">
			<div className="movement-buttons-section">
				<span className="movement-label">{isMobile ? "H:" : "Hour:"}</span>
				<div className="movement-buttons-grid">
					{generateButtons(hourMovement || 0, "hour")}
				</div>
			</div>
			<div className="movement-buttons-section">
				<span className="movement-label">{isMobile ? "M:" : "Minute:"}</span>
				<div className="movement-buttons-grid">
					{generateButtons(minuteMovement || 0, "minute")}
				</div>
			</div>
		</div>
	);
}

export default MovementButtons;
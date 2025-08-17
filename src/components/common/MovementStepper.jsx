import { useState, useEffect } from "react";

function MovementStepper({
	locationId,
	type,
	movement,
	limits = { min: -5, max: 5 },
	displayFormat = "time",
	movementToTime,
	onChange,
}) {
	const timeValue = movementToTime(movement, type);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="movement-stepper">
			<span className="movement-label">
				{isMobile
					? type === "hour"
						? "H:"
						: "M:"
					: type === "hour"
					? "Hour:"
					: "Minute:"}
			</span>
			<div className="stepper-controls">
				<button
					onClick={() =>
						onChange(locationId, Math.max(limits.min, movement - 1), type)
					}
					disabled={movement <= limits.min}
					className="stepper-btn"
				>
					−
				</button>
				<div className="stepper-value">
					{displayFormat === "movements"
						? `${movement >= 0 ? "+" : ""}${movement}`
						: timeValue}
				</div>
				<button
					onClick={() =>
						onChange(locationId, Math.min(limits.max, movement + 1), type)
					}
					disabled={movement >= limits.max}
					className="stepper-btn"
				>
					+
				</button>
			</div>
		</div>
	);
}

export default MovementStepper;
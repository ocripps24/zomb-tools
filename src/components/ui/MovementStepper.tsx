import { useState, useEffect } from "react";

interface MovementStepperProps {
	locationId: string;
	label: string;
	type?: string;
	movement: number;
	limits?: { min: number; max: number };
	displayFormat?: "time" | "movements";
	movementToTime: (movement: number, type?: string) => string;
	onChange: (locationId: string, movement: number, type?: string) => void;
}

function MovementStepper({
	locationId,
	label,
	type,
	movement,
	limits = { min: -5, max: 5 },
	displayFormat = "time",
	movementToTime,
	onChange,
}: MovementStepperProps) {
	const timeValue = movementToTime(movement, type);
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

	return (
		<div className="movement-stepper">
			<span className="movement-label">
				{isMobile ? shortLabel : `${label}:`}
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
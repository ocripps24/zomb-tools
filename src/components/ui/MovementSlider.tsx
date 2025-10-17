import { useState, useEffect, useCallback } from "react";

interface MovementSliderProps {
	locationId: string;
	label: string;
	type?: string;
	movement: number;
	limits?: { min: number; max: number };
	displayFormat?: "time" | "movements";
	movementToTime: (movement: number, type?: string) => string;
	onChange: (locationId: string, movement: number, type?: string) => void;
}

function MovementSlider({
	locationId,
	label,
	type,
	movement,
	limits = { min: -5, max: 5 },
	displayFormat = "time",
	movementToTime,
	onChange,
}: MovementSliderProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [tempValue, setTempValue] = useState(movement);
	const timeValue = movementToTime(isDragging ? tempValue : movement, type);

	// Get time values for the limits
	const minTimeValue = movementToTime(limits.min, type);
	const maxTimeValue = movementToTime(limits.max, type);

	const handleSliderChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = parseInt(e.target.value);
			setTempValue(newValue);
			if (!isDragging) {
				onChange(locationId, newValue, type);
			}
		},
		[locationId, type, onChange, isDragging]
	);

	const handleMouseDown = useCallback(() => {
		setIsDragging(true);
		setTempValue(movement);
	}, [movement]);

	const handleMouseUp = useCallback(() => {
		if (isDragging) {
			onChange(locationId, tempValue, type);
			setIsDragging(false);
		}
	}, [isDragging, locationId, tempValue, type, onChange]);

	// Update temp value when external movement changes
	useEffect(() => {
		if (!isDragging) {
			setTempValue(movement);
		}
	}, [movement, isDragging]);

	return (
		<div className="movement-slider">
			<span className="movement-label">{label}:</span>
			<div className="slider-container">
				<span className="slider-value">
					{displayFormat === "movements" ? limits.min : minTimeValue}
				</span>
				<input
					type="range"
					min={limits.min}
					max={limits.max}
					step="1"
					value={isDragging ? tempValue : movement}
					onChange={handleSliderChange}
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
					onTouchStart={handleMouseDown}
					onTouchEnd={handleMouseUp}
					className="slider"
				/>
				<span className="slider-value">
					{displayFormat === "movements" ? limits.max : maxTimeValue}
				</span>
			</div>
			<div className="slider-value">
				{displayFormat === "movements"
					? `${(isDragging ? tempValue : movement) >= 0 ? "+" : ""}${
							isDragging ? tempValue : movement
					  }`
					: timeValue}
			</div>
		</div>
	);
}

export default MovementSlider;
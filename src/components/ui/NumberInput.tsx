interface NumberInputProps {
	value: number | "";
	onChange: (value: number | "") => void;
	min?: number;
	max?: number;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
}

const UP_CHEVRON = (
	<svg
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden
	>
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			d="m6 12 4-4 4 4"
		/>
	</svg>
);

const DOWN_CHEVRON = (
	<svg
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden
	>
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			d="m6 8 4 4 4-4"
		/>
	</svg>
);

export function NumberInput({
	value,
	onChange,
	min,
	max,
	placeholder,
	className = "",
	disabled = false,
}: NumberInputProps) {
	const numValue = typeof value === "number" ? value : null;

	const increment = () => {
		const base = numValue ?? (min !== undefined ? min - 1 : 0);
		const next = base + 1;
		if (max !== undefined && next > max) return;
		onChange(next);
	};

	const decrement = () => {
		if (numValue === null) return;
		const next = numValue - 1;
		if (min !== undefined && next < min) return;
		onChange(next);
	};

	return (
		<div
			className={`number-input${disabled ? " number-input--disabled" : ""}${className ? ` ${className}` : ""}`}
		>
			<input
				type="number"
				className="number-input__field"
				value={value === "" ? "" : value}
				onChange={(e) =>
					onChange(
						e.target.value === "" ? "" : parseInt(e.target.value, 10),
					)
				}
				min={min}
				max={max}
				placeholder={placeholder}
				disabled={disabled}
				readOnly={disabled}
			/>
			<div className="number-input__spinners">
				<button
					type="button"
					className="number-input__btn"
					onClick={increment}
					tabIndex={-1}
					aria-label="Increase"
					disabled={disabled}
				>
					{UP_CHEVRON}
				</button>
				<button
					type="button"
					className="number-input__btn"
					onClick={decrement}
					tabIndex={-1}
					aria-label="Decrease"
					disabled={disabled}
				>
					{DOWN_CHEVRON}
				</button>
			</div>
		</div>
	);
}

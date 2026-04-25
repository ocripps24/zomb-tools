import React from "react";

export interface MultiSelectSymbol {
	id: string;
	component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	label?: string;
	disabled?: boolean;
}

export interface MultiSelectSymbolPickerProps {
	symbols: MultiSelectSymbol[];
	selectedSymbols: string[];
	onSymbolClick: (symbolId: string) => void;
	columns?: number;
	showLabel?: boolean;
	className?: string;
}

/**
 * Multi-select symbol picker component
 * Allows selecting multiple symbols with toggle behavior
 * Click to select, click again to deselect
 */
function MultiSelectSymbolPicker({
	symbols,
	selectedSymbols,
	onSymbolClick,
	columns,
	showLabel = false,
	className = "",
}: MultiSelectSymbolPickerProps) {
	return (
		<div
			className={`multi-select-symbol-picker ${className}`}
			style={
				columns !== undefined
					? {
							gridTemplateColumns: `repeat(${columns}, 1fr)`,
					  }
					: undefined
			}
		>
			{symbols.map((symbol) => {
				const SymbolComponent = symbol.component;
				const isSelected = selectedSymbols.includes(symbol.id);
				const isDisabled = symbol.disabled ?? false;

				return (
					<button
						key={symbol.id}
						className={[
							"multi-select-symbol-picker__symbol",
							isSelected ? "multi-select-symbol-picker__symbol--selected" : "",
							isDisabled ? "multi-select-symbol-picker__symbol--disabled" : "",
						].filter(Boolean).join(" ")}
						onClick={() => onSymbolClick(symbol.id)}
						disabled={isDisabled}
						aria-label={symbol.label || symbol.id}
						aria-pressed={isSelected}
					>
						<SymbolComponent className="multi-select-symbol-picker__icon" />
						{showLabel && symbol.label && (
							<span className="multi-select-symbol-picker__label">
								{symbol.label}
							</span>
						)}
					</button>
				);
			})}
		</div>
	);
}

export default MultiSelectSymbolPicker;

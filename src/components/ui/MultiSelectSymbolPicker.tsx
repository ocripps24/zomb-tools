import React from "react";

export interface MultiSelectSymbol {
	id: string;
	component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	label?: string;
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
	columns = 13,
	showLabel = false,
	className = "",
}: MultiSelectSymbolPickerProps) {
	return (
		<div
			className={`multi-select-symbol-picker ${className}`}
			style={{
				gridTemplateColumns: `repeat(${columns}, 1fr)`,
			}}
		>
			{symbols.map((symbol) => {
				const SymbolComponent = symbol.component;
				const isSelected = selectedSymbols.includes(symbol.id);

				return (
					<button
						key={symbol.id}
						className={`multi-select-symbol-picker__symbol ${
							isSelected ? "multi-select-symbol-picker__symbol--selected" : ""
						}`}
						onClick={() => onSymbolClick(symbol.id)}
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

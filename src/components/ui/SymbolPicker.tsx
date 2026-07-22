import React from "react";

export interface Symbol {
	id: string;
	component: React.ReactNode | React.ComponentType;
	name?: string;
	value?: number;
}

export interface SymbolPickerProps {
	symbols?: Symbol[];
	selectedSymbol?: string;
	onSymbolChange: (locationId: string, symbolId: string) => void;
	usedSymbols?: string[];
	locationId: string;
	/** Layout modifier class, e.g. "symbol-picker--voyage" - see _symbol-picker.scss for the grid it defines at each breakpoint. */
	className?: string;
	allowDeselect?: boolean;
	greyOutUnselected?: boolean;
}

function SymbolPicker({
	symbols = [],
	selectedSymbol = "",
	onSymbolChange,
	usedSymbols = [],
	locationId,
	className = "",
	allowDeselect = false,
	greyOutUnselected = false,
}: SymbolPickerProps) {
	const handleSymbolClick = (symbolId: string) => {
		if (allowDeselect && selectedSymbol === symbolId) {
			// Deselect if clicking currently selected symbol
			onSymbolChange(locationId, "");
		} else {
			onSymbolChange(locationId, symbolId);
		}
	};

	const isSymbolDisabled = (symbolId: string): boolean => {
		// Symbol is disabled if:
		// 1. It's used elsewhere but not selected here, OR
		// 2. Another symbol is selected in this location (and greyOutUnselected is enabled)
		const usedElsewhere = usedSymbols.includes(symbolId) && selectedSymbol !== symbolId;
		const greyedOut = greyOutUnselected && Boolean(selectedSymbol) && selectedSymbol !== symbolId;
		
		return usedElsewhere || greyedOut;
	};

	return (
		<div className={`symbol-picker ${className}`}>

			{symbols.map((symbol) => {
				const isSelected = selectedSymbol === symbol.id;
				const isDisabled = isSymbolDisabled(symbol.id);

				// Determine button classes
				const buttonClasses = [
					"symbol-button",
					isSelected ? "symbol-button--selected" : "",
					isDisabled ? "symbol-button--disabled" : ""
				].filter(Boolean).join(" ");

				return (
					<button
						key={symbol.id}
						className={buttonClasses}
						onClick={() => handleSymbolClick(symbol.id)}
						disabled={isDisabled}
						tabIndex={isDisabled ? -1 : 0}
						title={symbol.name || symbol.id}
						type="button"
					>
						{React.isValidElement(symbol.component) 
							? symbol.component
							: typeof symbol.component === 'function'
							? React.createElement(symbol.component, {})
							: symbol.component
						}
					</button>
				);
			})}
		</div>
	);
}

export default SymbolPicker;
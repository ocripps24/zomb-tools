import React from "react";

export interface Symbol {
	id: string;
	component: React.ReactNode | React.ComponentType;
	name?: string;
	value?: number;
}

export interface GridConfig {
	columns: number;
	rows?: number;
}

export interface SymbolPickerProps {
	symbols?: Symbol[];
	selectedSymbol?: string;
	onSymbolChange: (locationId: string, symbolId: string) => void;
	usedSymbols?: string[];
	locationId: string;
	className?: string;
	gridConfig?: GridConfig;
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
	gridConfig = { columns: 3, rows: 2 },
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

	const gridStyle = {
		gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)`,
		...(gridConfig.rows && { gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)` }),
	};

	return (
		<div
			className={`symbol-picker ${className}`}
			style={gridStyle}
		>
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
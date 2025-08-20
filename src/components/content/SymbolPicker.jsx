import React from "react";

/**
 * Reusable SymbolPicker component for selecting symbols across different maps
 * 
 * @param {Array} symbols - Array of symbol objects with {id, component, name?, value?}
 * @param {string} selectedSymbol - Currently selected symbol ID
 * @param {Function} onSymbolChange - Callback when symbol selection changes
 * @param {Array} usedSymbols - Array of symbol IDs that are used elsewhere (will be disabled)
 * @param {string} locationId - ID of the current location/input group
 * @param {string} className - Additional CSS class name
 * @param {Object} gridConfig - Grid configuration {columns, rows?}
 * @param {boolean} allowDeselect - Whether clicking selected symbol deselects it
 * @param {boolean} greyOutUnselected - Whether to grey out unselected symbols when one is selected
 */
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
}) {
	const handleSymbolClick = (symbolId) => {
		if (allowDeselect && selectedSymbol === symbolId) {
			// Deselect if clicking currently selected symbol
			onSymbolChange(locationId, "");
		} else {
			onSymbolChange(locationId, symbolId);
		}
	};

	const isSymbolDisabled = (symbolId) => {
		// Symbol is disabled if:
		// 1. It's used elsewhere but not selected here, OR
		// 2. Another symbol is selected in this location (and greyOutUnselected is enabled)
		const usedElsewhere = usedSymbols.includes(symbolId) && selectedSymbol !== symbolId;
		const greyedOut = greyOutUnselected && selectedSymbol && selectedSymbol !== symbolId;
		
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
					isSelected && "symbol-button--selected",
					isDisabled && "symbol-button--disabled"
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
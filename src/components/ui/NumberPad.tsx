import React, { useState } from "react";

export interface NumberPadProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
  placeholder?: string;
  maxLength?: number;
  includeZero?: boolean;
  disabled?: boolean;
  className?: string;
  inputMode?: 'keypad' | 'text';
}

/**
 * NumberPad component that provides both keypad and text input modes.
 * Features:
 * - Classic 3-column keypad layout
 * - Toggle between keypad entry and text input
 * - Configurable for 1-9 or 0-9 keypads
 * - Backspace functionality
 * - Clear functionality
 */
function NumberPad({
  value,
  onChange,
  title,
  placeholder = "Enter code",
  maxLength = 10,
  includeZero = true,
  disabled = false,
  className = "",
  inputMode = 'keypad'
}: NumberPadProps) {

  // Handle keypad button press
  const handleKeypadPress = (digit: string) => {
    if (disabled || value.length >= maxLength) return;
    onChange(value + digit);
  };

  // Handle backspace
  const handleBackspace = () => {
    if (disabled || value.length === 0) return;
    onChange(value.slice(0, -1));
  };

  // Handle clear
  const handleClear = () => {
    if (disabled) return;
    onChange("");
  };

  // Handle text input change
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Only allow digits and respect max length
    if (/^\d*$/.test(newValue) && newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  // Generate keypad buttons
  const getKeypadButtons = () => {
    const buttons = [];
    
    // Numbers 1-9
    for (let i = 1; i <= 9; i++) {
      buttons.push(
        <button
          key={i}
          type="button"
          className="keypad-button"
          onClick={() => handleKeypadPress(i.toString())}
          disabled={disabled}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  // Render the display value with underscores for empty positions
  const renderDisplayValue = () => {
    const totalLength = maxLength;
    const currentLength = value.length;
    
    let displayString = '';
    
    // Add the current digits
    for (let i = 0; i < currentLength; i++) {
      displayString += value[i];
    }
    
    // Add underscores for remaining positions
    for (let i = currentLength; i < totalLength; i++) {
      displayString += '_';
    }
    
    // Add spaces between characters for better readability
    return displayString.split('').join(' ');
  };

  return (
    <div className={`number-pad ${className}`.trim()}>
      {/* Title */}
      {title && (
        <div className="number-pad-title">
          <h4>{title}</h4>
        </div>
      )}

      {inputMode === 'keypad' ? (
        <>
          {/* Value Display */}
          <div className="number-pad-display">
            <div className="display-value">
              {renderDisplayValue()}
            </div>
          </div>
        </>
      ) : null}

      {inputMode === 'keypad' ? (
        // Keypad Mode
        <div className="keypad-container">
          <div className="keypad-grid">
            {getKeypadButtons()}
            
            {/* Bottom row */}
            <button
              type="button"
              className="keypad-button keypad-button--clear"
              onClick={handleClear}
              disabled={disabled}
            >
              C
            </button>
            
            {includeZero && (
              <button
                type="button"
                className="keypad-button"
                onClick={() => handleKeypadPress('0')}
                disabled={disabled}
              >
                0
              </button>
            )}
            
            <button
              type="button"
              className="keypad-button keypad-button--backspace"
              onClick={handleBackspace}
              disabled={disabled}
            >
              ⌫
            </button>
          </div>
        </div>
      ) : (
        // Text Input Mode - styled like the display
        <div className="text-input-container">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={value}
            onChange={handleTextInputChange}
            placeholder={renderDisplayValue()}
            maxLength={maxLength}
            disabled={disabled}
            className="text-input-display"
          />
        </div>
      )}
    </div>
  );
}

export default NumberPad;
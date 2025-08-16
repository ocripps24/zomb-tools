import { ReactNode } from "react";
import FloatingCard from "./FloatingCard";

interface LocationCardProps {
	// Core data
	primaryText: string;
	secondaryText?: string;
	
	// State management
	isCompleted?: boolean;
	onToggle?: () => void;
	
	// Selection functionality (for totems)
	selectable?: boolean;
	isSelected?: boolean;
	onSelect?: () => void;
	onToggleComplete?: () => void;
	
	// Behavior options
	showSecondaryOnlyWhenCompleted?: boolean;
	showSecondaryAlways?: boolean;
	clickable?: boolean;
	disabled?: boolean;
	
	// Visual options
	variant?: "quote" | "totem" | "location" | "default";
	
	// Additional content
	children?: ReactNode;
	className?: string;
}

function LocationCard({
	primaryText,
	secondaryText,
	isCompleted = false,
	onToggle,
	selectable = false,
	isSelected = false,
	onSelect,
	onToggleComplete,
	showSecondaryOnlyWhenCompleted = false,
	showSecondaryAlways = false,
	clickable = true,
	disabled = false,
	variant = "default",
	children,
	className = "",
}: LocationCardProps) {
	
	const shouldShowSecondary = secondaryText && (
		showSecondaryAlways || 
		(!showSecondaryOnlyWhenCompleted || isCompleted)
	);
	
	const handleClick = () => {
		if (disabled) return;
		
		if (selectable && onSelect) {
			// For selectable cards (totems), clicking selects
			onSelect();
		} else if (clickable && onToggle) {
			// For regular cards (quotes), clicking toggles completion
			onToggle();
		}
	};
	
	const handleStatusClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (disabled) return;
		
		if (selectable && onToggleComplete) {
			// For selectable cards, status click toggles completion
			onToggleComplete();
		} else if (onToggle) {
			// For regular cards, status click also toggles completion
			onToggle();
		}
	};
	
	const getStatusIcon = () => {
		if (isCompleted) {
			return "✅";
		} else {
			return "⭕"; // Red hollow circle for all uncompleted items
		}
	};
	
	const baseClasses = [
		"location-card",
		`location-card--${variant}`,
		isCompleted ? "location-card--completed" : "",
		isSelected ? "location-card--selected" : "",
		clickable && !disabled ? "location-card--clickable" : "",
		disabled ? "location-card--disabled" : "",
		className
	].filter(Boolean).join(" ");
	
	return (
		<FloatingCard
			className={baseClasses}
			interactive={clickable}
			onClick={handleClick}
		>
			<span className="location-card__status" onClick={handleStatusClick}>
				{getStatusIcon()}
			</span>
			
			<div className="location-card__content">
				<div className="location-card__primary">
					<strong>{variant === "quote" ? "Quote:" : variant === "totem" ? "Location:" : "Primary:"}</strong> "{primaryText}"
				</div>
				
				{shouldShowSecondary && (
					<div className="location-card__secondary">
						<strong>{variant === "quote" ? "Location:" : variant === "totem" ? "Reward:" : "Secondary:"}</strong> {secondaryText}
					</div>
				)}
				
				{children && (
					<div className="location-card__extra">
						{children}
					</div>
				)}
			</div>
		</FloatingCard>
	);
}

export default LocationCard;
import React from "react";
import { FloatingCard } from "../content/index.js";

const GameSelectionCard = ({ image, label, onClick, disabled }: {
	image: any;
	label: any;
	onClick: any;
	disabled?: boolean;
}) => (
	<FloatingCard
		interactive={!disabled}
		onClick={disabled ? undefined : onClick}
		className={`game-selection__card ${disabled ? "game-selection__card--disabled" : ""}`}
		role="button"
		tabIndex={disabled ? -1 : 0}
		onKeyDown={(e) => {
			if (onClick && !disabled && (e.key === "Enter" || e.key === " ")) {
				e.preventDefault();
				onClick();
			}
		}}
	>
		<div
			className="game-selection__card-bg"
			style={image ? { backgroundImage: `url(${image})` } : undefined}
		/>
		<div className="game-selection__card-label-bubble">{label}</div>
	</FloatingCard>
);

export default GameSelectionCard;

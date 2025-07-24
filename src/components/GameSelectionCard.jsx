import React from "react";
import FloatingCard from "./common/FloatingCard";

const GameSelectionCard = ({ image, label, onClick }) => (
	<FloatingCard
		interactive
		onClick={onClick}
		className="game-selection__card"
		role="button"
		tabIndex={0}
		onKeyDown={(e) => {
			if (onClick && (e.key === "Enter" || e.key === " ")) {
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

import React from "react";
import FloatingCard from "./common/FloatingCard";

const MapSelectionCard = ({
	image,
	label,
	onClick,
	children,
	style,
	className = "",
}) => (
	<FloatingCard
		interactive={!!onClick}
		onClick={onClick}
		className={`map-selection__card${className ? " " + className : ""}`}
		style={style}
	>
		<div
			className="map-selection__card-bg"
			style={image ? { backgroundImage: `url(${image})` } : undefined}
		/>
		<div className="map-selection__card-label-bubble">{label}</div>
		{children}
	</FloatingCard>
);

export default MapSelectionCard;

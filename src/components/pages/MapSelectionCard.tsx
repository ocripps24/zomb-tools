import React from "react";

interface MapSelectionCardProps {
	image: string | null;
	label: string;
	onClick?: () => void;
	style?: React.CSSProperties;
	className?: string;
	tools?: string[];
	status?: string;
	available?: boolean;
	beta?: boolean;
}

const MapSelectionCard: React.FC<MapSelectionCardProps> = ({
	image,
	label,
	onClick,
	style,
	className = "",
	tools,
	status,
	available = false,
	beta = false,
}) => (
	<div
		className={`map-selection-card${!available ? " selection-card--disabled" : ""}${className ? " " + className : ""}`}
		style={style}
		onClick={onClick}
	>
		<div className="selection-card__image">
			{image && (
				<img
					src={image}
					alt={label}
				/>
			)}
			{beta && <span className="selection-card__badge">BETA</span>}
		</div>
		<div className="selection-card__meta">
			<h3 className="selection-card__title">{label}</h3>
			{available && tools && tools.length > 0 ? (
				<div className="map-selection-card__tools">
					<strong>Tools:</strong> {tools.join(", ")}
				</div>
			) : (
				status && (
					<div className="map-selection-card__status">
						{status}
					</div>
				)
			)}
		</div>
	</div>
);

export default MapSelectionCard;

const GameSelectionCard = ({ image, label, onClick, disabled }: {
	image: any;
	label: any;
	onClick: any;
	disabled?: boolean;
}) => (
	<div
		className={`game-selection-card ${disabled ? "selection-card--disabled" : ""}`}
		role="button"
		tabIndex={disabled ? -1 : 0}
		onClick={disabled ? undefined : onClick}
		onKeyDown={(e) => {
			if (onClick && !disabled && (e.key === "Enter" || e.key === " ")) {
				e.preventDefault();
				onClick();
			}
		}}
	>
		<div className="selection-card__image">
			{image && (
				<img 
					src={image} 
					alt={label}
				/>
			)}
		</div>
		<div className="selection-card__meta">
			<h3 className="selection-card__title">{label}</h3>
		</div>
	</div>
);

export default GameSelectionCard;

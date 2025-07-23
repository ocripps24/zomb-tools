import React from "react";

interface FloatingCardProps {
	children: React.ReactNode;
	className?: string;
	interactive?: boolean;
	style?: React.CSSProperties;
}

const FloatingCard: React.FC<FloatingCardProps> = ({
	children,
	className = "",
	interactive = false,
	style,
}) => {
	return (
		<div
			className={`card${interactive ? " card--interactive" : ""}${
				className ? " " + className : ""
			}`}
			style={style}
			tabIndex={interactive ? 0 : undefined}
			role={interactive ? "button" : undefined}
		>
			{children}
		</div>
	);
};

export default FloatingCard;

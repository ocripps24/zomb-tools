import React from "react";

interface FloatingCardProps {
	children: React.ReactNode;
	className?: string;
	interactive?: boolean;
	style?: React.CSSProperties;
	onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	role?: string;
	tabIndex?: number;
	onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

const FloatingCard: React.FC<FloatingCardProps> = ({
	children,
	className = "",
	interactive = false,
	style,
	onClick,
	role,
	tabIndex,
	onKeyDown,
}) => {
	return (
		<div
			className={`card${interactive ? " card--interactive" : ""}${
				className ? " " + className : ""
			}`}
			style={style}
			tabIndex={tabIndex}
			role={role}
			onKeyDown={onKeyDown}
			onClick={onClick}
		>
			{children}
		</div>
	);
};

export default FloatingCard;

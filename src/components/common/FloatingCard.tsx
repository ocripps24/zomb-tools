import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { SxProps, Theme } from "@mui/material/styles";

interface FloatingCardProps {
	children: React.ReactNode;
	sx?: SxProps<Theme>;
	className?: string;
	elevation?: number;
}

const FloatingCard: React.FC<FloatingCardProps> = ({
	children,
	sx,
	className,
	elevation = 8,
}) => {
	return (
		<Card
			className={className}
			elevation={elevation}
			sx={{
				maxWidth: 600,
				margin: "2rem auto",
				borderRadius: 4,
				...sx,
			}}
		>
			<CardContent>{children}</CardContent>
		</Card>
	);
};

export default FloatingCard;

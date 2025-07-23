import React from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { SxProps, Theme } from "@mui/material/styles";

export type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends MuiButtonProps {
	variantType?: ButtonVariant;
	sx?: SxProps<Theme>;
}

const variantStyles: Record<ButtonVariant, SxProps<Theme>> = {
	primary: {
		background: "linear-gradient(90deg, #00e0ff 0%, #3a8dde 100%)",
		color: "#fff",
		"&:hover": {
			background: "linear-gradient(90deg, #00b8d9 0%, #2a6bbf 100%)",
		},
	},
	secondary: {
		background: "rgba(255,255,255,0.08)",
		color: "#00e0ff",
		border: "1px solid #00e0ff",
		"&:hover": {
			background: "rgba(0,224,255,0.12)",
		},
	},
	danger: {
		background: "linear-gradient(90deg, #ff3c6e 0%, #b91c1c 100%)",
		color: "#fff",
		"&:hover": {
			background: "linear-gradient(90deg, #d72660 0%, #7a1212 100%)",
		},
	},
};

const Button: React.FC<ButtonProps> = ({
	variantType = "primary",
	sx,
	...props
}) => {
	return (
		<MuiButton
			sx={{
				borderRadius: 12,
				fontWeight: 700,
				padding: "10px 24px",
				boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
				...(variantStyles[variantType] as object),
				...(sx as object),
			}}
			{...props}
		/>
	);
};

export default Button;

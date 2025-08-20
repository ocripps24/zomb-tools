import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variantType?: ButtonVariant;
	fullWidth?: boolean;
	children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
	variantType = "primary",
	fullWidth = false,
	className = "",
	children,
	...props
}) => {
	return (
		<button
			className={`btn btn--${variantType}${
				fullWidth ? " btn--full-width" : ""
			}${className ? " " + className : ""}`}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;

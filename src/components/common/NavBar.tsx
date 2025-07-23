import React from "react";
import { useNavigate } from "react-router-dom";

interface NavBarProps {
	title?: string;
}

const NavBar: React.FC<NavBarProps> = ({ title }) => {
	const navigate = useNavigate();

	return (
		<nav className="nav" aria-label="Global Navigation">
			<button
				className="nav__button"
				aria-label="Home"
				onClick={() => navigate("/")}
			>
				🏠
			</button>
			<button
				className="nav__button"
				aria-label="Games"
				onClick={() => navigate("/")}
			>
				🎮
			</button>
			<button
				className="nav__button"
				aria-label="Maps"
				onClick={() => navigate("/bo4")}
			>
				🗺️
			</button>
			<button
				className="nav__button"
				aria-label="Settings"
				onClick={() => navigate("/settings")}
				style={{ marginLeft: "auto" }}
			>
				⚙️
			</button>
			{title && <span className="nav__title">{title}</span>}
		</nav>
	);
};

export default NavBar;

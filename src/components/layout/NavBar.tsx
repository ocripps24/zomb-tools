import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getTheme, toggleTheme, THEMES } from "@/utils/theme";
import { ROUTES, getGameRoute } from "@/routes";

const games = [
	{ id: "bo4", name: "BO4" },
	{ id: "bo6", name: "BO6" },
];

const NavBar: React.FC<{ title?: string }> = ({ title }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [currentTheme, setCurrentTheme] = useState(getTheme());

	// Determine active game by path
	const activeGame = games.find((game) =>
		location.pathname.startsWith(`/${game.id}`)
	);
	const isHome = location.pathname === "/";

	const handleThemeToggle = () => {
		const newTheme = toggleTheme();
		setCurrentTheme(newTheme);
	};

	// Update theme state if it changes externally
	useEffect(() => {
		const handleStorageChange = () => {
			setCurrentTheme(getTheme());
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	return (
		<nav className="nav nav--bubble" aria-label="Global Navigation">
			<button
				className={`nav__brand nav__link${isHome ? " nav__link--active" : ""}`}
				onClick={() => navigate(ROUTES.home)}
				aria-label="Home"
			>
				ZomB Tools
			</button>
			<div className="nav__spacer" />
			<div className="nav__links">
				{games.map((game) => (
					<button
						key={game.id}
						className={`nav__link${
							activeGame && activeGame.id === game.id
								? " nav__link--active"
								: ""
						}`}
						onClick={() => navigate(getGameRoute(game.id as 'bo4' | 'bo6'))}
						aria-label={game.name}
					>
						{game.name}
					</button>
				))}
				<span className="nav__separator" />
				<button
					className="nav__link nav__link--theme"
					onClick={handleThemeToggle}
					aria-label={`Switch to ${
						currentTheme === THEMES.DARK ? "light" : "dark"
					} mode`}
					title={`Switch to ${
						currentTheme === THEMES.DARK ? "light" : "dark"
					} mode`}
				>
					{currentTheme === THEMES.DARK ? "☀️" : "🌙"}
				</button>
			</div>
		</nav>
	);
};

export default NavBar;

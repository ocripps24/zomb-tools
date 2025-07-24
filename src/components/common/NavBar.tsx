import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const games = [
	{ id: "bo4", name: "BO4" },
	{ id: "bo6", name: "BO6" },
];

const NavBar: React.FC<{ title?: string }> = ({ title }) => {
	const navigate = useNavigate();
	const location = useLocation();

	// Determine active game by path
	const activeGame = games.find((game) =>
		location.pathname.startsWith(`/${game.id}`)
	);
	const isSettings = location.pathname.startsWith("/settings");
	const isHome = location.pathname === "/";

	return (
		<nav className="nav" aria-label="Global Navigation">
			<button
				className={`nav__brand nav__link${isHome ? " nav__link--active" : ""}`}
				onClick={() => navigate("/")}
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
						onClick={() => navigate(`/${game.id}`)}
						aria-label={game.name}
					>
						{game.name}
					</button>
				))}
				<span className="nav__separator" />
				<button
					className={`nav__link nav__link--settings${
						isSettings ? " nav__link--active" : ""
					}`}
					onClick={() => navigate("/settings")}
					aria-label="Settings"
				>
					Settings
				</button>
			</div>
		</nav>
	);
};

export default NavBar;

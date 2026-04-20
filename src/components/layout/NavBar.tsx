import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES, getGameRoute, type GameId } from "@/routes";
import MrPeeksLogo from "@/assets/icons/mr-peeks-head-logo.svg";
import ChevronIcon from "@/assets/icons/chevron.svg";

const games = [
	{ id: "bo1", name: "BO1" },
	{ id: "bo3", name: "BO3" },
	{ id: "iw", name: "IW" },
	{ id: "bo4", name: "BO4" },
	{ id: "bo5", name: "CW" },
	{ id: "bo6", name: "BO6" },
	{ id: "bo7", name: "BO7" },
];

const NavBar: React.FC<{ title?: string }> = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	// Determine active game by path
	const activeGame = games.find((game) =>
		location.pathname.startsWith(`/${game.id}`),
	);
	const isHome = location.pathname === "/";
	const isDashboard = location.pathname.startsWith("/dashboard");

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const dropdown = document.querySelector(".nav__dropdown");
			if (dropdown && !dropdown.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		if (isDropdownOpen) {
			document.addEventListener("click", handleClickOutside);
		}

		return () => document.removeEventListener("click", handleClickOutside);
	}, [isDropdownOpen]);

	return (
		<nav className="nav" aria-label="Global Navigation">
			<button
				className={`nav__brand${isHome ? " nav__brand--active" : ""}`}
				onClick={() => navigate(ROUTES.home)}
				aria-label="Home"
			>
				<span className="nav__logo">
					<MrPeeksLogo />
				</span>
				<span className="nav__brand-text">ZomB Tools</span>
			</button>

			<div className="nav__links">
				{/* Desktop: Show all game links */}
				<div className="nav__links-desktop">
					{games.map((game) => (
						<button
							key={game.id}
							className={`nav__link${
								activeGame && activeGame.id === game.id
									? " nav__link--active"
									: ""
							}`}
							onClick={() =>
								navigate(
									getGameRoute(game.id as GameId),
								)
							}
							aria-label={game.name}
						>
							{game.name}
						</button>
					))}
					<button
						className={`nav__link${isDashboard ? " nav__link--active" : ""}`}
						onClick={() => navigate(ROUTES.dashboard.base)}
						aria-label="Dashboards"
					>
						Speedruns
					</button>
				</div>

				{/* Mobile: Dropdown menu */}
				<div className="nav__dropdown">
					<button
						className={`nav__link nav__dropdown-toggle${
							activeGame ? " nav__link--active" : ""
						}`}
						onClick={(e) => {
							e.stopPropagation();
							setIsDropdownOpen(!isDropdownOpen);
						}}
						aria-label="Games menu"
						aria-expanded={isDropdownOpen}
					>
						<span>Games</span>
						<span
							className={`nav__chevron${
								isDropdownOpen ? " nav__chevron--open" : ""
							}`}
						>
							<ChevronIcon />
						</span>
					</button>

					{isDropdownOpen && (
						<div className="nav__dropdown-menu">
							{games.map((game) => (
								<button
									key={game.id}
									className={`nav__dropdown-item${
										activeGame && activeGame.id === game.id
											? " nav__dropdown-item--active"
											: ""
									}`}
									onClick={() => {
										navigate(
											getGameRoute(
												game.id as GameId,
											),
										);
										setIsDropdownOpen(false);
									}}
								>
									{game.name}
								</button>
							))}
						</div>
					)}
				</div>

				{/* Theme toggle - hidden for now but keeping code */}
				{/* <span className="nav__separator" />
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
				</button> */}
			</div>
		</nav>
	);
};

export default NavBar;

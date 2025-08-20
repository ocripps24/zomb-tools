import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import GameSelection from "./components/GameSelection";
import MapSelection from "./components/MapSelection";
import VoyageOfDespair from "./components/games/bo4/maps/voyage-of-despair/VoyageOfDespair";
import TagDerToten from "./components/games/bo4/maps/tag-der-toten/TagDerToten";
import Terminus from "./components/games/bo6/maps/terminus/Terminus";
import Reckoning from "./components/games/bo6/maps/reckoning/Reckoning";
import ShatteredVeil from "./components/games/bo6/maps/shattered-veil/ShatteredVeil";
import LibertyFalls from "./components/games/bo6/maps/liberty-falls/LibertyFalls";
import NotFound from "./components/NotFound";
import { getGameById } from "./data/games";
import "./styles/main.scss";
import NavBar from "./components/common/NavBar";

function App() {
	const location = useLocation();

	// Determine the current page title based on the route
	const getPageTitle = () => {
		const path = location.pathname;

		// Handle specific map pages
		if (path.includes("/voyage-of-despair")) {
			return "Voyage of Despair";
		}
		if (path.includes("/tag-der-toten")) {
			return "Tag der Toten";
		}
		if (path.includes("/terminus")) {
			return "Terminus";
		}
		if (path.includes("/reckoning")) {
			return "Reckoning";
		}
		if (path.includes("/shattered-veil")) {
			return "Shattered Veil";
		}
		if (path.includes("/liberty-falls")) {
			return "Liberty Falls";
		}

		// Handle game selection pages
		if (path.startsWith("/bo4")) {
			const game = getGameById("bo4");
			return path === "/bo4" ? `${game.name} - Select Map` : game.name;
		}
		if (path.startsWith("/bo6")) {
			const game = getGameById("bo6");
			return path === "/bo6" ? `${game.name} - Select Map` : game.name;
		}

		// Default
		return "COD Zombies Tools";
	};

	// Get SEO-optimized document title
	const getDocumentTitle = () => {
		const path = location.pathname;
		const baseSite = "COD Zombies Tools";

		// Handle specific map pages with easter egg focus
		if (path.includes("/voyage-of-despair")) {
			return `Voyage of Despair Easter Eggs - ${baseSite}`;
		}
		if (path.includes("/tag-der-toten")) {
			return `Tag der Toten Easter Eggs - ${baseSite}`;
		}
		if (path.includes("/terminus")) {
			return `Terminus Easter Eggs - ${baseSite}`;
		}
		if (path.includes("/reckoning")) {
			return `Reckoning Easter Eggs - ${baseSite}`;
		}
		if (path.includes("/shattered-veil")) {
			return `Shattered Veil Easter Eggs - ${baseSite}`;
		}
		if (path.includes("/liberty-falls")) {
			return `Liberty Falls Easter Eggs - ${baseSite}`;
		}

		// Handle game selection pages
		if (path.startsWith("/bo4")) {
			return path === "/bo4" ? `BO4 Maps - ${baseSite}` : `BO4 Tools - ${baseSite}`;
		}
		if (path.startsWith("/bo6")) {
			return path === "/bo6" ? `BO6 Maps - ${baseSite}` : `BO6 Tools - ${baseSite}`;
		}

		// Default
		return `${baseSite} - Easter Egg Solver for BO4 & BO6`;
	};

	// Update document title when route changes
	useEffect(() => {
		document.title = getDocumentTitle();
	}, [location.pathname]);

	return (
		<div className="app">
			<header className="app-header">
				<NavBar title={getPageTitle()} />
			</header>

			<main className="app-main">
				<Routes>
					{/* Root - Game Selection */}
					<Route path="/" element={<GameSelection />} />

					{/* BO4 Routes */}
					<Route path="/bo4" element={<MapSelection gameId="bo4" />} />
					<Route
						path="/bo4/voyage-of-despair/*"
						element={<VoyageOfDespair />}
					/>
					<Route path="/bo4/tag-der-toten/*" element={<TagDerToten />} />

					{/* BO6 Routes */}
					<Route path="/bo6" element={<MapSelection gameId="bo6" />} />
					<Route path="/bo6/terminus/*" element={<Terminus />} />
					<Route path="/bo6/reckoning/*" element={<Reckoning />} />
					<Route path="/bo6/shattered-veil/*" element={<ShatteredVeil />} />
					<Route path="/bo6/liberty-falls/*" element={<LibertyFalls />} />

					{/* Legacy route redirect for existing bookmarks */}
					<Route path="/voyage-of-despair/*" element={<VoyageOfDespair />} />

					{/* 404 */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;

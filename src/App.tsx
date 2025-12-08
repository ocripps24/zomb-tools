import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PAGE_TRANSITION } from "@/utils/transitions";
import { GameSelection, MapSelection, NotFound } from "./components/pages";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import TermsAndConditions from "./components/pages/TermsAndConditions";
import Roadmap from "./components/pages/Roadmap";
import Moon from "./components/games/bo1/maps/moon/Moon";
import GorodKrovi from "./components/games/bo3/maps/gorod-krovi/GorodKrovi";
import ShadowsOfEvil from "./components/games/bo3/maps/shadows-of-evil/ShadowsOfEvil";
import VoyageOfDespair from "./components/games/bo4/maps/voyage-of-despair/VoyageOfDespair";
import TagDerToten from "./components/games/bo4/maps/tag-der-toten/TagDerToten";
import AlphaOmega from "./components/games/bo4/maps/alpha-omega/AlphaOmega";
import Classified from "./components/games/bo4/maps/classified/Classified";
import DeadOfTheNight from "./components/games/bo4/maps/dead-of-the-night/DeadOfTheNight";
import IX from "./components/games/bo4/maps/ix/IX";
import BloodOfTheDead from "./components/games/bo4/maps/blood-of-the-dead/BloodOfTheDead";
import FirebaseZ from "./components/games/bo5/maps/firebase-z/FirebaseZ";
import MauerDerToten from "./components/games/bo5/maps/mauer-der-toten/MauerDerToten";
import Terminus from "./components/games/bo6/maps/terminus/Terminus";
import Reckoning from "./components/games/bo6/maps/reckoning/Reckoning";
import ShatteredVeil from "./components/games/bo6/maps/shattered-veil/ShatteredVeil";
import LibertyFalls from "./components/games/bo6/maps/liberty-falls/LibertyFalls";
import CitadelleDesMorts from "./components/games/bo6/maps/citadelle-des-morts/CitadelleDesMorts";
import TheTomb from "./components/games/bo6/maps/the-tomb/TheTomb";
import AshesOfTheDamned from "./components/games/bo7/maps/ashes-of-the-damned/AshesOfTheDamned";
import AstraMalorum from "./components/games/bo7/maps/astra-malorum/AstraMalorum";
import DashboardList from "./components/dashboard/DashboardList";
import DashboardBuilder from "./components/dashboard/DashboardBuilder";
import DashboardView from "./components/dashboard/DashboardView";
import CookieConsentBanner from "./components/ui/CookieConsentBanner";
import { useConsent } from "./contexts/ConsentContext";
import { ROUTES, ROUTE_PATTERNS, getRouteMetadata } from "./routes";
import "./styles/main.scss";
import { NavBar, Footer } from "./components/layout/index.js";

function App() {
	const location = useLocation();
	const { resetConsent } = useConsent();

	// Get page title and document title from centralized route metadata
	const getPageTitle = () => {
		const metadata = getRouteMetadata(location.pathname);
		return metadata.title;
	};

	const getDocumentTitle = () => {
		const metadata = getRouteMetadata(location.pathname);
		return metadata.documentTitle;
	};

	// Update document title when route changes
	useEffect(() => {
		document.title = getDocumentTitle();
	}, [location.pathname]);

	// Generate a key for page transitions that ignores map step changes
	const getPageTransitionKey = () => {
		const path = location.pathname;

		// For map pages, only use the base map path (not the step)
		// e.g. "/bo6/terminus/nathan" becomes "/bo6/terminus"
		const segments = path.split("/").filter(Boolean);

		// If it's a map page with 3+ segments (game/map/step), use only first 2
		if (segments.length >= 3) {
			const gameId = segments[0];
			const mapId = segments[1];

			// Check if this is a known game/map combination
			if (
				(gameId === "bo1" ||
					gameId === "bo3" ||
					gameId === "bo4" ||
					gameId === "bo5" ||
					gameId === "bo6" ||
					gameId === "bo7") &&
				mapId
			) {
				return `/${gameId}/${mapId}`;
			}
		}

		// For all other routes, use the full path
		return path;
	};

	// Check if current route is a map page (has 3+ segments like /bo6/terminus/step)
	const isMapPage =
		location.pathname.split("/").filter(Boolean).length >= 2 &&
		(location.pathname.includes("/bo1/") ||
			location.pathname.includes("/bo3/") ||
			location.pathname.includes("/bo4/") ||
			location.pathname.includes("/bo5/") ||
			location.pathname.includes("/bo6/") ||
			location.pathname.includes("/bo7/"));

	// Extract map ID for background image
	const getMapId = () => {
		if (!isMapPage) return null;
		const segments = location.pathname.split("/").filter(Boolean);
		return segments[1] || null; // Second segment is the map ID (e.g., "moon", "terminus")
	};

	const mapId = getMapId();

	return (
		<div
			className={`app ${isMapPage ? "app--map-page" : ""}`}
			{...(mapId && { "data-map": mapId })}
		>
			<header className="app-header">
				<NavBar title={getPageTitle()} />
			</header>

			<main className="app-main">
				<AnimatePresence
					mode="wait"
					onExitComplete={() => window.scrollTo(0, 0)}
				>
					<motion.div key={getPageTransitionKey()} {...PAGE_TRANSITION}>
						<Routes location={location}>
							{/* Root - Game Selection */}
							<Route path={ROUTES.home} element={<GameSelection />} />

							{/* Info Routes */}
							<Route path={ROUTES.roadmap} element={<Roadmap />} />


							{/* Dashboard Routes */}
							<Route path={ROUTES.dashboard.base} element={<DashboardList />} />
						<Route path={ROUTES.dashboard.view(":id")} element={<DashboardView />} />
						<Route path={ROUTES.dashboard.new} element={<DashboardBuilder />} />
							{/* Legal Routes */}
							<Route path={ROUTES.privacyPolicy} element={<PrivacyPolicy />} />
							<Route
								path={ROUTES.termsAndConditions}
								element={<TermsAndConditions />}
							/>

							{/* BO1 Routes */}
							<Route
								path={ROUTES.games.bo1.base}
								element={<MapSelection gameId="bo1" />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo1.maps.moon}
								element={<Moon />}
							/>

							{/* BO3 Routes */}
							<Route
								path={ROUTES.games.bo3.base}
								element={<MapSelection gameId="bo3" />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo3.maps.gorodKrovi}
								element={<GorodKrovi />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo3.maps.shadowsOfEvil}
								element={<ShadowsOfEvil />}
							/>

							{/* BO4 Routes */}
							<Route
								path={ROUTES.games.bo4.base}
								element={<MapSelection gameId="bo4" />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo4.maps.voyageOfDespair}
								element={<VoyageOfDespair />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo4.maps.tagDerToten}
								element={<TagDerToten />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo4.maps.alphaOmega}
								element={<AlphaOmega />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo4.maps.classified}
								element={<Classified />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo4.maps.deadOfTheNight}
								element={<DeadOfTheNight />}
							/>
							<Route path={ROUTE_PATTERNS.games.bo4.maps.ix} element={<IX />} />
							<Route
								path={ROUTE_PATTERNS.games.bo4.maps.bloodOfTheDead}
								element={<BloodOfTheDead />}
							/>

							{/* BO5 Routes */}
							<Route
								path={ROUTES.games.bo5.base}
								element={<MapSelection gameId="bo5" />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo5.maps.firebaseZ}
								element={<FirebaseZ />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo5.maps.mauerDerToten}
								element={<MauerDerToten />}
							/>

							{/* BO6 Routes */}
							<Route
								path={ROUTES.games.bo6.base}
								element={<MapSelection gameId="bo6" />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo6.maps.terminus}
								element={<Terminus />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo6.maps.reckoning}
								element={<Reckoning />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo6.maps.shatteredVeil}
								element={<ShatteredVeil />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo6.maps.libertyFalls}
								element={<LibertyFalls />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo6.maps.citadelleDesMorts}
								element={<CitadelleDesMorts />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo6.maps.theTomb}
								element={<TheTomb />}
							/>

							{/* BO7 Routes */}
							<Route
								path={ROUTES.games.bo7.base}
								element={<MapSelection gameId="bo7" />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo7.maps.ashesOfTheDamned}
								element={<AshesOfTheDamned />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.bo7.maps.astraMalorum}
								element={<AstraMalorum />}
							/>

							{/* 404 */}
							<Route path="*" element={<NotFound />} />
						</Routes>
					</motion.div>
				</AnimatePresence>
			</main>

			<Footer onResetConsent={resetConsent} />

			<CookieConsentBanner />
		</div>
	);
}

export default App;

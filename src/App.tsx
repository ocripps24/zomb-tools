import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PAGE_TRANSITION } from "@/utils/transitions";
import { GameSelection, MapSelection, NotFound } from "./components/pages";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import TermsAndConditions from "./components/pages/TermsAndConditions";
import VoyageOfDespair from "./components/games/bo4/maps/voyage-of-despair/VoyageOfDespair";
import TagDerToten from "./components/games/bo4/maps/tag-der-toten/TagDerToten";
import AlphaOmega from "./components/games/bo4/maps/alpha-omega/AlphaOmega";
import Classified from "./components/games/bo4/maps/classified/Classified";
import Terminus from "./components/games/bo6/maps/terminus/Terminus";
import Reckoning from "./components/games/bo6/maps/reckoning/Reckoning";
import ShatteredVeil from "./components/games/bo6/maps/shattered-veil/ShatteredVeil";
import LibertyFalls from "./components/games/bo6/maps/liberty-falls/LibertyFalls";
import CitadelleDesMorts from "./components/games/bo6/maps/citadelle-des-morts/CitadelleDesMorts";
import CookieConsentBanner from "./components/ui/CookieConsentBanner";
import { useConsent } from "./contexts/ConsentContext";
import { getGameById } from "./data/games";
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
		const segments = path.split('/').filter(Boolean);
		
		// If it's a map page with 3+ segments (game/map/step), use only first 2
		if (segments.length >= 3) {
			const gameId = segments[0];
			const mapId = segments[1];
			
			// Check if this is a known game/map combination
			if ((gameId === 'bo4' || gameId === 'bo6') && mapId) {
				return `/${gameId}/${mapId}`;
			}
		}
		
		// For all other routes, use the full path
		return path;
	};

	return (
		<div className="app">
			<header className="app-header">
				<NavBar title={getPageTitle()} />
			</header>

			<main className="app-main">
				<AnimatePresence mode="wait">
					<motion.div
						key={getPageTransitionKey()}
						{...PAGE_TRANSITION}
					>
						<Routes location={location}>
							{/* Root - Game Selection */}
							<Route path={ROUTES.home} element={<GameSelection />} />

							{/* Legal Routes */}
							<Route path={ROUTES.privacyPolicy} element={<PrivacyPolicy />} />
							<Route path={ROUTES.termsAndConditions} element={<TermsAndConditions />} />

							{/* BO4 Routes */}
							<Route path={ROUTES.games.bo4.base} element={<MapSelection gameId="bo4" />} />
							<Route
								path={ROUTE_PATTERNS.games.bo4.maps.voyageOfDespair}
								element={<VoyageOfDespair />}
							/>
							<Route path={ROUTE_PATTERNS.games.bo4.maps.tagDerToten} element={<TagDerToten />} />
							<Route path={ROUTE_PATTERNS.games.bo4.maps.alphaOmega} element={<AlphaOmega />} />
							<Route path={ROUTE_PATTERNS.games.bo4.maps.classified} element={<Classified />} />

							{/* BO6 Routes */}
							<Route path={ROUTES.games.bo6.base} element={<MapSelection gameId="bo6" />} />
							<Route path={ROUTE_PATTERNS.games.bo6.maps.terminus} element={<Terminus />} />
							<Route path={ROUTE_PATTERNS.games.bo6.maps.reckoning} element={<Reckoning />} />
							<Route path={ROUTE_PATTERNS.games.bo6.maps.shatteredVeil} element={<ShatteredVeil />} />
							<Route path={ROUTE_PATTERNS.games.bo6.maps.libertyFalls} element={<LibertyFalls />} />
							<Route path={ROUTE_PATTERNS.games.bo6.maps.citadelleDesMorts} element={<CitadelleDesMorts />} />

							{/* Legacy route redirect for existing bookmarks */}
							<Route path={ROUTE_PATTERNS.legacy.voyageOfDespair} element={<VoyageOfDespair />} />

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

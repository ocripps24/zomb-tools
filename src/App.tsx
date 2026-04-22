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
import ShaolinShuffle from "./components/games/iw/maps/shaolin-shuffle/ShaolinShuffle";
import AttackOfTheRadioactiveThing from "./components/games/iw/maps/attack-of-the-radioactive-thing/AttackOfTheRadioactiveThing";
import AshesOfTheDamned from "./components/games/bo7/maps/ashes-of-the-damned/AshesOfTheDamned";
import AstraMalorum from "./components/games/bo7/maps/astra-malorum/AstraMalorum";
import ParadoxJunction from "./components/games/bo7/maps/paradox-junction/ParadoxJunction";
import DashboardList from "./components/dashboard/DashboardList";
import DashboardBuilder from "./components/dashboard/DashboardBuilder";
import DashboardView from "./components/dashboard/DashboardView";
import DashboardEditor from "./components/dashboard/DashboardEditor";
import CookieConsentBanner from "./components/ui/CookieConsentBanner";
import GlobalSettings from "./components/ui/GlobalSettings";
import { useConsent } from "./contexts/ConsentContext";
import {
	ROUTES,
	ROUTE_PATTERNS,
	getRouteMetadata,
	getGameIdFromPath,
} from "./routes";
import "./styles/main.scss";
import { NavBar, Footer } from "./components/layout";

function App() {
	const location = useLocation();
	const { resetConsent } = useConsent();

	useEffect(() => {
		document.title = getRouteMetadata(location.pathname).documentTitle;
	}, [location.pathname]);

	const getPageTransitionKey = () => {
		const segments = location.pathname.split("/").filter(Boolean);
		if (segments.length >= 3 && getGameIdFromPath(location.pathname)) {
			return `/${segments[0]}/${segments[1]}`;
		}
		return location.pathname;
	};

	const segments = location.pathname.split("/").filter(Boolean);
	const isMapPage =
		segments.length >= 2 && getGameIdFromPath(location.pathname) !== null;

	const isDashboardView =
		location.pathname.startsWith("/dashboard/") &&
		!location.pathname.startsWith("/dashboard/new") &&
		location.pathname !== "/dashboard" &&
		location.pathname !== "/dashboard/";

	const showSettings = isMapPage || isDashboardView;
	const mapId = isMapPage ? segments[1] : null;

	return (
		<div
			className={`app ${isMapPage ? "app--map-page" : ""}`}
			{...(mapId && { "data-map": mapId })}
		>
			<header className="app-header">
				<NavBar />
			</header>

			<main className="app-main">
				<AnimatePresence
					mode="wait"
					onExitComplete={() => window.scrollTo(0, 0)}
				>
					<motion.div key={getPageTransitionKey()} {...PAGE_TRANSITION}>
						<Routes location={location}>
							{/* Root */}
							<Route path={ROUTES.home} element={<GameSelection />} />

							{/* Info Routes */}
							<Route path={ROUTES.roadmap} element={<Roadmap />} />

							{/* Dashboard Routes */}
							<Route path={ROUTES.dashboard.base} element={<DashboardList />} />
							<Route
								path={ROUTES.dashboard.new}
								element={<DashboardBuilder />}
							/>
							<Route
								path={ROUTES.dashboard.view(":id")}
								element={<DashboardView />}
							/>
							<Route
								path={ROUTES.dashboard.edit(":id")}
								element={<DashboardEditor />}
							/>

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

							{/* IW Routes */}
							<Route
								path={ROUTES.games.iw.base}
								element={<MapSelection gameId="iw" />}
							/>
							<Route
								path={ROUTE_PATTERNS.games.iw.maps.shaolinShuffle}
								element={<ShaolinShuffle />}
							/>
							<Route
								path={
									ROUTE_PATTERNS.games.iw.maps
										.attackOfTheRadioactiveThing
								}
								element={<AttackOfTheRadioactiveThing />}
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
							<Route
								path={ROUTE_PATTERNS.games.bo7.maps.paradoxJunction}
								element={<ParadoxJunction />}
							/>

							{/* 404 */}
							<Route path="*" element={<NotFound />} />
						</Routes>
					</motion.div>
				</AnimatePresence>
			</main>

			<Footer onResetConsent={resetConsent} />

			{showSettings && <GlobalSettings />}
			<CookieConsentBanner />
		</div>
	);
}

export default App;

import { Link } from "react-router-dom";
import { ROUTES } from "@/routes";

const HeroFooterGrid = () => {
	// Quick links to game pages
	const gameLinks = [
		{ name: "Black Ops 3", route: ROUTES.games.bo3.base },
		{ name: "Black Ops 4", route: ROUTES.games.bo4.base },
		{ name: "Black Ops 6", route: ROUTES.games.bo6.base },
		{ name: "Black Ops 7", route: ROUTES.games.bo7.base },
	];

	// Featured map links
	const mapLinks = [
		{ name: "Reckoning", route: ROUTES.games.bo6.maps.reckoning },
		{ name: "Terminus", route: ROUTES.games.bo6.maps.terminus },
		{ name: "Tag der Toten", route: ROUTES.games.bo4.maps.tagDerToten },
		{ name: "Gorod Krovi", route: ROUTES.games.bo3.maps.gorodKrovi },
	];

	return (
		<div className="hero-footer-grid">
			{/* About Section */}
			<div className="hero-footer-grid__section">
				<h3 className="hero-footer-grid__label">About</h3>
				<div className="hero-footer-grid__content">
					<p>
						Tools to help you complete Easter Egg steps across the COD Zombies
						franchise. This site is under active development with new maps and
						features being added regularly.
					</p>
				</div>
			</div>

			{/* Quick Links Section */}
			<div className="hero-footer-grid__section hero-footer-grid__section--desktop-only">
				<h3 className="hero-footer-grid__label">Games</h3>
				<div className="hero-footer-grid__content">
					<ul className="hero-footer-grid__links">
						{gameLinks.map((link) => (
							<li key={link.route}>
								<Link to={link.route} data-text={link.name}>
									<span>{link.name}</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* Featured Maps Section */}
			<div className="hero-footer-grid__section hero-footer-grid__section--desktop-only">
				<h3 className="hero-footer-grid__label">Featured Maps</h3>
				<div className="hero-footer-grid__content">
					<ul className="hero-footer-grid__links">
						{mapLinks.map((link) => (
							<li key={link.route}>
								<Link to={link.route} data-text={link.name}>
									<span>{link.name}</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default HeroFooterGrid;

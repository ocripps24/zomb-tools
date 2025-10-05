import { Link } from "react-router-dom";
import { GAMES } from "@/data/games";
import { BO3_MAPS } from "@/data/bo3/maps";
import { BO4_MAPS } from "@/data/bo4/maps";
import { BO6_MAPS } from "@/data/bo6/maps";
import { BO7_MAPS } from "@/data/bo7/maps";

interface FooterProps {
	onResetConsent: () => void;
}

function Footer({ onResetConsent }: FooterProps) {
	// Get available maps for each game
	const getGameMaps = (gameId: string) => {
		switch (gameId) {
			case "bo3":
				return BO3_MAPS.filter((map) => map.available);
			case "bo4":
				return BO4_MAPS.filter((map) => map.available);
			case "bo6":
				return BO6_MAPS.filter((map) => map.available);
			case "bo7":
				return BO7_MAPS.filter((map) => map.available);
			default:
				return [];
		}
	};

	const availableGames = Object.values(GAMES).filter((game) => game.available);

	return (
		<footer className="site-footer">
			<div className="footer-content">
				{/* Navigation Section */}
				<div className="footer-nav">
					<h3>Quick Navigation</h3>
					<div className="nav-columns">
						{availableGames.map((game) => {
							const gameMaps = getGameMaps(game.id);
							return (
								<div key={game.id} className="nav-column">
									<h4>
										<Link to={game.route!} className="game-link">
											{game.name}
										</Link>
									</h4>
									{gameMaps.length > 0 && (
										<ul className="map-list">
											{gameMaps.map((map) => (
												<li key={map.id}>
													<Link to={map.route} className="map-link">
														{map.name}
													</Link>
												</li>
											))}
										</ul>
									)}
								</div>
							);
						})}
					</div>
				</div>

				{/* Copyright Section */}
				<div className="footer-legal">
					<div className="copyright">
						<p>&copy; 2025 Zomb Tools</p>
						<div className="legal-links">
							<Link to="/privacy-policy" className="legal-link">
								Privacy Policy
							</Link>
							<span className="separator">•</span>
							<Link to="/terms-and-conditions" className="legal-link">
								Terms & Conditions
							</Link>
							<span className="separator">•</span>
							<button
								onClick={onResetConsent}
								className="legal-link consent-link"
								type="button"
							>
								Manage Consent
							</button>
						</div>
					</div>
					<div className="disclaimer">
						<p>
							This website is an independent, unofficial Call of Duty Zombies
							fan site. It is not affiliated with or endorsed by Activision
							Blizzard. All trademarks, service marks, trade names, trade dress,
							product names, and logos appearing on this site are the property
							of their respective owners.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;

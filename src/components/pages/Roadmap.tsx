import GlassHero from "@/components/ui/GlassHero";
// import beamsImage from "@/assets/images/beams-bkg-v2.png";
import beamsImage from "@/assets/images/bo7-cover-art.jpg";

interface RoadmapEntry {
	date: string;
	items: string[];
}

// Roadmap data - organized chronologically (newest first)
const ROADMAP_DATA: RoadmapEntry[] = [
	{
		date: "November 2025",
		items: [
			"Expecting to add Dead of the Night support",
			"BO4: Planning to add Blood of the Dead",
			"BO7: Planning to add Ashes of the Damned",
		],
	},
	{
		date: "October 2025",
		items: [
			"Major design overhaul alongside further architectural improvements",
			"BO3: Added Shadows of Evil, Gorod Krovi with other maps under review",
			"BO4: Planning to add Dead of the Night, IX",
			"BO6: Added The Tomb",
			"Compact mode UI upgrades",
		],
	},
	{
		date: "September 2025",
		items: [
			"Launched Reckoning map tools",
			"BO4: Added Alpha Omega, Classified",
			"BO6: Added Liberty Falls",
			"BO7: Added Ashes of the Damned placeholder",
			"Various map upgrades and extensions",
		],
	},
	{
		date: "August 2025",
		items: [
			"Second design iteration with major architecture and component upgrades",
			"BO4: Added Tag der Toten",
			"BO6: Added Citadelle des Morts, Reckoning, Shattered Veil",
			"Improved code validation across all maps",
		],
	},
	{
		date: "July 2025",
		items: [
			"Initial site beta with support for Voyage of Despair",
			"Added Terminus",
			"Architecture upgrades",
		],
	},
];

function Roadmap() {
	return (
		<>
			<div className="roadmap__hero">
				{/* Full-viewport background with fluted glass effect */}
				<GlassHero
					imageSrc={beamsImage}
					glassIntensity={25}
					glassSegments={30}
					glassMode="mouse"
					glassMotion={0.75}
				/>
			</div>

			<div className="roadmap">
				<div className="roadmap__container">
					<div className="roadmap__card">
						<h1 className="roadmap__title">Development Roadmap</h1>
						<p className="roadmap__description">
							Track our progress and see what's coming next for Zomb Tools. This
							page is updated regularly with new features, map additions, and
							improvements.
						</p>

						<div className="roadmap__timeline">
							{ROADMAP_DATA.map((entry, index) => (
								<div key={index} className="roadmap__entry">
									<h2 className="roadmap__date">{entry.date}</h2>
									<ul className="roadmap__items">
										{entry.items.map((item, itemIndex) => (
											<li key={itemIndex} className="roadmap__item">
												{item}
											</li>
										))}
									</ul>
								</div>
							))}
						</div>

						<div className="roadmap__footer">
							<p>
								Have suggestions or requests?{" "}
								<a
									href="https://github.com/ocripps24/zomb-tools/issues"
									target="_blank"
									rel="noopener noreferrer"
									className="roadmap__link"
								>
									Let us know on GitHub
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Roadmap;

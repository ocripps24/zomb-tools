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
		date: "Comments",
		items: [
			"Speedruns: the tools are not targeted to a specific player group, however, the UI toggles available at the bottom of each section contain: standard mode for more casual players and compact mode for speedrunners. Tools will be reviewed and refined for optimisations where possible. Feel free to provide specific feedback  via the Github issues page (link at bottom).",
			"Content: The original purpose was just to provide solver tools but I do not rule out extending the content scope to interactive maps, full guides, etc",
			"Devices: The site is designed for desktop but features a responsive design. Fixes and further UI improvements for smaller screens and mobile devices are planned",
		],
	},
	{
		date: "2026",
		items: [
			"BO7: Planning to add all future DLCs",
			"BO2: Potential to add Die Rise, Buried",
			"IW: Development in progress",
			"AW/WW2: I'm unfamiliar with these games but they will be reviewed in the fullness of time",
		],
	},
	{
		date: "April 2026",
		items: [
			"IW: Added IW starting with Shaolin Shuffle - Morse code and Rooftop Symbol sections",
			"It's my first time playing through IW Zombies so please feel free to provide feedback on the tools via the Github issues page (link at bottom) as you explore the maps. Planning to add Attack of the Radioactive Thing and Beast from Beyond as I play through them.",
			"UI: Various UI improvements like easy close for settings panel",
		],
	},
	{
		date: "March 2026",
		items: [
			"BO7: Added Paradox Junction",
			"UI: Added functionality to rename locations for the piano notes in Paradox Junction.",
			"UI: Slight increase in max-width for map sections to allow for better use of space on larger screens",
		],
	},
	{
		date: "December 2025",
		items: [
			"BO7: Added Astra Malorum",
			"UI: Moved the Map Navigation to the top for easier access as some people weren't noticing it at the bottom 🤪",
			"Feature: Dashboard system that enables the creation of custom views so multiple map sections from multiple maps can be shown on a single page. This should help with speedruns and especially Supers.",
			"Feature: Settings have been unified into a context-aware global settings widget that will control settings across all sections and maps.",
		],
	},
	{
		date: "November 2025",
		items: [
			"BO4: Added Blood of the Dead",
			"BO7: Added Ashes of the Damned",
			"UI: Planning to tweak some UI elements to be more consistent 🤪",
		],
	},
	{
		date: "October 2025",
		items: [
			"Design: Major design overhaul alongside further architectural improvements",
			"BO1: Added Moon with a Samantha Says tool",
			"BO3: Added Shadows of Evil and Gorod Krovi with other maps under review",
			"BO4: Added IX and Dead of the Night (further updates planned)",
			"BO5: Added Firebase Z and Mauer der Toten",
			"BO6: Added The Tomb",
			"UI: Compact mode UI upgrades",
		],
	},
	{
		date: "September 2025",
		items: [
			"App: Significant architecture improvements for better performance and maintainability",
			"BO4: Added Alpha Omega, Classified",
			"BO6: Added Reckoning, Liberty Falls",
			"BO7: Added Ashes of the Damned placeholder",
			"Misc: Various map upgrades and extensions",
		],
	},
	{
		date: "August 2025",
		items: [
			"Design: Second design iteration with major architecture and component upgrades",
			"BO4: Added Tag der Toten",
			"BO6: Added Citadelle des Morts, Reckoning, Shattered Veil",
			"Misc: Improved code validation across all maps",
		],
	},
	{
		date: "July 2025",
		items: [
			"Launch: beta launch of Zomb Tools",
			"BO4: Added Voyage of Despair",
			"BO6: Added Terminus",
			"App: Architecture upgrades",
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

import { useNavigate } from "react-router-dom";
import GameSelectionCard from "./GameSelectionCard";
import SettingsInfoPanel from "@/components/ui/SettingsInfoPanel";
import VideoHero from "@/components/ui/VideoHero";
import { GAMES } from "@/data/games";

// Vite dynamic import for all game logos - supports multiple formats
const logosWebp = import.meta.glob("@/assets/games/*-logo.webp", {
	eager: true,
	import: "default",
});

const logosJpg = import.meta.glob("@/assets/games/*-logo.jpg", {
	eager: true,
	import: "default",
});

const logosPng = import.meta.glob("@/assets/games/*-logo.png", {
	eager: true,
	import: "default",
});

const getLogo = (id: string): string | null => {
	// Priority order: WebP > JPG > PNG (WebP is most efficient)
	const formats = [
		{ ext: "webp", logos: logosWebp },
		{ ext: "jpg", logos: logosJpg },
		{ ext: "png", logos: logosPng },
	];

	for (const format of formats) {
		const match = Object.entries(format.logos).find(([path]) =>
			path.includes(`/${id}-logo.${format.ext}`)
		);
		if (match) {
			return match[1] as string;
		}
	}

	return null;
};

function GameSelection() {
	const allGames = (Object.values(GAMES) as Array<{
		id: string;
		name: string;
		fullName: string;
		description: string;
		available: boolean;
		releaseYear: number;
		route: string | null;
	}>).sort((a, b) => b.releaseYear - a.releaseYear);
	const navigate = useNavigate();

	return (
		<>
			{/* Full-viewport background video */}
			<VideoHero videoId="07SF99EeZ1M" />

			<div className="game-selection">
				<h2 className="game-selection__title">Select a Game</h2>
				{/* <p className="game-selection__subtitle">
					Choose which Call of Duty Zombies game you want to access speedrun tools
					for.
				</p> */}
				<div className="game-selection__grid">
					{allGames.map((game) => (
						<GameSelectionCard
							key={game.id}
							image={getLogo(game.id)}
							label={game.name}
							onClick={
								game.available && game.route
									? () => navigate(game.route!)
									: undefined
							}
							disabled={!game.available}
						/>
					))}
				</div>

				{/* Settings Information Section */}
				<SettingsInfoPanel />
			</div>
		</>
	);
}

export default GameSelection;

import { useNavigate } from "react-router-dom";
import MapSelectionCard from "./MapSelectionCard";
import SettingsInfoPanel from "@/components/ui/SettingsInfoPanel";
import { getGameById } from "@/data/games";
import { BO3_MAPS, type BO3Map } from "@/data/bo3/maps";
import { BO4_MAPS, type BO4Map } from "@/data/bo4/maps";
import { BO6_MAPS, type BO6Map } from "@/data/bo6/maps";
import { BO7_MAPS, type BO7Map } from "@/data/bo7/maps";
import { ROUTES } from "@/routes";

// Vite dynamic import for all map preview images - supports multiple formats
const previewsWebp = import.meta.glob("@/assets/maps/*/*-preview.webp", {
	eager: true,
	import: "default",
});

const previewsJpg = import.meta.glob("@/assets/maps/*/*-preview.jpg", {
	eager: true,
	import: "default",
});

const previewsPng = import.meta.glob("../../assets/maps/*/*-preview.png", {
	eager: true,
	import: "default",
});

const getPreview = (gameId: string, mapId: string): string | null => {
	// Priority order: WebP > JPG > PNG (WebP is most efficient)
	const formats = [
		{ ext: "webp", previews: previewsWebp },
		{ ext: "jpg", previews: previewsJpg },
		{ ext: "png", previews: previewsPng },
	];

	for (const format of formats) {
		const match = Object.entries(format.previews).find(([path]) =>
			path.includes(`/${gameId}/${mapId}-preview.${format.ext}`)
		);
		if (match) {
			return match[1] as string;
		}
	}

	return null;
};

const getMapsByGame = (gameId: string): (BO3Map | BO4Map | BO6Map | BO7Map)[] => {
	switch (gameId) {
		case "bo3":
			return BO3_MAPS;
		case "bo4":
			return BO4_MAPS;
		case "bo6":
			return BO6_MAPS;
		case "bo7":
			return BO7_MAPS;
		default:
			return [];
	}
};

interface MapSelectionProps {
	gameId: string;
}

function MapSelection({ gameId }: MapSelectionProps) {
	const game = getGameById(gameId);
	const maps = getMapsByGame(gameId);
	const navigate = useNavigate();

	if (!game) {
		return (
			<MapSelectionCard 
				label="Game Not Found"
				image={null}
				onClick={() => {}}
				style={{}}
				status="The requested game could not be found."
			/>
		);
	}

	return (
		<div className="map-selection">
			<button
				className="btn btn--secondary"
				onClick={() => navigate(ROUTES.home)}
				style={{ marginBottom: "2rem" }}
			>
				← Back to Games
			</button>
			<h2 className="map-selection__title">Select a {game.name} Map</h2>
			{/* <p className="map-selection__subtitle">
				Choose which {game.name} Zombies map you want to access speedrun tools
				for.
			</p> */}
			<div className="map-selection__grid">
				{maps.map((map) => (
					<MapSelectionCard
						key={map.id}
						image={getPreview(gameId, map.id)}
						label={map.name}
						onClick={map.available ? () => navigate(map.route) : undefined}
						style={{ opacity: map.available ? 1 : 0.5 }}
						tools={map.tools}
						status={map.status}
						available={map.available}
					/>
				))}
			</div>

			{/* Settings Information Section */}
			<SettingsInfoPanel />
		</div>
	);
}

export default MapSelection;

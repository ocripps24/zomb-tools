import { useNavigate } from "react-router-dom";
import MapSelectionCard from "./MapSelectionCard";
import SettingsInfoPanel from "@/components/ui/SettingsInfoPanel";
import { getGameById } from "@/data/games";
import { BO1_MAPS, type BO1Map } from "@/data/bo1/maps";
import { BO2_MAPS, type BO2Map } from "@/data/bo2/maps";
import { BO3_MAPS, type BO3Map } from "@/data/bo3/maps";
import { BO4_MAPS, type BO4Map } from "@/data/bo4/maps";
import { BO5_MAPS, type BO5Map } from "@/data/bo5/maps";
import { BO6_MAPS, type BO6Map } from "@/data/bo6/maps";
import { BO7_MAPS, type BO7Map } from "@/data/bo7/maps";
import { IW_MAPS, type IWMap } from "@/data/iw/maps";
import GlassHero from "@/components/ui/GlassHero";
import beamsImage from "@/assets/images/beams-bkg-v2.png";

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

const getMapsByGame = (
	gameId: string
): (BO1Map | BO2Map | BO3Map | BO4Map | BO5Map | BO6Map | BO7Map | IWMap)[] => {
	switch (gameId) {
		case "bo1":
			return BO1_MAPS;
		case "bo2":
			return BO2_MAPS;
		case "bo3":
			return BO3_MAPS;
		case "bo4":
			return BO4_MAPS;
		case "bo5":
			return BO5_MAPS;
		case "bo6":
			return BO6_MAPS;
		case "bo7":
			return BO7_MAPS;
		case "iw":
			return IW_MAPS;
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
		<>
			{/* Full-viewport background image with fluted glass effect */}
			<GlassHero
				imageSrc={beamsImage}
				glassIntensity={50}
				glassSegments={60}
				glassMode="mouse"
				glassMotion={0.75}
				fixed={true}
			/>

			<div className={`map-selection map-selection--${gameId}`}>
				<div className="map-selection__header">
					<h2 className="map-selection__title">{game.name}</h2>
				</div>
				<div className="map-selection__grid">
					{maps.map((map) => (
						<MapSelectionCard
							key={map.id}
							image={getPreview(gameId, map.id)}
							label={map.name}
							onClick={map.available ? () => navigate(map.route) : undefined}
							// style={{ opacity: map.available ? 1 : 0.5 }}
							tools={map.tools}
							status={map.status}
							available={map.available}
							beta={"beta" in map ? map.beta : undefined}
						/>
					))}
				</div>

				{/* Settings Information Section */}
				<SettingsInfoPanel />
			</div>
		</>
	);
}

export default MapSelection;

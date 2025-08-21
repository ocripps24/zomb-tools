import React from "react";
import { useNavigate } from "react-router-dom";
import MapSelectionCard from "./MapSelectionCard";
import { getGameById } from "@/data/games";
import { BO4_MAPS } from "@/data/bo4/maps";
import { BO6_MAPS } from "@/data/bo6/maps";
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

const getPreview = (gameId, mapId) => {
	// Priority order: WebP > JPG > PNG (WebP is most efficient)
	const formats = [
		{ ext: 'webp', previews: previewsWebp },
		{ ext: 'jpg', previews: previewsJpg },
		{ ext: 'png', previews: previewsPng }
	];

	for (const format of formats) {
		const match = Object.entries(format.previews).find(([path]) =>
			path.includes(`/${gameId}/${mapId}-preview.${format.ext}`)
		);
		if (match) {
			return match[1];
		}
	}

	return null;
};

const getMapsByGame = (gameId) => {
	switch (gameId) {
		case "bo4":
			return BO4_MAPS;
		case "bo6":
			return BO6_MAPS;
		default:
			return [];
	}
};

function MapSelection({ gameId }) {
	const game = getGameById(gameId);
	const maps = getMapsByGame(gameId);
	const navigate = useNavigate();

	if (!game) {
		return (
			<MapSelectionCard label="Game Not Found">
				<div className="card__content">
					The requested game could not be found.
				</div>
			</MapSelectionCard>
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
			<p className="map-selection__subtitle">
				Choose which {game.name} Zombies map you want to access speedrun tools
				for.
			</p>
			<div className="map-selection__grid">
				{maps.map((map) => (
					<MapSelectionCard
						key={map.id}
						image={getPreview(gameId, map.id)}
						label={map.name}
						onClick={map.available ? () => navigate(map.route) : undefined}
						style={{ opacity: map.available ? 1 : 0.5 }}
					>
						<div className="card__content">{map.status}</div>
						{map.tools && map.tools.length > 0 && (
							<div
								className="card__content"
								style={{ fontSize: "0.9em", marginTop: "0.5em" }}
							>
								<strong>Tools:</strong> {map.tools.join(", ")}
							</div>
						)}
						{!map.available && (
							<button
								className="btn btn--secondary"
								disabled
								style={{ marginTop: "1.5rem", width: "100%" }}
							>
								Coming Soon
							</button>
						)}
					</MapSelectionCard>
				))}
			</div>
		</div>
	);
}

export default MapSelection;

import React from "react";
import { useNavigate } from "react-router-dom";
import FloatingCard from "./common/FloatingCard";
import Button from "./common/Button";
import { getGameById } from "../data/games";
import { BO4_MAPS } from "../data/bo4/maps";
import { BO6_MAPS } from "../data/bo6/maps";

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
			<FloatingCard>
				<div className="card__header">
					<div className="card__title">Game Not Found</div>
				</div>
				<div className="card__content">
					The requested game could not be found.
				</div>
				<Button variantType="primary" onClick={() => navigate("/")}>
					← Back to Game Selection
				</Button>
			</FloatingCard>
		);
	}

	return (
		<div className="map-selection">
			<Button
				variantType="secondary"
				onClick={() => navigate("/")}
				style={{ marginBottom: "2rem" }}
			>
				← Back to Games
			</Button>
			<h2 className="map-selection__title">Select a {game.name} Map</h2>
			<p className="map-selection__subtitle">
				Choose which {game.name} Zombies map you want to access speedrun tools
				for.
			</p>
			<div className="map-selection__grid">
				{maps.map((map) => (
					<FloatingCard
						key={map.id}
						style={{ opacity: map.available ? 1 : 0.5 }}
					>
						<div className="card__header">
							<div className="card__title">{map.name}</div>
						</div>
						<div className="card__content">{map.status}</div>
						{map.tools && map.tools.length > 0 && (
							<div
								className="card__content"
								style={{ fontSize: "0.9em", marginTop: "0.5em" }}
							>
								<strong>Tools:</strong> {map.tools.join(", ")}
							</div>
						)}
						{map.available ? (
							<Button
								fullWidth
								variantType="primary"
								onClick={() => navigate(map.route)}
								style={{ marginTop: "1.5rem" }}
							>
								Open {map.name}
							</Button>
						) : (
							<Button
								fullWidth
								variantType="secondary"
								disabled
								style={{ marginTop: "1.5rem" }}
							>
								Coming Soon
							</Button>
						)}
					</FloatingCard>
				))}
			</div>
		</div>
	);
}

export default MapSelection;

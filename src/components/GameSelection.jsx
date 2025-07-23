import React from "react";
import { useNavigate } from "react-router-dom";
import FloatingCard from "./common/FloatingCard";
import Button from "./common/Button";
import { getAvailableGames } from "../data/games";

function GameSelection() {
	const availableGames = getAvailableGames();
	const navigate = useNavigate();

	return (
		<div className="game-selection">
			<h2 className="game-selection__title">Select a Game</h2>
			<p className="game-selection__subtitle">
				Choose which Call of Duty Zombies game you want to access speedrun tools
				for.
			</p>
			<div className="game-selection__grid">
				{availableGames.map((game) => (
					<FloatingCard
						key={game.id}
						interactive
						onClick={() => navigate(game.route)}
					>
						<div className="card__header">
							<div className="card__title">{game.name}</div>
						</div>
						<div className="card__content">{game.description}</div>
						<Button
							fullWidth
							variantType="primary"
							style={{ marginTop: "1.5rem" }}
						>
							Explore {game.name}
						</Button>
					</FloatingCard>
				))}
			</div>
		</div>
	);
}

export default GameSelection;

import React from "react";
import { useNavigate } from "react-router-dom";
import GameSelectionCard from "./GameSelectionCard";
import { getAvailableGames } from "../../data/games";

// Vite dynamic import for all game logos
const logos = import.meta.glob("../../assets/games/*-logo.png", {
	eager: true,
	import: "default",
});

const getLogo = (id) => {
	const match = Object.entries(logos).find(([path]) =>
		path.includes(`/${id}-logo.png`)
	);
	return match ? match[1] : null;
};

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
					<GameSelectionCard
						key={game.id}
						image={getLogo(game.id)}
						label={game.name}
						onClick={() => navigate(game.route)}
					/>
				))}
			</div>
		</div>
	);
}

export default GameSelection;

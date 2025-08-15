import React from "react";
import { Link } from "react-router-dom";

interface MapNavigationProps {
	backTo: string;
	settingsPath: string;
	onReset: () => void;
}

const MapNavigation: React.FC<MapNavigationProps> = ({
	backTo,
	settingsPath,
	onReset,
}) => {
	const handleReset = () => {
		if (
			window.confirm(
				"Are you sure you want to reset all data? This cannot be undone."
			)
		) {
			onReset();
		}
	};

	// Extract game name from backTo path for display
	const getGameName = (path: string) => {
		if (!path || typeof path !== "string") {
			console.warn("MapNavigation: backTo prop is invalid:", path);
			return "Game";
		}

		const pathParts = path.split("/");
		const gameId = pathParts[1]; // Extract "bo4" from "/bo4"

		if (!gameId) {
			console.warn("MapNavigation: Could not extract game ID from path:", path);
			return "Game";
		}

		return gameId.toUpperCase();
	};

	// Ensure we have valid props
	if (!backTo || !settingsPath) {
		console.error("MapNavigation: Missing required props:", {
			backTo,
			settingsPath,
		});
		return (
			<div className="map-nav">
				<div className="btn btn-secondary">Navigation Error</div>
			</div>
		);
	}

	return (
		<div className="map-nav">
			<Link to={backTo} className="btn btn-secondary">
				<span className="btn-text">← Back to {getGameName(backTo)} Maps</span>
			</Link>
			<div className="nav-right">
				<Link to={settingsPath} className="btn btn-secondary settings-btn">
					<span className="btn-text">⚙️ Options</span>
				</Link>
				<button onClick={handleReset} className="btn btn-secondary reset-btn">
					<span className="btn-text">🗑️ Reset All Data</span>
				</button>
			</div>
		</div>
	);
};

export default MapNavigation;

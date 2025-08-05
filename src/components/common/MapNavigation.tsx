import React from "react";
import { Link, useLocation } from "react-router-dom";

interface MapNavigationProps {
	gameId: string;
	mapId: string;
	onReset: () => void;
	settingsPath: string;
	currentPath: string;
}

const MapNavigation: React.FC<MapNavigationProps> = ({
	gameId,
	mapId,
	onReset,
	settingsPath,
	currentPath,
}) => {
	const location = useLocation();

	const handleReset = () => {
		if (
			window.confirm(
				"Are you sure you want to reset all data? This cannot be undone."
			)
		) {
			onReset();
		}
	};

	return (
		<div className="map-nav">
			<Link to={`/${gameId}`} className="btn btn-secondary">
				<span className="btn-text">← Back to {gameId.toUpperCase()} Maps</span>
				<span className="btn-icon">←</span>
			</Link>
			<div className="nav-right">
				<Link
					to={settingsPath}
					state={{ returnTo: currentPath }}
					className="btn btn-secondary settings-btn"
				>
					<span className="btn-text">⚙️ Options</span>
					<span className="btn-icon">⚙️</span>
				</Link>
				<button onClick={handleReset} className="btn btn-secondary reset-btn">
					<span className="btn-text">🗑️ Reset All Data</span>
					<span className="btn-icon">🗑️</span>
				</button>
			</div>
		</div>
	);
};

export default MapNavigation;

import React from "react";
import { Link } from "react-router-dom";
import YouTubeIcon from "@/assets/icons/youtube-icon.svg";

interface Guide {
	url: string;
	type: "internal" | "external";
	channelName?: string;
}

interface MapNavigationProps {
	backTo: string;
	onReset: () => void;
	guide?: Guide; // Optional YouTube guide configuration
}

const MapNavigation: React.FC<MapNavigationProps> = ({
	backTo,
	onReset,
	guide,
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

	const scrollToGuide = () => {
		const guideElement = document.getElementById("youtube-guide-section");
		if (guideElement) {
			guideElement.scrollIntoView({ behavior: "smooth" });
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
	if (!backTo) {
		console.error("MapNavigation: Missing required props:", {
			backTo,
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
				<span className="btn-text">← {getGameName(backTo)} Maps</span>
			</Link>
			<div className="nav-right">
				{guide && (
					<button
						onClick={scrollToGuide}
						className="btn btn-secondary guide-btn"
					>
						<span className="btn-icon">
							<YouTubeIcon />
						</span>
					</button>
				)}
				<button onClick={handleReset} className="btn btn-secondary reset-btn">
					<span className="btn-icon">🗑️</span>
					<span className="btn-text">Reset All Data</span>
				</button>
			</div>
		</div>
	);
};

export default MapNavigation;

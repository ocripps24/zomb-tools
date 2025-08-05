import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import FloatingCard from "./FloatingCard";

interface SettingsPageProps {
	mapId: string;
	gameId: string;
	children?: React.ReactNode;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
	mapId,
	gameId,
	children,
}) => {
	const location = useLocation();

	// Determine return path based on navigation state or fallback
	const getReturnPath = () => {
		// First, try to use the state passed from navigation
		if (location.state?.returnTo) {
			return location.state.returnTo;
		}

		// Fallback: try document.referrer
		const referrer = document.referrer;
		const currentOrigin = window.location.origin;

		if (referrer && referrer.startsWith(currentOrigin)) {
			const referrerPath = referrer.replace(currentOrigin, "");
			// If it's a map page but not settings, return there
			if (
				(referrerPath.startsWith(`/${gameId}/${mapId}`) ||
					referrerPath.startsWith(`/${mapId}`)) &&
				!referrerPath.includes("/settings")
			) {
				return referrerPath;
			}
		}

		// Final fallback to map root
		return `/${gameId}/${mapId}`;
	};

	const returnPath = getReturnPath();

	return (
		<FloatingCard>
			<div className="settings-page">
				<div className="settings-header">
					<h2>Settings</h2>
					<Link to={returnPath} className="btn btn-secondary">
						← Back
					</Link>
				</div>

				<div className="settings-content">
					{children || <p>No specific settings available for this map.</p>}
				</div>
			</div>
		</FloatingCard>
	);
};

export default SettingsPage;

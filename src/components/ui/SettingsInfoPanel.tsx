import React from 'react';

/**
 * Reusable settings information panel that explains available customization options.
 * Used on game selection and map selection pages to inform users about settings features.
 */
function SettingsInfoPanel() {
	return (
		<div className="settings-info">
			<h4>Settings & Customization</h4>
			<p className="settings-info__description">
				Many map sections include settings panels at the bottom to customize
				your experience:
			</p>
			<div className="settings-info__features">
				<div className="settings-feature">
					<strong>Input Formats:</strong> Choose between button-based input
					and text entry fields for different data types.
				</div>
				<div className="settings-feature">
					<strong>UI Size:</strong> Switch between Standard and Compact modes.
					Compact mode reduces spacing and padding for a denser layout
					preferred by speedrunners.
				</div>
			</div>
			<p className="settings-info__note">
				<strong>Notes:</strong>
				<br />
				1. Compact UI is currently experimental and is gradually being rolled
				out across maps.
				<br />
				2. The site is optimized for desktop layouts with varying degrees of
				responsive design for smaller devices.
			</p>
		</div>
	);
}

export default SettingsInfoPanel;
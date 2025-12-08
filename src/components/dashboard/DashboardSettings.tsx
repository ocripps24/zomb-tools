import { useState } from "react";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

/**
 * Floating settings widget for dashboard view
 * Controls global UI density setting for all sections
 */
export default function DashboardSettings() {
	const { settings, updateSetting } = useGlobalSettings();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="dashboard-settings">
			<button
				className="dashboard-settings__toggle"
				onClick={() => setIsOpen(!isOpen)}
				aria-label="Dashboard Settings"
				aria-expanded={isOpen}
			>
				<span className="settings-icon">⚙</span>
				<span className="settings-label">Settings</span>
			</button>

			{isOpen && (
				<div className="dashboard-settings__panel">
					<div className="dashboard-settings__header">
						<h3>Dashboard Settings</h3>
						<button
							className="dashboard-settings__close"
							onClick={() => setIsOpen(false)}
							aria-label="Close settings"
						>
							✕
						</button>
					</div>

					<div className="dashboard-settings__content">
						{/* Global UI Size Setting */}
						<div className="dashboard-settings__section">
							<h4>Display</h4>
							<div className="setting-item">
								<label htmlFor="ui-size">UI Density</label>
								<select
									id="ui-size"
									value={settings.uiSize}
									onChange={(e) =>
										updateSetting("uiSize", e.target.value as "standard" | "compact")
									}
								>
									<option value="standard">Standard</option>
									<option value="compact">Compact</option>
								</select>
								<p className="setting-note">
									Compact mode reduces spacing and hides tips - optimal for speedruns
								</p>
							</div>
						</div>

						<div className="dashboard-settings__info">
							<p>
								Section-specific settings can be accessed within each section's
								settings panel.
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

import { useState, useEffect, useRef } from "react";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";
import { useSettingsRegistry } from "@/contexts/SettingsRegistryContext";

export default function GlobalSettings() {
	const { settings, updateSetting } = useGlobalSettings();
	const { registeredSettings } = useSettingsRegistry();
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isOpen) return;
		const handleClickOutside = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen]);

	// Get all registered section settings as an array
	const sectionSettingsArray = Array.from(registeredSettings.values());

	return (
		<div className="global-settings" ref={containerRef}>
			<button
				className="global-settings__toggle"
				onClick={() => setIsOpen(!isOpen)}
				aria-label="Global Settings"
				aria-expanded={isOpen}
			>
				<span className="settings-icon">⚙</span>
				<span className="settings-label">Settings</span>
			</button>

			{isOpen && (
				<div className="global-settings__panel">
					<div className="global-settings__header">
						<h3>Settings</h3>
						<button
							className="global-settings__close"
							onClick={() => setIsOpen(false)}
							aria-label="Close settings"
						>
							✕
						</button>
					</div>

					<div className="global-settings__content">
						{/* Global UI Size Setting */}
						<div className="global-settings__section">
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

						{/* Section-Specific Settings */}
						{sectionSettingsArray.length > 0 ? (
							<>
								{sectionSettingsArray.map((sectionMeta) => (
									<div
										key={`${sectionMeta.mapId}-${sectionMeta.sectionId}`}
										className="global-settings__section"
									>
										<h4>{sectionMeta.sectionName}</h4>
										{sectionMeta.settings.map((setting) => (
											<div key={setting.id} className="setting-item">
												<label htmlFor={`${sectionMeta.sectionId}-${setting.id}`}>
													{setting.label}
												</label>
												<select
													id={`${sectionMeta.sectionId}-${setting.id}`}
													value={setting.value}
													onChange={(e) => setting.onChange(e.target.value)}
												>
													{setting.options.map((option) => (
														<option key={option.value} value={option.value}>
															{option.label}
														</option>
													))}
												</select>
												{setting.note && (
													<p className="setting-note">{setting.note}</p>
												)}
											</div>
										))}
									</div>
								))}
							</>
						) : (
							<div className="global-settings__info">
								<p>
									Section-specific settings will appear here when sections are loaded.
								</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

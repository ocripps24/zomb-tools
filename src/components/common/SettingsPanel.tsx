import React from "react";

interface SettingsPanelProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
	open,
	onClose,
	children,
}) => {
	if (!open) return null;
	return (
		<aside
			className="settings-panel"
			role="dialog"
			aria-modal="true"
			aria-label="Settings Panel"
		>
			<button
				className="settings-panel__close"
				aria-label="Close Settings"
				onClick={onClose}
			>
				×
			</button>
			{children}
		</aside>
	);
};

export default SettingsPanel;

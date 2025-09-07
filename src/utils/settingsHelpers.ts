import type { Setting } from "@/components/content/SettingsSection";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

/**
 * Helper functions for creating common settings configurations
 */

/**
 * Creates a UI Size setting that affects the entire app (global setting)
 */
export function createUiSizeSetting(): Setting {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { settings, updateSetting } = useGlobalSettings();

	return {
		id: "ui-size",
		label: "UI Size",
		value: settings.uiSize,
		options: [
			{ value: "standard", label: "Standard" },
			{ value: "compact", label: "Compact" },
		],
		note: "Compact mode reduces spacing and padding throughout the app",
		onChange: (value) =>
			updateSetting("uiSize", value as "standard" | "compact"),
	};
}

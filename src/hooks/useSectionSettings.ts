import { useEffect, useMemo } from "react";
import { useGlobalSettings } from "./useGlobalSettings";
import {
	useSettingsRegistry,
	type SettingDefinition,
	type SettingOption,
} from "@/contexts/SettingsRegistryContext";

export interface SectionSettingConfig {
	id: string;
	label: string;
	defaultValue: string;
	options: SettingOption[];
	note?: string;
}

interface UseSectionSettingsParams {
	mapId: string;
	sectionId: string;
	sectionName: string;
	settings: SectionSettingConfig[];
}

/**
 * Hook for sections to register and manage their settings
 * Automatically registers settings on mount and unregisters on unmount
 */
export function useSectionSettings({
	mapId,
	sectionId,
	sectionName,
	settings: settingsConfig,
}: UseSectionSettingsParams) {
	const { registerSettings, unregisterSettings } = useSettingsRegistry();
	const {
		getSectionSetting,
		updateSectionSetting,
	} = useGlobalSettings();

	// Create unique key for this section
	const settingsKey = `${mapId}-${sectionId}`;

	// Build setting definitions with actual values and onChange handlers
	const settingDefinitions: SettingDefinition[] = useMemo(() => {
		return settingsConfig.map((config) => ({
			id: config.id,
			label: config.label,
			value: getSectionSetting(mapId, sectionId, config.id, config.defaultValue),
			options: config.options,
			note: config.note,
			onChange: (value: string) => {
				updateSectionSetting(mapId, sectionId, config.id, value);
			},
		}));
	}, [settingsConfig, mapId, sectionId, getSectionSetting, updateSectionSetting]);

	// Register settings when definitions change (includes value updates)
	useEffect(() => {
		if (settingDefinitions.length > 0) {
			registerSettings(settingsKey, {
				mapId,
				sectionId,
				sectionName,
				settings: settingDefinitions,
			});
		}
	}, [
		settingsKey,
		mapId,
		sectionId,
		sectionName,
		settingDefinitions,
		registerSettings,
	]);

	// Unregister on unmount only
	useEffect(() => {
		return () => {
			unregisterSettings(settingsKey);
		};
	}, [settingsKey, unregisterSettings]);

	// Helper to get a specific setting value
	const getSetting = (settingId: string, defaultValue: string = ""): string => {
		return getSectionSetting(mapId, sectionId, settingId, defaultValue);
	};

	// Helper to update a specific setting
	const updateSetting = (settingId: string, value: string) => {
		updateSectionSetting(mapId, sectionId, settingId, value);
	};

	return {
		getSetting,
		updateSetting,
	};
}

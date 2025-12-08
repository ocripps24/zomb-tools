import React, { createContext, useContext, useState, useCallback } from "react";

/**
 * Definition of a single setting option
 */
export interface SettingOption {
	value: string;
	label: string;
}

/**
 * Definition of a single setting field
 */
export interface SettingDefinition {
	id: string;
	label: string;
	value: string;
	options: SettingOption[];
	note?: string;
	onChange: (value: string) => void;
}

/**
 * Settings metadata for a section
 */
export interface SectionSettingsMetadata {
	mapId: string;
	sectionId: string;
	sectionName: string;
	settings: SettingDefinition[];
}

interface SettingsRegistryContextValue {
	/** All registered section settings */
	registeredSettings: Map<string, SectionSettingsMetadata>;
	/** Register settings for a section */
	registerSettings: (key: string, metadata: SectionSettingsMetadata) => void;
	/** Unregister settings for a section */
	unregisterSettings: (key: string) => void;
	/** Get settings for a specific section */
	getSettings: (key: string) => SectionSettingsMetadata | undefined;
	/** Get all settings for sections on a specific map */
	getMapSettings: (mapId: string) => SectionSettingsMetadata[];
}

const SettingsRegistryContext = createContext<
	SettingsRegistryContextValue | undefined
>(undefined);

/**
 * Provider for the settings registry
 * Manages registration and discovery of section-specific settings
 */
export function SettingsRegistryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [registeredSettings, setRegisteredSettings] = useState<
		Map<string, SectionSettingsMetadata>
	>(new Map());

	const registerSettings = useCallback(
		(key: string, metadata: SectionSettingsMetadata) => {
			setRegisteredSettings((prev) => {
				// Check if anything actually changed to avoid unnecessary updates
				const existing = prev.get(key);
				if (existing) {
					// Deep compare the settings to see if they've changed
					const hasChanged =
						existing.mapId !== metadata.mapId ||
						existing.sectionId !== metadata.sectionId ||
						existing.sectionName !== metadata.sectionName ||
						existing.settings.length !== metadata.settings.length ||
						existing.settings.some((setting, idx) => {
							const newSetting = metadata.settings[idx];
							return (
								setting.id !== newSetting.id ||
								setting.label !== newSetting.label ||
								setting.value !== newSetting.value ||
								setting.note !== newSetting.note ||
								setting.options.length !== newSetting.options.length
							);
						});

					if (!hasChanged) {
						return prev; // No change, return same reference
					}
				}

				const next = new Map(prev);
				next.set(key, metadata);
				return next;
			});
		},
		[]
	);

	const unregisterSettings = useCallback((key: string) => {
		setRegisteredSettings((prev) => {
			const next = new Map(prev);
			next.delete(key);
			return next;
		});
	}, []);

	const getSettings = useCallback(
		(key: string) => {
			return registeredSettings.get(key);
		},
		[registeredSettings]
	);

	const getMapSettings = useCallback(
		(mapId: string) => {
			const settings: SectionSettingsMetadata[] = [];
			registeredSettings.forEach((metadata) => {
				if (metadata.mapId === mapId) {
					settings.push(metadata);
				}
			});
			return settings;
		},
		[registeredSettings]
	);

	return (
		<SettingsRegistryContext.Provider
			value={{
				registeredSettings,
				registerSettings,
				unregisterSettings,
				getSettings,
				getMapSettings,
			}}
		>
			{children}
		</SettingsRegistryContext.Provider>
	);
}

/**
 * Hook to access the settings registry
 */
export function useSettingsRegistry() {
	const context = useContext(SettingsRegistryContext);
	if (!context) {
		throw new Error(
			"useSettingsRegistry must be used within SettingsRegistryProvider"
		);
	}
	return context;
}

import { useState } from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { useSectionSettings } from "@/hooks/useSectionSettings";

const CRATES = [
	{ id: "x9", code: "X-9", part: "Robot Parts" },
	{ id: "iii6", code: "III-6", part: "Gas" },
	{ id: "v7", code: "V-7", part: "PzGR Shipment" },
	{ id: "iv3", code: "IV-3", part: "Chemical Bomb" },
] as const;

const LOCATIONS = [
	{ id: "o2-building", name: "O2 Building" },
	{ id: "dry-dock", name: "Dry Dock" },
	{ id: "war-factory", name: "War Factory" },
	{ id: "core-foundry", name: "Core Foundry" },
] as const;

const QUOTES = [
	{
		id: "phrase1",
		highlight: "Robot Parts",
		text: "The PZGR shells are gone and now carry Robot Parts instead. I've wired the crates so opening them completes a circuit and delivers a nasty shock",
		targetCrateId: "x9",
	},
	{
		id: "phrase2",
		highlight: "disperse gas",
		text: "I replaced the PzGR shipment with parts from the lab rigged to disperse gas, the artillery crew won't know what hit them!!",
		targetCrateId: "iii6",
	},
	{
		id: "phrase3",
		highlight: "couldn't tamper",
		text: "I couldn't tamper with the PzGR shipment, too many eyes in the depot, We must wait for a quieter shift",
		targetCrateId: "v7",
	},
	{
		id: "phrase4",
		highlight: "Chemical Bomb",
		text: "The switch is done, PzGR shells out, Chemical Bomb in. I rigged it so the first man to open them gets a lungful, hopefully its that bastard Richtofen",
		targetCrateId: "iv3",
	},
] as const;

function renderQuoteText(text: string, highlight: string) {
	const idx = text.indexOf(highlight);
	if (idx === -1) return `"${text}"`;
	return (
		<>
			&ldquo;{text.slice(0, idx)}
			<strong>{highlight}</strong>
			{text.slice(idx + highlight.length)}&rdquo;
		</>
	);
}

interface AABulletData {
	crateLocations: Record<string, string | null>;
	quoteId: string | null;
}

const DEFAULT_VALUE: AABulletData = {
	crateLocations: { x9: null, iii6: null, v7: null, iv3: null },
	quoteId: null,
};

function AABulletSection(props: BaseSectionProps<AABulletData>) {
	const [showManifest, setShowManifest] = useState(false);

	useSectionSettings({
		mapId: "totenreich",
		sectionId: "aa-bullet",
		sectionName: "AA Bullet",
		settings: [],
	});

	return (
		<BaseSection
			config={{
				storageKey: "totenreich-aa-bullet-data",
				defaultValue: DEFAULT_VALUE,
				title: "AA Bullet",
				description:
					"Find the scrap of paper at Tyr's Foot or Crane Room to identify which crate holds the AA Bullet. Optionally map crate numbers to locations using the War Room cargo manifest.",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Cargo Manifest",
							text: "The War Room contains a manifest listing 4 parts with code numbers: Robot Parts (X-9), Gas (III-6), PzGR Shipment (V-7), Chemical Bomb (IV-3).",
						},
						{
							label: "Crate Locations",
							text: "Four crates around the map will have these code numbers on them. The locations change each game — crates can be at O2 Building, Dry Dock, War Factory, or Core Foundry.",
						},
						{
							label: "Find the Note",
							text: "Check Tyr's Foot or Crane Room for a scrap of paper. The message describes what happened to the PzGR Shipment crate, revealing which crate now holds the AA Bullet.",
						},
					],
				},
			}}
			getProgress={(data: AABulletData) => ({
				completed: data.quoteId !== null ? 1 : 0,
				total: 1,
				isComplete: data.quoteId !== null,
			})}
			{...props}
		>
			{({ data, setData }) => {
				const handleAssignLocation = (crateId: string, locationId: string) => {
					const current = data.crateLocations[crateId];
					if (current === locationId) {
						setData({
							...data,
							crateLocations: { ...data.crateLocations, [crateId]: null },
						});
						return;
					}

					const newLocations = { ...data.crateLocations };
					for (const id of Object.keys(newLocations)) {
						if (newLocations[id] === locationId) newLocations[id] = null;
					}
					newLocations[crateId] = locationId;

					const assignedCount = Object.values(newLocations).filter(
						(v) => v !== null,
					).length;
					if (assignedCount === 3) {
						const unassignedId = CRATES.find(
							(c) => newLocations[c.id] === null,
						)?.id;
						const usedSet = new Set(
							Object.values(newLocations).filter(Boolean),
						);
						const remaining = LOCATIONS.find((l) => !usedSet.has(l.id))?.id;
						if (unassignedId && remaining) {
							newLocations[unassignedId] = remaining;
						}
					}

					setData({ ...data, crateLocations: newLocations });
				};

				const handleSelectQuote = (quoteId: string) => {
					setData({
						...data,
						quoteId: data.quoteId === quoteId ? null : quoteId,
					});
				};

				const selectedQuote = QUOTES.find((q) => q.id === data.quoteId);
				const resultCrate = selectedQuote
					? CRATES.find((c) => c.id === selectedQuote.targetCrateId)
					: null;
				const resultLocationId = selectedQuote
					? data.crateLocations[selectedQuote.targetCrateId]
					: null;
				const resultLocation = resultLocationId
					? LOCATIONS.find((l) => l.id === resultLocationId)
					: null;

				const usedLocations = new Set(
					Object.values(data.crateLocations).filter(
						(v): v is string => v !== null,
					),
				);

				return (
					<div className="aa-bullet-section">
						{/* Optional cargo manifest */}
						<div className="cargo-manifest-panel">
							<button
								className="cargo-manifest-panel__toggle"
								onClick={() => setShowManifest((v) => !v)}
								type="button"
							>
								<span>Crate Location Mapping (Optional)</span>
								<span
									className={`cargo-manifest-panel__chevron${showManifest ? " cargo-manifest-panel__chevron--open" : ""}`}
								>
									▾
								</span>
							</button>
							{showManifest && (
								<div className="cargo-manifest-panel__body">
									<p className="cargo-manifest-panel__hint">
										Assign each crate code to the location where you found it.
										Enter 3 and the 4th auto-fills.
									</p>
									<div className="crate-location-grid">
										{CRATES.map((crate) => {
											const assignedId = data.crateLocations[crate.id];
											return (
												<div key={crate.id} className="crate-location-row">
													<div className="crate-location-row__header">
														<span className="crate-location-row__code">
															{crate.code}
														</span>
														<span className="crate-location-row__part">
															{crate.part}
														</span>
													</div>
													<div className="crate-location-row__buttons">
														{LOCATIONS.map((location) => {
															const isSelected = assignedId === location.id;
															const isUsedByOther =
																!isSelected && usedLocations.has(location.id);
															return (
																<button
																	key={location.id}
																	className={[
																		"location-assign-btn",
																		isSelected
																			? "location-assign-btn--selected"
																			: "",
																		isUsedByOther
																			? "location-assign-btn--used"
																			: "",
																	]
																		.filter(Boolean)
																		.join(" ")}
																	onClick={() =>
																		handleAssignLocation(crate.id, location.id)
																	}
																	disabled={isUsedByOther}
																	type="button"
																>
																	{location.name}
																</button>
															);
														})}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							)}
						</div>

						{/* Quote selector */}
						<div className="quote-picker">
							<h3 className="quote-picker__title">Select Your Phrase</h3>
							<p className="quote-picker__hint">
								Find the scrap of paper at <strong>Tyr's Foot</strong> or{" "}
								<strong>Crane Room</strong> and select the matching phrase
								below.
							</p>
							<div className="quote-picker__cards">
								{QUOTES.map((quote, index) => (
									<button
										key={quote.id}
										className={[
											"quote-card",
											data.quoteId === quote.id ? "quote-card--selected" : "",
										]
											.filter(Boolean)
											.join(" ")}
										onClick={() => handleSelectQuote(quote.id)}
										type="button"
									>
										<div className="quote-card__header">
											<span className="quote-card__label">
												Phrase {index + 1}
											</span>
											<span className="quote-card__keyword">
												{quote.highlight}
											</span>
										</div>
										<span className="quote-card__text">
											{renderQuoteText(quote.text, quote.highlight)}
										</span>
									</button>
								))}
							</div>
						</div>

						{/* Result */}
						{selectedQuote && resultCrate && (
							<div className="aa-bullet-result">
								<h3 className="aa-bullet-result__title">AA Bullet Location</h3>
								<div className="aa-bullet-result__row">
									<span className="aa-bullet-result__label">Crate Number</span>
									<span className="aa-bullet-result__value">
										{resultCrate.code}
									</span>
								</div>
								{resultLocation ? (
									<div className="aa-bullet-result__row">
										<span className="aa-bullet-result__label">Located At</span>
										<span className="aa-bullet-result__value">
											{resultLocation.name}
										</span>
									</div>
								) : (
									<p className="aa-bullet-result__hint">
										Map crate locations above to also see where to find this
										crate.
									</p>
								)}
							</div>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default AABulletSection;

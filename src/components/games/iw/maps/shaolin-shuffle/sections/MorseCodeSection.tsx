import { useState } from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// Morse code per digit: 0=-----, 1=.----, 2=..---, 3=...--, 4=....-,
//                       5=....., 6=-...., 7=--..., 8=---.., 9=----.
const POSTER_CODES = [
	{
		number: "281",
		digits: ["..---", "---..", ".----"] as string[],
		disambiguation: null as string | null,
		disambiguateDigit: null as number | null,
	},
	{
		number: "407",
		digits: ["....-", "-----", "--..."],
		disambiguation: "Ends in dots — if it ends in dashes instead, you have 420",
		disambiguateDigit: 2,
	},
	{
		number: "420",
		digits: ["....-", "..---", "-----"],
		disambiguation: "Ends in dashes — if it ends in dots instead, you have 407",
		disambiguateDigit: 2,
	},
	{
		number: "596",
		digits: [".....", "----.", "-...."],
		disambiguation: null as string | null,
		disambiguateDigit: null as number | null,
	},
	{
		number: "713",
		digits: ["--...", ".----", "...--"],
		disambiguation: null as string | null,
		disambiguateDigit: null as number | null,
	},
	{
		number: "818",
		digits: ["---..", ".----", "---.."],
		disambiguation: null as string | null,
		disambiguateDigit: null as number | null,
	},
];

const POSTER_LOCATIONS = [
	{ id: "subway-1", name: "Subway 1" },
	{ id: "dojo", name: "Dojo" },
	{ id: "racing-stripes", name: "Racing Stripes" },
	{ id: "bombstoppers", name: "Bombstoppers" },
	{ id: "infernos-roof", name: "Inferno's Roof" },
	{ id: "subway-2", name: "Subway 2" },
] as const;

type LocationId = (typeof POSTER_LOCATIONS)[number]["id"];

interface MorseCodeData {
	posterMappings: Record<LocationId, string | null>;
	selectedCode: string | null;
}

const DEFAULT_DATA: MorseCodeData = {
	posterMappings: {
		"subway-1": null,
		dojo: null,
		"racing-stripes": null,
		bombstoppers: null,
		"infernos-roof": null,
		"subway-2": null,
	},
	selectedCode: null,
};

function getResult(
	selectedCode: string,
	posterMappings: Record<string, string | null>,
) {
	const mappedEntry = Object.entries(posterMappings).find(
		([, num]) => num === selectedCode,
	);
	if (mappedEntry) {
		const location = POSTER_LOCATIONS.find((l) => l.id === mappedEntry[0]);
		return {
			type: "exact" as const,
			locationName: location?.name ?? mappedEntry[0],
		};
	}

	const anyMapped = Object.values(posterMappings).some((v) => v !== null);
	if (anyMapped) {
		const candidates = POSTER_LOCATIONS.filter(
			(loc) => posterMappings[loc.id] === null,
		);
		return {
			type: "candidates" as const,
			locations: candidates.map((l) => l.name),
		};
	}

	return { type: "none" as const };
}

function MorseCodeSection(props: BaseSectionProps<MorseCodeData>) {
	const [isMappingOpen, setIsMappingOpen] = useState(false);

	return (
		<BaseSection
			config={{
				storageKey: "shaolin-shuffle-morse-code-data",
				defaultValue: DEFAULT_DATA,
				title: "Morse Code",
				description:
					"After shooting all 6 dragon symbols, interact with the single grey payphone in Subway 1. Listen to the morse code to identify your movie poster number.",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Dragon Symbols",
							text: "Shoot 6 dragon symbols around the map. As you complete them, payphones light up red one by one — the last grey phone is your target in Subway 1.",
						},
						{
							label: "407 vs 420",
							text: "Both codes start with 4 (····–). Listen for how the sequence ends: ends in dots = 407, ends in dashes = 420.",
						},
						{
							label: "Poster Locations",
							nested: [
								{
									label: "Subway 1",
									text: "Other end of the platform from Up-and-Atoms",
								},
								{
									label: "Dojo",
									text: "Inbetween the Dojo and the Barbershop",
								},
								{
									label: "Racing Stripes",
									text: "On the right of the rooftop before crossing the bridge to Racing Stripes",
								},
								{
									label: "Bombstoppers",
									text: "Near Bombstoppers in the alley between Inferno's VIP Room and Heebie Jeebies",
								},
								{
									label: "Inferno's Roof",
									text: "On the rooftop next to the vent dropdown",
								},
								{
									label: "Subway 2",
									text: "Wall next to the empty tracks where you place the Alien fuses",
								},
							],
						},
						{
							label: "Wrong Poster",
							text: "Interacting with the wrong poster forces you to restart from the dragon symbol step.",
						},
					],
				},
			}}
			getProgress={(data: MorseCodeData) => ({
				completed: data.selectedCode !== null ? 1 : 0,
				total: 1,
				isComplete: data.selectedCode !== null,
			})}
			{...props}
		>
			{({ data, setData }) => {
				const updateMapping = (
					locationId: LocationId,
					value: string | null,
				) => {
					setData((prev: MorseCodeData) => {
						const updated = { ...prev.posterMappings, [locationId]: value };
						const filledCount = Object.values(updated).filter(Boolean).length;
						if (filledCount === 5) {
							const emptyLocationId = (
								Object.keys(updated) as LocationId[]
							).find((id) => !updated[id]);
							const usedNums = new Set(Object.values(updated).filter(Boolean));
							const remainingNum = POSTER_CODES.find(
								(c) => !usedNums.has(c.number),
							);
							if (emptyLocationId && remainingNum) {
								updated[emptyLocationId] = remainingNum.number;
							}
						}
						return { ...prev, posterMappings: updated };
					});
				};

				const handleCodeSelect = (number: string) => {
					setData((prev: MorseCodeData) => ({
						...prev,
						selectedCode: prev.selectedCode === number ? null : number,
					}));
				};

				const usedNumbers = new Set(
					Object.values(data.posterMappings).filter(Boolean),
				);

				const result =
					data.selectedCode !== null
						? getResult(data.selectedCode, data.posterMappings)
						: null;

				return (
					<div className="morse-code-section">
						{/* Optional Poster Location Mapping */}
						<div className="morse-poster-mapping">
							<button
								className="morse-poster-mapping__toggle"
								onClick={() => setIsMappingOpen((v) => !v)}
								type="button"
							>
								<span>Map Poster Locations</span>
								<span className="morse-poster-mapping__badge">Optional</span>
								<span className="morse-poster-mapping__chevron">
									{isMappingOpen ? "▲" : "▼"}
								</span>
							</button>

							{isMappingOpen && (
								<div className="morse-poster-mapping__body">
									<p className="morse-poster-mapping__hint">
										Scout poster spawns at game start and note which number is
										at each location. The tool will then direct you straight to
										your poster after the phone call.
									</p>
									<div className="morse-poster-mapping__grid">
										{POSTER_LOCATIONS.map((location) => {
											const currentValue =
												data.posterMappings[location.id] ?? "";
											return (
												<div
													key={location.id}
													className="morse-poster-mapping__row"
												>
													<span className="morse-poster-mapping__location">
														{location.name}
													</span>
													<select
														className="morse-poster-mapping__select"
														value={currentValue}
														onChange={(e) =>
															updateMapping(location.id, e.target.value || null)
														}
													>
														<option value="">— not mapped —</option>
														{POSTER_CODES.map((code) => (
															<option
																key={code.number}
																value={code.number}
																disabled={
																	usedNumbers.has(code.number) &&
																	currentValue !== code.number
																}
															>
																{code.number}
															</option>
														))}
													</select>
												</div>
											);
										})}
									</div>
								</div>
							)}
						</div>

						{/* Morse Code Cards */}
						<p className="morse-code-section__prompt">
							Select the number that matches the morse code you heard:
						</p>
						<div className="morse-cards">
							{POSTER_CODES.map((code) => {
								const isSelected = data.selectedCode === code.number;
								return (
									<button
										key={code.number}
										className={`morse-card${isSelected ? " morse-card--selected" : ""}`}
										onClick={() => handleCodeSelect(code.number)}
										type="button"
									>
										<span className="morse-card__number">{code.number}</span>
										<div className="morse-card__sequence">
											{code.digits.map((digit, i) => (
												<span
													key={i}
													className={`morse-card__digit${code.disambiguateDigit === i ? " morse-card__digit--highlight" : ""}`}
												>
													{digit}
												</span>
											))}
										</div>
										{code.disambiguation && (
											<span className="morse-card__note">
												{code.disambiguation}
											</span>
										)}
									</button>
								);
							})}
						</div>

						{/* Result */}
						{result && data.selectedCode && (
							<div className={`morse-result morse-result--${result.type}`}>
								<span className="morse-result__label">
									Poster #{data.selectedCode}
								</span>
								{result.type === "exact" && (
									<span className="morse-result__location">
										→ {result.locationName}
									</span>
								)}
								{result.type === "candidates" && (
									<div className="morse-result__candidates">
										<span>Check these unmapped locations:</span>
										<ul>
											{result.locations.map((loc) => (
												<li key={loc}>{loc}</li>
											))}
										</ul>
									</div>
								)}
								{result.type === "none" && (
									<span className="morse-result__hint">
										Look for the poster showing this number.
									</span>
								)}
							</div>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default MorseCodeSection;

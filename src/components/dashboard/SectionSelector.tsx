import { useState } from "react";
import {
	getAllGames,
	getMapsByGame,
	getSectionsByMap,
} from "@/data/sectionRegistry";
import type { DashboardSection } from "@/types/dashboard";

interface SectionSelectorProps {
	onSelectSection: (section: {
		gameId: string;
		mapId: string;
		sectionId: string;
		sectionName: string;
		mapName: string;
		gameName: string;
	}) => void;
	selectedSections: DashboardSection[];
}

/**
 * Tree view for browsing and selecting sections
 * Structure: Game > Map > Section
 */
export default function SectionSelector({
	onSelectSection,
	selectedSections,
}: SectionSelectorProps) {
	const [expandedGames, setExpandedGames] = useState<Set<string>>(new Set());
	const [expandedMaps, setExpandedMaps] = useState<Set<string>>(new Set());

	const games = getAllGames();

	const toggleGame = (gameId: string) => {
		const newExpanded = new Set(expandedGames);
		if (newExpanded.has(gameId)) {
			newExpanded.delete(gameId);
		} else {
			newExpanded.add(gameId);
		}
		setExpandedGames(newExpanded);
	};

	const toggleMap = (mapKey: string) => {
		const newExpanded = new Set(expandedMaps);
		if (newExpanded.has(mapKey)) {
			newExpanded.delete(mapKey);
		} else {
			newExpanded.add(mapKey);
		}
		setExpandedMaps(newExpanded);
	};

	const isSectionSelected = (
		gameId: string,
		mapId: string,
		sectionId: string
	) => {
		return selectedSections.some(
			(s) =>
				s.gameId === gameId && s.mapId === mapId && s.sectionId === sectionId
		);
	};

	return (
		<div className="section-selector">
			{games.length === 0 ? (
				<p className="section-selector__empty">No sections available</p>
			) : (
				<div className="section-selector__tree">
					{games.map((game) => {
						const isGameExpanded = expandedGames.has(game.id);
						const maps = getMapsByGame(game.id);

						return (
							<div key={game.id} className="tree-game">
								<button
									className="tree-game__toggle"
									onClick={() => toggleGame(game.id)}
									aria-expanded={isGameExpanded}
								>
									<span className={`tree-arrow ${isGameExpanded ? "open" : ""}`}>
										▶
									</span>
									<span className="tree-game__name">{game.name}</span>
									<span className="tree-count">{maps.length} maps</span>
								</button>

								{isGameExpanded && (
									<div className="tree-maps">
										{maps.map((map) => {
											const mapKey = `${game.id}-${map.id}`;
											const isMapExpanded = expandedMaps.has(mapKey);
											const sections = getSectionsByMap(game.id, map.id);

											return (
												<div key={mapKey} className="tree-map">
													<button
														className="tree-map__toggle"
														onClick={() => toggleMap(mapKey)}
														aria-expanded={isMapExpanded}
													>
														<span
															className={`tree-arrow ${isMapExpanded ? "open" : ""}`}
														>
															▶
														</span>
														<span className="tree-map__name">{map.name}</span>
														<span className="tree-count">
															{sections.length} sections
														</span>
													</button>

													{isMapExpanded && (
														<div className="tree-sections">
															{sections.map((section) => {
																const isSelected = isSectionSelected(
																	game.id,
																	map.id,
																	section.id
																);

																return (
																	<button
																		key={section.id}
																		className={`tree-section ${isSelected ? "selected" : ""}`}
																		onClick={() =>
																			onSelectSection({
																				gameId: game.id,
																				mapId: map.id,
																				sectionId: section.id,
																				sectionName: section.name,
																				mapName: map.name,
																				gameName: game.name,
																			})
																		}
																		disabled={isSelected}
																	>
																		<span className="tree-section__name">
																			{section.name}
																		</span>
																		{isSelected && (
																			<span className="tree-section__badge">
																				Added
																			</span>
																		)}
																	</button>
																);
															})}
														</div>
													)}
												</div>
											);
										})}
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

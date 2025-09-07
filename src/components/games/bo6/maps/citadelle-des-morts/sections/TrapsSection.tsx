import React from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// Import CDM page symbols as React components
import CdmPage0Icon from "@/assets/symbols/cdm-page-0.svg";
import CdmPage1Icon from "@/assets/symbols/cdm-page-1.svg";
import CdmPage4Icon from "@/assets/symbols/cdm-page-4.svg";
import CdmPage8Icon from "@/assets/symbols/cdm-page-8.svg";

// Symbol data
const SYMBOLS = [
	{ id: "0", name: "CDM Page 0", icon: CdmPage0Icon },
	{ id: "1", name: "CDM Page 1", icon: CdmPage1Icon },
	{ id: "4", name: "CDM Page 4", icon: CdmPage4Icon },
	{ id: "8", name: "CDM Page 8", icon: CdmPage8Icon },
];

// Page data
const PAGES = [
	{ id: "page1", name: "Page 1", position: "Near Left Corner" },
	{ id: "page2", name: "Page 2", position: "TV Corner" },
	{ id: "page3", name: "Page 3", position: "Sofa" },
	{ id: "page4", name: "Page 4", position: "Right Corner" },
];

// Trap locations (excluding Stamina Up which is always the 4th trap)
const TRAP_LOCATIONS = [
	"Quick Revive",
	"Pack-a-Punch",
	"Courtyard",
	"Speed Cola",
	"Deadshot",
];

// Data interface for this section
interface TrapsData {
	pageSymbols: {
		page1: string;
		page2: string;
		page3: string;
		page4: string;
	};
	trapLocations: {
		trap1: string;
		trap2: string;
		trap3: string;
	};
}

function TrapsSection(props: BaseSectionProps<TrapsData>) {
	return (
		<BaseSection
			config={{
				storageKey: "citadelle-des-morts-traps-data",
				defaultValue: {
					pageSymbols: {
						page1: "",
						page2: "",
						page3: "",
						page4: "",
					},
					trapLocations: {
						trap1: "",
						trap2: "",
						trap3: "",
					},
				},
				title: "Traps",
				description:
					"Record the symbols from the 4 pages, then assign trap locations.",
				resetButtonText: "Reset Traps",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Page Location",
							text: "All 4 pages are in the same room with fixed positions"
						},
						{
							label: "Symbol Selection",
							text: "Each symbol (0, 1, 4, 8) can only be used once across all pages"
						},
						{
							label: "Auto-Assignment",
							text: "When you select 3 symbols, the 4th will be automatically assigned"
						},
						{
							label: "Trap Order",
							text: "Traps must be activated in the same order as the page symbols"
						},
						{
							label: "Final Trap",
							text: "The 4th trap location is always Stamina Up and cannot be changed"
						}
					]
				}
			}}
			getProgress={(data: TrapsData) => {
				const pagesCompleted = Object.values(data.pageSymbols).filter(
					Boolean
				).length;
				const locationsCompleted = Object.values(data.trapLocations).filter(
					Boolean
				).length;
				const totalCompleted = pagesCompleted + locationsCompleted;

				return {
					completed: totalCompleted,
					total: 7, // 4 pages + 3 locations (4th is auto-assigned)
					isComplete: pagesCompleted === 4 && locationsCompleted === 3,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				// Get used symbols to grey them out
				const usedSymbols = Object.values(data.pageSymbols).filter(Boolean);

				// Auto-assign the 4th symbol when 3 are selected
				if (usedSymbols.length === 3) {
					const remainingSymbol = SYMBOLS.find(
						(s) => !usedSymbols.includes(s.id)
					)?.id;
					if (remainingSymbol) {
						// Find which page is empty and assign the remaining symbol
						const emptyPageKey = Object.keys(data.pageSymbols).find(
							(key) => !data.pageSymbols[key as keyof typeof data.pageSymbols]
						) as keyof typeof data.pageSymbols;

						if (emptyPageKey && data.pageSymbols[emptyPageKey] === "") {
							// Auto-assign the remaining symbol
							setData((prev: TrapsData) => ({
								...prev,
								pageSymbols: {
									...prev.pageSymbols,
									[emptyPageKey]: remainingSymbol,
								},
							}));
						}
					}
				}

				const handlePageSymbolSelect = (pageId: string, symbolId: string) => {
					setData((prev: TrapsData) => {
						// If symbol is already selected for this page, deselect it
						if (
							prev.pageSymbols[pageId as keyof typeof prev.pageSymbols] ===
							symbolId
						) {
							return {
								...prev,
								pageSymbols: {
									...prev.pageSymbols,
									[pageId]: "",
								},
							};
						}

						// Otherwise, select the symbol
						return {
							...prev,
							pageSymbols: {
								...prev.pageSymbols,
								[pageId]: symbolId,
							},
						};
					});
				};

				const handleTrapLocationSelect = (
					trapNumber: number,
					location: string
				) => {
					setData((prev: TrapsData) => ({
						...prev,
						trapLocations: {
							...prev.trapLocations,
							[`trap${trapNumber}`]: location,
						},
					}));
				};

				// Get available locations (excluding already selected ones)
				const getAvailableLocations = (currentTrap: number) => {
					const selectedLocations = Object.values(data.trapLocations).filter(
						Boolean
					);
					return TRAP_LOCATIONS.filter(
						(location) =>
							!selectedLocations.includes(location) ||
							data.trapLocations[
								`trap${currentTrap}` as keyof typeof data.trapLocations
							] === location
					);
				};

				// Check if all pages are completed
				const allPagesCompleted = Object.values(data.pageSymbols).every(
					Boolean
				);

				// Get the symbols in the order they were selected
				const getSymbolOrder = () => {
					return PAGES.map((page) => {
						const symbolId =
							data.pageSymbols[page.id as keyof typeof data.pageSymbols];
						return SYMBOLS.find((s) => s.id === symbolId);
					}).filter(Boolean);
				};

				return (
					<div className="traps-section">
						{/* Pages Section */}
						<div className="pages-section">
							<h3>Pages - All 4 pages</h3>
							<p className="pages-description">
								Record the symbols shown on each page in the room. Each symbol
								can only be used once.
							</p>

							<div className="pages-grid">
								{PAGES.map((page) => {
									const selectedSymbol =
										data.pageSymbols[page.id as keyof typeof data.pageSymbols];

									return (
										<div key={page.id} className="page-card">
											<div className="page-header">
												<h4>{page.name}</h4>
												<span className="page-position">{page.position}</span>
											</div>

											<div className="symbol-selection">
												{SYMBOLS.map((symbol) => {
													const isSelected = selectedSymbol === symbol.id;
													const isUsedElsewhere =
														usedSymbols.includes(symbol.id) && !isSelected;

													return (
														<button
															key={symbol.id}
															className={`symbol-option ${
																isSelected ? "symbol-option--selected" : ""
															} ${
																isUsedElsewhere ? "symbol-option--disabled" : ""
															}`}
															onClick={() =>
																handlePageSymbolSelect(page.id, symbol.id)
															}
															disabled={isUsedElsewhere}
														>
															{(() => {
																const IconComponent =
																	symbol.icon as unknown as React.ComponentType<
																		React.SVGProps<SVGSVGElement>
																	>;
																return (
																	<IconComponent className="symbol-icon" />
																);
															})()}
														</button>
													);
												})}
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* Traps Section - Only show when all pages are completed */}
						{allPagesCompleted && (
							<div className="traps-assignment">
								<h3>Traps</h3>
								<p className="traps-description">
									Assign locations to the first 3 traps based on the symbol
									order from the pages. The 4th trap is always at Stamina Up.
								</p>

								<div className="traps-grid">
									{getSymbolOrder()
										.slice(0, 3)
										.map((symbol, index) => {
											const trapNumber = index + 1;
											const selectedLocation =
												data.trapLocations[
													`trap${trapNumber}` as keyof typeof data.trapLocations
												];

											return (
												<div key={`trap${trapNumber}`} className="trap-card">
													<div className="trap-header">
														<h4>Trap {trapNumber}</h4>
														<div className="trap-symbol">
															{(() => {
																const IconComponent = symbol!
																	.icon as unknown as React.ComponentType<
																	React.SVGProps<SVGSVGElement>
																>;
																return (
																	<IconComponent className="symbol-icon" />
																);
															})()}
														</div>
													</div>

													<div className="location-selection">
														<select
															value={selectedLocation}
															onChange={(e) =>
																handleTrapLocationSelect(
																	trapNumber,
																	e.target.value
																)
															}
															className="location-select"
														>
															<option value="">Select location...</option>
															{getAvailableLocations(trapNumber).map(
																(location) => (
																	<option key={location} value={location}>
																		{location}
																	</option>
																)
															)}
														</select>
													</div>
												</div>
											);
										})}

									{/* 4th trap - always Stamina Up */}
									<div className="trap-card trap-card--fixed">
										<div className="trap-header">
											<h4>Trap 4</h4>
											<div className="trap-symbol">
												{getSymbolOrder()[3] &&
													(() => {
														const IconComponent = getSymbolOrder()[3]!
															.icon as unknown as React.ComponentType<
															React.SVGProps<SVGSVGElement>
														>;
														return <IconComponent className="symbol-icon" />;
													})()}
											</div>
										</div>

										<div className="location-fixed">
											<span className="fixed-location">Stamina Up</span>
											<small>(Always fixed)</small>
										</div>
									</div>
								</div>
							</div>
						)}

					</div>
				);
			}}
		</BaseSection>
	);
}

export default TrapsSection;

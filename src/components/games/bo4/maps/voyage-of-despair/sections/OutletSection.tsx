import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

const OUTLET_LOCATIONS = [
	{ id: "state-rooms", name: "State Rooms" },
	{ id: "grand-stairs", name: "Grand Stairs" },
	{ id: "first-class", name: "1st Class" },
	{ id: "dining-room", name: "Dining Room" },
	{ id: "aft-deck", name: "Aft Deck" },
	{ id: "third-class", name: "3rd Class" },
];

const CATALYST_TYPES = [
	{ id: "electric", name: "Electric", color: "#fbbf24" },
	{ id: "fire", name: "Fire", color: "#ef4444" },
	{ id: "poison", name: "Poison", color: "#16a34a" },
	{ id: "water", name: "Water", color: "#3b82f6" },
];

const PORTAL_ORDER = [
	{ step: 1, catalyst: "poison", name: "Poison" },
	{ step: 2, catalyst: "water", name: "Water" },
	{ step: 3, catalyst: "electric", name: "Electric" },
	{ step: 4, catalyst: "fire", name: "Fire" },
];

// Data interface for this section
interface OutletData {
	[locationId: string]: string; // locationId -> catalystId
}

function OutletSection(props: BaseSectionProps<OutletData>) {
	return (
		<BaseSection
			config={{
				storageKey: "voyage-of-despair-outlet-data",
				defaultValue: {},
				title: "Outlet Locations & Catalysts",
				description: "Select which catalyst zombie type appears at each outlet location. After killing the catalyst zombie, enter the portals in the specific order shown below.",
				resetButtonText: "Reset Outlets"
			}}
			getProgress={(data: OutletData) => {
				const assignedCount = Object.keys(data).length;
				return {
					completed: assignedCount,
					total: 4,
					isComplete: assignedCount === 4
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const handleCatalystSelect = (locationId: string, catalystId: string | null) => {
					setData((prev: OutletData) => {
						const newData = { ...prev };

						// Remove this catalyst from any other location
						Object.keys(newData).forEach((key) => {
							if (newData[key] === catalystId) {
								delete newData[key];
							}
						});

						// Set the catalyst for this location
						if (catalystId) {
							newData[locationId] = catalystId;
						} else {
							delete newData[locationId];
						}

						return newData;
					});
				};

				const getUsedCatalysts = () => {
					return Object.values(data);
				};

				const isCatalystUsed = (catalystId: string) => {
					return getUsedCatalysts().includes(catalystId);
				};

				const getLocationForCatalyst = (catalystId: string) => {
					const locationId = Object.keys(data).find(
						(key) => data[key] === catalystId
					);
					if (locationId) {
						const location = OUTLET_LOCATIONS.find((loc) => loc.id === locationId);
						return location ? location.name : null;
					}
					return null;
				};

				const assignedCount = Object.keys(data).length;

				return (
					<div className="outlets-section">
						{/* Outlet Selection Grid */}
						<div className="outlet-grid">
							{OUTLET_LOCATIONS.map((location) => {
								const selectedCatalyst = data[location.id];
								const isLocationDisabled = !selectedCatalyst && assignedCount >= 4;

								return (
									<div
										key={location.id}
										className={`outlet-location ${
											selectedCatalyst ? "outlet-location--selected" : ""
										} ${isLocationDisabled ? "outlet-location--disabled" : ""}`}
									>
										<h4 className="outlet-location-title">{location.name}</h4>

										<div className="catalyst-buttons">
											{CATALYST_TYPES.map((catalyst) => {
												const isSelected = selectedCatalyst === catalyst.id;
												const isUsedElsewhere =
													isCatalystUsed(catalyst.id) && !isSelected;
												const isDisabled = isLocationDisabled || isUsedElsewhere;

												return (
													<button
														key={catalyst.id}
														onClick={() =>
															handleCatalystSelect(
																location.id,
																isSelected ? null : catalyst.id
															)
														}
														className={`catalyst-btn ${
															isSelected ? "catalyst-btn--selected" : ""
														} ${isDisabled ? "catalyst-btn--disabled" : ""}`}
														style={
															isSelected
																? {
																		backgroundColor: catalyst.color,
																		borderColor: catalyst.color,
																		color:
																			catalyst.id === "electric" ? "black" : "white",
																  }
																: {}
														}
														disabled={isDisabled}
														title={catalyst.name}
													>
														<span className="catalyst-btn__full">
															{catalyst.name}
														</span>
														<span className="catalyst-btn__short">
															{catalyst.name.charAt(0)}
														</span>
													</button>
												);
											})}
										</div>
									</div>
								);
							})}
						</div>

						{/* Portal Entry Order */}
						<div className="portal-order">
							<h4>Portal Entry Order:</h4>
							<div className="portal-order-list">
								{PORTAL_ORDER.map((portal) => {
									const location = getLocationForCatalyst(portal.catalyst);
									const catalyst = CATALYST_TYPES.find(
										(c) => c.id === portal.catalyst
									);

									return (
										<div
											key={portal.step}
											className={`portal-order-item ${
												location ? "portal-order-item--assigned" : ""
											}`}
											style={
												location && catalyst
													? {
															backgroundColor: catalyst.color,
															borderColor: catalyst.color,
													  }
													: {}
											}
										>
											<span className="portal-step">{portal.step}</span>
											<span
												className="portal-location"
												style={
													location && catalyst
														? {
																color: catalyst.id === "electric" ? "black" : "white",
																fontWeight: "600",
														  }
														: {}
												}
											>
												{location || "Not assigned"}
											</span>
											<span
												className="portal-catalyst"
												style={
													location && catalyst
														? {
																color: catalyst.id === "electric" ? "black" : "white",
																fontWeight: "600",
														  }
														: {}
												}
											>
												{portal.name}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default OutletSection;
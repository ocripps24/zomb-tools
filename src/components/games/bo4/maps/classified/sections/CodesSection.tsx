import { useState } from "react";
import { FloatingCard } from "@/components/ui";
import { BaseSection } from "@/components/core";
import { NumberPad } from "@/components/ui";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	MouseSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Location Button Component
interface LocationButtonProps {
	codeData: (typeof CODES_DATA)[0];
	isSelected: boolean;
	isCompleted: boolean;
	onClick: () => void;
}

function SortableLocationButton({
	codeData,
	isSelected,
	isCompleted,
	onClick,
}: LocationButtonProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: codeData.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const getButtonClass = () => {
		let baseClass = "location-button";
		if (isCompleted) baseClass += " location-button--completed";
		else if (isSelected) baseClass += " location-button--selected";
		else baseClass += " location-button--empty";
		return baseClass;
	};

	return (
		<div ref={setNodeRef} style={style} className={getButtonClass()}>
			<div className="location-content" onClick={onClick}>
				<span className="location-order">{codeData.order}</span>
				<span className="location-separator">-</span>
				<span className="location-name">{codeData.casualLocation}</span>
			</div>
			<button
				className="drag-handle"
				{...attributes}
				{...listeners}
				title="Drag to reorder"
				type="button"
			>
				⋮⋮
			</button>
		</div>
	);
}

// Code data - ordered by the sequence they should be displayed in results
const CODES_DATA = [
	{
		id: 1,
		map: "Shi No Numa",
		strictLocation: "Deserted Hallway",
		casualLocation: "Paintings",
		order: 1,
		tip: "With a packed weapon shoot the paintings with George Washington as 1 in this order: 3 -> 2 -> 4 to reveal the code at 1",
	},
	{
		id: 2,
		map: "Kino Der Toten",
		strictLocation: "Panic Room",
		casualLocation: "Panic TV",
		order: 4,
		tip: "To enter the Panic Room, activate Defcon 5 in the following order: Catwalk Corner -> Server Room -> Top of Stairs -> Underneath Staircase. Interact with the static TV",
	},
	{
		id: 3,
		map: "Shangri-La",
		strictLocation: "South Laboratories",
		casualLocation: "Lab Tub",
		order: 3,
		tip: "Use a Frag/Acid Grenade or an explosive packed weapon to trigger an explosion in the large chrome tub in the spawn window",
	},
	{
		id: 4,
		map: "Der Riese",
		strictLocation: "Main Office",
		casualLocation: "Desk Drawer",
		order: 2,
		tip: "Obtain the key opposite the Cola perk machine to unlock the desk drawer in Main Offices",
	},
];

// Tips configuration with introduction and conclusion
const TIPS = [
	...CODES_DATA.map((code) => ({
		label: `${code.map} (${code.strictLocation})`,
		text: code.tip,
	})),
	{
		label: "Enter Codes",
		text: "Enter the codes in the War Room in order: Shi No Numa, Der Riese, Shangri-La, Kino Der Toten",
	},
	{
		label: "Final Step",
		text: "Place the teleporter pieces to travel to Groom Lake and survive for 3 rounds",
	},
];

// Data interface for this section
interface CodesSectionData {
	codes: {
		[key: string]: string; // code1, code2, code3, code4
	};
	locationOrder: number[]; // Track the order of locations for drag/drop
}

function CodesSection(props: BaseSectionProps<CodesSectionData>) {
	const [inputType, setInputType] = useState<"keypad" | "text">("keypad");
	const [uiMode, setUiMode] = useState<"standard" | "compact">("standard");
	const [selectedLocationId, setSelectedLocationId] = useState<number>(1); // Default to first location

	// Drag and drop sensors with better touch support
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 5, // Small distance for mouse
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 250, // 250ms delay for touch
				tolerance: 5, // 5px tolerance during delay
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	return (
		<BaseSection
			config={{
				storageKey: "classified-codes-data",
				defaultValue: {
					codes: {},
					locationOrder: [3, 4, 2, 1], // Default order for code collection
				},
				title: "Project Skadi",
				description:
					"Collect 4 codes and their related maps to obtain the correct sequence for Project Skadi.",
				resetButtonText: "Reset Codes",
				tipsConfig: {
					show: true,
					items: TIPS,
				},
				settingsConfig: {
					show: true,
					title: "Input Preferences",
					description:
						"Customize how you input the 4-digit codes and adjust the UI layout.",
					settings: [
						{
							id: "inputType",
							label: "Input Type",
							value: inputType,
							options: [
								{ value: "keypad", label: "Keypad" },
								{ value: "text", label: "Text Input" },
							],
							note: "Choose your preferred input method for the 4-digit codes",
							onChange: (value) => setInputType(value as "keypad" | "text"),
						},
						{
							id: "uiMode",
							label: "UI Mode",
							value: uiMode,
							options: [
								{ value: "standard", label: "Standard" },
								{ value: "compact", label: "Compact" },
							],
							note: "Adjust the layout density of the code input grid",
							onChange: (value) => setUiMode(value as "standard" | "compact"),
						},
					],
				},
			}}
			getProgress={(data: CodesSectionData) => {
				const enteredCodes = Object.values(data.codes || {}).filter(
					(code) => code && code.trim() !== ""
				).length;
				return {
					completed: enteredCodes,
					total: 4,
					isComplete: enteredCodes === 4,
				};
			}}
			onSectionReset={() => {
				// Reset to first location in the order when data is reset
				const defaultOrder = [3, 4, 2, 1];
				setSelectedLocationId(defaultOrder[0]);
			}}
			{...props}
		>
			{({ data, setData, progress }) => {
				// Handle drag end for reordering locations
				const handleDragEnd = (event: DragEndEvent) => {
					const { active, over } = event;

					if (over && active.id !== over.id) {
						const currentOrder = data.locationOrder || [3, 4, 2, 1];
						const oldIndex = currentOrder.indexOf(active.id as number);
						const newIndex = currentOrder.indexOf(over.id as number);

						const newOrder = arrayMove(currentOrder, oldIndex, newIndex);

						setData((prev: CodesSectionData) => ({
							...prev,
							locationOrder: newOrder,
						}));

						// Auto-select the first incomplete location in the new order
						const firstIncompleteLocation = newOrder.find((locationId) => {
							const codeKey = `code${locationId}`;
							return !data.codes[codeKey] || data.codes[codeKey].length < 4;
						});

						// If we found an incomplete location, select it; otherwise keep current selection
						if (firstIncompleteLocation) {
							setSelectedLocationId(firstIncompleteLocation);
						}
					}
				};

				// Handle location selection
				const handleLocationSelect = (locationId: number) => {
					setSelectedLocationId(locationId);
				};

				// Handle code input
				const handleCodeChange = (value: string) => {
					const codeKey = `code${selectedLocationId}`;
					setData((prev: CodesSectionData) => ({
						...prev,
						codes: {
							...prev.codes,
							[codeKey]: value,
						},
					}));

					// Auto-progression: if code is complete (4 digits), move to next incomplete location
					if (value.length === 4) {
						const currentOrderedIds = data.locationOrder || [3, 4, 2, 1];
						const currentIndex = currentOrderedIds.indexOf(selectedLocationId);

						// Find next incomplete location in current order
						for (let i = currentIndex + 1; i < currentOrderedIds.length; i++) {
							const nextId = currentOrderedIds[i];
							const nextCodeKey = `code${nextId}`;
							if (
								!data.codes[nextCodeKey] ||
								data.codes[nextCodeKey].length < 4
							) {
								setSelectedLocationId(nextId);
								return;
							}
						}

						// If no incomplete locations after current, try from beginning
						for (let i = 0; i < currentIndex; i++) {
							const nextId = currentOrderedIds[i];
							const nextCodeKey = `code${nextId}`;
							if (
								!data.codes[nextCodeKey] ||
								data.codes[nextCodeKey].length < 4
							) {
								setSelectedLocationId(nextId);
								return;
							}
						}
					}
				};

				// Get ordered locations based on current order
				const getOrderedLocations = () => {
					const locationOrder = data.locationOrder || [3, 4, 2, 1]; // Fallback to default order
					return locationOrder.map(
						(id) => CODES_DATA.find((code) => code.id === id)!
					);
				};

				// Get selected location data
				const selectedLocation = CODES_DATA.find(
					(code) => code.id === selectedLocationId
				);
				const selectedCode = data.codes[`code${selectedLocationId}`] || "";

				// Get codes in the correct sequence order for results (sorted by order field)
				const getOrderedCodes = () => {
					return CODES_DATA.sort((a, b) => a.order - b.order) // Sort by order field (1, 2, 3, 4)
						.map((codeData) => ({
							...codeData,
							value: data.codes?.[`code${codeData.id}`] || "",
						}));
				};

				return (
					<div className="codes-section-content">
						{/* New Location Selection + Numberpad Layout */}
						<div className="codes-input-section">
							<h3>Code Collection Order</h3>

							<div className="codes-input-layout">
								{/* Left Column - Location Selector */}
								<div className="location-selector">
									<DndContext
										sensors={sensors}
										collisionDetection={closestCenter}
										onDragEnd={handleDragEnd}
									>
										<SortableContext
											items={data.locationOrder || [3, 4, 2, 1]}
											strategy={verticalListSortingStrategy}
										>
											{getOrderedLocations().map((codeData) => {
												const isSelected = selectedLocationId === codeData.id;
												const isCompleted =
													data.codes[`code${codeData.id}`]?.length === 4;

												return (
													<SortableLocationButton
														key={codeData.id}
														codeData={codeData}
														isSelected={isSelected}
														isCompleted={isCompleted}
														onClick={() => handleLocationSelect(codeData.id)}
													/>
												);
											})}
										</SortableContext>
									</DndContext>
								</div>

								{/* Right Column - Number Pad */}
								<div className="numberpad-column">
									{selectedLocation && (
										<NumberPad
											value={selectedCode}
											onChange={handleCodeChange}
											title={`${selectedLocation.order} - ${selectedLocation.casualLocation}`}
											maxLength={4}
											placeholder="____"
											inputMode={inputType}
											className="main-numberpad"
										/>
									)}
								</div>
							</div>
						</div>

						{/* Results Section - Show when we have at least one completed code */}
						{progress.completed > 0 && (
							<div className="codes-results-section">
								<FloatingCard className="completion-card">
									<h4>
										{progress.isComplete
											? "🎉 All Codes Collected!"
											: "📋 Project Skadi Sequence"}
									</h4>
									<p>
										{progress.isComplete
											? "Here are your codes in the correct sequence order:"
											: "Codes collected so far in the correct sequence order:"}
									</p>

									<div className="codes-sequence">
										{getOrderedCodes()
											.filter((code) => code.value && code.value.length === 4)
											.map((code) => (
												<div key={code.id} className="sequence-item">
													<div className="sequence-number">{code.order}</div>
													<div className="sequence-details">
														<div className="sequence-map">{code.map}</div>
														<div className="sequence-code">{code.value}</div>
													</div>
												</div>
											))}
									</div>
								</FloatingCard>
							</div>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default CodesSection;

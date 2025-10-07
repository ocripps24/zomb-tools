import { useMemo, useCallback } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	TouchSensor,
	MouseSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Location Item Component
function SortableLocationItem({
	location,
	index,
	displayNumber,
	isFinalFixed,
	isLastLocation,
	locationLabel,
	onRemove,
}: {
	location: string;
	index: number;
	displayNumber: number;
	isFinalFixed: boolean;
	isLastLocation: boolean;
	locationLabel?: string;
	onRemove: (index: number) => void;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: location });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`location-order-item ${isFinalFixed ? "location-final" : ""} ${
				isDragging ? "location-order-item--dragging" : ""
			}`}
			title={isFinalFixed ? `${location} (Final step)` : "Drag to reorder"}
		>
			<span className="location-number">{displayNumber}</span>
			<div className="location-info">
				<div className="location-name">
					<span className="location-name-primary">{location}</span>
					{locationLabel && (
						<span className="location-name-detail"> - {locationLabel}</span>
					)}
				</div>
			</div>
			{!isFinalFixed && (
				<div className="location-actions">
					<button
						className="drag-handle"
						{...attributes}
						{...listeners}
						title="Drag to reorder"
						type="button"
					>
						⋮⋮
					</button>
					{isLastLocation && (
						<button
							onClick={() => onRemove(index)}
							className="delete-btn"
							title="Remove last location"
							type="button"
						>
							✕
						</button>
					)}
				</div>
			)}
		</div>
	);
}

export interface OrderedLocationSectionProps {
	locations: string[];
	locationLabels?: { [key: string]: string };
	onLocationsChange: (locations: string[]) => void;
	finalFixedLocation?: string;
}

export function OrderedLocationSection({
	locations,
	locationLabels = {},
	onLocationsChange,
	finalFixedLocation,
}: OrderedLocationSectionProps) {
	// Configure sensors for @dnd-kit
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

	const addLocation = useCallback(
		(location: string) => {
			if (!locations.includes(location)) {
				onLocationsChange([...locations, location]);
			}
		},
		[locations, onLocationsChange]
	);

	const removeLocation = useCallback(
		(index: number) => {
			onLocationsChange(locations.filter((_, i) => i !== index));
		},
		[locations, onLocationsChange]
	);

	const handleDragEnd = useCallback(
		(event: any) => {
			const { active, over } = event;

			if (active.id !== over?.id) {
				const oldIndex = locations.indexOf(active.id);
				const newIndex = locations.indexOf(over.id);
				onLocationsChange(arrayMove(locations, oldIndex, newIndex));
			}
		},
		[locations, onLocationsChange]
	);

	const clearAll = useCallback(() => {
		onLocationsChange([]);
	}, [onLocationsChange]);

	// All possible locations including the final fixed one
	const allLocations = useMemo(() => {
		const locs = Object.keys(locationLabels);
		if (finalFixedLocation && !locs.includes(finalFixedLocation)) {
			return [...locs, finalFixedLocation];
		}
		return locs;
	}, [locationLabels, finalFixedLocation]);

	const availableLocations = useMemo(() => {
		return allLocations.filter(
			(location) =>
				!locations.includes(location) && location !== finalFixedLocation
		);
	}, [allLocations, locations, finalFixedLocation]);

	// Get display order with final fixed location automatically added at the end
	const displayOrder = useMemo(() => {
		const order = [...locations];
		if (finalFixedLocation) {
			order.push(finalFixedLocation);
		}
		return order;
	}, [locations, finalFixedLocation]);

	return (
		<div className="locations-section">
			{/* Available locations - only show when there are locations available */}
			{availableLocations.length > 0 && (
				<div className="available-locations">
					<h4>Available Locations:</h4>
					<div className="location-grid">
						{availableLocations.map((location) => (
							<button
								key={location}
								onClick={() => addLocation(location)}
								className="location-btn"
							>
								{location}
							</button>
						))}
					</div>
				</div>
			)}

			{/* Current location order */}
			{displayOrder.length > 0 && (
				<div className="location-order">
					<h4>Current Order:</h4>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={locations}
							strategy={verticalListSortingStrategy}
						>
							<div className="location-order-list">
								{displayOrder.map((location, index) => {
									const isFinalFixed =
										finalFixedLocation &&
										location === finalFixedLocation &&
										index === displayOrder.length - 1;
									const isLastLocation =
										!isFinalFixed && index === locations.length - 1;
									// For final fixed location, show its fixed position number
									const totalExpected = allLocations.length;
									const displayNumber = isFinalFixed ? totalExpected : index + 1;

									return (
										<SortableLocationItem
											key={location}
											location={location}
											index={index}
											displayNumber={displayNumber}
											isFinalFixed={!!isFinalFixed}
											isLastLocation={isLastLocation}
											locationLabel={locationLabels[location]}
											onRemove={removeLocation}
										/>
									);
								})}
							</div>
						</SortableContext>
					</DndContext>
					{locations.length > 0 && (
						<button onClick={clearAll} className="btn btn-secondary clear-btn">
							Clear All
						</button>
					)}
				</div>
			)}
		</div>
	);
}

export default OrderedLocationSection;

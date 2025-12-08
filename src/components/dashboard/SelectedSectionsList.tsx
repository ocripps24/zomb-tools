import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DashboardSection } from "@/types/dashboard";

interface SelectedSectionsListProps {
	sections: DashboardSection[];
	onRemove: (index: number) => void;
	onReorder: (sections: DashboardSection[]) => void;
}

interface SortableSectionItemProps {
	section: DashboardSection;
	index: number;
	onRemove: (index: number) => void;
}

/**
 * Sortable section item for drag-and-drop
 */
function SortableSectionItem({
	section,
	index,
	onRemove,
}: SortableSectionItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: `${section.gameId}-${section.mapId}-${section.sectionId}`,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`selected-section ${isDragging ? "dragging" : ""}`}
		>
			<button
				className="selected-section__drag-handle"
				{...attributes}
				{...listeners}
				aria-label="Drag to reorder"
			>
				<span className="drag-icon">⋮⋮</span>
			</button>

			<div className="selected-section__info">
				<div className="selected-section__order">{index + 1}</div>
				<div className="selected-section__details">
					<div className="selected-section__name">{section.sectionName}</div>
					<div className="selected-section__path">
						{section.gameName} › {section.mapName}
					</div>
				</div>
			</div>

			<button
				className="selected-section__remove"
				onClick={() => onRemove(index)}
				aria-label="Remove section"
			>
				✕
			</button>
		</div>
	);
}

/**
 * List of selected sections with drag-and-drop reordering
 */
export default function SelectedSectionsList({
	sections,
	onRemove,
	onReorder,
}: SelectedSectionsListProps) {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = sections.findIndex(
				(s) => `${s.gameId}-${s.mapId}-${s.sectionId}` === active.id
			);
			const newIndex = sections.findIndex(
				(s) => `${s.gameId}-${s.mapId}-${s.sectionId}` === over.id
			);

			const reordered = arrayMove(sections, oldIndex, newIndex);
			onReorder(reordered);
		}
	};

	if (sections.length === 0) {
		return (
			<div className="selected-sections-empty">
				<p>No sections selected yet</p>
				<p className="selected-sections-empty__hint">
					Click on sections from the available list to add them here
				</p>
			</div>
		);
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={sections.map(
					(s) => `${s.gameId}-${s.mapId}-${s.sectionId}`
				)}
				strategy={verticalListSortingStrategy}
			>
				<div className="selected-sections-list">
					{sections.map((section, index) => (
						<SortableSectionItem
							key={`${section.gameId}-${section.mapId}-${section.sectionId}`}
							section={section}
							index={index}
							onRemove={onRemove}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}

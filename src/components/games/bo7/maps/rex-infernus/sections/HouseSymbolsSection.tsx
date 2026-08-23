import { useRef, useState } from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import HouseSymbolsImage from "@/assets/maps/bo7/rex-infernus/rex-infernus-house-symbols.jpg";

const MAX_SYMBOLS = 4;
const DRAG_THRESHOLD_PX = 6;

interface SymbolPosition {
	x: number; // percent, relative to the image
	y: number; // percent, relative to the image
}

interface HouseSymbolsData {
	positions: SymbolPosition[];
}

const DEFAULT_VALUE: HouseSymbolsData = {
	positions: [],
};

function HouseSymbolsSection(props: BaseSectionProps<HouseSymbolsData>) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
	const dragStateRef = useRef({ startX: 0, startY: 0, moved: false });

	return (
		<BaseSection
			config={{
				storageKey: "rex-infernus-house-symbols-data",
				defaultValue: DEFAULT_VALUE,
				title: "House Symbols",
				description:
					"Record the order of your symbols by clicking where they appear on the house.",
				resetButtonText: "Clear",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Triggering the Symbols",
							text: "Shoot the basketball in the broken eave at the front of the house and let it fall. The first symbol will spawn in the round following opening of pack-a-punch and the next 3 will spawn in subsequent rounds. ",
						},
						{
							label: "Shooting the Symbols",
							text: "The symbols must be shot in spawn order and at the start of an exfil round. They will pulse when shot correctly. Taking too long or shooting the wrong order will play a failure sound.",
						},
						{
							label: "Placing Symbols",
							text: "Click the image where a symbol appears. It's numbered in the order you click, up to 4 total.",
						},
						{
							label: "Fixing Mistakes",
							text: "Tap a placed number to remove it (everything after it automatically renumbers), or drag it to a new spot without losing its place in the order.",
						},
					],
				},
			}}
			getProgress={(data: HouseSymbolsData) => ({
				completed: data.positions.length,
				total: MAX_SYMBOLS,
				isComplete: data.positions.length === MAX_SYMBOLS,
			})}
			{...props}
		>
			{({ data, setData }) => {
				const positionFromPointer = (clientX: number, clientY: number) => {
					const rect = containerRef.current?.getBoundingClientRect();
					if (!rect) return { x: 0, y: 0 };
					const x = Math.min(
						100,
						Math.max(0, ((clientX - rect.left) / rect.width) * 100),
					);
					const y = Math.min(
						100,
						Math.max(0, ((clientY - rect.top) / rect.height) * 100),
					);
					return { x, y };
				};

				const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
					if (data.positions.length >= MAX_SYMBOLS) return;
					const { x, y } = positionFromPointer(e.clientX, e.clientY);
					setData({ positions: [...data.positions, { x, y }] });
				};

				// A tap removes the marker; a drag repositions it without losing
				// its place in the order. Distinguished by movement distance
				// since both start the same way, on the marker's pointerdown.
				const handleMarkerPointerDown = (
					e: React.PointerEvent<HTMLButtonElement>,
					index: number,
				) => {
					e.stopPropagation();
					dragStateRef.current = {
						startX: e.clientX,
						startY: e.clientY,
						moved: false,
					};
					setDraggingIndex(index);
					e.currentTarget.setPointerCapture(e.pointerId);
				};

				const handleMarkerPointerMove = (
					e: React.PointerEvent<HTMLButtonElement>,
					index: number,
				) => {
					if (draggingIndex !== index) return;
					const dx = e.clientX - dragStateRef.current.startX;
					const dy = e.clientY - dragStateRef.current.startY;
					if (
						!dragStateRef.current.moved &&
						Math.hypot(dx, dy) < DRAG_THRESHOLD_PX
					) {
						return;
					}
					dragStateRef.current.moved = true;
					const { x, y } = positionFromPointer(e.clientX, e.clientY);
					setData({
						positions: data.positions.map((pos, i) =>
							i === index ? { x, y } : pos,
						),
					});
				};

				const handleMarkerPointerUp = (
					e: React.PointerEvent<HTMLButtonElement>,
					index: number,
				) => {
					e.stopPropagation();
					if (!dragStateRef.current.moved) {
						setData({
							positions: data.positions.filter((_, i) => i !== index),
						});
					}
					setDraggingIndex(null);
				};

				return (
					<div className="house-symbols-section">
						<p className="house-symbols-section__hint">
							{data.positions.length >= MAX_SYMBOLS
								? "All 4 symbols placed — tap a number to remove it, or drag it to reposition."
								: `Click the image to place symbol ${data.positions.length + 1}.`}
						</p>

						<div
							ref={containerRef}
							className="house-symbols-image"
							onClick={handleImageClick}
							role="button"
							tabIndex={0}
						>
							<img
								src={HouseSymbolsImage}
								alt="Rex Infernus house, showing where symbols appear"
								draggable={false}
							/>
							{data.positions.map((pos, index) => (
								<button
									key={index}
									type="button"
									className={[
										"house-symbols-marker",
										draggingIndex === index
											? "house-symbols-marker--dragging"
											: "",
									]
										.filter(Boolean)
										.join(" ")}
									style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
									onPointerDown={(e) => handleMarkerPointerDown(e, index)}
									onPointerMove={(e) => handleMarkerPointerMove(e, index)}
									onPointerUp={(e) => handleMarkerPointerUp(e, index)}
									onClick={(e) => {
										e.stopPropagation();
										e.preventDefault();
									}}
									aria-label={`Symbol ${index + 1} — tap to remove, drag to reposition`}
								>
									{index + 1}
								</button>
							))}
						</div>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default HouseSymbolsSection;

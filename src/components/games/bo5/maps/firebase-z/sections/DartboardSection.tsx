import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import ResultsDisplay from "@/components/ui/ResultsDisplay";

// Traditional dartboard number layout (clockwise from top)
const DARTBOARD_NUMBERS = [
	20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
];

interface DartboardData {
	segments: number[]; // Array of up to 3 selected segment numbers
}

const TIPS_CONFIG = {
	show: true,
	items: [
		{
			label: "Computer Screen",
			text: "Watch the computer screen in the crash site to see which 3 dartboard segments light up in sequence",
		},
		{
			label: "Order Matters",
			text: "Remember the exact order the segments appear on the screen",
		},
		{
			label: "Spawn Dartboard",
			text: "Shoot the segments on the physical dartboard in spawn in the same order, then shoot the bullseye to complete",
		},
	],
};

function DartboardSection(props: BaseSectionProps<DartboardData>) {
	return (
		<BaseSection
			config={{
				storageKey: "firebase-z-dartboard-data",
				defaultValue: { segments: [] },
				title: "Dartboard Code",
				description:
					"Click the segments in the order shown on the computer screen (3 segments total)",
				resetButtonText: "Clear Dartboard",
				tipsConfig: TIPS_CONFIG,
			}}
			getProgress={(data: DartboardData) => ({
				completed: data.segments.length,
				total: 3,
				isComplete: data.segments.length === 3,
			})}
			{...props}
		>
			{({ data, setData, progress }) => {
				const handleSegmentClick = (segmentNumber: number) => {
					// Only add if we haven't reached 3 segments yet
					if (data.segments.length < 3) {
						setData({
							segments: [...data.segments, segmentNumber],
						});
					}
				};

				return (
					<div className="dartboard-section">
						{/* Dartboard SVG */}
						<div className="dartboard-container">
							<svg
								className="dartboard"
								viewBox="0 0 400 400"
								xmlns="http://www.w3.org/2000/svg"
							>
								{/* Background circle */}
								<circle
									className="dartboard-background"
									cx="200"
									cy="200"
									r="190"
								/>

								{/* Generate 20 segments */}
								{DARTBOARD_NUMBERS.map((number, index) => {
									// Offset by half a segment (9 degrees) to center first segment at top
									const segmentAngle = 360 / 20; // 18 degrees per segment
									const offset = segmentAngle / 2; // 9 degrees offset
									const angle = index * segmentAngle - 90 - offset;
									const nextAngle = (index + 1) * segmentAngle - 90 - offset;
									const isSelected = data.segments.includes(number);

									// Calculate path for segment (pie slice)
									const startAngleRad = (angle * Math.PI) / 180;
									const endAngleRad = (nextAngle * Math.PI) / 180;
									const outerRadius = 190;
									const innerRadius = 40; // Leave space for center

									const x1 = 200 + innerRadius * Math.cos(startAngleRad);
									const y1 = 200 + innerRadius * Math.sin(startAngleRad);
									const x2 = 200 + outerRadius * Math.cos(startAngleRad);
									const y2 = 200 + outerRadius * Math.sin(startAngleRad);
									const x3 = 200 + outerRadius * Math.cos(endAngleRad);
									const y3 = 200 + outerRadius * Math.sin(endAngleRad);
									const x4 = 200 + innerRadius * Math.cos(endAngleRad);
									const y4 = 200 + innerRadius * Math.sin(endAngleRad);

									const pathData = `
										M ${x1} ${y1}
										L ${x2} ${y2}
										A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3}
										L ${x4} ${y4}
										A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}
										Z
									`;

									// Calculate position for number label
									const labelRadius = 165;
									const labelAngle = (angle + nextAngle) / 2;
									const labelAngleRad = (labelAngle * Math.PI) / 180;
									const labelX = 200 + labelRadius * Math.cos(labelAngleRad);
									const labelY = 200 + labelRadius * Math.sin(labelAngleRad);

									return (
										<g key={number} className="dartboard-segment-group">
											{/* Segment */}
											<path
												d={pathData}
												className={`dartboard-segment ${
													isSelected ? "selected" : ""
												} ${index % 2 === 0 ? "even" : "odd"}`}
												onClick={() => handleSegmentClick(number)}
											/>

											{/* Number label */}
											<text
												x={labelX}
												y={labelY}
												className={`dartboard-label ${
													isSelected ? "selected" : ""
												}`}
											>
												{number}
											</text>
										</g>
									);
								})}

								{/* Center circle (non-interactive) */}
								<circle className="dartboard-center" cx="200" cy="200" r="40" />
							</svg>
						</div>

						{/* Results Display */}
						<ResultsDisplay
							variant="sequence"
							title="Dartboard Sequence"
							sequenceItems={data.segments.map((segment, index) => ({
								id: `segment-${index}`,
								order: index + 1,
								value: segment,
								status: "complete" as const,
							}))}
							note="Shoot these segments in order on the spawn dartboard, then shoot the bullseye"
							showIncomplete={true}
							totalExpected={3}
							progressMode="badge"
							progress={progress}
							colorScheme="success"
						/>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default DartboardSection;

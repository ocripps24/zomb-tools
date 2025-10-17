import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import ResultsDisplay from "@/components/ui/ResultsDisplay";
import { ReferenceImages } from "@/components/ui/ReferenceImages";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

// Import atlas images
import Atlas1 from "@/assets/maps/bo4/dead-of-the-night/dotn-atlas-1.jpg";
import Atlas2 from "@/assets/maps/bo4/dead-of-the-night/dotn-atlas-2.jpg";
import Atlas3 from "@/assets/maps/bo4/dead-of-the-night/dotn-atlas-3.jpg";
import Atlas4 from "@/assets/maps/bo4/dead-of-the-night/dotn-atlas-4.jpg";
import Atlas5 from "@/assets/maps/bo4/dead-of-the-night/dotn-atlas-5.jpg";
import Atlas6 from "@/assets/maps/bo4/dead-of-the-night/dotn-atlas-6.jpg";

interface AtlasPosition {
	id: number;
	description: string;
	image: string;
	movements: {
		left: string;
		middle: string;
		right: string;
	};
}

const ATLAS_POSITIONS: AtlasPosition[] = [
	{
		id: 1,
		description: "Inner ring - mirror above crystal",
		image: Atlas1,
		movements: { left: "-5", middle: "+6", right: "+5" },
	},
	{
		id: 2,
		description: "Inner/Outer rings horizontal",
		image: Atlas2,
		movements: { left: "+5", middle: "+6", right: "-5" },
	},
	{
		id: 3,
		description: "Outer ring angled down ",
		image: Atlas3,
		movements: { left: "+6", middle: "+5", right: "-5" },
	},
	{
		id: 4,
		description: "Inner ring horizontal",
		image: Atlas4,
		movements: { left: "+6", middle: "-5", right: "+5" },
	},
	{
		id: 5,
		description: "Outer ring angled up",
		image: Atlas5,
		movements: { left: "-5", middle: "+5", right: "+6" },
	},
	{
		id: 6,
		description: "Inner ring - mirror below crystal",
		image: Atlas6,
		movements: { left: "+5", middle: "-5", right: "+6" },
	},
];

interface AtlasData {
	selectedPosition: number | null;
}

const TIPS_CONFIG = {
	show: true,
	items: [
		{
			label: "Objective",
			text: "Align the rings and mirrors so to focus the blue, green and red beams of light",
		},
		{
			label: "Starting Position",
			text: "The starting position of the rings has 6 possible configurations, choose yours to receive the inputs for the controls",
		},
		{
			label: "Controls",
			text: "Use the Left, Middle, and Right control panels to adjust the ring positions",
		},
	],
};

function AtlasSection(props: BaseSectionProps<AtlasData>) {
	const { settings } = useGlobalSettings();
	const isCompact = settings.uiSize === "compact";

	return (
		<BaseSection
			config={{
				storageKey: "dead-of-the-night-atlas-data",
				defaultValue: { selectedPosition: null },
				title: "Atlas",
				description:
					"Select your starting ring configuration to get the mirror alignment movements",
				resetButtonText: "Reset Selection",
				tipsConfig: TIPS_CONFIG,
			}}
			getProgress={(data: AtlasData) => {
				const isComplete = data.selectedPosition !== null;
				return {
					completed: isComplete ? 1 : 0,
					total: 1,
					isComplete,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const handlePositionSelect = (positionId: number) => {
					setData({
						selectedPosition:
							data.selectedPosition === positionId ? null : positionId,
					});
				};

				const selectedPositionData = ATLAS_POSITIONS.find(
					(pos) => pos.id === data.selectedPosition
				);

				return (
					<div className="atlas-section">
						{/* Position Selection Grid */}
						<div className="position-grid">
							{ATLAS_POSITIONS.map((position) => {
								const isSelected = data.selectedPosition === position.id;

								return (
									<button
										key={position.id}
										className={`position-card ${isSelected ? "selected" : ""}`}
										onClick={() => handlePositionSelect(position.id)}
										type="button"
									>
										<div className="position-header">
											<span className="position-number">{position.id}</span>
											<span className="position-description">
												{position.description}
											</span>
										</div>
										{!isCompact && (
											<div className="position-image-wrapper">
												<img
													src={position.image}
													alt={position.description}
													className="position-image"
												/>
											</div>
										)}
									</button>
								);
							})}
						</div>

						{/* Results Display */}
						{selectedPositionData && (
							<ResultsDisplay
								variant="grid"
								title="Mirror Alignment Movements"
								description="positive(+) = right side input -  negative(-) = left side input"
								gridColumns={3}
								results={[
									{
										id: "left",
										label: "Left",
										value: selectedPositionData.movements.left,
									},
									{
										id: "middle",
										label: "Middle",
										value: selectedPositionData.movements.middle,
									},
									{
										id: "right",
										label: "Right",
										value: selectedPositionData.movements.right,
									},
								]}
								colorScheme="success"
							/>
						)}

						{/* Reference Images Slider */}
						<ReferenceImages
							images={ATLAS_POSITIONS.map((position) => ({
								src: position.image,
								alt: position.description,
								label: `Starting Position ${position.id}`,
							}))}
						/>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default AtlasSection;

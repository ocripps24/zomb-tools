import { FloatingCard, LocationCard } from "@/components/content";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// Fuse box configurations - these are always the same
const FUSE_BOXES = [
	{
		id: "diner",
		location: "Diner",
		position: "Up",
		completed: false,
	},
	{
		id: "beds",
		location: "Beds",
		position: "Up",
		completed: false,
	},
	{
		id: "lounge",
		location: "Lounge",
		position: "Down",
		completed: false,
	},
	{
		id: "generators",
		location: "Generators",
		position: "Up",
		completed: false,
	},
	{
		id: "storage",
		location: "Storage",
		position: "Down",
		completed: false,
	},
	{
		id: "solitary",
		location: "Solitary",
		position: "Down",
		completed: false,
	},
];

// Data interface for this section
interface CoreValue4Data {
	fuseBoxes: Array<{
		id: string;
		location: string;
		position: string;
		completed: boolean;
	}>;
}

function CoreValue4Section(props: BaseSectionProps<CoreValue4Data>) {
	return (
		<BaseSection
			config={{
				storageKey: "alpha-omega-core-value-4-data",
				defaultValue: { fuseBoxes: [...FUSE_BOXES] },
				title: "Core Value 4",
				description:
					"Set all fuse boxes to their correct positions to turn all lights green and restore power.",
				resetButtonText: "Reset Fuse Boxes",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Power Failure",
							text: "The power will fail automatically during this step of the Easter Egg",
						},
						{
							label: "Fuse Box Puzzle",
							text: "Each fuse box has 6 lights that change from red to green based on the Up/Down position",
						},
						{
							label: "Objective",
							text: "Set all 6 fuse boxes to their correct positions to make all lights green",
						},
						{
							label: "Fixed Solution",
							text: "The fuse box positions are always the same - use the reference below",
						},
						{
							label: "Power Restoration",
							text: "Once all lights are green, return to the main power switch to restore power.",
						},
					],
				},
			}}
			getProgress={(data: CoreValue4Data) => {
				const completedCount =
					data.fuseBoxes?.filter((box) => box.completed).length || 0;
				return {
					completed: completedCount,
					total: 6,
					isComplete: completedCount === 6,
				};
			}}
			{...props}
		>
			{({ data, setData, progress }) => {
				const toggleFuseBoxCompleted = (fuseBoxId: string) => {
					setData((prev: CoreValue4Data) => ({
						...prev,
						fuseBoxes: prev.fuseBoxes.map((box) =>
							box.id === fuseBoxId ? { ...box, completed: !box.completed } : box
						),
					}));
				};

				return (
					<div className="core-value-4-section-content">
						<div className="fuse-box-reference">
							<h3>Fuse Box Positions Reference</h3>
							<p>Set each fuse box to the position shown below:</p>

							<div className="location-grid location-grid--fuse-boxes">
								{data.fuseBoxes?.map((fuseBox) => (
									<LocationCard
										key={fuseBox.id}
										primaryText={fuseBox.location}
										secondaryText={`Position: ${fuseBox.position}`}
										isCompleted={fuseBox.completed}
										onToggle={() => toggleFuseBoxCompleted(fuseBox.id)}
										showSecondaryOnlyWhenCompleted={false}
										variant="location"
									/>
								))}
							</div>
						</div>

						{progress.isComplete && (
							<div className="section-completion">
								<FloatingCard className="completion-card">
									<h4>🎉 All Fuse Boxes Set!</h4>
									<p>
										All fuse boxes are in the correct positions. All lights
										should now be green and the power will be restored
										automatically.
									</p>
								</FloatingCard>
							</div>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default CoreValue4Section;

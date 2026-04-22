import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

interface ChemistrySectionData {
	placeholder: boolean;
}

function ChemistrySection(props: BaseSectionProps<ChemistrySectionData>) {
	return (
		<BaseSection<ChemistrySectionData>
			config={{
				storageKey: "radioactive-thing-crafting-data",
				defaultValue: { placeholder: true },
				title: "Chemistry - Crafting",
				description:
					"Use your Chemistry - Data values to calculate and craft the correct chemical mixture.",
			}}
			getProgress={() => ({ completed: 0, total: 0, isComplete: false })}
			{...props}
		>
			{() => (
				<p className="radioactive-coming-soon">
					Chemistry section coming soon.
				</p>
			)}
		</BaseSection>
	);
}

export default ChemistrySection;

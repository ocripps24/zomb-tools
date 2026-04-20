import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

interface RooftopSymbolsData {
	placeholder: boolean;
}

const DEFAULT_DATA: RooftopSymbolsData = {
	placeholder: false,
};

function RooftopSymbolsSection(props: BaseSectionProps<RooftopSymbolsData>) {
	return (
		<BaseSection
			config={{
				storageKey: "shaolin-shuffle-rooftop-symbols-data",
				defaultValue: DEFAULT_DATA,
				title: "Rooftop Symbols",
				description: "Coming soon.",
			}}
			getProgress={(_data: RooftopSymbolsData) => ({
				completed: 0,
				total: 1,
				isComplete: false,
			})}
			{...props}
		>
			{() => (
				<div className="rooftop-symbols-section">
					<p style={{ color: "var(--text-secondary)" }}>
						This section is under construction.
					</p>
				</div>
			)}
		</BaseSection>
	);
}

export default RooftopSymbolsSection;

export interface TipItem {
	label?: string;  // Optional label
	text?: string;   // Optional text
	nested?: TipItem[];  // Optional nested tips
}

export interface TipsConfig {
	show: boolean;
	items: TipItem[];
}

export interface TipsSectionProps {
	config: TipsConfig;
	title?: string;
}

/**
 * Renders a single tip item, including nested items if present
 * Handles optional label and text fields:
 * - Label only: Renders label with nested items (e.g., category header)
 * - Text only: Renders simple bullet point without bold label
 * - Both: Renders "Label: Text" format (standard)
 */
function TipItemRenderer({ tip, index }: { tip: TipItem; index: number }) {
	return (
		<li key={index}>
			{tip.label && tip.text && (
				<>
					<strong>{tip.label}:</strong> {tip.text}
				</>
			)}
			{tip.label && !tip.text && <strong>{tip.label}</strong>}
			{!tip.label && tip.text && <>{tip.text}</>}
			{tip.nested && tip.nested.length > 0 && (
				<ul className="nested-tips">
					{tip.nested.map((nestedTip, nestedIndex) => (
						<TipItemRenderer
							key={nestedIndex}
							tip={nestedTip}
							index={nestedIndex}
						/>
					))}
				</ul>
			)}
		</li>
	);
}

/**
 * Centralized tips section component used across all map sections.
 * Provides consistent styling and structure for displaying tips and instructions.
 * Supports nested bullet points for hierarchical information.
 */
function TipsSection({ config, title = "Tips/Instructions" }: TipsSectionProps) {
	// Don't render if tips are disabled or no items
	if (!config.show || !config.items || config.items.length === 0) {
		return null;
	}

	return (
		<div className="section-tips">
			<h3>{title}</h3>
			<ul>
				{config.items.map((tip, index) => (
					<TipItemRenderer key={index} tip={tip} index={index} />
				))}
			</ul>
		</div>
	);
}

export default TipsSection;

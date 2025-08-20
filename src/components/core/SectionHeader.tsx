import React from "react";
import Button from "./Button";

interface SectionHeaderProps {
	title: string;
	progress?: {
		completed: number;
		total: number;
	};
	description?: string;
	onReset: () => void;
	resetButtonText?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
	title,
	progress,
	description,
	onReset,
	resetButtonText = "Reset All",
}) => {
	return (
		<div className="section-header">
			<div className="section-header__top-row">
				<h3 className="section-header__title">
					{title}{" "}
					{progress && (
						<span className="progress-counter">
							({progress.completed}/{progress.total})
						</span>
					)}
				</h3>
				<Button variantType="secondary" onClick={onReset}>
					<span className="btn__full">{resetButtonText}</span>
					<span className="btn__short">Clear</span>
				</Button>
			</div>
			{description && (
				<p className="section-header__description">{description}</p>
			)}
		</div>
	);
};

export default SectionHeader;
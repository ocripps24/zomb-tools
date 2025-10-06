import React from "react";
import Button from "./Button";
import YouTubeIcon from "@/assets/icons/youtube-icon.svg";

interface Guide {
	url: string;
	type: "internal" | "external";
	channelName?: string;
}

interface SectionHeaderProps {
	title: string;
	progress?: {
		completed: number;
		total: number;
	};
	description?: string;
	onReset: () => void;
	resetButtonText?: string;
	guide?: Guide;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
	title,
	progress,
	description,
	onReset,
	resetButtonText = "Clear",
	guide,
}) => {
	const scrollToGuide = () => {
		const guideElement = document.getElementById("youtube-guide-section");
		if (guideElement) {
			guideElement.scrollIntoView({ behavior: "smooth" });
		}
	};

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
				<div className="section-header__buttons">
					{guide && (
						<button
							onClick={scrollToGuide}
							className="btn btn-secondary guide-btn"
						>
							<span className="btn-icon">
								<YouTubeIcon />
							</span>
						</button>
					)}
					<Button variantType="secondary" onClick={onReset}>
						{resetButtonText}
					</Button>
				</div>
			</div>
			{description && (
				<p className="section-header__description">{description}</p>
			)}
		</div>
	);
};

export default SectionHeader;
import React from 'react';
import YouTubeIcon from '@/assets/icons/youtube-icon.svg';

interface Guide {
	url: string;
	type: "internal" | "external";
	channelName?: string;
}

interface YouTubeGuideSectionProps {
	guide: Guide;
	mapName: string;
}

/**
 * YouTube guide section component that embeds video guides at the bottom of map pages.
 * Uses responsive iframe embed for optimal viewing experience.
 * Supports both internal and external guides with appropriate descriptions.
 */
function YouTubeGuideSection({ guide, mapName }: YouTubeGuideSectionProps) {
	const getDescription = () => {
		if (guide.type === "internal") {
			return "Watch this complete walkthrough to learn how to complete the Easter Egg step by step.";
		} else {
			return `Checkout this guide from ${guide.channelName}, it's my preferred guide and probably what I used when I was learning the map.`;
		}
	};

	return (
		<div id="youtube-guide-section" className="youtube-guide-section">
			<h4><YouTubeIcon /> Easter Egg Guide for {mapName}</h4>
			<p className="guide-description">
				{getDescription()}
			</p>
			<div className="youtube-embed-container">
				<iframe
					src={guide.url}
					title={`${mapName} Easter Egg Guide`}
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerPolicy="strict-origin-when-cross-origin"
					allowFullScreen
					className="youtube-iframe"
				></iframe>
			</div>
			<p className="guide-note">
				This guide complements the interactive tools above. Use both together for the best experience!
			</p>
		</div>
	);
}

export default YouTubeGuideSection;
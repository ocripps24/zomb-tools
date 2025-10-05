import React from "react";

interface HeroProps {
	videoSrc?: string; // Direct video file URL
	imageSrc?: string; // Image URL (used if no videoSrc)
	className?: string;
}

/**
 * Full-viewport hero component
 * Displays video or image background without effects
 */
const Hero: React.FC<HeroProps> = ({ videoSrc, imageSrc, className = "" }) => {
	return (
		<div className={`hero ${className}`}>
			{videoSrc ? (
				<video
					className="hero__video"
					src={videoSrc}
					autoPlay
					muted
					loop
					playsInline
				/>
			) : imageSrc ? (
				<img className="hero__image" src={imageSrc} alt="" />
			) : null}
		</div>
	);
};

export default Hero;

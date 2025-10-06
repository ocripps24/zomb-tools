import React, { useEffect, useRef } from "react";
import { initFlutedGlass } from "@/utils/tlg-fluted-glass";

interface GlassHeroProps {
	videoSrc?: string; // Direct video file URL for fluted glass effect
	imageSrc?: string; // Image URL for fluted glass effect (used if no videoSrc)
	glassIntensity?: number; // 0-100, controls the warping intensity (default: 10)
	glassSegments?: number; // Number of vertical glass segments (default: 60)
	glassMode?: "static" | "mouse" | "scroll"; // Interaction mode (default: 'mouse')
	glassOverlay?: number; // 0-100, gradient overlay opacity (default: 0)
	glassMotion?: number; // Motion sensitivity (default: 0.5)
	className?: string;
}

/**
 * Full-viewport hero component with fluted glass effect
 * Supports video or image sources with WebGL shader-based glass distortion
 */
const GlassHero: React.FC<GlassHeroProps> = ({
	videoSrc,
	imageSrc,
	glassIntensity = 10,
	glassSegments = 60,
	glassMode = "mouse",
	glassOverlay = 0,
	glassMotion = 0.5,
	className = "",
}) => {
	const glassContainerRef = useRef<HTMLDivElement>(null);
	const sketchRef = useRef<any>(null);

	useEffect(() => {
		if (glassContainerRef.current && !sketchRef.current) {
			// Set attributes on the DOM element directly
			const container = glassContainerRef.current;
			container.setAttribute("tlg-fluted-glass-canvas", "");
			container.setAttribute("tlg-fluted-glass-mode", glassMode);
			container.setAttribute("tlg-fluted-glass-segments", glassSegments.toString());
			container.setAttribute("tlg-fluted-glass-overlay", glassOverlay.toString());
			container.setAttribute("tlg-fluted-glass-motion", glassMotion.toString());
			container.setAttribute("tlg-fluted-glass-intensity", glassIntensity.toString());

			// Set attribute on video/image element
			const videoElement = container.querySelector("video");
			const imageElement = container.querySelector("img");
			if (videoElement) {
				videoElement.setAttribute("tlg-fluted-glass-video", "");
			}
			if (imageElement) {
				imageElement.setAttribute("tlg-fluted-glass-image", "");
			}

			sketchRef.current = initFlutedGlass(container);
		}

		return () => {
			if (sketchRef.current && sketchRef.current.destroy) {
				sketchRef.current.destroy();
				sketchRef.current = null;
			}
		};
	}, [glassMode, glassSegments, glassOverlay, glassMotion, glassIntensity]);

	return (
		<div className={`glass-hero ${className}`}>
			<div ref={glassContainerRef} className="glass-hero__container">
				{videoSrc ? (
					<video
						src={videoSrc}
						autoPlay
						muted
						loop
						playsInline
						crossOrigin="anonymous"
						style={{ display: "none" }}
					/>
				) : imageSrc ? (
					<img
						src={imageSrc}
						alt=""
						crossOrigin="anonymous"
						style={{ display: "none" }}
					/>
				) : null}
			</div>
		</div>
	);
};

export default GlassHero;

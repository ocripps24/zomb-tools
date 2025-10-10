import React, { useEffect, useRef } from "react";
import { initFlutedGlass } from "@/utils/tlg-fluted-glass";

interface GlassHeroProps {
	videoSrc?: string; // Direct video file URL for fluted glass effect
	imageSrc?: string; // Image URL for fluted glass effect (used if no videoSrc)
	glassIntensity?: number; // 0-100, controls the warping intensity (default: 50). Higher = more distortion
	glassSegments?: number; // Number of vertical glass segments (default: 80). More segments = finer detail but more performance cost. Try 40-120 range
	glassMode?: "static" | "mouse" | "scroll"; // Interaction mode (default: 'mouse'). On touch devices, 'mouse' auto-converts to 'static'
	glassOverlay?: number; // 0-100, gradient overlay opacity (default: 0). Adds subtle light/dark gradients over the glass
	glassMotion?: number; // Motion sensitivity multiplier (default: 1). Higher = more responsive to mouse/scroll
	glassRotation?: number; // Rotation angle in degrees (default: 0). Rotates the glass distortion axis. Try 45, 90, etc.
	glassDynamicSegments?: boolean; // Enable/disable segment increase on mouse interaction (default: false). When true, segments increase on hover for more detail
	glassSegmentMultiplier?: number; // Multiplier for segment increase on interaction (default: 1.5). Range 1.0-3.0. E.g., 2.0 = double segments on hover. Only applies if glassDynamicSegments is true
	className?: string;
}

/**
 * Full-viewport hero component with fluted glass effect
 * Supports video or image sources with WebGL shader-based glass distortion
 *
 * @example
 * // Basic usage with defaults
 * <GlassHero imageSrc={bgImage} />
 *
 * @example
 * // High detail glass with more segments
 * <GlassHero
 *   imageSrc={bgImage}
 *   glassSegments={120}
 *   glassIntensity={70}
 * />
 *
 * @example
 * // Rotated glass effect
 * <GlassHero
 *   imageSrc={bgImage}
 *   glassRotation={45}
 *   glassSegments={100}
 * />
 *
 * @example
 * // Dynamic segments that increase on mouse hover
 * <GlassHero
 *   imageSrc={bgImage}
 *   glassSegments={60}
 *   glassDynamicSegments={true}
 *   glassSegmentMultiplier={2.0}
 * />
 */
const GlassHero: React.FC<GlassHeroProps> = ({
	videoSrc,
	imageSrc,
	glassIntensity = 50,
	glassSegments = 80,
	glassMode = "mouse",
	glassOverlay = 0,
	glassMotion = 1,
	glassRotation = 0,
	glassDynamicSegments = false,
	glassSegmentMultiplier = 1.5,
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
			container.setAttribute("tlg-fluted-glass-rotation", glassRotation.toString());
			container.setAttribute("tlg-fluted-glass-dynamic-segments", glassDynamicSegments.toString());
			container.setAttribute("tlg-fluted-glass-segment-multiplier", glassSegmentMultiplier.toString());

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
	}, [glassMode, glassSegments, glassOverlay, glassMotion, glassIntensity, glassRotation, glassDynamicSegments, glassSegmentMultiplier]);

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

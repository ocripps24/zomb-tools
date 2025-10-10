import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isTouchDevice } from "@/utils/deviceDetection";

interface SmoothScrollProps {
	children: ReactNode;
	smooth?: number; // 0-3, higher = smoother (default: 1)
	effects?: boolean; // Enable data-speed parallax effects (default: false)
	smoothTouch?: boolean | number; // Enable smooth scroll on touch devices (default: false)
	normalizeScroll?: boolean; // Normalize scroll across browsers (default: true)
}

/**
 * GSAP ScrollSmoother wrapper component
 * Provides buttery smooth scrolling with optional parallax effects
 *
 * IMPORTANT: Requires GSAP Club GreenSock membership
 *
 * @example
 * // Basic usage in App.tsx
 * <SmoothScroll>
 *   <YourContent />
 * </SmoothScroll>
 *
 * @example
 * // With custom settings
 * <SmoothScroll smooth={1.5} effects={true}>
 *   <YourContent />
 * </SmoothScroll>
 */
const SmoothScroll = ({
	children,
	smooth = 1,
	effects = false,
	smoothTouch = false,
	normalizeScroll = true,
}: SmoothScrollProps) => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const smootherRef = useRef<any>(null);

	useEffect(() => {
		// Skip ScrollSmoother on touch devices - they have native smooth scrolling
		// and the two can conflict
		if (isTouchDevice()) {
			return;
		}

		// Register plugins
		gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

		// Create ScrollSmoother instance
		if (scrollRef.current && contentRef.current) {
			smootherRef.current = ScrollSmoother.create({
				wrapper: scrollRef.current,
				content: contentRef.current,
				smooth: smooth,
				effects: effects,
				smoothTouch: smoothTouch,
				normalizeScroll: normalizeScroll,
			});
		}

		// Cleanup
		return () => {
			if (smootherRef.current) {
				smootherRef.current.kill();
				smootherRef.current = null;
			}
		};
	}, [smooth, effects, smoothTouch, normalizeScroll]);

	return (
		<div id="smooth-wrapper" ref={scrollRef}>
			<div id="smooth-content" ref={contentRef}>
				{children}
			</div>
		</div>
	);
};

export default SmoothScroll;

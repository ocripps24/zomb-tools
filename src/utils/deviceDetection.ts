/**
 * Device detection utilities (non-React)
 * For use in vanilla JS/TS classes and utilities
 */

/**
 * Detects if the device has touch capabilities
 * Combines touch event support with user agent detection and pointer capabilities
 */
export function isTouchDevice(): boolean {
	if (typeof window === "undefined") return false;

	return (
		"ontouchstart" in window ||
		(navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		)
	);
}

/**
 * Detects if the viewport width is below a certain breakpoint
 * @param breakpoint - Width in pixels (default: 768)
 */
export function isMobileViewport(breakpoint: number = 768): boolean {
	if (typeof window === "undefined") return false;
	return window.innerWidth < breakpoint;
}

/**
 * Checks if a media query matches
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 */
export function matchesMediaQuery(query: string): boolean {
	if (typeof window === "undefined") return false;
	return window.matchMedia(query).matches;
}

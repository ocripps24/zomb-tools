import { useState, useEffect } from "react";

/**
 * Detects if the device has touch capabilities
 * Combines touch event support with user agent detection and pointer capabilities
 */
export function useIsTouchDevice(): boolean {
	const [isTouchDevice, setIsTouchDevice] = useState(() => {
		// Initial detection (SSR-safe)
		if (typeof window === "undefined") return false;

		return (
			"ontouchstart" in window ||
			navigator.maxTouchPoints > 0 ||
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			)
		);
	});

	useEffect(() => {
		// Re-check on mount (in case initial state was server-rendered)
		const checkTouchDevice = () => {
			setIsTouchDevice(
				"ontouchstart" in window ||
					navigator.maxTouchPoints > 0 ||
					/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
						navigator.userAgent
					)
			);
		};

		checkTouchDevice();
	}, []);

	return isTouchDevice;
}

/**
 * Detects if the viewport width is below a certain breakpoint
 * @param breakpoint - Width in pixels (default: 768)
 */
export function useIsMobile(breakpoint: number = 768): boolean {
	const [isMobile, setIsMobile] = useState(() => {
		if (typeof window === "undefined") return false;
		return window.innerWidth < breakpoint;
	});

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < breakpoint);
		};

		handleResize(); // Check immediately
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [breakpoint]);

	return isMobile;
}

/**
 * Generic media query hook
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 */
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(() => {
		if (typeof window === "undefined") return false;
		return window.matchMedia(query).matches;
	});

	useEffect(() => {
		const mediaQuery = window.matchMedia(query);

		const handleChange = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		// Set initial value
		setMatches(mediaQuery.matches);

		// Modern browsers
		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		} else {
			// Legacy browsers (Safari < 14)
			mediaQuery.addListener(handleChange);
			return () => mediaQuery.removeListener(handleChange);
		}
	}, [query]);

	return matches;
}

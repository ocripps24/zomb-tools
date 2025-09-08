import { useState, useEffect } from "react";

export type ConsentStatus = "pending" | "accepted" | "declined";

interface ConsentManager {
	consentStatus: ConsentStatus;
	hasConsent: boolean;
	acceptConsent: () => void;
	declineConsent: () => void;
	resetConsent: () => void;
}

export function useConsentManager(): ConsentManager {
	const [consentStatus, setConsentStatus] = useState<ConsentStatus>("pending");

	useEffect(() => {
		const savedConsent = localStorage.getItem("cookie-consent");
		if (savedConsent === "accepted") {
			setConsentStatus("accepted");
			initializeAnalytics();
		} else if (savedConsent === "declined") {
			setConsentStatus("declined");
		}
	}, []);

	const acceptConsent = () => {
		localStorage.setItem("cookie-consent", "accepted");
		setConsentStatus("accepted");
		initializeAnalytics();
	};

	const declineConsent = () => {
		localStorage.setItem("cookie-consent", "declined");
		setConsentStatus("declined");
		// Disable analytics if it was already loaded
		if (window.gtag) {
			window.gtag("consent", "update", {
				analytics_storage: "denied",
			});
		}
	};

	const resetConsent = () => {
		localStorage.removeItem("cookie-consent");
		setConsentStatus("pending");
	};

	return {
		consentStatus,
		hasConsent: consentStatus === "accepted",
		acceptConsent,
		declineConsent,
		resetConsent,
	};
}

function initializeAnalytics() {
	if (typeof window === "undefined") return;

	// Initialize Google Analytics if not already loaded
	if (!window.gtag) {
		// Load gtag script
		const script = document.createElement("script");
		script.async = true;
		script.src = "https://www.googletagmanager.com/gtag/js?id=G-9YZ3JRRW37";
		document.head.appendChild(script);

		// Initialize gtag
		window.dataLayer = window.dataLayer || [];
		window.gtag = function() {
			window.dataLayer.push(arguments);
		};
		
		script.onload = () => {
			window.gtag!("js", new Date());
			window.gtag!("config", "G-9YZ3JRRW37", {
				analytics_storage: "granted",
			});
		};
	} else {
		// Update consent if gtag is already loaded
		window.gtag("consent", "update", {
			analytics_storage: "granted",
		});
	}
}

// Extend the Window interface for TypeScript
declare global {
	interface Window {
		dataLayer: any[];
		gtag?: (...args: any[]) => void;
	}
}
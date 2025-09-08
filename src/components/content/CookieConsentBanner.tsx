import { Link } from "react-router-dom";
import { useConsent } from "@/contexts/ConsentContext";

function CookieConsentBanner() {
	const { consentStatus, acceptConsent, declineConsent } = useConsent();

	if (consentStatus !== "pending") return null;

	return (
		<div className="cookie-consent-banner">
			<div className="consent-content">
				<div className="consent-text">
					<h4>🍪 We use cookies</h4>
					<p>
						We use Google Analytics to improve our website. This helps us understand 
						how you use our tools so we can make them better. Your progress is saved 
						locally on your device.
					</p>
					<p>
						<Link to="/privacy-policy" className="privacy-link">
							Read our Privacy Policy
						</Link>
					</p>
				</div>
				<div className="consent-actions">
					<button 
						onClick={declineConsent} 
						className="btn btn-outline consent-btn"
					>
						Decline
					</button>
					<button 
						onClick={acceptConsent} 
						className="btn btn-primary consent-btn"
					>
						Accept
					</button>
				</div>
			</div>
		</div>
	);
}

export default CookieConsentBanner;
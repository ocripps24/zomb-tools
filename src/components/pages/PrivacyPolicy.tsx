import { Link } from "react-router-dom";

function PrivacyPolicy() {
	return (
		<div className="legal-page">
			<div className="legal-content">
				<h1>Privacy Policy</h1>
				<p className="last-updated">Last updated: 8th September 2025</p>

				<section>
					<h2>Overview</h2>
					<p>
						ZomB Tools ("we", "our", or "us") is committed to protecting your
						privacy. This Privacy Policy explains how we collect, use, and
						protect information when you use our website at zomb-tools.com.
					</p>
				</section>

				<section>
					<h2>Information We Collect</h2>

					<h3>Automatically Collected Information</h3>
					<p>
						When you visit our website, we automatically collect certain
						information through:
					</p>

					<h4>Google Analytics</h4>
					<p>
						We use Google Analytics to understand how visitors use our site.
						This service collects:
					</p>
					<ul>
						<li>Pages you visit and time spent on each page</li>
						<li>How you arrived at our site (referrer information)</li>
						<li>Your approximate location (city/region level, not precise)</li>
						<li>Device and browser information</li>
						<li>Basic demographics (age range, interests) if available</li>
					</ul>
					<p>
						Google Analytics uses cookies and similar technologies. You can
						learn more about how Google uses this data at{" "}
						<a
							href="https://policies.google.com/privacy/partners"
							target="_blank"
							rel="noopener noreferrer"
						>
							Google's Privacy Policy
						</a>
						.
					</p>

					<h4>Local Storage</h4>
					<p>
						We store your progress and preferences locally on your device using
						browser storage. This includes:
					</p>
					<ul>
						<li>Easter egg solving progress for each map</li>
						<li>Code calculations and inputs you've entered</li>
						<li>Your preference settings</li>
					</ul>
					<p>
						This information stays on your device and is not transmitted to our
						servers. You can clear this data anytime through your browser
						settings.
					</p>
				</section>

				<section>
					<h2>How We Use Information</h2>
					<p>We use collected information to:</p>
					<ul>
						<li>Improve our website's functionality and user experience</li>
						<li>Understand which tools and maps are most popular</li>
						<li>Identify and fix technical issues</li>
						<li>Save your progress so you don't lose your work</li>
					</ul>
				</section>

				<section>
					<h2>Information Sharing</h2>
					<p>
						We do not sell, trade, or rent your personal information to third
						parties. Information may only be shared with:
					</p>
					<ul>
						<li>Google Analytics (as described above)</li>
						<li>Legal authorities if required by law</li>
					</ul>
				</section>

				<section>
					<h2>Data Retention</h2>
					<ul>
						<li>
							Google Analytics data is retained according to Google's data
							retention policies
						</li>
						<li>
							Local storage data remains on your device until you clear it
						</li>
					</ul>
				</section>

				<section>
					<h2>Your Rights and Choices</h2>
					<p>You can:</p>
					<ul>
						<li>
							Opt out of Google Analytics tracking by installing the{" "}
							<a
								href="https://tools.google.com/dlpage/gaoptout"
								target="_blank"
								rel="noopener noreferrer"
							>
								Google Analytics Opt-out Browser Add-on
							</a>
						</li>
						<li>Disable cookies in your browser settings</li>
						<li>
							Clear local storage data through your browser's developer tools or
							settings
						</li>
						<li>Use our cookie consent banner to manage your preferences</li>
					</ul>
				</section>

				<section>
					<h2>Security</h2>
					<p>
						We implement reasonable security measures to protect information.
						However, no method of transmission over the internet is 100% secure.
					</p>
				</section>

				<section>
					<h2>Third-Party Links</h2>
					<p>
						Our website may contain links to YouTube and other external sites.
						We are not responsible for the privacy practices of these
						third-party sites.
					</p>
				</section>

				<section>
					<h2>Children's Privacy</h2>
					<p>
						Our website is not intended for children under 13. We do not
						knowingly collect personal information from children under 13.
					</p>
				</section>

				<section>
					<h2>Changes to This Policy</h2>
					<p>
						We may update this Privacy Policy from time to time. Changes will be
						posted on this page with an updated "Last updated" date.
					</p>
				</section>

				<section>
					<h2>Contact Us</h2>
					<p>
						If you have questions about this Privacy Policy, please contact us
						through our website or create an issue on our GitHub repository.
					</p>
				</section>

				<div className="legal-footer">
					<Link to="/" className="btn btn-primary">
						Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}

export default PrivacyPolicy;

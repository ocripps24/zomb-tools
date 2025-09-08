import { Link } from "react-router-dom";

function TermsAndConditions() {
	return (
		<div className="legal-page">
			<div className="legal-content">
				<h1>Terms and Conditions</h1>
				<p className="last-updated">Last updated: 8th September 2025</p>

				<section>
					<h2>Acceptance of Terms</h2>
					<p>
						By accessing and using COD Zombies Tools (zomb-tools.com), you
						accept and agree to be bound by these Terms and Conditions. If you
						do not agree to these terms, please do not use our website.
					</p>
				</section>

				<section>
					<h2>Description of Service</h2>
					<p>
						COD Zombies Tools is a fan-created website that provides interactive
						tools and calculators to help players solve Easter eggs and complete
						challenges in Call of Duty Zombies maps. Our service is provided
						free of charge.
					</p>
				</section>

				<section>
					<h2>Disclaimer and Limitation of Liability</h2>
					<p>
						<strong>Use at Your Own Risk:</strong> This website and its tools
						are provided "as is" without any warranties, express or implied. We
						do not guarantee:
					</p>
					<ul>
						<li>
							The accuracy, completeness, or reliability of any information or
							tools
						</li>
						<li>
							That the website will be available, uninterrupted, or error-free
						</li>
						<li>
							That defects will be corrected or that the site is free of viruses
						</li>
					</ul>
					<p>
						<strong>No Liability:</strong> To the fullest extent permitted by
						law, we shall not be liable for any direct, indirect, incidental,
						consequential, or punitive damages arising from your use of this
						website, including but not limited to:
					</p>
					<ul>
						<li>Loss of data or progress</li>
						<li>Interruption of service</li>
						<li>Gaming-related losses or frustrations</li>
						<li>
							Any damages resulting from reliance on our tools or information
						</li>
					</ul>
				</section>

				<section>
					<h2>User Responsibilities</h2>
					<p>You agree to:</p>
					<ul>
						<li>Use the website for lawful purposes only</li>
						<li>
							Not attempt to disrupt, damage, or interfere with the website's
							operation
						</li>
						<li>
							Not use automated tools to scrape or download content without
							permission
						</li>
						<li>Respect the intellectual property rights of others</li>
					</ul>
				</section>

				<section>
					<h2>Intellectual Property</h2>
					<p>
						<strong>Our Content:</strong> The design, code, and original content
						of this website are owned by COD Zombies Tools and protected by
						applicable laws.
					</p>
					<p>
						<strong>Game Content:</strong> Call of Duty, Black Ops, and related
						game content, trademarks, and intellectual property belong to
						Activision Blizzard and their respective owners. This website is an
						unofficial fan site and is not affiliated with or endorsed by
						Activision Blizzard.
					</p>
					<p>
						<strong>Fair Use:</strong> We use game-related information under
						fair use principles for educational and informational purposes.
					</p>
				</section>

				<section>
					<h2>Privacy and Data</h2>
					<p>
						Your privacy is important to us. Please review our{" "}
						<Link to="/privacy-policy">Privacy Policy</Link> to understand how
						we collect and use information.
					</p>
				</section>

				<section>
					<h2>Third-Party Services</h2>
					<p>
						Our website uses third-party services including Google Analytics and
						embeds YouTube videos. These services have their own terms and
						privacy policies which govern your use of their services.
					</p>
				</section>

				<section>
					<h2>Modifications and Termination</h2>
					<p>We reserve the right to:</p>
					<ul>
						<li>
							Modify or discontinue the website at any time without notice
						</li>
						<li>Update these Terms and Conditions at any time</li>
						<li>Block access to users who violate these terms</li>
					</ul>
					<p>
						Continued use after changes constitutes acceptance of modified
						terms.
					</p>
				</section>

				<section>
					<h2>Indemnification</h2>
					<p>
						You agree to indemnify and hold harmless COD Zombies Tools and its
						operators from any claims, damages, or expenses arising from your
						use of the website or violation of these terms.
					</p>
				</section>

				<section>
					<h2>Governing Law</h2>
					<p>
						These terms are governed by the laws of the jurisdiction where the
						website operator resides. Any disputes will be resolved in the
						appropriate courts of that jurisdiction.
					</p>
				</section>

				<section>
					<h2>Severability</h2>
					<p>
						If any provision of these terms is found to be invalid or
						unenforceable, the remaining provisions will continue in full force
						and effect.
					</p>
				</section>

				<section>
					<h2>No Waiver</h2>
					<p>
						Our failure to enforce any right or provision of these terms does
						not constitute a waiver of such right or provision.
					</p>
				</section>

				<section>
					<h2>Contact Information</h2>
					<p>
						If you have questions about these Terms and Conditions, please
						contact us through our website or create an issue on our GitHub
						repository.
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

export default TermsAndConditions;

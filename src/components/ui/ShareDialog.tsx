import { useEffect, useRef, useState } from "react";
import type { Dashboard } from "@/types/dashboard";

export interface ShareDialogProps {
	isOpen: boolean;
	dashboard: Dashboard | null;
	onClose: () => void;
}

/**
 * ShareDialog Component
 * Allows users to share dashboards via URL encoding
 */
export default function ShareDialog({
	isOpen,
	dashboard,
	onClose,
}: ShareDialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [copied, setCopied] = useState(false);

	// Generate shareable URL
	const generateShareUrl = (): string => {
		if (!dashboard) return "";

		// Create a minimal dashboard object for encoding
		const shareData = {
			name: dashboard.name,
			description: dashboard.description,
			sections: dashboard.sections.map((section) => ({
				gameId: section.gameId,
				mapId: section.mapId,
				sectionId: section.sectionId,
				sectionName: section.sectionName,
				mapName: section.mapName,
				gameName: section.gameName,
				order: section.order,
			})),
		};

		// Encode to base64
		const encoded = btoa(JSON.stringify(shareData));

		// Create full URL
		const baseUrl = window.location.origin;
		return `${baseUrl}/dashboard/import?data=${encoded}`;
	};

	const shareUrl = generateShareUrl();

	// Open/close dialog
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen) {
			dialog.showModal();
		} else {
			dialog.close();
			setCopied(false); // Reset copied state when closing
		}
	}, [isOpen]);

	// Handle backdrop click to close
	const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const rect = dialog.getBoundingClientRect();
		const isInDialog =
			rect.top <= e.clientY &&
			e.clientY <= rect.top + rect.height &&
			rect.left <= e.clientX &&
			e.clientX <= rect.left + rect.width;

		if (!isInDialog) {
			onClose();
		}
	};

	// Handle escape key
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const handleCancel = (e: Event) => {
			e.preventDefault();
			onClose();
		};

		dialog.addEventListener("cancel", handleCancel);
		return () => dialog.removeEventListener("cancel", handleCancel);
	}, [onClose]);

	// Copy to clipboard
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);

			// Reset copied state after 2 seconds
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy to clipboard:", err);
			// Fallback: select the text
			if (inputRef.current) {
				inputRef.current.select();
			}
		}
	};

	// Select all text when input is clicked
	const handleInputClick = () => {
		if (inputRef.current) {
			inputRef.current.select();
		}
	};

	return (
		<dialog
			ref={dialogRef}
			className="share-dialog"
			onClick={handleDialogClick}
		>
			<div className="share-dialog__content">
				<header className="share-dialog__header">
					<h2>Share Layout</h2>
					<button
						type="button"
						className="close-btn"
						onClick={onClose}
						aria-label="Close dialog"
					>
						×
					</button>
				</header>

				<div className="share-dialog__body">
					{dashboard && (
						<>
							<p className="share-dialog__description">
								Share this link to allow others to import your layout
								configuration:
							</p>

							<div className="share-dialog__dashboard-info">
								<strong>{dashboard.name}</strong>
								{dashboard.description && <p>{dashboard.description}</p>}
								<p className="section-count">
									{dashboard.sections.length}{" "}
									{dashboard.sections.length === 1 ? "section" : "sections"}
								</p>
							</div>

							<div className="share-dialog__url-container">
								<input
									ref={inputRef}
									type="text"
									value={shareUrl}
									readOnly
									onClick={handleInputClick}
									className="share-dialog__url-input"
								/>
								<button
									type="button"
									onClick={handleCopy}
									className={`btn btn-primary ${copied ? "btn-success" : ""}`}
								>
									{copied ? "✓ Copied!" : "Copy"}
								</button>
							</div>

							<div className="share-dialog__note">
								<p>
									<strong>Note:</strong> This URL contains your layout
									configuration (name, description, and selected sections). It
									does not include any saved data from the sections themselves.
								</p>
							</div>
						</>
					)}
				</div>

				<footer className="share-dialog__footer">
					<button type="button" className="btn btn-secondary" onClick={onClose}>
						Close
					</button>
				</footer>
			</div>
		</dialog>
	);
}

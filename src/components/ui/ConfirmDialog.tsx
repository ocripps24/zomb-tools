import { useEffect, useRef } from "react";

export interface ConfirmDialogProps {
	isOpen: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "danger" | "warning" | "info";
	onConfirm: () => void;
	onCancel: () => void;
}

/**
 * Reusable confirmation dialog component
 * Used for destructive actions like deleting dashboards
 */
export default function ConfirmDialog({
	isOpen,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	variant = "danger",
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	}, [isOpen]);

	const handleConfirm = () => {
		onConfirm();
	};

	const handleCancel = () => {
		onCancel();
	};

	// Close on backdrop click
	const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const rect = dialog.getBoundingClientRect();
		const clickedInDialog =
			rect.top <= e.clientY &&
			e.clientY <= rect.top + rect.height &&
			rect.left <= e.clientX &&
			e.clientX <= rect.left + rect.width;

		if (!clickedInDialog) {
			handleCancel();
		}
	};

	// Close on Escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				handleCancel();
			}
		};

		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [isOpen]);

	return (
		<dialog
			ref={dialogRef}
			className={`confirm-dialog confirm-dialog--${variant}`}
			onClick={handleDialogClick}
		>
			<div className="confirm-dialog__content">
				<header className="confirm-dialog__header">
					<h2>{title}</h2>
				</header>

				<div className="confirm-dialog__body">
					<p>{message}</p>
				</div>

				<footer className="confirm-dialog__footer">
					<button
						className="btn btn-secondary"
						onClick={handleCancel}
						type="button"
					>
						{cancelText}
					</button>
					<button
						className={`btn btn-${variant === "danger" ? "danger" : "primary"}`}
						onClick={handleConfirm}
						type="button"
						autoFocus
					>
						{confirmText}
					</button>
				</footer>
			</div>
		</dialog>
	);
}

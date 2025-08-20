import { useState, useEffect, useRef } from "react";
import { SectionHeader } from "../../../../../core/index.js";

// Document data with predefined order for code calculation
const DOCUMENTS = [
	{
		id: 1,
		name: "Notso's Collar",
		number: 1,
		date: "07/15/1985",
		dateObj: new Date(1985, 6, 15), // Month is 0-indexed in JavaScript
	},
	{
		id: 2,
		name: "Katana",
		number: 2,
		date: "12/08/1985",
		dateObj: new Date(1985, 11, 8),
	},
	{
		id: 3,
		name: "Scarf",
		number: 3,
		date: "08/21/1985",
		dateObj: new Date(1985, 7, 21),
	},
	{
		id: 4,
		name: "Wristwatch",
		number: 4,
		date: "09/02/1985",
		dateObj: new Date(1985, 8, 2),
	},
	{
		id: 5,
		name: "Combat Goggles",
		number: 5,
		date: "10/12/1985",
		dateObj: new Date(1985, 9, 12),
	},
	{
		id: 6,
		name: "BND Badge",
		number: 6,
		date: "6/28/1985",
		dateObj: new Date(1985, 5, 28),
	},
];

// Pre-calculated order based on dates (earliest to latest): 6, 1, 3, 4, 5, 2
const DATE_ORDER = [6, 1, 3, 4, 5, 2];

function DocumentsCodeSection({ data, onChange }) {
	const [localData, setLocalData] = useState(data || { selectedDocuments: [] });
	const isInitializing = useRef(true);

	// Load from localStorage on mount or when parent data changes (reset)
	useEffect(() => {
		const isParentDataEmpty = !data || Object.keys(data).length === 0;

		if (isParentDataEmpty) {
			const saved = localStorage.getItem("reckoning-documents-data");
			if (saved) {
				try {
					const parsedData = JSON.parse(saved);
					setLocalData(parsedData);
				} catch (e) {
					console.error("Failed to parse documents data:", e);
					const initial = { selectedDocuments: [] };
					setLocalData(initial);
				}
			} else {
				const initial = { selectedDocuments: [] };
				setLocalData(initial);
			}
		}
		isInitializing.current = true;
	}, [data]);

	// Save to localStorage and update parent when data changes
	useEffect(() => {
		localStorage.setItem("reckoning-documents-data", JSON.stringify(localData));

		if (!isInitializing.current) {
			onChange(localData);
		} else {
			isInitializing.current = false;
		}
	}, [localData]); // Removed onChange from dependencies to prevent infinite loop

	const handleDocumentToggle = (documentId) => {
		setLocalData((prev) => {
			const currentSelected = prev.selectedDocuments || [];
			const isSelected = currentSelected.includes(documentId);

			let newSelected;
			if (isSelected) {
				// Remove document
				newSelected = currentSelected.filter((id) => id !== documentId);
			} else {
				// Add document (max 4)
				if (currentSelected.length < 4) {
					newSelected = [...currentSelected, documentId];
				} else {
					// Already at max, don't add
					return prev;
				}
			}

			return {
				...prev,
				selectedDocuments: newSelected,
			};
		});
	};

	const generateCode = () => {
		const selectedDocs = localData.selectedDocuments || [];
		if (selectedDocs.length === 0) return "";

		// Sort selected documents by their position in the date order
		const sortedSelected = selectedDocs.sort((a, b) => {
			const orderA = DATE_ORDER.indexOf(a);
			const orderB = DATE_ORDER.indexOf(b);
			return orderA - orderB;
		});

		// Get the numbers of the sorted documents
		return sortedSelected
			.map((docId) => DOCUMENTS.find((doc) => doc.id === docId)?.number)
			.join("");
	};

	const resetAll = () => {
		setLocalData({ selectedDocuments: [] });
	};

	const selectedCount = localData.selectedDocuments?.length || 0;
	const generatedCode = generateCode();

	return (
		<div className="documents-section">
			<SectionHeader
				title="Documents Code"
				progress={{ completed: selectedCount, total: 4 }}
				description="Select the 4 documents that are present in your game."
				onReset={resetAll}
				resetButtonText="Reset Documents"
			/>

			{/* Document Selection Grid */}
			<div className="documents-grid">
				{DOCUMENTS.map((document) => {
					const isSelected = localData.selectedDocuments?.includes(document.id);
					const isDisabled = !isSelected && selectedCount >= 4;

					return (
						<div
							key={document.id}
							className={`document-card ${
								isSelected ? "document-card--selected" : ""
							} ${isDisabled ? "document-card--disabled" : ""}`}
							onClick={() => !isDisabled && handleDocumentToggle(document.id)}
						>
							<div className="document-number">#{document.number}</div>
							<div className="document-info">
								<h4 className="document-name">{document.name}</h4>
								<p className="document-date">{document.date}</p>
							</div>
							<div className="document-status">{isSelected ? "✓" : "+"}</div>
						</div>
					);
				})}
			</div>

			{/* Code Preview */}
			{selectedCount > 0 && (
				<div className="code-preview">
					<h4>Generated Code</h4>
					<div className="code-display">
						<span className="code-value">{generatedCode}</span>
						{selectedCount < 4 && (
							<span className="code-note">
								Select {4 - selectedCount} more document
								{4 - selectedCount !== 1 ? "s" : ""} to complete the code
							</span>
						)}
					</div>
					{selectedCount === 4 && (
						<p className="code-instruction">
							Enter this {generatedCode.length}-digit code into the computer
							terminal in the teleportation room.
						</p>
					)}
				</div>
			)}
		</div>
	);
}

export default DocumentsCodeSection;
